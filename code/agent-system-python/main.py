#!/usr/bin/env python3
"""
MTM Hackathon '26 - Team AXIONS
Message-pack event planner.

Reads a pack of messages (emails, WhatsApp texts, notices - English, Urdu script and
Roman Urdu) and produces a valid plan for a physical hackathon across five
areas: venue, schedule, food, judging, budget.

ONE command for everything:

    python3 main.py <messages.txt>

- First run (no run/state.json yet): the file is the full message pack.
- Later runs: the file holds new message(s); the existing plan is updated.
  No flags, no hints - the system reads each message the same way.

Design (deliberate):
- The model ONLY reads language: it extracts facts from messages into JSON.
- All arithmetic, planning and constraint checking is plain code, so figures
  are exact and a message that would break the plan is rejected by code,
  with the reason printed in the trace.
- Every model call is printed in the trace: number, model name, one area
  tag, full input, full output, and the token counts the API reports.

Config (environment):
    GROQ_API_KEY   required for live model calls
    MODEL_NAME     default: openai/gpt-oss-20b  (a small model, on purpose)
    MODEL_API_BASE default: https://api.groq.com/openai/v1
    MODEL_TRANSPORT  "direct" (default) or "connector" (testing only)

Outputs (in run/, next to this file):
    state.json  - fact base + current plan (the system's memory)
    plan.txt    - latest plan, checks, rejected messages
    trace.txt   - full trace of the whole session (appended every run)
    index.html  - the same plan / trace / rejections as a web page
"""

import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load a local .env file (KEY=VALUE lines) if present, so the venue setup
# is just "copy .env.example to .env and paste the key". Real environment
# variables win over .env values.
_env_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(_env_path):
    with open(_env_path, encoding="utf-8") as _fh:
        for _line in _fh:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _v = _line.split("=", 1)
                os.environ.setdefault(_k.strip(), _v.strip())
RUN_DIR = os.path.join(BASE_DIR, "run")
STATE_PATH = os.path.join(RUN_DIR, "state.json")
PLAN_PATH = os.path.join(RUN_DIR, "plan.txt")
TRACE_PATH = os.path.join(RUN_DIR, "trace.txt")
HTML_PATH = os.path.join(RUN_DIR, "index.html")

MODEL = os.environ.get("MODEL_NAME", "openai/gpt-oss-20b")
API_BASE = os.environ.get("MODEL_API_BASE", "https://api.groq.com/openai/v1").rstrip("/")
API_KEY = os.environ.get("GROQ_API_KEY", "")
TRANSPORT = os.environ.get("MODEL_TRANSPORT", "direct")

USER_AGENT = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

AREAS = ["venue", "schedule", "food", "judging", "budget"]


# --------------------------------------------------------------------------
# Model access
# --------------------------------------------------------------------------

def _direct_call(prompt, max_tokens=3000):
    """One chat completion against an OpenAI-compatible API (Groq).
    Returns (reply_text, usage_dict_or_None)."""
    if not API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Create .env values first - see RUNBOOK.md.")
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "max_tokens": max_tokens,
        "response_format": {"type": "json_object"},
    }
    if "gpt-oss" in MODEL:
        payload["reasoning_effort"] = "low"

    def attempt(body):
        data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            API_BASE + "/chat/completions", data=data, method="POST",
            headers={"Authorization": "Bearer " + API_KEY,
                     "Content-Type": "application/json",
                     "Accept": "application/json",
                     "User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode("utf-8"))

    result = None
    last_err = None
    for i in range(3):
        try:
            result = attempt(payload)
            break
        except urllib.error.HTTPError as exc:
            last_err = exc
            if exc.code == 400 and i == 0:
                # Drop optional parameters some models reject, then retry.
                payload.pop("response_format", None)
                payload.pop("reasoning_effort", None)
                continue
            if exc.code in (429, 500, 502, 503) and i < 2:
                time.sleep(5 * (i + 1))
                continue
            raise
        except Exception as exc:  # network hiccup - retry twice
            last_err = exc
            if i < 2:
                time.sleep(3 * (i + 1))
                continue
            raise
    if result is None:
        raise RuntimeError("Model call failed: %s" % last_err)
    choices = result.get("choices") or []
    text = ""
    if choices:
        text = (choices[0].get("message") or {}).get("content") or ""
    return text, result.get("usage")


def _connector_call(prompt, max_tokens=3000):
    """Testing transport: route through the locally registered Groq
    connector client. It does not return token usage, so the trace marks
    usage as not reported. Never used at the venue."""
    import subprocess
    client = os.path.expanduser(
        "~/workspace/custom-connectors/custom.groq/bin/groq_api.py")
    out = subprocess.run(
        [sys.executable, client, "chat", "--model", MODEL,
         "--prompt", prompt, "--max-tokens", str(max_tokens)],
        capture_output=True, text=True, timeout=180)
    if out.returncode != 0:
        raise RuntimeError("Connector call failed: " + out.stderr[:300])
    return json.loads(out.stdout).get("reply", ""), None


def call_model(prompt, max_tokens=3000):
    """One model call. The API reserves prompt + max_tokens against the
    per-minute token limit, so max_tokens stays as small as the reply
    allows, and a 429 is retried after a pause (the limit is per minute)."""
    last_err = None
    for attempt in range(3):
        try:
            if TRANSPORT == "connector":
                return _connector_call(prompt, max_tokens)
            return _direct_call(prompt, max_tokens)
        except RuntimeError as exc:
            last_err = exc
            if "429" in str(exc) or "Rate limit" in str(exc):
                if attempt < 2:
                    time.sleep(15)
                    continue
            raise
    raise last_err


def parse_json_reply(text):
    """Extract the JSON object from a model reply (handles code fences)."""
    if not text:
        return None
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    raw = m.group(1) if m else text
    raw = raw.strip()
    try:
        return json.loads(raw)
    except Exception:
        start, end = raw.find("{"), raw.rfind("}")
        if start >= 0 and end > start:
            try:
                return json.loads(raw[start:end + 1])
            except Exception:
                return None
    return None


# --------------------------------------------------------------------------
# Trace
# --------------------------------------------------------------------------

class Trace:
    """The printed trace. Model calls are numbered across the whole
    session; code steps are printed as [code] lines and are never counted
    as model calls."""

    def __init__(self, state):
        self.state = state
        self.lines = []
        self.run_tokens = 0

    def model_call(self, tag, prompt, output, usage):
        self.state["model_calls"] = self.state.get("model_calls", 0) + 1
        n = self.state["model_calls"]
        if usage:
            total = usage.get("total_tokens")
            if total is None:
                total = (usage.get("prompt_tokens") or 0) + \
                        (usage.get("completion_tokens") or 0)
            self.run_tokens += total or 0
            self.state["total_tokens"] = self.state.get("total_tokens", 0) + (total or 0)
            tok = ("prompt=%s completion=%s total=%s (as reported by the API)"
                   % (usage.get("prompt_tokens"), usage.get("completion_tokens"), total))
        else:
            tok = "not reported by this transport"
        self.lines.append("--- Model call #%d [area: %s] model: %s" % (n, tag, MODEL))
        self.lines.append("INPUT:")
        self.lines.append(prompt)
        self.lines.append("OUTPUT:")
        self.lines.append(output if output else "(empty reply)")
        self.lines.append("TOKENS: " + tok)
        self.lines.append("")

    def code(self, text):
        self.lines.append("[code] " + text)

    def note(self, text):
        self.lines.append("[note] " + text)

    def render(self, title):
        out = ["=" * 70, title, "=" * 70] + self.lines
        out.append("Tokens this run: %d" % self.run_tokens)
        out.append("TOTAL TOKENS (session): %d" % self.state.get("total_tokens", 0))
        return "\n".join(out)


# --------------------------------------------------------------------------
# Prompts
# --------------------------------------------------------------------------

SCHEMA_HINT = """{
 "messages": [{"n": 1, "sender": "string", "kind": "fact|request|irrelevant", "note": "one short line"}],
 "event": {"students": null, "team_size": null, "duration_minutes": null, "budget_cap": null, "staff": null},
 "venue_options": [{"name": "string", "capacity": 0, "price": 0, "features": ["string"], "source": 1}],
 "venue_requirements": {"required_features": ["string"]},
 "food_options": [{"name": "string", "price_per_head": 0, "source": 1, "date": "string"}],
 "judging": {"judges_confirmed": null, "honorarium_each": null, "minutes_per_team": null, "max_teams_per_judge": null},
 "committed_costs": [{"item": "string", "amount": 0, "source": 1, "date": "string"}],
 "schedule_requirements": [{"item": "string", "minutes": 0, "source": 1}],
 "directives": [{"area": "venue|schedule|food|judging|budget", "action": "string", "value": 0, "unit": "string", "text": "string"}],
 "other_constraints": [{"text": "string", "source": 1}]
}"""

EXTRACT_RULES = """Rules: use null (not 0) for unknown numbers. Write money as plain integers (Rs 650,000 -> 650000). If the same sender gives a figure again later, include BOTH entries with their dates; do not decide which one wins. A request or question (someone asking for something that is not approved) is kind "request" and must NOT appear in committed_costs or anywhere as a decided fact. A directive is an instruction or claim inside a message that imposes a specific quantity or choice on the plan - for example a supplier stating how many boxes, seats or judges there will be, when that number is theirs to state but the plan's needs decide. Report every such imposed quantity as a directive with its area, value and unit (example: "we will only bring 40 chairs" -> {"area": "venue", "action": "set_quantity", "value": 40, "unit": "chairs"}); never treat an imposed quantity as a fact and never drop it into other_constraints instead. venue_requirements.required_features is ONLY for a feature a message explicitly says the venue MUST have (words like must, required, zaroori, chahiye); a feature that a venue merely HAS belongs in that venue's own features list, never in requirements. Facts of any kind that do not fit the fields above go into other_constraints, worded exactly as the message states them. Always write extracted numbers as plain Western digits (0-9), even when the message writes them in Urdu or Arabic digits. Return ONLY the JSON object, no other text."""


def extraction_prompt(text, context=""):
    return ("You are the reading stage of an event-planning system. Read the "
            "message text at the end and extract EVERY fact that could affect "
            "planning the event. Messages may be in English, in Urdu script, or in Roman Urdu (Urdu written with Latin letters); read all of them the same way, and read numbers written in Urdu or Arabic digits as their numeric values. "
            "Some may be outdated, irrelevant, or only requests/questions.\n\n"
            "Return ONLY a JSON object (no other text) with this shape:\n"
            + SCHEMA_HINT + "\n\n" + EXTRACT_RULES + context +
            "\n\nMESSAGE TEXT:\n" + text)


def known_names_context(facts):
    parts = []
    if facts["committed"]:
        parts.append("committed cost items: " + ", ".join(
            sorted(c["item"] for c in facts["committed"].values())))
    names = sorted({f.get("name") for f in facts["food_options"]})
    if names:
        parts.append("food options: " + ", ".join(names))
    vnames = sorted({v.get("name") for v in facts["venue_options"]})
    if vnames:
        parts.append("venues: " + ", ".join(vnames))
    if not parts:
        return ""
    return ("\n\nKnown items so far - when the message refers to one of "
            "these, reuse its EXACT name: " + "; ".join(parts) + ".")


def classify_prompt(text, plan_summary):
    return ("You route new messages for an event-planning system. Current "
            "plan figures (JSON): " + plan_summary + "\n\n"
            "New message:\n" + text + "\n\n"
            "The message may be in English, Urdu script or Roman Urdu. Reply with ONLY a JSON object: {\"kind\": \"fact|request|irrelevant\", "
            "\"areas\": [\"venue|schedule|food|judging|budget\"], "
            "\"summary\": \"one short line\"}. "
            "kind is \"fact\" if the message states or changes any planning "
            "fact (including imposing a number on the plan), \"request\" if it "
            "only asks for something not yet approved, \"irrelevant\" if it "
            "changes nothing. areas lists the plan areas its facts touch "
            "(empty for request/irrelevant).")


# --------------------------------------------------------------------------
# Fact base
# --------------------------------------------------------------------------

MONTHS = {m: i + 1 for i, m in enumerate(
    ["jan", "feb", "mar", "apr", "may", "jun",
     "jul", "aug", "sep", "oct", "nov", "dec"])}


def parse_date(text):
    """Best-effort (month, day) from strings like '12 Nov', '12 November',
    '2026-11-12'. Returns None when no date is recognisable."""
    if not text:
        return None
    t = normalize_digits(str(text).lower())
    m = re.search(r"(\d{4})-(\d{1,2})-(\d{1,2})", t)
    if m:
        return (int(m.group(2)), int(m.group(3)))
    m = re.search(r"(\d{1,2})\s*([a-z]{3,})", t)
    if m and m.group(2)[:3] in MONTHS:
        return (MONTHS[m.group(2)[:3]], int(m.group(1)))
    m = re.search(r"([a-z]{3,})\s*(\d{1,2})", t)
    if m and m.group(1)[:3] in MONTHS:
        return (MONTHS[m.group(1)[:3]], int(m.group(2)))
    return None


def norm(text):
    return re.sub(r"\s+", " ", str(text or "").strip().lower())


def empty_facts():
    return {
        "event": {"students": None, "team_size": None,
                  "duration_minutes": None, "budget_cap": None, "staff": None},
        "venue_options": [],
        "venue_requirements": {"required_features": []},
        "food_options": [],
        "judging": {"judges_confirmed": None, "honorarium_each": None,
                    "minutes_per_team": None, "max_teams_per_judge": None},
        "committed": {},
        "schedule_requirements": [],
        "other_constraints": [],
        "requests": [],
    }


def find_key(existing_keys, new_key):
    """Match a model-supplied item name to an existing key. Models rename
    items slightly between messages ('printing' vs 'printing bill');
    without matching, a correction would double-count. Matching is by
    exact name or by word-set containment ('printing' is contained in
    'printing bill') - never by a shared generic first word, so 'Hall A'
    and 'Hall B' stay distinct."""
    nk = norm(new_key)
    if not nk:
        return None
    if nk in existing_keys:
        return nk
    nwords = nk.split(" ")
    cands = []
    for k in existing_keys:
        kwords = k.split(" ")
        if set(nwords) <= set(kwords) or set(kwords) <= set(nwords):
            if nwords[0] == kwords[0] or len(nwords) == 1 or len(kwords) == 1:
                cands.append(k)
    if len(cands) == 1:
        return cands[0]
    return None


def merge_extraction(facts, ext, seq):
    """Merge one extraction result into the fact base. Later arrivals win
    for the same key; dated entries are resolved again at plan time.
    Returns the directives list for separate evaluation."""
    if not ext:
        return []
    ev = ext.get("event") or {}
    for k, v in ev.items():
        if v is not None and k in facts["event"]:
            facts["event"][k] = v
    for v in ext.get("venue_options") or []:
        if not v.get("name"):
            continue
        v = dict(v)
        v["_seq"] = seq
        vkey = find_key([norm(x.get("name")) for x in facts["venue_options"]],
                        v.get("name"))
        facts["venue_options"] = [
            x for x in facts["venue_options"]
            if norm(x.get("name")) != (vkey or norm(v.get("name")))]
        facts["venue_options"].append(v)
    vr = ext.get("venue_requirements") or {}
    for f in vr.get("required_features") or []:
        if norm(f) not in [norm(x) for x in
                           facts["venue_requirements"]["required_features"]]:
            facts["venue_requirements"]["required_features"].append(f)
    for f in ext.get("food_options") or []:
        if f.get("price_per_head") is None:
            continue
        f = dict(f)
        f["_seq"] = seq
        facts["food_options"].append(f)
    ju = ext.get("judging") or {}
    for k, v in ju.items():
        if v is not None and k in facts["judging"]:
            facts["judging"][k] = v
    for c in ext.get("committed_costs") or []:
        if c.get("amount") is None or not c.get("item"):
            continue
        key = find_key(list(facts["committed"].keys()), c["item"]) \
            or norm(c["item"])
        facts["committed"][key] = {
            "item": c["item"], "amount": c["amount"],
            "source": c.get("source"), "date": c.get("date"), "_seq": seq}
    for s in ext.get("schedule_requirements") or []:
        if s.get("minutes") is None or not s.get("item"):
            continue
        skey = find_key([norm(x.get("item")) for x in
                         facts["schedule_requirements"]], s.get("item"))
        facts["schedule_requirements"] = [
            x for x in facts["schedule_requirements"]
            if norm(x.get("item")) != (skey or norm(s.get("item")))]
        s = dict(s)
        s["_seq"] = seq
        facts["schedule_requirements"].append(s)
    seen = {norm(o["text"]) for o in facts["other_constraints"]}
    for o in ext.get("other_constraints") or []:
        if o.get("text") and norm(o["text"]) not in seen:
            o = dict(o)
            o["_seq"] = seq
            facts["other_constraints"].append(o)
            seen.add(norm(o["text"]))
    for msg in ext.get("messages") or []:
        if msg.get("kind") == "request":
            facts["requests"].append(
                {"summary": msg.get("note") or "", "source": msg.get("n"),
                 "_seq": seq})
    return ext.get("directives") or []


def current_food_options(facts):
    """Resolve superseded prices: for each menu item name, the entry with
    the latest date (then latest arrival) is the current one."""
    best = {}
    known = []
    for f in facts["food_options"]:
        key = find_key(known, f.get("name")) or norm(f.get("name"))
        if key not in known:
            known.append(key)
        rank = (parse_date(f.get("date")) or (0, 0), f.get("_seq", 0))
        if key not in best or rank >= best[key][0]:
            best[key] = (rank, f)
    return [v[1] for v in best.values()]


# --------------------------------------------------------------------------
# Planning (plain code - exact arithmetic, no model)
# --------------------------------------------------------------------------

def build_plan(facts):
    ev = facts["event"]
    ju = facts["judging"]
    students = ev.get("students")
    team_size = ev.get("team_size")
    staff = ev.get("staff") or 0
    cap = ev.get("budget_cap")
    duration = ev.get("duration_minutes")

    teams = None
    if students and team_size:
        teams = int(math.ceil(students / float(team_size)))

    judges_needed = None
    if teams and ju.get("max_teams_per_judge"):
        judges_needed = int(math.ceil(teams / float(ju["max_teams_per_judge"])))
    confirmed = ju.get("judges_confirmed")
    judges_used = None
    if judges_needed is not None:
        judges_used = judges_needed if confirmed is None else min(judges_needed, confirmed)
        if confirmed is not None and confirmed >= judges_needed:
            judges_used = judges_needed

    people = None
    if students is not None and judges_used is not None:
        people = students + staff + judges_used

    req_features = [norm(f) for f in
                    facts["venue_requirements"].get("required_features", [])]

    def venue_ok(v, check_features=True):
        if people is not None and (v.get("capacity") or 0) < people:
            return False
        if check_features:
            feats = [norm(x) for x in v.get("features") or []]
            def has(rf):
                return any(rf == f or set(rf.split()) <= set(f.split())
                           or set(f.split()) <= set(rf.split())
                           for f in feats)
            if any(not has(rf) for rf in req_features):
                return False
        return True

    venues = sorted(facts["venue_options"],
                    key=lambda v: (v.get("price") or 0))
    fitting = [v for v in venues if venue_ok(v)]
    venue_relaxed = False
    if not fitting and venues:
        fitting = [v for v in venues if venue_ok(v, check_features=False)]
        venue_relaxed = bool(fitting)
    venue = fitting[0] if fitting else None

    committed_total = sum(c["amount"] for c in facts["committed"].values())
    honorarium_total = None
    if judges_used is not None and ju.get("honorarium_each") is not None:
        honorarium_total = judges_used * ju["honorarium_each"]

    foods = current_food_options(facts)
    # Default offering first (highest price is the standard tier in the
    # messages); cheaper tiers are the fallback when the budget demands it.
    foods_by_pref = sorted(foods, key=lambda f: -(f.get("price_per_head") or 0))

    def total_with(food, ven):
        t = committed_total
        if ven:
            t += ven.get("price") or 0
        if honorarium_total:
            t += honorarium_total
        if food and people:
            t += (food.get("price_per_head") or 0) * people
        return t

    chosen_food, chosen_venue = None, venue
    if foods_by_pref and people:
        done = False
        for food in foods_by_pref:
            for ven in ([venue] if venue else []) + \
                       [v for v in fitting if v is not venue]:
                if cap is None or total_with(food, ven) <= cap:
                    chosen_food, chosen_venue = food, ven
                    done = True
                    break
            if done:
                break
        if not done:
            # Nothing fits the cap: take the cheapest combination and let
            # the budget check report it honestly.
            chosen_food = sorted(foods, key=lambda f: f.get("price_per_head") or 0)[0]
            chosen_venue = venue
    food_total = None
    if chosen_food and people:
        food_total = (chosen_food.get("price_per_head") or 0) * people

    judging_minutes = None
    if teams and judges_used and ju.get("minutes_per_team"):
        rounds = int(math.ceil(teams / float(judges_used)))
        judging_minutes = rounds * ju["minutes_per_team"]

    schedule = []
    schedule_ok = True
    if duration:
        opening = 15 if duration >= 120 else 10
        closing = 15 if duration >= 120 else 10
        reqs = facts["schedule_requirements"]
        req_total = sum(r.get("minutes") or 0 for r in reqs)
        fixed = opening + closing + req_total + (judging_minutes or 0)
        main = duration - fixed
        if main < 0:
            schedule_ok = False
            main = 0
        blocks = [("Opening and team check-in", opening)]
        if reqs:
            half = main // 2
            blocks.append(("Hacking / building - part 1", half))
            for r in reqs:
                blocks.append((str(r["item"]).capitalize(), r.get("minutes") or 0))
            blocks.append(("Hacking / building - part 2", main - half))
        else:
            blocks.append(("Hacking / building", main))
        if judging_minutes:
            blocks.append(("Judging (every team seen by a judge)", judging_minutes))
        blocks.append(("Closing and prize announcement", closing))
        t = 0
        for name, mins in blocks:
            schedule.append({"item": name, "minutes": mins,
                             "start": t, "end": t + mins})
            t += mins
        if t != duration:
            schedule_ok = False

    lines = []
    if chosen_venue:
        lines.append(("Venue - " + str(chosen_venue.get("name")),
                      chosen_venue.get("price") or 0))
    if food_total is not None:
        lines.append(("Food - %s x %d people" %
                      (chosen_food.get("name"), people), food_total))
    if honorarium_total is not None:
        lines.append(("Judge honorarium - %d judges" % judges_used,
                      honorarium_total))
    for c in sorted(facts["committed"].values(), key=lambda c: c["item"]):
        lines.append(("Already committed - " + str(c["item"]), c["amount"]))
    total = sum(a for _, a in lines)

    plan = {
        "students": students, "teams": teams, "staff": staff,
        "judges_needed": judges_needed, "judges_confirmed": confirmed,
        "judges_used": judges_used, "people_to_feed": people,
        "venue": chosen_venue, "venue_relaxed": venue_relaxed,
        "food": chosen_food, "food_total": food_total,
        "honorarium_total": honorarium_total,
        "judging_minutes": judging_minutes,
        "schedule": schedule, "budget_lines": lines,
        "budget_total": total, "budget_cap": cap,
        "budget_remaining": (cap - total) if cap is not None else None,
    }

    checks = []
    checks.append({
        "name": "Budget within cap",
        "ok": cap is not None and total <= cap,
        "detail": "total Rs %s of cap Rs %s" % (fmt(total), fmt(cap))})
    checks.append({
        "name": "Venue fits everyone",
        "ok": bool(chosen_venue) and people is not None and
              (chosen_venue.get("capacity") or 0) >= people and not venue_relaxed,
        "detail": "%s seats %s, %s people present" % (
            chosen_venue.get("name") if chosen_venue else "none",
            chosen_venue.get("capacity") if chosen_venue else 0, people)})
    checks.append({
        "name": "Enough food ordered",
        "ok": bool(chosen_food) and people is not None,
        "detail": "%s boxes for %s people" % (people, people)})
    checks.append({
        "name": "Enough judges",
        "ok": judges_needed is not None and confirmed is not None and
              confirmed >= judges_needed,
        "detail": "%s needed (%s teams, max %s per judge), %s confirmed" % (
            judges_needed, teams,
            ju.get("max_teams_per_judge"), confirmed)})
    checks.append({
        "name": "Schedule valid",
        "ok": bool(schedule) and schedule_ok,
        "detail": "blocks sum to %s of %s minutes, all required breaks included"
                  % (sum(b["minutes"] for b in schedule), duration)})
    checks.append({
        "name": "All five areas covered",
        "ok": bool(chosen_venue and schedule and chosen_food and
                   judges_used is not None and lines),
        "detail": "venue, schedule, food, judging, budget all planned"})
    plan["checks"] = checks
    return plan


def recommendations(facts, plan):
    """Code-generated risk flags and fixes, computed from the plan's own
    figures - never model-invented. Each item names the numbers and the
    concrete lever that resolves it."""
    out = []
    cap = plan["budget_cap"]
    rem = plan["budget_remaining"]
    people = plan["people_to_feed"]
    foods = current_food_options(facts)
    chosen_food = plan["food"]
    chosen_venue = plan["venue"]
    levers = []
    if chosen_food and people:
        for alt in foods:
            if alt is chosen_food:
                continue
            saving = ((chosen_food.get("price_per_head") or 0)
                      - (alt.get("price_per_head") or 0)) * people
            if saving > 0:
                levers.append(
                    "switch food to %s (Rs %s per head) and save Rs %s"
                    % (alt.get("name"), fmt(alt.get("price_per_head")),
                       fmt(saving)))
    if chosen_venue:
        for v in facts["venue_options"]:
            if v is chosen_venue:
                continue
            if people is not None and (v.get("capacity") or 0) >= people \
                    and (v.get("price") or 0) < (chosen_venue.get("price") or 0):
                levers.append("move to %s and save Rs %s"
                              % (v.get("name"),
                                 fmt((chosen_venue.get("price") or 0)
                                     - (v.get("price") or 0))))
    if cap is not None and rem is not None:
        if rem < 0:
            txt = "The plan is Rs %s OVER the budget cap." % fmt(-rem)
            if levers:
                txt += (" To get back inside the cap: "
                        + "; ".join(levers) + ".")
            out.append(("risk", txt))
        elif rem < 0.10 * cap:
            txt = ("Budget headroom is thin: only Rs %s of Rs %s is left "
                   "(%.0f%%). Any new cost above Rs %s breaks the cap."
                   % (fmt(rem), fmt(cap), 100.0 * rem / cap, fmt(rem)))
            if levers:
                txt += " Room can be freed: " + "; ".join(levers) + "."
            out.append(("risk", txt))
    if chosen_venue and people:
        spare = (chosen_venue.get("capacity") or 0) - people
        if 0 <= spare <= 0.15 * people:
            bigger = [v for v in facts["venue_options"]
                      if (v.get("capacity") or 0)
                      > (chosen_venue.get("capacity") or 0)]
            txt = ("Venue headroom is small: %s seats %s for %s people - "
                   "only %s spare seats if attendance grows."
                   % (chosen_venue.get("name"),
                      fmt(chosen_venue.get("capacity")), fmt(people),
                      fmt(spare)))
            if bigger:
                b = sorted(bigger, key=lambda x: x.get("price") or 0)[0]
                txt += (" The next larger option is %s (seats %s, Rs %s)."
                        % (b.get("name"), fmt(b.get("capacity")),
                           fmt(b.get("price"))))
            out.append(("advice", txt))
    if plan["venue_relaxed"] and chosen_venue:
        feats = [norm(x) for x in chosen_venue.get("features") or []]

        def has(rf):
            return any(rf == f or set(rf.split()) <= set(f.split())
                       or set(f.split()) <= set(rf.split()) for f in feats)
        missing = [r for r in
                   facts["venue_requirements"].get("required_features", [])
                   if not has(norm(r))]
        out.append(("risk",
                    "No venue offers every required feature, so the plan "
                    "uses %s without: %s. Confirm the feature with the "
                    "venue, or drop the requirement."
                    % (chosen_venue.get("name"),
                       ", ".join(missing) if missing else "some requirements")))
    needed = plan["judges_needed"]
    confirmed = plan["judges_confirmed"]
    if needed is not None and confirmed is not None:
        if confirmed < needed:
            out.append(("risk",
                        "Only %s of the %s judges needed are confirmed - "
                        "judging cannot cover all %s teams. Recruit at "
                        "least %s more judge(s), or raise the per-judge "
                        "team cap."
                        % (fmt(confirmed), fmt(needed), fmt(plan["teams"]),
                           fmt(needed - confirmed))))
        elif plan["judges_used"] and confirmed - needed <= 1 \
                and plan["judges_used"] > 1:
            mins = facts["judging"].get("minutes_per_team")
            if mins:
                rounds2 = math.ceil(plan["teams"]
                                    / float(plan["judges_used"] - 1))
                delta = rounds2 * mins - (plan["judging_minutes"] or 0)
                if delta > 0:
                    out.append(("advice",
                                "There is almost no spare judging capacity "
                                "(%s confirmed, %s needed). If one judge "
                                "drops out, judging grows by %s minutes "
                                "and the schedule no longer fits - line up "
                                "a backup judge."
                                % (fmt(confirmed), fmt(needed), fmt(delta))))
    if chosen_food and len(foods) == 1:
        out.append(("advice",
                    "Only one food option was quoted (%s), so there is no "
                    "cheaper fallback if its price rises. Ask the caterer "
                    "for a second tier as a backup."
                    % chosen_food.get("name")))
    hacking = sum(b["minutes"] for b in plan["schedule"]
                  if "Hacking" in b["item"])
    duration = facts["event"].get("duration_minutes")
    if duration and 0 < hacking < 45:
        out.append(("advice",
                    "Hacking time is squeezed to %s minutes - the fixed "
                    "items (opening, judging, breaks, closing) take %s "
                    "of the %s minutes. Trim judging rounds or extend "
                    "the event if teams need more build time."
                    % (fmt(hacking), fmt(duration - hacking),
                       fmt(duration))))
    if facts["requests"]:
        out.append(("advice",
                    "%d request(s) are noted but not budgeted (first: "
                    "%s). Approving any of them has to come out of the "
                    "Rs %s still remaining - the plan does not include "
                    "them."
                    % (len(facts["requests"]),
                       str(facts["requests"][0].get("summary", ""))[:90],
                       fmt(rem))))
    if not out:
        out.append(("advice",
                    "No risks flagged: budget, venue, judges and "
                    "schedule all have healthy headroom."))
    return out


def fmt(n):
    if n is None:
        return "-"
    return "{:,}".format(int(n))


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------

def render_plan_text(state):
    plan = state["plan"]
    facts = state["facts"]
    out = []
    out.append("HACKATHON PLAN")
    out.append("Students: %s | Teams: %s | Staff: %s | People to feed: %s"
               % (plan["students"], plan["teams"], plan["staff"],
                  plan["people_to_feed"]))
    out.append("")
    v = plan["venue"]
    out.append("[venue] %s - seats %s, Rs %s" % (
        v.get("name") if v else "NOT FOUND", v.get("capacity") if v else "-",
        fmt(v.get("price")) if v else "-"))
    out.append("[schedule] %s minutes total:" %
               (state["facts"]["event"].get("duration_minutes") or "-"))
    for b in plan["schedule"]:
        out.append("    %3d-%3d  %-42s %3d min" %
                   (b["start"], b["end"], b["item"], b["minutes"]))
    f = plan["food"]
    out.append("[food] %s - %s boxes x Rs %s = Rs %s" % (
        f.get("name") if f else "NOT FOUND", plan["people_to_feed"],
        fmt(f.get("price_per_head")) if f else "-", fmt(plan["food_total"])))
    out.append("[judging] %s judges used (%s needed, %s confirmed), "
               "%s minutes of judging, honorarium Rs %s" % (
                   plan["judges_used"], plan["judges_needed"],
                   plan["judges_confirmed"], plan["judging_minutes"],
                   fmt(plan["honorarium_total"])))
    out.append("[budget]")
    for name, amount in plan["budget_lines"]:
        out.append("    %-46s Rs %s" % (name, fmt(amount)))
    out.append("    %-46s Rs %s" % ("TOTAL", fmt(plan["budget_total"])))
    out.append("    %-46s Rs %s" % ("Budget cap", fmt(plan["budget_cap"])))
    out.append("    %-46s Rs %s" % ("Remaining", fmt(plan["budget_remaining"])))
    out.append("")
    out.append("CHECKS:")
    for c in plan["checks"]:
        out.append("    [%s] %s - %s" %
                   ("PASS" if c["ok"] else "FAIL", c["name"], c["detail"]))
    recos = recommendations(facts, plan)
    if recos:
        out.append("")
        out.append("RISKS AND RECOMMENDATIONS:")
        for level, text in recos:
            out.append("    [%s] %s"
                       % ("RISK" if level == "risk" else "ADVICE", text))
    if facts["requests"]:
        out.append("")
        out.append("REQUESTS NOTED (not approved, not in the plan):")
        for r in facts["requests"]:
            out.append("    - " + str(r.get("summary", "")))
    if facts["other_constraints"]:
        out.append("")
        out.append("OTHER CONSTRAINTS READ FROM THE MESSAGES:")
        for o in facts["other_constraints"]:
            out.append("    - " + str(o.get("text", "")))
    if state.get("rejected"):
        out.append("")
        out.append("REJECTED MESSAGES:")
        for r in state["rejected"]:
            out.append("    - \"%s\"" % r["message"][:160])
            out.append("      Reason: " + r["reason"])
    ledger = fact_ledger_lines(state)
    if ledger:
        out.append("")
        out.append("FACT LEDGER (where each fact came from):")
        for line in ledger:
            out.append("    - " + line)
    if state.get("history"):
        out.append("")
        out.append("UPDATE HISTORY:")
        for h in state["history"]:
            total = ("Rs " + fmt(h["total"])) \
                if h.get("total") is not None else "-"
            out.append("    #%s %s - %s (total after: %s)"
                       % (h["seq"], h["type"], h["detail"], total))
    return "\n".join(out)


def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;"))


def render_html(state, trace_text):
    plan = state["plan"]
    facts = state["facts"]
    rows = "".join(
        "<tr><td>%s</td><td class='n'>Rs %s</td></tr>" % (esc(n), fmt(a))
        for n, a in plan["budget_lines"])
    sched = "".join(
        "<tr><td class='t'>%d-%d</td><td>%s</td><td class='n'>%d min</td></tr>"
        % (b["start"], b["end"], esc(b["item"]), b["minutes"])
        for b in plan["schedule"])
    checks = "".join(
        "<li><b class='%s'>%s</b> %s - %s</li>"
        % ("ok" if c["ok"] else "bad", "PASS" if c["ok"] else "FAIL",
           esc(c["name"]), esc(c["detail"]))
        for c in plan["checks"])
    rej = ("<div class='rejbox'><h2>Rejected messages</h2>"
           "<p class='note'>None - every message so far could be used "
           "without breaking the plan.</p></div>")
    if state.get("rejected"):
        items = "".join(
            "<li><span dir='auto'>\"%s\"</span><br><b>Reason:</b> %s</li>"
            % (esc(r["message"][:300]), esc(r["reason"]))
            for r in state["rejected"])
        rej = ("<div class='rejbox'><h2>Rejected messages</h2>"
               "<p class='note'>Messages that would have broken the "
               "plan, kept out - with the reason for each.</p>"
               "<ul class='rej'>%s</ul></div>" % items)
    req = ""
    if facts["requests"]:
        items = "".join("<li>%s</li>" % esc(r.get("summary", ""))
                        for r in facts["requests"])
        req = ("<h2>Requests noted (not approved - not in the plan)</h2>"
               "<ul>%s</ul>" % items)
    chip = ("<span class='cnt'>%d</span>" % len(state["rejected"])) \
        if state.get("rejected") else ""
    cons_html = ""
    if facts["other_constraints"]:
        cons_html = ("<h2>Other constraints</h2><p class='note'>Read "
                     "from the messages and respected by the plan.</p>"
                     "<ul>%s</ul>" % "".join(
                         "<li><span dir='auto'>%s</span></li>"
                         % esc(o.get("text", ""))
                         for o in facts["other_constraints"]))
    ledger_html = ""
    ledger_lines = fact_ledger_lines(state)
    if ledger_lines:
        ledger_html = ("<h2>Fact ledger</h2><p class='note'>Every figure the plan uses, with the message it was read from.</p><table>%s</table>" % "".join(
            "<tr><td>%s</td></tr>" % esc(x) for x in ledger_lines))
    hist_html = ""
    if state.get("history"):
        hist_html = ("<h2>Update history</h2><p class='note'>Every message that arrived after the first run, and what it did to the plan.</p><table>%s</table>" % "".join(
            "<tr><td class='t'>#%s</td><td>%s</td><td>%s</td>"
            "<td class='n'>%s</td></tr>"
            % (h["seq"], esc(h["type"]), esc(h["detail"]),
               ("Rs " + fmt(h["total"])) if h.get("total") is not None
               else "-")
            for h in state["history"]))
    all_ok = all(c["ok"] for c in plan["checks"])
    n_fail = sum(1 for c in plan["checks"] if not c["ok"])
    banner = ("<div class='banner %s'>%s</div>" % (
        "okb" if all_ok else "badb",
        ("ALL CHECKS PASS" if all_ok else "%d CHECK(S) FAILING" % n_fail)
        + " &middot; Total Rs %s of Rs %s &middot; Rs %s remaining"
        % (fmt(plan["budget_total"]), fmt(plan["budget_cap"]),
           fmt(plan["budget_remaining"]))))
    seg_colors = []
    for b in plan["schedule"]:
        name = b["item"].lower()
        if "prayer" in name or "namaz" in name:
            seg_colors.append("#B45309")
        elif "judg" in name:
            seg_colors.append("#134E4A")
        elif "hack" in name or "build" in name or "work" in name:
            seg_colors.append("#0F766E")
        else:
            seg_colors.append("#44403C")
    segs = "".join(
        "<div style='flex:%d;background:%s'>%s</div>"
        % (b["minutes"], col,
           "%d min" % b["minutes"] if b["minutes"] >= 25 else "")
        for b, col in zip(plan["schedule"], seg_colors))
    legend = " &middot; ".join(
        "%s (%d min)" % (esc(b["item"]), b["minutes"])
        for b in plan["schedule"])
    timeline = ("<div class='tl'>%s</div>"
                "<div class='tllegend'>%s</div>" % (segs, legend))
    v, f = plan["venue"], plan["food"]
    chips = ""
    if v and v.get("features"):
        chips = ("<div class='chips'>" + "".join(
            "<span class='chip'>%s</span>" % esc(x)
            for x in v["features"]) + "</div>")
    pct = 0
    if plan["budget_cap"]:
        pct = round(100.0 * plan["budget_total"] / plan["budget_cap"])
    meter = ("<div class='meter'><div style='width:%d%%'></div></div>"
             "<p class='capnote'>%d%% of the budget used</p>" % (pct, pct))
    figures = ["%s students" % fmt(plan["students"]),
               "%s teams" % fmt(plan["teams"]),
               esc(v.get("name") if v else "-"),
               "%s people to feed" % fmt(plan["people_to_feed"]),
               "Rs %s of Rs %s" % (fmt(plan["budget_total"]),
                                   fmt(plan["budget_cap"])),
               "ALL CHECKS PASS" if all_ok else "CHECKS FAILING"]
    band = (" &middot; ".join(figures) + " &middot; ") * 3
    marquee = ("<div class='marquee'><div class='mtrack'>"
               "<span>%s</span><span>%s</span></div></div>" % (band, band))
    stats = ("<p class='sub'>Model calls so far: %s &middot; "
             "Total tokens (as reported by the API): %s</p>"
             % (fmt(state["model_calls"]), fmt(state["total_tokens"])))
    reco_html = ""
    recos = recommendations(facts, plan)
    if recos:
        reco_items = "".join(
            "<li class='%s'><b>%s</b> %s</li>"
            % ("rk" if lv == "risk" else "ad",
               "RISK" if lv == "risk" else "ADVICE", esc(t))
            for lv, t in recos)
        reco_html = ("<h2>Risks and recommendations</h2>"
                     "<p class='note'>Generated in code from the plan's "
                     "own figures - each item names the problem and the "
                     "lever that fixes it.</p><ul class='reco'>%s</ul>"
                     % reco_items)
    html = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hackathon Plan - Team AXIONS</title>
<style>
body{font-family:system-ui,Arial,sans-serif;background:#FAFAF9;color:#1C1917;
margin:0;padding:24px;line-height:1.45}
.wrap{max-width:880px;margin:0 auto}
h1{font-size:28px;margin:0 0 4px}
h2{font-size:19px;margin:32px 0 8px;padding-bottom:6px;
border-bottom:1px solid #E7E5E4}
.note{color:#57534E;font-size:14px;margin:0 0 10px}
::selection{background:#0F766E;color:#fff}
summary{cursor:pointer;font-weight:600}
.reco li{margin:7px 0}
.reco .rk b{color:#B91C1C}
.reco .ad b{color:#0F766E}
.pbtn:focus-visible,summary:focus-visible{outline:2px solid #0F766E;
outline-offset:2px}
.sub{color:#57534E;margin-bottom:16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.card{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:14px}
.card h3{margin:0 0 6px;font-size:13px;letter-spacing:.08em;color:#0F766E}
.card p{margin:0;font-size:17px}
table{width:100%%;border-collapse:collapse;background:#fff;
border:1px solid #E7E5E4;border-radius:10px;overflow:hidden}
td{padding:8px 12px;border-top:1px solid #E7E5E4} td.n{text-align:right;white-space:nowrap} td.t{white-space:nowrap}
ul{padding-left:20px} .ok{color:#0F766E} .bad{color:#B91C1C}
.rej li{margin-bottom:10px}
details{background:#fff;border:1px solid #E7E5E4;border-radius:10px;padding:12px}
pre{white-space:pre-wrap;word-break:break-word;font-size:12px}
.banner{border-radius:10px;padding:12px 16px;color:#fff;font-weight:600;
margin-bottom:16px}
.banner.okb{background:#0F766E} .banner.badb{background:#B91C1C}
.tl{display:flex;height:34px;border-radius:8px;overflow:hidden;margin-bottom:6px}
.tl div{color:#fff;font-size:12px;display:flex;align-items:center;
justify-content:center;overflow:hidden;white-space:nowrap;min-width:0}
.tllegend{font-size:12px;color:#57534E;margin-bottom:10px}
.rejbox{background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;
padding:6px 16px 12px;margin-top:22px}
.rejbox h2{color:#B91C1C;margin-top:10px;border-bottom:0;padding-bottom:0}
.pbtn{float:right;background:#1C1917;color:#fff;border:0;border-radius:8px;
padding:9px 14px;font-size:14px;cursor:pointer}
.chips{margin-top:8px}
.chip{display:inline-block;background:#F5F5F4;border:1px solid #E7E5E4;
border-radius:999px;padding:2px 10px;font-size:12px;margin:0 4px 4px 0;
color:#44403C}
.meter{background:#E7E5E4;border-radius:999px;height:10px;margin-top:10px;
overflow:hidden}
.meter div{background:#0F766E;height:100%%}
.capnote{font-size:13px;color:#57534E;margin-top:6px}
.marquee{overflow:hidden;background:#1C1917;color:#FAFAF9;border-radius:10px;
margin-bottom:16px}
.mtrack{display:flex;width:max-content;animation:mq 26s linear infinite}
.mtrack span{padding:9px 0;white-space:nowrap;font-weight:600;
letter-spacing:.06em;font-size:13px}
@keyframes mq{to{transform:translateX(-50%%)}}
@media (prefers-reduced-motion: reduce){.mtrack{animation:none}}
.wordmark{font-weight:900;font-size:clamp(64px,17vw,168px);line-height:.82;
letter-spacing:-.02em;text-align:center;color:#E7E5E4;user-select:none;
margin-top:44px}
.pbtn{border-radius:999px;transition:background .25s ease}
.pbtn:hover{background:#0F766E}
.pbtn .more{display:inline-block;max-width:0;overflow:hidden;
white-space:nowrap;transition:max-width .35s ease;vertical-align:bottom}
.pbtn:hover .more{max-width:180px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:18px 0 4px}
.tab{border:1px solid #E7E5E4;background:#fff;color:#1C1917;
border-radius:999px;padding:9px 18px;font-size:14px;font-weight:600;
cursor:pointer;font-family:inherit}
.tab[aria-selected='true']{background:#1C1917;color:#fff;
border-color:#1C1917}
.tab .cnt{background:#B91C1C;color:#fff;border-radius:999px;
padding:1px 7px;font-size:12px;margin-left:6px}
.view{display:none}
.view.active{display:block}
.tracebox{background:#fff;border:1px solid #E7E5E4;border-radius:10px;
padding:12px;overflow-x:auto}
@media print{body{background:#fff;padding:0}
.pbtn{display:none} .marquee{display:none} .tabs{display:none}
.view{display:block!important}
.card,.rejbox,.banner{break-inside:avoid}}
</style></head><body><div class="wrap">
<header>
<h1>Hackathon Plan - Plan Banao</h1>
<button class='pbtn' onclick='window.print()'>Print<span class='more'> / save as PDF</span></button>
<div class="sub">%s students, %s teams, %s people to feed in total</div>
</header>
<nav class="tabs">
<button class="tab" data-view="view-plan" aria-selected="true">Plan</button>
<button class="tab" data-view="view-facts" aria-selected="false">Facts &amp; messages</button>
<button class="tab" data-view="view-updates" aria-selected="false">Updates%s</button>
<button class="tab" data-view="view-trace" aria-selected="false">Trace</button>
</nav>
<main>
<section id="view-plan" class="view active">
%s
%s
<div class="cards">
<div class="card"><h3>VENUE</h3><p>%s</p><p>Seats %s - Rs %s</p>%s</div>
<div class="card"><h3>FOOD</h3><p>%s</p><p>%s boxes - Rs %s</p><p class='capnote'>Rs %s per person</p></div>
<div class="card"><h3>JUDGING</h3><p>%s judges (%s confirmed)</p><p>%s minutes - Rs %s</p></div>
<div class="card"><h3>BUDGET</h3><p>Rs %s of Rs %s</p><p>Remaining: Rs %s</p>%s</div>
</div>
<h2>Schedule</h2>%s<table>%s</table>
<h2>Budget detail</h2><table>%s
<tr><td><b>TOTAL</b></td><td class="n"><b>Rs %s</b></td></tr></table>
<h2>Checks</h2><p class='note'>Six deterministic checks, run in code after every build. The plan counts as valid only while all of them pass.</p><ul>%s</ul>
%s
</section>
<section id="view-facts" class="view">
%s%s%s
</section>
<section id="view-updates" class="view">
%s%s
</section>
<section id="view-trace" class="view">
<h2>Full trace</h2>%s<pre class='tracebox'>%s</pre>
</section>
</main>
<footer><div class="wordmark">AXIONS</div></footer>
</div>
<script>
document.querySelectorAll('.tab').forEach(function(b){
b.addEventListener('click',function(){
document.querySelectorAll('.tab').forEach(function(x){x.setAttribute('aria-selected','false')});
document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active')});
b.setAttribute('aria-selected','true');
document.getElementById(b.getAttribute('data-view')).classList.add('active');
window.scrollTo(0,0);
});
});
var h=window.location.hash.replace('#','');
if(h){var t=document.querySelector('[data-view="'+h+'"]');if(t){t.click();}}
</script>
</body></html>""" % (
        plan["students"], plan["teams"], plan["people_to_feed"], chip,
        banner, marquee, esc(v.get("name") if v else "NOT FOUND"),
        v.get("capacity") if v else "-",
        fmt(v.get("price")) if v else "-", chips,
        esc(f.get("name") if f else "NOT FOUND"), plan["people_to_feed"],
        fmt(plan["food_total"]),
        fmt(f.get("price_per_head")) if f else "-",
        plan["judges_used"], plan["judges_confirmed"],
        plan["judging_minutes"], fmt(plan["honorarium_total"]),
        fmt(plan["budget_total"]), fmt(plan["budget_cap"]),
        fmt(plan["budget_remaining"]), meter,
        timeline, sched, rows, fmt(plan["budget_total"]), checks,
        reco_html, ledger_html, req, cons_html, hist_html, rej,
        stats, esc(trace_text))
    with open(HTML_PATH, "w", encoding="utf-8") as fh:
        fh.write(html)


# --------------------------------------------------------------------------
# Directive evaluation - messages that try to impose a number on the plan
# --------------------------------------------------------------------------

def evaluate_directives(directives, plan, trace, state, source_text):
    """Returns True if all directives can be honoured. A directive that
    would break a hard requirement is rejected: the plan stays as it was
    and the reason is recorded and printed."""
    people = plan.get("people_to_feed")
    for d in directives or []:
        area = norm(d.get("area"))
        action = norm(d.get("action"))
        value = d.get("value")
        reason = None
        if value is not None and area == "food" and people is not None \
                and value < people:
            reason = ("the message sets the food quantity to %s, but %s "
                      "people must be fed - %s people would get no food. "
                      "The plan keeps %s boxes."
                      % (fmt(value), fmt(people), fmt(people - value),
                         fmt(people)))
        elif value is not None and area == "judging" \
                and plan.get("judges_needed") is not None \
                and value < plan["judges_needed"]:
            reason = ("the message allows only %s judges, but %s teams at "
                      "most %s teams per judge need at least %s judges. "
                      "The plan keeps %s judges."
                      % (fmt(value), fmt(plan.get("teams")),
                         "the stated cap", fmt(plan["judges_needed"]),
                         fmt(plan["judges_used"])))
        elif value is not None and area == "venue" and people is not None \
                and value < people:
            reason = ("the message limits the venue to %s people, but %s "
                      "people will be present. The plan keeps a venue that "
                      "fits everyone." % (fmt(value), fmt(people)))
        if reason:
            trace.note("REJECTED directive (%s): %s" % (d.get("text", ""), reason))
            state.setdefault("rejected", []).append(
                {"message": source_text.strip(), "reason": reason})
            return False
        trace.code("directive noted, plan stays valid: %s"
                   % (d.get("text") or d))
    return True


def normalize_digits(text):
    """Urdu/Arabic digits and the Arabic thousands separator -> Western
    digits, so the code-side checks read quantities in any script."""
    return str(text).translate(_DIGIT_TABLE)


# --------------------------------------------------------------------------
# Deterministic conflict scan (plain code - does not depend on the model
# classifying a message correctly)
# --------------------------------------------------------------------------

QUANTITY_UNITS = [
    (r"boxes|box\b", "food", "people_to_feed",
     "the message sets the food quantity to {v} boxes, but {need} people "
     "must be fed - {diff} people would get no food. The plan keeps "
     "{need} boxes."),
    (r"judges|judge\b", "judging", "judges_needed",
     "the message allows only {v} judges, but {teams} teams need at "
     "least {need} judges. The plan keeps {used} judges."),
    (r"seats|chairs", "venue", "people_to_feed",
     "the message provides only {v} seats, but {need} people will be "
     "present. The plan keeps a venue that fits everyone."),
]


_DIGIT_TABLE = str.maketrans("٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹٬", "01234567890123456789,")



_NUMBER_WORDS = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4,
                 "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9,
                 "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13,
                 "fourteen": 14, "fifteen": 15, "sixteen": 16,
                 "seventeen": 17, "eighteen": 18, "nineteen": 19,
                 "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
                 "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}


def words_to_digits(text):
    """English number phrases -> digits ('one hundred and twenty' ->
    '120'), so the quantity scan also catches quantities a message
    spells out in words instead of digits."""
    tokens = re.findall(r"[a-z]+|[^a-z]+", text)
    out, i = [], 0
    while i < len(tokens):
        tok = tokens[i]
        if tok in _NUMBER_WORDS or tok in ("hundred", "thousand") or \
                (tok == "a" and i + 2 < len(tokens)
                 and tokens[i + 2] in ("hundred", "thousand")):
            total, current, j = 0, 0, i
            while j < len(tokens):
                t = tokens[j]
                if t in _NUMBER_WORDS:
                    current += _NUMBER_WORDS[t]
                elif t == "hundred":
                    current = (current or 1) * 100
                elif t == "thousand":
                    total += (current or 1) * 1000
                    current = 0
                elif t == "a" and current == 0 and total == 0:
                    current = 1
                elif t == "and" and (current or total):
                    pass
                else:
                    break
                j += 1
                if j < len(tokens) and tokens[j].strip() == "":
                    j += 1
            out.append(str(total + current))
            if j > i and tokens[j - 1].strip() == "":
                out.append(tokens[j - 1])
            i = j
        else:
            out.append(tok)
            i += 1
    return "".join(out)


def scan_conflicting_quantities(text, plan):
    """Find quantities a message imposes (a number right before a unit
    word) and check them against the plan's hard requirements. Returns a
    rejection reason string, or None."""
    if not plan:
        return None
    low = words_to_digits(normalize_digits(text.lower()))
    for pattern, area, need_key, template in QUANTITY_UNITS:
        need = plan.get(need_key)
        if need is None:
            continue
        for m in re.finditer(r"(\d[\d,]*)\s*(?:" + pattern + ")", low):
            value = int(m.group(1).replace(",", ""))
            if value < need:
                return template.format(
                    v=fmt(value), need=fmt(need), diff=fmt(need - value),
                    teams=fmt(plan.get("teams")), used=fmt(plan.get("judges_used")))
    return None


# --------------------------------------------------------------------------
# Runs
# --------------------------------------------------------------------------

def new_state():
    return {"facts": empty_facts(), "plan": None, "rejected": [],
            "model_calls": 0, "total_tokens": 0, "seq": 0,
            "messages_seen": [], "history": []}


def log_history(state, type_, detail):
    """Append one entry to the session's update history (shown in the
    plan and the UI): what happened, and the budget total after it."""
    plan = state.get("plan") or {}
    state.setdefault("history", []).append(
        {"seq": state.get("seq", 1), "type": type_, "detail": detail,
         "total": plan.get("budget_total")})


def fact_ledger_lines(state):
    """One line per fact in the fact base, with the message it came
    from (and its date, where the message carried one)."""
    facts = state["facts"]
    lines = []
    for v in facts["venue_options"]:
        lines.append("Venue option: %s - seats %s, Rs %s (message #%s)"
                     % (v.get("name"), v.get("capacity"),
                        fmt(v.get("price")), v.get("source", "?")))
    for f in facts["food_options"]:
        d = (" on " + str(f["date"])) if f.get("date") else ""
        lines.append("Food: %s - Rs %s per head%s (message #%s)"
                     % (f.get("name"), fmt(f.get("price_per_head")), d,
                        f.get("source", "?")))
    ju = facts["judging"]
    if any(ju.get(k) is not None for k in
           ("judges_confirmed", "honorarium_each", "minutes_per_team",
            "max_teams_per_judge")):
        lines.append("Judging: %s confirmed, Rs %s each, %s min per "
                     "team, max %s teams per judge"
                     % (ju.get("judges_confirmed"),
                        fmt(ju.get("honorarium_each")),
                        ju.get("minutes_per_team"),
                        ju.get("max_teams_per_judge")))
    for c in sorted(facts["committed"].values(),
                    key=lambda c: c.get("item", "")):
        d = (" on " + str(c["date"])) if c.get("date") else ""
        lines.append("Committed cost: %s - Rs %s%s (message #%s)"
                     % (c.get("item"), fmt(c.get("amount")), d,
                        c.get("source", "?")))
    for s in facts["schedule_requirements"]:
        lines.append("Schedule requirement: %s - %s min (message #%s)"
                     % (s.get("item"), s.get("minutes"),
                        s.get("source", "?")))
    for o in facts["other_constraints"]:
        lines.append("Constraint: %s (message #%s)"
                     % (o.get("text"), o.get("source", "?")))
    return lines


def save_outputs(state, trace_text):
    os.makedirs(RUN_DIR, exist_ok=True)
    with open(STATE_PATH, "w", encoding="utf-8") as fh:
        json.dump(state, fh, indent=1)
    with open(PLAN_PATH, "w", encoding="utf-8") as fh:
        fh.write(render_plan_text(state))
    with open(TRACE_PATH, "a", encoding="utf-8") as fh:
        fh.write(trace_text + "\n\n")
    full_trace = ""
    if os.path.exists(TRACE_PATH):
        with open(TRACE_PATH, encoding="utf-8") as fh:
            full_trace = fh.read()
    render_html(state, full_trace)


def extract_with_retry(prompt, tag, trace):
    """One extraction call; if the reply is empty or unparseable, retry
    once (counted honestly as a second model call)."""
    for attempt in range(2):
        reply, usage = call_model(prompt, max_tokens=6000)
        trace.model_call(tag, prompt, reply, usage)
        obj = parse_json_reply(reply)
        if isinstance(obj, list):
            obj = next((x for x in obj if isinstance(x, dict)), None)
        if isinstance(obj, dict):
            return obj
        trace.note("reply was not valid JSON; retrying the call")
    raise RuntimeError("Model did not return valid JSON twice in a row.")


def run_full(text):
    state = new_state()
    trace = Trace(state)
    state["seq"] = 1
    trace.code("full run: reading the whole message pack")
    ext = extract_with_retry(extraction_prompt(text), "reading", trace)
    directives = merge_extraction(state["facts"], ext, seq=1)
    for m in ext.get("messages") or []:
        state["messages_seen"].append(
            {"n": m.get("n"), "kind": m.get("kind"),
             "summary": m.get("note")})
    plan = build_plan(state["facts"])
    state["plan"] = plan
    if directives:
        evaluate_directives(directives, plan, trace, state, text)
        plan = build_plan(state["facts"])
        state["plan"] = plan
    trace.code("plan built in code: venue, schedule, food, judging, budget")
    for c in plan["checks"]:
        trace.code("check [%s] %s - %s"
                   % ("PASS" if c["ok"] else "FAIL", c["name"], c["detail"]))
    log_history(state, "Full run", "message pack read; plan built")
    trace_text = trace.render("TRACE - full run")
    save_outputs(state, trace_text)
    return state, trace_text


def plan_summary(plan):
    if not plan:
        return "{}"
    return json.dumps({
        "students": plan["students"], "teams": plan["teams"],
        "people_to_feed": plan["people_to_feed"],
        "venue": (plan["venue"] or {}).get("name"),
        "judges_used": plan["judges_used"],
        "budget_total": plan["budget_total"],
        "budget_cap": plan["budget_cap"]})


def run_update(text):
    with open(STATE_PATH, encoding="utf-8") as fh:
        state = json.load(fh)
    trace = Trace(state)
    state["seq"] = state.get("seq", 1) + 1
    seq = state["seq"]
    old_plan = state["plan"]
    old_checks = {c["name"]: c["ok"] for c in old_plan["checks"]}

    trace.code("update run: classifying the new message")
    reply, usage = call_model(classify_prompt(text, plan_summary(old_plan)),
                              max_tokens=400)
    trace.model_call("reading", classify_prompt(text, plan_summary(old_plan)),
                     reply, usage)
    route = parse_json_reply(reply) or {}
    if isinstance(route, list):
        route = next((x for x in route if isinstance(x, dict)), {})
    if not isinstance(route, dict):
        route = {}
    kind = norm(route.get("kind")) or "fact"
    areas = [norm(a) for a in route.get("areas") or [] if norm(a) in AREAS]
    trace.code("classified as kind=%s, areas=%s (%s)"
               % (kind, areas, route.get("summary", "")))
    state["messages_seen"].append(
        {"kind": kind, "summary": route.get("summary", "")})

    conflict = scan_conflicting_quantities(text, old_plan) \
        if kind == "fact" else None
    if conflict:
        trace.note("REJECTED by the code validator: " + conflict)
        state.setdefault("rejected", []).append(
            {"message": text.strip(), "reason": conflict})
        log_history(state, "Update rejected", conflict)
        trace_text = trace.render("TRACE - update")
        save_outputs(state, trace_text)
        return state, trace_text

    if kind in ("request", "irrelevant"):
        if kind == "request":
            state["facts"]["requests"].append(
                {"summary": route.get("summary", ""), "_seq": seq})
            trace.note("request noted - not approved, so the plan does "
                       "not change and no area is recomputed")
        else:
            trace.note("message changes no planning fact - plan unchanged")
        log_history(state,
                    "Request noted" if kind == "request"
                    else "Update ignored",
                    route.get("summary", ""))
        trace_text = trace.render("TRACE - update")
        save_outputs(state, trace_text)
        return state, trace_text

    import copy
    snapshot = copy.deepcopy(state["facts"])
    tag = areas[0] if areas else "reading"
    trace.code("extracting the update for area: %s" % tag)
    ext = extract_with_retry(
        extraction_prompt(text, known_names_context(state["facts"])),
        tag, trace)
    directives = merge_extraction(state["facts"], ext, seq=seq)
    plan = build_plan(state["facts"])

    rejected_reason = None
    if directives and not evaluate_directives(
            directives, plan, trace, state, text):
        rejected_reason = state["rejected"][-1]["reason"]
    if rejected_reason is None:
        for c in plan["checks"]:
            if not c["ok"] and old_checks.get(c["name"]):
                rejected_reason = (
                    "accepting this message would break the check "
                    "'%s' (%s). The previous valid plan is kept."
                    % (c["name"], c["detail"]))
                break
    if rejected_reason is not None:
        state["facts"] = snapshot
        if not directives:
            state.setdefault("rejected", []).append(
                {"message": text.strip(), "reason": rejected_reason})
        trace.note("REJECTED: " + rejected_reason)
        state["plan"] = build_plan(state["facts"])
        log_history(state, "Update rejected", rejected_reason)
    else:
        state["plan"] = plan
        recomputed = list(dict.fromkeys(areas + ["budget"]))
        trace.code("update accepted; recomputed areas (in code): %s"
                   % ", ".join(recomputed))
        log_history(state, "Update accepted",
                    "recomputed areas: " + ", ".join(recomputed))
        for c in plan["checks"]:
            trace.code("check [%s] %s - %s"
                       % ("PASS" if c["ok"] else "FAIL",
                          c["name"], c["detail"]))
    trace_text = trace.render("TRACE - update")
    save_outputs(state, trace_text)
    return state, trace_text


def main(argv):
    if len(argv) != 2:
        print("Usage: python3 main.py <messages.txt>")
        return 2
    with open(argv[1], encoding="utf-8") as fh:
        text = fh.read()
    started = time.time()
    if os.path.exists(STATE_PATH):
        state, trace_text = run_update(text)
        mode = "update"
    else:
        state, trace_text = run_full(text)
        mode = "full run"
    print(render_plan_text(state))
    print()
    print(trace_text)
    print()
    print("[done] %s in %.1f seconds. Plan: %s | Trace: %s | UI: %s"
          % (mode, time.time() - started, PLAN_PATH, TRACE_PATH, HTML_PATH))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
