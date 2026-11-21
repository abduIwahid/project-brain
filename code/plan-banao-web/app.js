"use strict";
/* app.js - Plan Banao (browser edition).
   Same design as main.py: the model only reads, planner.js plans,
   validators guard. State lives in this page only. */
const $ = s => document.querySelector(s);
const esc = s => String(s === null || s === undefined ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");
let S = null;
let PROV = [];

function newState() {
  return {facts: emptyFacts(), plan: null, rejected: [], history: [],
    calls: 0, tokens: {prompt: 0, completion: 0, total: 0},
    trace: [], diffHtml: "", seq: 0, sims: []};
}
function setStatus(msg, isErr) {
  const el = $("#status");
  el.textContent = msg || "";
  el.className = "status" + (isErr ? " err" : "");
}
function note(line) { S.trace.push("[code] " + line); }
function busy(b) {
  $("#runBtn").disabled = b;
  document.querySelectorAll("[data-break], #applyBtn")
    .forEach(x => x.disabled = b);
  const sk = $("#skel"), rs = $("#results");
  if (sk) sk.style.display =
    (b && rs && rs.style.display === "none") ? "block" : "none";
}

async function callModel(area, prompt, maxTokens) {
  const qp = new URLSearchParams(location.search);
  const override = qp.get("base");
  const url = override
    ? override.replace(/\/$/, "") + "/chat/completions" : "/api/chat";
  const headers = { "Content-Type": "application/json" };
  if (override) headers["Authorization"] = "Bearer " + (qp.get("key") || "");
  let lastErr = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({model: MODEL_NAME, temperature: 0,
          max_tokens: maxTokens,
          response_format: {type: "json_object"},
          messages: [{role: "user", content: prompt}]})});
    } catch (e) {
      throw new Error("Could not reach the model API (" + e.message +
        "). Check the endpoint and your connection.");
    }
    if (res.status === 429 && attempt < 3) {
      setStatus("Rate limit reached - waiting 15 seconds, then retrying…");
      await new Promise(r => setTimeout(r, 15000));
      continue;
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error("Model API returned " + res.status + ": " +
        t.slice(0, 200));
    }
    const data = await res.json();
    const content = data.choices[0].message.content || "";
    const usage = data.usage || {};
    S.calls += 1;
    S.tokens.prompt += usage.prompt_tokens || 0;
    S.tokens.completion += usage.completion_tokens || 0;
    S.tokens.total += usage.total_tokens || 0;
    S.trace.push("--- MODEL CALL #" + S.calls + " ---");
    S.trace.push("Model: " + MODEL_NAME);
    S.trace.push("Area: " + area);
    S.trace.push("Input:\n" + prompt);
    S.trace.push("Output:\n" + content);
    S.trace.push("Tokens (as reported by the API): prompt " +
      (usage.prompt_tokens || 0) + ", completion " +
      (usage.completion_tokens || 0) + ", total " +
      (usage.total_tokens || 0));
    return parseJson(content);
  }
  throw lastErr || new Error("Model call failed.");
}
function parseJson(content) {
  try { return JSON.parse(content); } catch (e) { /* fall through */ }
  const a = content.indexOf("{"), b = content.lastIndexOf("}");
  if (a >= 0 && b > a) return JSON.parse(content.slice(a, b + 1));
  throw new Error("The model did not return valid JSON.");
}

/* ---------------- chat ---------------- */
function bubble(text, who) {
  const th = $("#chatThread");
  if (!th) return;
  const d = document.createElement("div");
  d.className = "chatmsg " + who;
  d.textContent = text;
  th.appendChild(d);
  th.scrollTop = th.scrollHeight;
  persist();
}
function agentSay(text) { bubble(text, "agent"); }
function answerQuestion(raw) {
  if (!S || !S.plan) return null;
  const t = raw.toLowerCase();
  const isQ = t.includes("?") ||
    /^(kya|kitna|kitne|konsa|kaun|what|how|why|batao|show|tell)\b/
      .test(t.trim()) || t.includes(" batao");
  if (!isQ) return null;
  const p = S.plan, f = S.facts;
  if (/^(hi|hello|salam|aoa|hey)\b/.test(t.trim()))
    return "Hello. I am the planning agent. Send me update messages " +
      "and I will apply them safely, or ask me about the budget, " +
      "venue, food, judges, schedule, checks or risks.";
  if (t.includes("risk") || t.includes("recommend") ||
      t.includes("suggest") || t.includes("masla") ||
      t.includes("issue"))
    return "Risks and recommendations:\n" + recommendations(f, p)
      .map((r, i) => (i + 1) + ". [" + r[0].toUpperCase() + "] " + r[1])
      .join("\n");
  if (t.includes("bacha") || t.includes("remaining") ||
      t.includes("budget") || t.includes("total") ||
      t.includes("cost") || t.includes("kharcha"))
    return "Budget: total Rs " + fmt(p.budget_total) + " of Rs " +
      fmt(p.budget_cap) + " - Rs " + fmt(p.budget_remaining) +
      " remaining.";
  if (t.includes("venue") || t.includes("hall"))
    return "Venue: " + (p.venue ? p.venue.name : "none") + " - seats " +
      (p.venue ? p.venue.capacity : "-") + ", Rs " +
      fmt(p.venue ? p.venue.price : null) + ".";
  if (t.includes("food") || t.includes("khana") ||
      t.includes("lunch") || t.includes("boxes"))
    return "Food: " + (p.food ? p.food.name : "none") + " - Rs " +
      fmt(p.food ? p.food.price_per_head : null) + " per person x " +
      p.people_to_feed + " people = Rs " + fmt(p.food_total) + ".";
  if (t.includes("judge"))
    return "Judging: " + p.judges_used + " judges used (" +
      p.judges_needed + " needed, " + p.judges_confirmed +
      " confirmed), " + p.judging_minutes + " minutes, honorarium Rs " +
      fmt(p.honorarium_total) + ".";
  if (t.includes("schedule") || t.includes("program") ||
      t.includes("timing"))
    return "Schedule:\n" + p.schedule.map(b => b.start + "-" + b.end +
      "  " + b.item + " (" + b.minutes + " min)").join("\n");
  if (t.includes("check") || t.includes("valid") ||
      t.includes("pass"))
    return "Checks: " + p.checks.filter(c => c.ok).length + " of 6 " +
      "pass." + (p.checks.every(c => c.ok) ? "" : " Failing: " +
      p.checks.filter(c => !c.ok).map(c => c.name).join(", ") + ".");
  if (t.includes("kitne") || t.includes("kitna") ||
      t.includes("people") || t.includes("student") ||
      t.includes("team"))
    return "Counts: " + p.students + " students, " + p.teams +
      " teams, " + p.staff + " staff, " + p.judges_used + " judges - " +
      p.people_to_feed + " people to feed in total.";
  return null;
}
/* ---------------- request tracker ----------------
   The chat shows the live phase of the user's latest request -
   received, reading, checking, updating - then the outcome, so
   they can see the agent actually working. Driven by the real
   pipeline stages in runUpdate, never by a timer. */
const TRACK_STEPS = ["Received", "Reading the message",
  "Checking against the plan", "Updating the plan"];
let trackEl = null;
function trackStart(text) {
  trackEl = $("#reqTrack"); if (!trackEl) return;
  trackEl.hidden = false;
  trackEl.innerHTML = "<div class='track'><div class='track-h'><b>" +
    "Your request</b><span class='track-state work'>WORKING</span>" +
    "</div><p class='track-msg'>&ldquo;" + esc(text) + "&rdquo;</p>" +
    "<ol class='tsteps'>" + TRACK_STEPS.map((t, i) =>
      "<li data-i='" + i + "'><span class='tdot'></span>" + t +
      "</li>").join("") + "</ol><p class='track-out'></p></div>";
  trackStep(1);
}
function trackStep(n) {
  if (!trackEl || trackEl.hidden) return;
  trackEl.querySelectorAll(".tsteps li").forEach(li => {
    const i = +li.getAttribute("data-i");
    li.className = i < n ? "done" : (i === n ? "active" : "");
    li.querySelector(".tdot").textContent = i < n ? "\u2713" : "";
  });
}
function trackDone(outcome, kind) {
  if (!trackEl || trackEl.hidden) return;
  trackStep(4);
  const st = trackEl.querySelector(".track-state");
  if (st) { st.textContent = "DONE"; st.className = "track-state done"; }
  const out = trackEl.querySelector(".track-out");
  if (out) { out.textContent = outcome; out.className = "track-out " + (kind || "ok"); }
}
function trackQuick(outcome) {
  trackEl = $("#reqTrack"); if (!trackEl) return;
  trackEl.hidden = false;
  trackEl.innerHTML = "<div class='track'><div class='track-h'><b>" +
    "Your request</b><span class='track-state done'>DONE</span></div>" +
    "<p class='track-out ok' style='margin-top:6px'>" + esc(outcome) +
    "</p></div>";
}
async function sendChat(raw) {
  const text = raw.trim();
  if (!text) return;
  bubble(text, "user");
  if (!S || !S.plan) {
    agentSay("Run a plan first - upload the message pack above. " +
      "Then you can send me updates and questions here.");
    return;
  }
  const ans = answerQuestion(text);
  if (ans) {
    trackQuick("Answered from the plan's own figures - no model " +
      "call was needed.");
    agentSay(ans);
    note("chat question answered from the plan - no model call");
    return;
  }
  await runUpdate(text);
}

/* ---------------- full run ---------------- */
async function runFull(text) {
  S = newState();
  setStatus("Reading the messages with the model…");
  const ext = await callModel("reading",
    extractionPrompt(text, S.facts, false), 6000);
  S.seq = 1;
  mergeExtraction(S.facts, ext, 1);
  note("facts merged into the fact base; planning in code");
  S.plan = buildPlan(S.facts);
  S.history.push({seq: 1, type: "Full run",
    detail: "message pack read; plan built", total: S.plan.budget_total});
  S.diffHtml = "";
  note("plan built - total Rs " + fmt(S.plan.budget_total) + "; " +
    S.plan.checks.filter(c => c.ok).length + " of 6 checks pass");
  render();
  setStatus("Plan ready. Chat with the agent, send updates, or try " +
    "to break the plan - all in the Agent chat tab.");
  const okN = S.plan.checks.filter(c => c.ok).length;
  agentSay("Plan ready - total Rs " + fmt(S.plan.budget_total) +
    " of Rs " + fmt(S.plan.budget_cap) + ", " + okN + " of 6 checks " +
    "pass. Send me update messages here, or ask about the plan.");
  const recos = recommendations(S.facts, S.plan);
  const nRisk = recos.filter(r => r[0] === "risk").length;
  if (nRisk)
    agentSay("Heads up: " + nRisk + " risk(s) flagged - see Risks " +
      "and recommendation in the Plan tab.");
  const advice = primaryAdvice(recos, S.plan);
  if (advice) agentSay("My recommendation: " + advice);
}

/* ---------------- update run ---------------- */
function checksPassed(plan) {
  return new Set(plan.checks.filter(c => c.ok).map(c => c.name));
}
function rejectUpdate(text, reason, areas) {
  S.rejected.push({message: text, reason: reason});
  S.history.push({seq: S.seq, type: "Update rejected",
    detail: reason, total: S.plan.budget_total});
  S.diffHtml = "<div class='diffbox bad'><p><b>Update rejected - the " +
    "plan did not change.</b></p><p>" + esc(reason) + "</p></div>";
  trackDone("Rejected - the plan did not change. " + reason, "bad");
  note("update REJECTED: " + reason);
  agentSay("I kept that message out: " + reason);
}
async function runUpdate(text) {
  if (!S || !S.plan) { setStatus("Run a plan first.", true); return; }
  busy(true);
  trackStart(text);
  try {
    setStatus("Reading the new message…");
    S.seq += 1;
    const cls = await callModel("reading",
      classifyPrompt(text, planSummary(S.plan)), 400);
    const kind = cls.kind || "fact";
    const areas = (cls.areas || []).filter(a => AREAS.includes(a));
    trackStep(2);
    const scan = scanConflictingDirective(text, S.plan);
    if (scan) {
      const reason = evaluateDirectives([scan], S.plan);
      if (reason) { rejectUpdate(text, reason, areas); render(); return; }
    }
    if (kind === "request") {
      S.facts.requests.push({summary: cls.summary || text,
        source: null, _seq: S.seq});
      S.history.push({seq: S.seq, type: "Request noted",
        detail: (cls.summary || text) +
          " - noted, not added to the plan or the budget",
        total: S.plan.budget_total});
      S.diffHtml = "<div class='diffbox'><p><b>Request noted.</b> " +
        "It is listed under Facts &amp; messages; the plan and the " +
        "budget did not change.</p></div>";
      note("request noted, plan unchanged");
      agentSay("Noted as a request - it is not in the plan or the " +
        "budget: " + (cls.summary || text));
      trackDone("Noted as a request - it is listed under Facts " +
        "& messages; the plan and the budget did not change.");
      render(); return;
    }
    if (kind === "irrelevant") {
      S.history.push({seq: S.seq, type: "Update ignored",
        detail: "the message changes nothing about the event",
        total: S.plan.budget_total});
      S.diffHtml = "<div class='diffbox'><p><b>Nothing to update.</b> " +
        "The message does not change any figure in the plan.</p></div>";
      note("message irrelevant, plan unchanged");
      agentSay("That message does not change anything in the plan.");
      trackDone("No change - this message does not affect any " +
        "figure in the plan.");
      render(); return;
    }
    const tag = areas.length ? areas[0] : "reading";
    trackStep(3);
    const ext = await callModel(tag,
      extractionPrompt(text, S.facts, true), 6000);
    const candidate = structuredClone(S.facts);
    const directives = mergeExtraction(candidate, ext, S.seq);
    const plan2 = buildPlan(candidate);
    const dirReason = evaluateDirectives(directives, plan2);
    if (dirReason) { rejectUpdate(text, dirReason, areas); render(); return; }
    const before = checksPassed(S.plan);
    const broken = plan2.checks.filter(c => !c.ok && before.has(c.name));
    if (broken.length) {
      rejectUpdate(text, "the update would break a check that " +
        "currently passes (" + broken[0].name.toLowerCase() +
        ") - the plan stays as it was.", areas);
      render(); return;
    }
    const prev = S.plan;
    S.facts = candidate; S.plan = plan2;
    S.history.push({seq: S.seq, type: "Update accepted",
      detail: "recomputed areas: " + (areas.join(", ") || "none"),
      total: plan2.budget_total});
    S.diffHtml = diffHtml(prev, plan2);
    note("update accepted - new total Rs " + fmt(plan2.budget_total));
    agentSay("Done - recomputed " + (areas.join(", ") || "the plan") +
      ". Total is now Rs " + fmt(plan2.budget_total) + " (was Rs " +
      fmt(prev.budget_total) + "); " +
      plan2.checks.filter(c => c.ok).length + " of 6 checks pass.");
    trackDone("Applied - the plan was rebuilt and re-checked. " +
      "New total: Rs " + fmt(plan2.budget_total) + ".");
    render();
  } catch (e) {
    trackDone("Stopped - " + e.message, "bad");
    setStatus(e.message, true);
  } finally {
    busy(false);
  }
}
function diffHtml(prev, next) {
  let h = "<div class='diffbox'><p><b>What changed</b></p>";
  h += "<p>Total: <s>Rs " + fmt(prev.budget_total) + "</s> → " +
    "<span class='new'>Rs " + fmt(next.budget_total) + "</span></p>";
  const pm = {}, nm = {};
  prev.budget_lines.forEach(l => pm[l.label] = l.amount);
  next.budget_lines.forEach(l => nm[l.label] = l.amount);
  let any = false;
  for (const l of next.budget_lines) {
    if (l.label in pm && pm[l.label] !== l.amount) {
      h += "<p>" + esc(l.label) + ": <s>Rs " + fmt(pm[l.label]) +
        "</s> → <span class='new'>Rs " + fmt(l.amount) + "</span></p>";
      any = true;
    } else if (!(l.label in pm)) {
      h += "<p>Added: " + esc(l.label) + " - <span class='new'>Rs " +
        fmt(l.amount) + "</span></p>"; any = true;
    }
  }
  for (const l of prev.budget_lines)
    if (!(l.label in nm)) {
      h += "<p>Removed: " + esc(l.label) + " - <s>Rs " +
        fmt(l.amount) + "</s></p>"; any = true;
    }
  if (!any) h += "<p>No figure changed.</p>";
  return h + "</div>";
}

/* ---------------- rendering ---------------- */
function prov(title, body) {
  PROV.push({t: title, b: body});
  return " data-prov='" + (PROV.length - 1) + "'";
}
function srcText(o) {
  let s = "";
  if (o && o.source) s += "message #" + o.source;
  if (o && o.date) s += (s ? ", " : "") + o.date;
  return s || "the messages";
}
function render() {
  PROV = [];
  const p = S.plan, f = S.facts;
  const allOk = p.checks.every(c => c.ok);
  const banner = "<div class='banner" + (allOk ? "" : " bad") + "'>" +
    (allOk ? "ALL CHECKS PASS" : "SOME CHECKS FAIL") + " / Total Rs " +
    fmt(p.budget_total) + " of Rs " + fmt(p.budget_cap) + " / Rs " +
    fmt(p.budget_remaining) + " remaining" +
    (S.restored ? " <span class='demotag'>DEMO DETAILS</span>" : "") +
    "</div>";
  const figStr = p.students + " students / " + p.teams + " teams / " +
    (p.venue ? p.venue.name : "-") + " / " + p.people_to_feed +
    " people to feed / Rs " + fmt(p.budget_total) + " of Rs " +
    fmt(p.budget_cap) + " / " + (allOk ? "ALL CHECKS PASS" : "CHECK FAILING");
  const marquee = "<div class='marquee'><span class='track'>" +
    esc(figStr + " / " + figStr + " / " + figStr) + "</span></div>";
  const v = p.venue || {}, fd = p.food || {};
  const chips = (v.features || []).map(x =>
    "<span class='chip'>" + esc(x) + "</span>").join("");
  const pct = p.budget_cap
    ? Math.round(100 * p.budget_total / p.budget_cap) : 0;
  const cards = "<div class='cards'>" +
    "<div class='card clickable' data-ev='venue'><h3>VENUE</h3><p>" + esc(v.name || "NOT FOUND") +
    "</p><p>Seats " + esc(v.capacity ?? "-") + " - Rs " + fmt(v.price) +
    "</p><div class='chips'>" + chips + "</div></div>" +
    "<div class='card clickable' data-ev='food'><h3>FOOD</h3><p>" + esc(fd.name || "NOT FOUND") +
    "</p><p>" + p.people_to_feed + " boxes - Rs " + fmt(p.food_total) +
    "</p><p class='capnote'>Rs " + fmt(fd.price_per_head) +
    " per person</p></div>" +
    "<div class='card clickable' data-ev='judging'><h3>JUDGING</h3><p>" + p.judges_used + " judges (" +
    p.judges_confirmed + " confirmed)</p><p>" + p.judging_minutes +
    " minutes - Rs " + fmt(p.honorarium_total) + "</p></div>" +
    "<div class='card clickable' " +
    prov("Budget total", "The total is plain addition of the budget " +
      "lines below - no model arithmetic. Click any budget line to see " +
      "where its figure came from.") +
    "><h3>BUDGET</h3><p>Rs " + fmt(p.budget_total) + " of Rs " +
    fmt(p.budget_cap) + "</p><p>Remaining: Rs " +
    fmt(p.budget_remaining) + "</p><div class='meter'><div style='width:" +
    pct + "%'></div></div><p class='capnote'>" + pct +
    "% of the budget used</p></div></div>";
  const tlCols = ["b0", "b1", "b2", "b1", "b3", "b4"];
  let timeline = "<div class='tl'>";
  p.schedule.forEach((b, i) => {
    timeline += "<div class='" + tlCols[i % tlCols.length] +
      "' style='flex:" + Math.max(b.minutes, 1) + "'>" +
      (b.minutes >= 25 ? b.minutes + " min" : "") + "</div>";
  });
  timeline += "</div><p class='legend'>" + p.schedule.map(b =>
    esc(b.item) + " (" + b.minutes + " min)").join(" / ") + "</p>";
  const schedRows = p.schedule.map(b => "<tr><td class='n'>" + b.start +
    "-" + b.end + "</td><td>" + esc(b.item) + "</td><td class='n'>" +
    b.minutes + " min</td></tr>").join("");
  const lineProv = l => {
    let body = "Figure read from " + srcText(l) + ".";
    if (l.label.startsWith("Food -") && p.food)
      body += " Amount = Rs " + fmt(p.food.price_per_head) +
        " per person × " + p.people_to_feed + " people.";
    if (l.label.startsWith("Venue -"))
      body += " The cheapest venue that fits " + p.people_to_feed +
        " people and has every required feature.";
    if (l.label.startsWith("Judge honorarium"))
      body = "Judges used = " + p.judges_used + " (teams " + p.teams +
        " ÷ max " + f.judging.max_teams_per_judge + " per judge, " +
        "rounded up). Amount = " + p.judges_used + " × Rs " +
        fmt(f.judging.honorarium_each) + " honorarium.";
    return body;
  };
  const budgetRows = p.budget_lines.map(l =>
    "<tr class='clickable'" + prov(l.label, lineProv(l)) + "><td>" +
    esc(l.label) + "</td><td class='n'>Rs " + fmt(l.amount) +
    "</td></tr>").join("");
  const checks = "<ul>" + p.checks.map(c => "<li><span class='" +
    (c.ok ? "pass" : "fail") + "'>" + (c.ok ? "PASS" : "FAIL") +
    "</span> " + esc(c.name) + " - " + esc(c.detail) + "</li>")
    .join("") + "</ul>";
  $("#view-plan").innerHTML = banner + marquee + S.diffHtml + cards +
    "<div class='chatcta'><div><b>Questions or an update?</b>" +
    "<p class='note'>Message the agent - every change is re-checked " +
    "against this plan before it is applied.</p></div>" +
    "<button class='btn' onclick=\"activateTab('view-chat')\">Talk " +
    "to the agent</button></div>" +
    "<h2>Schedule</h2>" + timeline + "<table>" + schedRows + "</table>" +
    "<h2>Budget detail</h2><p class='note'>Click any line to see where " +
    "the figure came from.</p><table>" + budgetRows +
    "<tr><td><b>TOTAL</b></td><td class='n'><b>Rs " +
    fmt(p.budget_total) + "</b></td></tr></table>" +
    "<h2>Checks</h2><p class='note'>Six deterministic checks, run in " +
    "code after every build. The plan counts as valid only while all " +
    "of them pass.</p>" + checks + recoHtml() + simHtml();
  /* facts view */
  const led = [];
  const ev = f.event;
  const addLed = (fact, value, o) => led.push([fact, value, o]);
  addLed("Students", ev.students, null);
  addLed("Team size", ev.team_size, null);
  addLed("Event duration (minutes)", ev.duration_minutes, null);
  addLed("Budget cap", "Rs " + fmt(ev.budget_cap), null);
  addLed("Staff on site", ev.staff, null);
  for (const x of f.venue_options)
    addLed("Venue option - " + x.name,
      "seats " + x.capacity + ", Rs " + fmt(x.price), x);
  for (const x of currentFoodOptions(f))
    addLed("Food - " + x.name, "Rs " + fmt(x.price_per_head) +
      " per person", x);
  addLed("Judges confirmed", f.judging.judges_confirmed, null);
  addLed("Judge honorarium each",
    "Rs " + fmt(f.judging.honorarium_each), null);
  addLed("Max teams per judge", f.judging.max_teams_per_judge, null);
  for (const c of Object.values(f.committed))
    addLed("Committed - " + c.item, "Rs " + fmt(c.amount), c);
  for (const r of f.schedule_requirements)
    addLed("Schedule requirement - " + r.item, r.minutes + " min", r);
  const ledRows = led.map(r => "<tr class='clickable'" +
    prov(r[0], "Read from " + srcText(r[2]) + ". The planner uses the " +
      "latest dated value when a message corrects an earlier one.") +
    "><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" +
    esc(srcText(r[2])) + "</td></tr>").join("");
  let factsHtml = "<h2>Fact ledger</h2><p class='note'>Every figure " +
    "the plan uses, with the message it was read from. Click a row " +
    "for the detail.</p><table><tr><th>Fact</th><th>Value</th>" +
    "<th>Source</th></tr>" + ledRows + "</table>";
  const dlog = f.decision_log || [];
  if (dlog.length)
    factsHtml += "<h2>Decision history</h2><p class='note'>Values " +
      "replaced as newer messages arrived - what changed, and where " +
      "the change came from.</p><ul>" + dlog.map(d => "<li>" +
      esc(d.label) + ": " + esc(d.old) + " \u2192 " + esc(d.new) +
      (d.source ? " (message #" + d.source +
        (d.date ? ", " + esc(d.date) : "") + ")" : "") +
      "</li>").join("") + "</ul>";
  if (f.requests.length)
    factsHtml += "<h2>Requests noted (not in the plan)</h2><ul>" +
      f.requests.map(r => "<li>" + esc(r.summary) + "</li>").join("") +
      "</ul>";
  if (f.other_constraints.length)
    factsHtml += "<h2>Other constraints</h2><ul>" +
      f.other_constraints.map(o => "<li><span dir='auto'>" +
        esc(o.text) + "</span></li>").join("") + "</ul>";
  $("#view-facts").innerHTML = factsHtml;
  /* updates view */
  const histRows = S.history.map(h => "<tr><td class='n'>#" + h.seq +
    "</td><td>" + esc(h.type) + "</td><td>" + esc(h.detail) +
    "</td><td class='n'>Rs " + fmt(h.total) + "</td></tr>").join("");
  let rej;
  if (S.rejected.length)
    rej = "<div class='rejbox'><h2>Rejected messages</h2>" +
      "<p class='note'>Messages that would have broken the plan, kept " +
      "out - with the reason for each.</p><ul class='rej'>" +
      S.rejected.map(r => "<li><span class='msgq' dir='auto'>\"" +
        esc(r.message) + "\"</span><br><b>Reason:</b> " + esc(r.reason) +
        "</li>").join("") + "</ul></div>";
  else
    rej = "<div class='rejbox'><h2>Rejected messages</h2>" +
      "<p class='note'>None - every message so far could be used " +
      "without breaking the plan.</p></div>";
  $("#view-updates").innerHTML =
    "<h2>Update history</h2><p class='note'>Every message that arrived " +
    "after the first run, and what it did to the plan.</p><table>" +
    histRows + "</table>" + rej;
  $("#updBadge").innerHTML = S.rejected.length
    ? "<span class='cnt'>" + S.rejected.length + "</span>" : "";
  /* trace view */
  const stats = "<p class='note'>Model calls so far: " + S.calls +
    " / Tokens (as reported by the API): prompt " + fmt(S.tokens.prompt) +
    ", completion " + fmt(S.tokens.completion) + ", total " +
    fmt(S.tokens.total) + ". Every call used " + MODEL_NAME + ".</p>";
  $("#view-trace").innerHTML = "<h2>Full trace</h2>" + stats +
    "<pre class='tracebox'>" + esc(S.trace.join("\n\n")) + "</pre>";
  $("#results").style.display = "block";
  persist();
}
function primaryAdvice(recos, plan) {
  const adv = recos.filter(r => r[0] === "advice");
  if (adv.length) return adv[0][1];
  const risks = recos.filter(r => r[0] === "risk");
  if (risks.length)
    return "Act on the top risk first - " + risks[0][1];
  if (plan && plan.checks.every(c => c.ok))
    return "The plan passes all 6 checks, with Rs " +
      fmt(plan.budget_remaining) + " of the Rs " + fmt(plan.budget_cap) +
      " cap still free. Keep that amount untouched as a buffer for " +
      "on-the-day surprises - it is the cheapest insurance this " +
      "plan has.";
  return null;
}
function recoHtml() {
  const recos = recommendations(S.facts, S.plan);
  const risks = recos.filter(r => r[0] === "risk");
  const advice = primaryAdvice(recos, S.plan);
  let h = "<h2>Risks and recommendation</h2><p class='note'>From the " +
    "plan's own figures: every risk the checks can see, and the one " +
    "clearest next step.</p>";
  if (risks.length)
    h += risks.map(r => "<div class='reco risk'><span class='rk'>!</" +
      "span><div><b>RISK</b> " + esc(r[1]) + "</div></div>").join("");
  else
    h += "<p class='note'>No risks flagged - every check passes " +
      "and no headroom is dangerously thin.</p>";
  if (advice)
    h += "<div class='reco rec-main'><span class='ad'>\u2713</span>" +
      "<div><b>RECOMMENDATION</b> " + esc(advice) + "</div></div>";
  return h;
}

/* ---------------- what-if simulator ----------------
   Simulate only: every scenario runs the planner on a CLONE of the
   fact base. The real plan, history and trace are never touched. */
const SIMS = {
  "venue-out": "The chosen venue becomes unavailable",
  "food-cheaper": "Switch to the cheapest food tier",
  "food-upgrade": "Switch to the premium food tier",
  "students-50": "50 more students register",
  "cap-20": "The budget cap is cut by 20%",
  "judge-drop": "One judge drops out"};
function runSim(id) {
  if (!S || !S.plan) return;
  const c = structuredClone(S.facts);
  const p0 = S.plan;
  if (id === "venue-out" && p0.venue)
    c.venue_options = c.venue_options.filter(
      x => norm(x.name) !== norm(p0.venue.name));
  if (id === "food-cheaper" || id === "food-upgrade") {
    const cur = currentFoodOptions(c);
    if (cur.length) {
      const sorted = [...cur].sort((a, b) =>
        (a.price_per_head || 0) - (b.price_per_head || 0));
      const target = id === "food-cheaper"
        ? sorted[0] : sorted[sorted.length - 1];
      const keep = norm(target.name);
      c.food_options = c.food_options.filter(x =>
        norm(x.name) === keep || findKey([keep], x.name) === keep);
    }
  }
  if (id === "students-50")
    c.event.students = (c.event.students || 0) + 50;
  if (id === "cap-20" && c.event.budget_cap)
    c.event.budget_cap = Math.round(c.event.budget_cap * 0.8);
  if (id === "judge-drop")
    c.judging.judges_confirmed = Math.max(0,
      (c.judging.judges_confirmed || 0) - 1);
  const p2 = buildPlan(c);
  const lines = [];
  lines.push("Venue: " + (p0.venue ? p0.venue.name : "-") + " \u2192 " +
    (p2.venue ? p2.venue.name + " (Rs " + fmt(p2.venue.price) + ")"
              : "NO VENUE FITS"));
  if ((p2.food || {}).name !== (p0.food || {}).name)
    lines.push("Food: " + (p0.food ? p0.food.name : "-") + " \u2192 " +
      (p2.food ? p2.food.name : "-"));
  lines.push("Total: Rs " + fmt(p0.budget_total) + " \u2192 Rs " +
    fmt(p2.budget_total) + " (" +
    (p2.budget_total >= p0.budget_total ? "+" : "-") + "Rs " +
    fmt(Math.abs(p2.budget_total - p0.budget_total)) + ")");
  lines.push("Remaining: Rs " + fmt(p0.budget_remaining) + " \u2192 Rs " +
    fmt(p2.budget_remaining));
  if (p2.people_to_feed !== p0.people_to_feed ||
      p2.judges_used !== p0.judges_used)
    lines.push("People to feed: " + p0.people_to_feed + " \u2192 " +
      p2.people_to_feed + " / judges used: " + p0.judges_used +
      " \u2192 " + p2.judges_used + " / judging: " +
      p0.judging_minutes + " \u2192 " + p2.judging_minutes + " min");
  const failing = p2.checks.filter(x => !x.ok);
  S.sims.unshift({name: SIMS[id] || id, lines: lines,
    feasible: failing.length === 0,
    failing: failing.map(x => x.name)});
  note("simulation run (" + (SIMS[id] || id) +
    ") - real plan unchanged");
  render();
}
function simHtml() {
  let h = "<h2>What-if simulator</h2><p class='note'>Simulate only - " +
    "experiments run on a copy of the facts and never overwrite the " +
    "real plan.</p><div class='simgrid'>" +
    Object.keys(SIMS).map(k => "<button class='simbtn' data-sim='" +
      k + "'>" + SIMS[k] + "</button>").join("") + "</div>";
  for (const s of S.sims || [])
    h += "<div class='simcard" + (s.feasible ? "" : " no") + "'>" +
      "<span class='simtag'>SIMULATION - REAL PLAN UNCHANGED</span>" +
      "<h3>" + esc(s.name) + "</h3>" + s.lines.map(l => "<p>" +
      esc(l) + "</p>").join("") + "<p class='feas " +
      (s.feasible ? "ok" : "no") + "'>" + (s.feasible
        ? "FEASIBLE - all 6 checks still pass"
        : "NOT FEASIBLE - failing: " + s.failing.join(", ")) +
      "</p></div>";
  return h;
}

/* ---------------- decision evidence ---------------- */
function decisionEvidence(kind) {
  const p = S.plan, f = S.facts;
  const dl = (f.decision_log || []);
  if (kind === "venue" && p.venue) {
    const v = p.venue, L = [];
    L.push("Quoted in " + srcText(v) + " - Rs " + fmt(v.price) +
      ", seats " + v.capacity + (v.features && v.features.length
        ? ", features: " + v.features.join(", ") : "") + ".");
    for (const d of dl)
      if (d.label.startsWith("Venue " + v.name))
        L.push("Changed while reading: " + d.label.split(" - ")[1] +
          " " + d.old + " \u2192 " + d.new + " (" + srcText(d) + ").");
    L.push("Why chosen: the cheapest venue that seats " +
      p.people_to_feed + " people and has every required feature.");
    for (const o of f.venue_options) {
      if (norm(o.name) === norm(v.name)) continue;
      if ((o.capacity || 0) < p.people_to_feed)
        L.push(o.name + ": rejected - seats " + o.capacity +
          ", fewer than the " + p.people_to_feed + " people present.");
      else
        L.push(o.name + ": also fits - Rs " +
          fmt((o.price || 0) - (v.price || 0)) +
          " more, so it was not chosen.");
    }
    return {t: "Evidence - venue: " + v.name, lines: L};
  }
  if (kind === "food" && p.food) {
    const fd = p.food, L = [];
    L.push("Current price Rs " + fmt(fd.price_per_head) +
      " per person, from " + srcText(fd) +
      ". When quotes conflict, the latest dated one wins.");
    for (const o of f.food_options)
      if (norm(o.name) === norm(fd.name) &&
          o.price_per_head !== fd.price_per_head)
        L.push("Earlier quote: Rs " + fmt(o.price_per_head) +
          " per person (" + (o.date || "undated") +
          ") - replaced by the later quote above.");
    L.push("Why chosen: tiers are tried from the standard tier " +
      "down; the first combination that fits the cap wins. With " +
      fd.name + " the total is Rs " + fmt(p.budget_total) +
      " of Rs " + fmt(p.budget_cap) + ".");
    for (const o of currentFoodOptions(f))
      if (norm(o.name) !== norm(fd.name))
        L.push("Alternative: " + o.name + " at Rs " +
          fmt(o.price_per_head) + " per person would change the " +
          "total by Rs " + fmt(((o.price_per_head || 0) -
            (fd.price_per_head || 0)) * p.people_to_feed) + ".");
    return {t: "Evidence - food: " + fd.name, lines: L};
  }
  if (kind === "judging") {
    const L = [];
    L.push(p.judges_needed + " judges needed = " + p.teams +
      " teams \u00f7 max " + f.judging.max_teams_per_judge +
      " per judge, rounded up. " + p.judges_confirmed +
      " confirmed, so " + p.judges_used + " are used.");
    L.push("Honorarium: " + p.judges_used + " \u00d7 Rs " +
      fmt(f.judging.honorarium_each) + " = Rs " +
      fmt(p.honorarium_total) + ".");
    L.push("Judging time: " + Math.ceil(p.teams / p.judges_used) +
      " rounds \u00d7 " + f.judging.minutes_per_team + " minutes = " +
      p.judging_minutes + " minutes in the schedule.");
    for (const d of dl)
      if (d.label.startsWith("Judging"))
        L.push("Changed while reading: " + d.label + " " + d.old +
          " \u2192 " + d.new + ".");
    return {t: "Evidence - judging", lines: L};
  }
  return null;
}

/* ---------------- wiring ---------------- */
function activateTab(name) {
  document.querySelectorAll(".tab").forEach(x =>
    x.setAttribute("aria-selected",
      x.getAttribute("data-view") === name ? "true" : "false"));
  document.querySelectorAll(".view").forEach(x =>
    x.classList.toggle("active", x.id === name));
  const label = {["view-plan"]: "Plan", ["view-facts"]: "Facts & messages",
    ["view-updates"]: "Updates", ["view-chat"]: "Agent chat",
    ["view-trace"]: "Trace"}[name];
  if (label) $("#crumbNow").textContent = label;
}
document.addEventListener("click", e => {
  const tab = e.target.closest(".tab");
  if (tab) { activateTab(tab.getAttribute("data-view")); return; }
  const brk = e.target.closest("[data-break]");
  if (brk) {
    $("#updText").value = brk.getAttribute("data-break");
    runUpdate(brk.getAttribute("data-break"));
    activateTab("view-updates");
    return;
  }
  if (e.target.closest("#applyBtn")) {
    const t = $("#updText").value.trim();
    if (t) runUpdate(t);
    return;
  }
  const sim = e.target.closest("[data-sim]");
  if (sim) { runSim(sim.getAttribute("data-sim")); return; }
  const evEl = e.target.closest("[data-ev]");
  if (evEl) {
    const d = decisionEvidence(evEl.getAttribute("data-ev"));
    if (d) {
      $("#provTitle").textContent = d.t;
      $("#provBody").innerHTML = d.lines.map(esc).join("<br>");
      $("#provPanel").classList.add("show");
      $("#provPanel").scrollIntoView({behavior: "smooth",
        block: "nearest"});
    }
    return;
  }
  const pv = e.target.closest("[data-prov]");
  if (pv) {
    const d = PROV[+pv.getAttribute("data-prov")];
    if (d) {
      $("#provTitle").textContent = d.t;
      $("#provBody").textContent = d.b;
      $("#provPanel").classList.add("show");
      $("#provPanel").scrollIntoView({behavior: "smooth",
        block: "nearest"});
    }
  }
});
$("#provClose").addEventListener("click", () =>
  $("#provPanel").classList.remove("show"));
$("#burger").addEventListener("click", () =>
  $("#mainnav").classList.toggle("open"));

const dz = $("#dropzone"), fi = $("#fileInput");
dz.addEventListener("click", () => fi.click());
dz.addEventListener("dragover", e => { e.preventDefault();
  dz.classList.add("drag"); });
dz.addEventListener("dragleave", () => dz.classList.remove("drag"));
dz.addEventListener("drop", e => {
  e.preventDefault(); dz.classList.remove("drag");
  if (e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]);
});
fi.addEventListener("change", () => {
  if (fi.files.length) readFile(fi.files[0]);
});
function readFile(file) {
  const r = new FileReader();
  r.onload = () => {
    $("#msgText").value = String(r.result || "");
    setStatus("Loaded " + file.name + " - press Run the planner.");
  };
  r.readAsText(file);
}
$("#runBtn").addEventListener("click", async () => {
  const text = $("#msgText").value.trim();
  if (!text) { setStatus("Upload a messages file (or paste the " +
    "messages) first.", true); return; }
  busy(true);
  try { await runFull(text); }
  catch (e) { setStatus(e.message, true); }
  finally { busy(false); }
});
$("#chatSend").addEventListener("click", () => {
  const v = $("#chatText").value;
  $("#chatText").value = "";
  sendChat(v);
});
$("#chatText").addEventListener("keydown", e => {
  if (e.key === "Enter") $("#chatSend").click();
});
/* ---------------- session persistence ----------------
   The whole session (fact base, plan, history, trace, chat) is kept
   in this browser's local storage, so when a new message arrives -
   minutes or days later - the agent still has the full context of
   the earlier runs. Nothing is sent to any server. */
const LS_KEY = "axions-planner-v1";
function persist() {
  try {
    if (!S || !S.plan) return;
    localStorage.setItem(LS_KEY, JSON.stringify({
      facts: S.facts, plan: S.plan, rejected: S.rejected,
      history: S.history, calls: S.calls, tokens: S.tokens,
      trace: S.trace, seq: S.seq, sims: S.sims || [],
      chat: $("#chatThread") ? $("#chatThread").innerHTML : ""}));
  } catch (e) { /* storage full or blocked - session just won't persist */ }
}
function restore() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d.plan || !d.facts) return;
    S = {facts: d.facts, plan: d.plan, rejected: d.rejected || [],
      history: d.history || [], calls: d.calls || 0,
      tokens: d.tokens || {prompt: 0, completion: 0, total: 0},
      trace: d.trace || [], diffHtml: "", seq: d.seq || 1,
      sims: d.sims || [], restored: true};
    render();
    if (d.chat) $("#chatThread").innerHTML = d.chat;
    setStatus("Demo details - this is the sample plan saved in this " +
      "browser from an earlier run, not live data. Send the next update " +
      "in Agent chat, or start a new plan.");
    agentSay("Welcome back - I still have the current plan (total " +
      "Rs " + fmt(S.plan.budget_total) + ") and the history of " +
      S.history.length + " run(s). Send the next message whenever " +
      "it arrives; I will read it against everything so far.");
  } catch (e) { /* corrupted saved state - start clean */ }
}
$("#resetBtn").addEventListener("click", () => {
  try { localStorage.removeItem(LS_KEY); } catch (e) {}
  S = null;
  $("#results").style.display = "none";
  $("#chatThread").innerHTML = "";
  $("#crumbNow").textContent = "New plan";
  setStatus("Session cleared. Upload a new message pack to start " +
    "a fresh plan.");
});
restore();
window.runWithText = t =>
  runFull(t).catch(e => setStatus(e.message, true));
