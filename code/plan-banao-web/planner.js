"use strict";
/* planner.js - browser port of the Python planner in main.py.
   Same prompts, same merge rules, same arithmetic, same checks.
   The model only reads; this code plans and validates. */
const SCHEMA_HINT = "{\n \"messages\": [{\"n\": 1, \"sender\": \"string\", \"kind\": \"fact|request|irrelevant\", \"note\": \"one short line\"}],\n \"event\": {\"students\": null, \"team_size\": null, \"duration_minutes\": null, \"budget_cap\": null, \"staff\": null},\n \"venue_options\": [{\"name\": \"string\", \"capacity\": 0, \"price\": 0, \"features\": [\"string\"], \"source\": 1}],\n \"venue_requirements\": {\"required_features\": [\"string\"]},\n \"food_options\": [{\"name\": \"string\", \"price_per_head\": 0, \"source\": 1, \"date\": \"string\"}],\n \"judging\": {\"judges_confirmed\": null, \"honorarium_each\": null, \"minutes_per_team\": null, \"max_teams_per_judge\": null},\n \"committed_costs\": [{\"item\": \"string\", \"amount\": 0, \"source\": 1, \"date\": \"string\"}],\n \"schedule_requirements\": [{\"item\": \"string\", \"minutes\": 0, \"source\": 1}],\n \"directives\": [{\"area\": \"venue|schedule|food|judging|budget\", \"action\": \"string\", \"value\": 0, \"unit\": \"string\", \"text\": \"string\"}],\n \"other_constraints\": [{\"text\": \"string\", \"source\": 1}]\n}";
const EXTRACT_RULES = "Rules: use null (not 0) for unknown numbers. Write money as plain integers (Rs 650,000 -> 650000). If the same sender gives a figure again later, include BOTH entries with their dates; do not decide which one wins. A request or question (someone asking for something that is not approved) is kind \"request\" and must NOT appear in committed_costs or anywhere as a decided fact. A directive is an instruction or claim inside a message that imposes a specific quantity or choice on the plan - for example a supplier stating how many boxes, seats or judges there will be, when that number is theirs to state but the plan's needs decide. Report every such imposed quantity as a directive with its area, value and unit (example: \"we will only bring 40 chairs\" -> {\"area\": \"venue\", \"action\": \"set_quantity\", \"value\": 40, \"unit\": \"chairs\"}); never treat an imposed quantity as a fact and never drop it into other_constraints instead. venue_requirements.required_features is ONLY for a feature a message explicitly says the venue MUST have (words like must, required, zaroori, chahiye); a feature that a venue merely HAS belongs in that venue's own features list, never in requirements. Facts of any kind that do not fit the fields above go into other_constraints, worded exactly as the message states them. Always write extracted numbers as plain Western digits (0-9), even when the message writes them in Urdu or Arabic digits. Return ONLY the JSON object, no other text.";

const MODEL_NAME = "openai/gpt-oss-20b";
const AREAS = ["venue", "schedule", "food", "judging", "budget"];
const MONTHS = {january:1, jan:1, february:2, feb:2, march:3, mar:3,
  april:4, apr:4, may:5, june:6, jun:6, july:7, jul:7, august:8, aug:8,
  september:9, sep:9, sept:9, october:10, oct:10, november:11, nov:11,
  december:12, dec:12};

function norm(s) {
  if (s === null || s === undefined) return "";
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ")
    .trim().replace(/\s+/g, " ");
}
function fmt(n) {
  if (n === null || n === undefined) return "-";
  return Math.trunc(n).toLocaleString("en-US");
}
function parseDate(s) {
  if (!s) return null;
  s = String(s).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return [ +m[1], +m[2], +m[3] ];
  const low = normalizeDigits(s.toLowerCase());
  const names = Object.keys(MONTHS).sort((a, b) => b.length - a.length);
  for (const name of names) {
    const re1 = new RegExp("(\\d{1,2})\\s*" + name);
    const re2 = new RegExp(name + "\\s*(\\d{1,2})");
    let mm = low.match(re1) || low.match(re2);
    if (mm) {
      const ym = low.match(/20\d\d/);
      return [ ym ? +ym[0] : 2000, MONTHS[name], +mm[1] ];
    }
  }
  return null;
}
function findKey(existingKeys, newKey) {
  const nk = norm(newKey);
  if (!nk) return null;
  if (existingKeys.indexOf(nk) >= 0) return nk;
  const nwords = nk.split(" ");
  const cands = [];
  for (const k of existingKeys) {
    const kwords = k.split(" ");
    const nset = new Set(nwords), kset = new Set(kwords);
    const subset = (a, b) => [...a].every(x => b.has(x));
    if (subset(nset, kset) || subset(kset, nset)) {
      if (nwords[0] === kwords[0] || nwords.length === 1 ||
          kwords.length === 1) cands.push(k);
    }
  }
  return cands.length === 1 ? cands[0] : null;
}
const DIGIT_MAP = {};
"٠١٢٣٤٥٦٧٨٩".split("").forEach((c, i) => DIGIT_MAP[c] = String(i));
"۰۱۲۳۴۵۶۷۸۹".split("").forEach((c, i) => DIGIT_MAP[c] = String(i));
DIGIT_MAP["٬"] = ",";
function normalizeDigits(text) {
  return String(text).replace(/[٠-٩۰-۹٬]/g, c => DIGIT_MAP[c] || c);
}
const UNITS = {zero:0, one:1, two:2, three:3, four:4, five:5, six:6,
  seven:7, eight:8, nine:9, ten:10, eleven:11, twelve:12, thirteen:13,
  fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18,
  nineteen:19};
const TENS = {twenty:20, thirty:30, forty:40, fifty:50, sixty:60,
  seventy:70, eighty:80, ninety:90};
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function wordsToDigits(text) {
  const NW = Object.assign({}, UNITS, TENS);
  const tokens = text.match(/[a-z]+|[^a-z]+/g) || [];
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    const tok = tokens[i];
    if (has(NW, tok) || tok === "hundred" || tok === "thousand" ||
        (tok === "a" && i + 2 < tokens.length &&
         (tokens[i + 2] === "hundred" || tokens[i + 2] === "thousand"))) {
      let total = 0, current = 0, j = i;
      while (j < tokens.length) {
        const t = tokens[j];
        if (has(NW, t)) current += NW[t];
        else if (t === "hundred") current = (current || 1) * 100;
        else if (t === "thousand") {
          total += (current || 1) * 1000; current = 0;
        }
        else if (t === "a" && current === 0 && total === 0) current = 1;
        else if (t === "and" && (current || total)) { /* keep going */ }
        else break;
        j += 1;
        if (j < tokens.length && tokens[j].trim() === "") j += 1;
      }
      out.push(String(total + current));
      if (j > i && tokens[j - 1].trim() === "") out.push(tokens[j - 1]);
      i = j;
    } else {
      out.push(tok); i += 1;
    }
  }
  return out.join("");
}
const QUANTITY_UNITS = [
  ["boxes", "food"], ["box\\b", "food"], ["judges", "judging"],
  ["seats", "venue"], ["places", "venue"], ["logon", "venue"],
  ["people", "venue"], ["persons", "venue"]];
function scanConflictingDirective(text, plan) {
  const people = plan.people_to_feed;
  if (people === null || people === undefined) return null;
  const low = wordsToDigits(normalizeDigits(String(text)).toLowerCase());
  for (const [unit, area] of QUANTITY_UNITS) {
    const re = new RegExp("(\\d[\\d,]*)\\s*(?:" + unit + ")", "g");
    let m;
    while ((m = re.exec(low)) !== null) {
      const value = parseInt(m[1].replace(/,/g, ""), 10);
      if (area === "food" && value < people)
        return {area: "food", action: "set quantity", value: value, text: text};
      if (area === "judging" && plan.judges_needed != null &&
          value < plan.judges_needed)
        return {area: "judging", action: "set quantity", value: value, text: text};
      if (area === "venue" && value < people)
        return {area: "venue", action: "set capacity", value: value, text: text};
    }
  }
  return null;
}
function emptyFacts() {
  return {
    event: {students: null, team_size: null, duration_minutes: null,
      budget_cap: null, staff: null},
    venue_options: [], venue_requirements: {required_features: []},
    food_options: [],
    judging: {judges_confirmed: null, honorarium_each: null,
      minutes_per_team: null, max_teams_per_judge: null},
    committed: {}, schedule_requirements: [], requests: [],
    other_constraints: [], decision_log: []};
}
function mergeExtraction(facts, ext, seq) {
  if (!ext) return [];
  if (!facts.decision_log) facts.decision_log = [];
  const dlog = (label, oldV, newV, src, date) => {
    if (oldV !== null && oldV !== undefined &&
        String(oldV) !== String(newV))
      facts.decision_log.push({label: label, old: oldV, new: newV,
        source: src || null, date: date || null, seq: seq});
  };
  const ev = ext.event || {};
  for (const k of Object.keys(ev))
    if (ev[k] !== null && ev[k] !== undefined && k in facts.event) {
      dlog("Event - " + k, facts.event[k], ev[k], null, null);
      facts.event[k] = ev[k];
    }
  for (let v of ext.venue_options || []) {
    if (!v.name) continue;
    v = Object.assign({}, v); v._seq = seq;
    const vkey = findKey(facts.venue_options.map(x => norm(x.name)), v.name);
    const oldV = facts.venue_options.find(
      x => norm(x.name) === (vkey || norm(v.name)));
    if (oldV) {
      dlog("Venue " + v.name + " - price", oldV.price, v.price,
        v.source, v.date);
      dlog("Venue " + v.name + " - seats", oldV.capacity, v.capacity,
        v.source, v.date);
    }
    facts.venue_options = facts.venue_options.filter(
      x => norm(x.name) !== (vkey || norm(v.name)));
    facts.venue_options.push(v);
  }
  const vr = ext.venue_requirements || {};
  for (const f of vr.required_features || [])
    if (!facts.venue_requirements.required_features.some(
        x => norm(x) === norm(f)))
      facts.venue_requirements.required_features.push(f);
  for (let f of ext.food_options || []) {
    if (f.price_per_head === null || f.price_per_head === undefined) continue;
    f = Object.assign({}, f); f._seq = seq;
    facts.food_options.push(f);
  }
  const ju = ext.judging || {};
  for (const k of Object.keys(ju))
    if (ju[k] !== null && ju[k] !== undefined && k in facts.judging) {
      dlog("Judging - " + k, facts.judging[k], ju[k], null, null);
      facts.judging[k] = ju[k];
    }
  for (const c of ext.committed_costs || []) {
    if (c.amount === null || c.amount === undefined || !c.item) continue;
    const key = findKey(Object.keys(facts.committed), c.item) || norm(c.item);
    if (facts.committed[key])
      dlog("Committed - " + c.item, facts.committed[key].amount,
        c.amount, c.source, c.date);
    facts.committed[key] = {item: c.item, amount: c.amount,
      source: c.source, date: c.date, _seq: seq};
  }
  for (let s of ext.schedule_requirements || []) {
    if (s.minutes === null || s.minutes === undefined || !s.item) continue;
    const skey = findKey(
      facts.schedule_requirements.map(x => norm(x.item)), s.item);
    facts.schedule_requirements = facts.schedule_requirements.filter(
      x => norm(x.item) !== (skey || norm(s.item)));
    s = Object.assign({}, s); s._seq = seq;
    facts.schedule_requirements.push(s);
  }
  const seen = new Set(facts.other_constraints.map(o => norm(o.text)));
  for (let o of ext.other_constraints || []) {
    if (o.text && !seen.has(norm(o.text))) {
      o = Object.assign({}, o); o._seq = seq;
      facts.other_constraints.push(o); seen.add(norm(o.text));
    }
  }
  for (const msg of ext.messages || [])
    if (msg.kind === "request")
      facts.requests.push({summary: msg.note || "", source: msg.n, _seq: seq});
  return ext.directives || [];
}
function currentFoodOptions(facts) {
  const best = {}, known = [];
  for (const f of facts.food_options) {
    const key = findKey(known, f.name) || norm(f.name);
    if (!known.includes(key)) known.push(key);
    const d = parseDate(f.date) || [0, 0, 0];
    const rank = [d[0], d[1], d[2], f._seq || 0];
    if (!(key in best) ||
        rank.join(",") >= best[key][0].join(","))
      best[key] = [rank, f];
  }
  return Object.values(best).map(v => v[1]);
}

function buildPlan(facts) {
  const ev = facts.event, ju = facts.judging;
  const students = ev.students, teamSize = ev.team_size;
  const staff = ev.staff || 0, cap = ev.budget_cap;
  const duration = ev.duration_minutes;
  let teams = null;
  if (students && teamSize) teams = Math.ceil(students / teamSize);
  let judgesNeeded = null;
  if (teams && ju.max_teams_per_judge)
    judgesNeeded = Math.ceil(teams / ju.max_teams_per_judge);
  const confirmed = ju.judges_confirmed;
  let judgesUsed = null;
  if (judgesNeeded !== null) {
    judgesUsed = confirmed === null || confirmed === undefined
      ? judgesNeeded : Math.min(judgesNeeded, confirmed);
    if (confirmed !== null && confirmed !== undefined &&
        confirmed >= judgesNeeded) judgesUsed = judgesNeeded;
  }
  let people = null;
  if (students !== null && students !== undefined &&
      judgesUsed !== null) people = students + staff + judgesUsed;
  const reqFeatures = (facts.venue_requirements.required_features || [])
    .map(norm);
  function venueOk(v, checkFeatures = true) {
    if (people !== null && (v.capacity || 0) < people) return false;
    if (checkFeatures) {
      const feats = (v.features || []).map(norm);
      const has = rf => feats.some(f => rf === f ||
        rf.split(" ").every(w => f.split(" ").includes(w)) ||
        f.split(" ").every(w => rf.split(" ").includes(w)));
      if (reqFeatures.some(rf => !has(rf))) return false;
    }
    return true;
  }
  const venues = [...facts.venue_options]
    .sort((a, b) => (a.price || 0) - (b.price || 0));
  let fitting = venues.filter(v => venueOk(v));
  let venueRelaxed = false;
  if (!fitting.length && venues.length) {
    fitting = venues.filter(v => venueOk(v, false));
    venueRelaxed = fitting.length > 0;
  }
  const venue = fitting.length ? fitting[0] : null;
  const committedTotal = Object.values(facts.committed)
    .reduce((s, c) => s + c.amount, 0);
  let honorariumTotal = null;
  if (judgesUsed !== null && ju.honorarium_each !== null &&
      ju.honorarium_each !== undefined)
    honorariumTotal = judgesUsed * ju.honorarium_each;
  const foods = currentFoodOptions(facts);
  const foodsByPref = [...foods]
    .sort((a, b) => (b.price_per_head || 0) - (a.price_per_head || 0));
  function totalWith(food, ven) {
    let t = committedTotal;
    if (ven) t += ven.price || 0;
    if (honorariumTotal) t += honorariumTotal;
    if (food && people) t += (food.price_per_head || 0) * people;
    return t;
  }
  let chosenFood = null, chosenVenue = venue;
  if (foodsByPref.length && people) {
    let done = false;
    for (const food of foodsByPref) {
      const order = (venue ? [venue] : [])
        .concat(fitting.filter(v => v !== venue));
      for (const ven of order) {
        if (cap === null || cap === undefined ||
            totalWith(food, ven) <= cap) {
          chosenFood = food; chosenVenue = ven; done = true; break;
        }
      }
      if (done) break;
    }
    if (!done) {
      chosenFood = [...foods]
        .sort((a, b) => (a.price_per_head || 0) - (b.price_per_head || 0))[0];
      chosenVenue = venue;
    }
  }
  let foodTotal = null;
  if (chosenFood && people)
    foodTotal = (chosenFood.price_per_head || 0) * people;
  let judgingMinutes = null;
  if (teams && judgesUsed && ju.minutes_per_team) {
    const rounds = Math.ceil(teams / judgesUsed);
    judgingMinutes = rounds * ju.minutes_per_team;
  }
  const schedule = [];
  let scheduleOk = true;
  if (duration) {
    const opening = duration >= 120 ? 15 : 10;
    const closing = duration >= 120 ? 15 : 10;
    const reqs = facts.schedule_requirements;
    const reqTotal = reqs.reduce((s, r) => s + (r.minutes || 0), 0);
    const fixed = opening + closing + reqTotal + (judgingMinutes || 0);
    let main = duration - fixed;
    if (main < 0) { scheduleOk = false; main = 0; }
    const blocks = [["Opening and team check-in", opening]];
    if (reqs.length) {
      const half = Math.floor(main / 2);
      blocks.push(["Hacking / building - part 1", half]);
      for (const r of reqs)
        blocks.push([String(r.item).charAt(0).toUpperCase() +
          String(r.item).slice(1).toLowerCase(), r.minutes || 0]);
      blocks.push(["Hacking / building - part 2", main - half]);
    } else {
      blocks.push(["Hacking / building", main]);
    }
    if (judgingMinutes)
      blocks.push(["Judging (every team seen by a judge)", judgingMinutes]);
    blocks.push(["Closing and prize announcement", closing]);
    let t = 0;
    for (const [name, mins] of blocks) {
      schedule.push({item: name, minutes: mins, start: t, end: t + mins});
      t += mins;
    }
    if (t !== duration) scheduleOk = false;
  }
  const lines = [];
  if (chosenVenue) lines.push({label: "Venue - " + chosenVenue.name,
    amount: chosenVenue.price || 0, source: chosenVenue.source,
    date: chosenVenue.date});
  if (foodTotal !== null) lines.push({
    label: "Food - " + chosenFood.name + " x " + people + " people",
    amount: foodTotal, source: chosenFood.source, date: chosenFood.date});
  if (honorariumTotal !== null) lines.push({
    label: "Judge honorarium - " + judgesUsed + " judges",
    amount: honorariumTotal, source: null, date: null});
  for (const c of Object.values(facts.committed)
      .sort((a, b) => a.item < b.item ? -1 : 1))
    lines.push({label: "Already committed - " + c.item,
      amount: c.amount, source: c.source, date: c.date});
  const total = lines.reduce((s, l) => s + l.amount, 0);
  const plan = {
    students: students, teams: teams, staff: staff,
    judges_needed: judgesNeeded, judges_confirmed: confirmed,
    judges_used: judgesUsed, people_to_feed: people,
    venue: chosenVenue, venue_relaxed: venueRelaxed,
    food: chosenFood, food_total: foodTotal,
    honorarium_total: honorariumTotal, judging_minutes: judgingMinutes,
    schedule: schedule, budget_lines: lines, budget_total: total,
    budget_cap: cap,
    budget_remaining: (cap !== null && cap !== undefined)
      ? cap - total : null};
  const checks = [];
  checks.push({name: "Budget within cap",
    ok: cap !== null && cap !== undefined && total <= cap,
    detail: "total Rs " + fmt(total) + " of cap Rs " + fmt(cap)});
  checks.push({name: "Venue fits everyone",
    ok: !!chosenVenue && people !== null &&
      (chosenVenue.capacity || 0) >= people && !venueRelaxed,
    detail: (chosenVenue ? chosenVenue.name : "none") + " seats " +
      (chosenVenue ? chosenVenue.capacity : 0) + ", " + people +
      " people present"});
  checks.push({name: "Enough food ordered",
    ok: !!chosenFood && people !== null,
    detail: people + " boxes for " + people + " people"});
  checks.push({name: "Enough judges",
    ok: judgesNeeded !== null && confirmed !== null &&
      confirmed !== undefined && confirmed >= judgesNeeded,
    detail: judgesNeeded + " needed (" + teams + " teams, max " +
      ju.max_teams_per_judge + " per judge), " + confirmed + " confirmed"});
  checks.push({name: "Schedule valid",
    ok: schedule.length > 0 && scheduleOk,
    detail: "blocks sum to " +
      schedule.reduce((s, b) => s + b.minutes, 0) + " of " + duration +
      " minutes, all required breaks included"});
  checks.push({name: "All five areas covered",
    ok: !!(chosenVenue && schedule.length && chosenFood &&
      judgesUsed !== null && lines.length),
    detail: "venue, schedule, food, judging, budget all planned"});
  plan.checks = checks;
  return plan;
}
function evaluateDirectives(directives, plan) {
  const people = plan.people_to_feed;
  for (const d of directives || []) {
    const area = norm(d.area), value = d.value;
    let reason = null;
    if (value !== null && value !== undefined && area === "food" &&
        people !== null && people !== undefined && value < people)
      reason = "the message sets the food quantity to " + fmt(value) +
        ", but " + fmt(people) + " people must be fed - " +
        fmt(people - value) + " people would get no food. " +
        "The plan keeps " + fmt(people) + " boxes.";
    else if (value !== null && value !== undefined && area === "judging" &&
        plan.judges_needed !== null && plan.judges_needed !== undefined &&
        value < plan.judges_needed)
      reason = "the message allows only " + fmt(value) + " judges, but " +
        fmt(plan.teams) + " teams at most the stated cap teams per judge " +
        "need at least " + fmt(plan.judges_needed) + " judges. " +
        "The plan keeps " + fmt(plan.judges_used) + " judges.";
    else if (value !== null && value !== undefined && area === "venue" &&
        people !== null && people !== undefined && value < people)
      reason = "the message limits the venue to " + fmt(value) +
        " people, but " + fmt(people) + " people will be present. " +
        "The plan keeps a venue that fits everyone.";
    if (reason) return reason;
  }
  return null;
}
function knownNamesContext(facts) {
  const parts = [];
  const committed = Object.values(facts.committed).map(c => c.item).sort();
  if (committed.length) parts.push("committed cost items: " + committed.join(", "));
  const names = [...new Set(facts.food_options.map(f => f.name))].sort();
  if (names.length) parts.push("food options: " + names.join(", "));
  const vnames = [...new Set(facts.venue_options.map(v => v.name))].sort();
  if (vnames.length) parts.push("venues: " + vnames.join(", "));
  if (!parts.length) return "";
  return "\n\nKnown items so far - when the message refers to one of " +
    "these, reuse its EXACT name: " + parts.join("; ") + ".";
}
function extractionPrompt(text, facts, isUpdate) {
  const context = isUpdate ? knownNamesContext(facts) : "";
  return "You are the reading stage of an event-planning system. Read " +
    "the message text at the end and extract EVERY fact that could " +
    "affect planning the event. Messages may be in English, in Urdu " +
    "script, or in Roman Urdu (Urdu written with Latin letters); read " +
    "all of them the same way, and read numbers written in Urdu or " +
    "Arabic digits as their numeric values. \n\nReturn ONLY a JSON " +
    "object (no other text) with this shape:\n" + SCHEMA_HINT + "\n\n" +
    EXTRACT_RULES + context + "\n\nMESSAGE TEXT:\n" + text;
}
function planSummary(plan) {
  return {students: plan.students, teams: plan.teams,
    venue: plan.venue ? plan.venue.name : null,
    food_price_per_head: plan.food ? plan.food.price_per_head : null,
    judges_used: plan.judges_used, budget_total: plan.budget_total,
    budget_cap: plan.budget_cap};
}
function classifyPrompt(text, summary) {
  return "You route new messages for an event-planning system. Current " +
    "plan figures (JSON): " + JSON.stringify(summary) +
    "\n\nNew message:\n" + text + "\n\nThe message may be in English, " +
    "Urdu script or Roman Urdu. Reply with ONLY a JSON object: " +
    "{\"kind\": \"fact|request|irrelevant\", \"areas\": " +
    "[\"venue|schedule|food|judging|budget\"], \"summary\": \"one short " +
    "line\"}. kind is \"fact\" if the message states or changes any " +
    "figure, price, date, rule or requirement; \"request\" if it asks " +
    "for something new that is not yet approved; \"irrelevant\" if it " +
    "changes nothing about the event. areas lists only the areas the " +
    "message touches.";
}
function recommendations(facts, plan) {
  const out = [];
  const cap = plan.budget_cap, rem = plan.budget_remaining;
  const people = plan.people_to_feed;
  const foods = currentFoodOptions(facts);
  const chosenFood = plan.food, chosenVenue = plan.venue;
  const levers = [];
  if (chosenFood && people) {
    for (const alt of foods) {
      if (alt === chosenFood) continue;
      const saving = ((chosenFood.price_per_head || 0) -
        (alt.price_per_head || 0)) * people;
      if (saving > 0)
        levers.push("switch food to " + alt.name + " (Rs " +
          fmt(alt.price_per_head) + " per head) and save Rs " + fmt(saving));
    }
  }
  if (chosenVenue) {
    for (const v of facts.venue_options) {
      if (v === chosenVenue) continue;
      if (people !== null && people !== undefined &&
          (v.capacity || 0) >= people &&
          (v.price || 0) < (chosenVenue.price || 0))
        levers.push("move to " + v.name + " and save Rs " +
          fmt((chosenVenue.price || 0) - (v.price || 0)));
    }
  }
  if (cap !== null && cap !== undefined &&
      rem !== null && rem !== undefined) {
    if (rem < 0) {
      let txt = "The plan is Rs " + fmt(-rem) + " OVER the budget cap.";
      if (levers.length)
        txt += " To get back inside the cap: " + levers.join("; ") + ".";
      out.push(["risk", txt]);
    } else if (rem < 0.10 * cap) {
      let txt = "Budget headroom is thin: only Rs " + fmt(rem) +
        " of Rs " + fmt(cap) + " is left (" + Math.round(100 * rem / cap) +
        "%). Any new cost above Rs " + fmt(rem) + " breaks the cap.";
      if (levers.length)
        txt += " Room can be freed: " + levers.join("; ") + ".";
      out.push(["risk", txt]);
    }
  }
  if (chosenVenue && people) {
    const spare = (chosenVenue.capacity || 0) - people;
    if (spare >= 0 && spare <= 0.15 * people) {
      const bigger = facts.venue_options.filter(v =>
        (v.capacity || 0) > (chosenVenue.capacity || 0));
      let txt = "Venue headroom is small: " + chosenVenue.name +
        " seats " + fmt(chosenVenue.capacity) + " for " + fmt(people) +
        " people - only " + fmt(spare) +
        " spare seats if attendance grows.";
      if (bigger.length) {
        const b = [...bigger]
          .sort((x, y) => (x.price || 0) - (y.price || 0))[0];
        txt += " The next larger option is " + b.name + " (seats " +
          fmt(b.capacity) + ", Rs " + fmt(b.price) + ").";
      }
      out.push(["advice", txt]);
    }
  }
  if (plan.venue_relaxed && chosenVenue) {
    const feats = (chosenVenue.features || []).map(norm);
    const has = rf => feats.some(f => rf === f ||
      rf.split(" ").every(w => f.split(" ").includes(w)) ||
      f.split(" ").every(w => rf.split(" ").includes(w)));
    const missing = (facts.venue_requirements.required_features || [])
      .filter(r => !has(norm(r)));
    out.push(["risk", "No venue offers every required feature, so " +
      "the plan uses " + chosenVenue.name + " without: " +
      (missing.length ? missing.join(", ") : "some requirements") +
      ". Confirm the feature with the venue, or drop the requirement."]);
  }
  const needed = plan.judges_needed, confirmed = plan.judges_confirmed;
  if (needed !== null && needed !== undefined &&
      confirmed !== null && confirmed !== undefined) {
    if (confirmed < needed) {
      out.push(["risk", "Only " + fmt(confirmed) + " of the " +
        fmt(needed) + " judges needed are confirmed - judging cannot " +
        "cover all " + fmt(plan.teams) + " teams. Recruit at least " +
        fmt(needed - confirmed) + " more judge(s), or raise the " +
        "per-judge team cap."]);
    } else if (plan.judges_used && confirmed - needed <= 1 &&
        plan.judges_used > 1) {
      const mins = facts.judging.minutes_per_team;
      if (mins) {
        const rounds2 = Math.ceil(plan.teams / (plan.judges_used - 1));
        const delta = rounds2 * mins - (plan.judging_minutes || 0);
        if (delta > 0)
          out.push(["advice", "There is almost no spare judging " +
            "capacity (" + fmt(confirmed) + " confirmed, " + fmt(needed) +
            " needed). If one judge drops out, judging grows by " +
            fmt(delta) + " minutes and the schedule no longer fits - " +
            "line up a backup judge."]);
      }
    }
  }
  if (chosenFood && foods.length === 1)
    out.push(["advice", "Only one food option was quoted (" +
      chosenFood.name + "), so there is no cheaper fallback if its " +
      "price rises. Ask the caterer for a second tier as a backup."]);
  const hacking = plan.schedule
    .filter(b => b.item.includes("Hacking"))
    .reduce((s, b) => s + b.minutes, 0);
  const duration = facts.event.duration_minutes;
  if (duration && hacking > 0 && hacking < 45)
    out.push(["advice", "Hacking time is squeezed to " + fmt(hacking) +
      " minutes - the fixed items (opening, judging, breaks, closing) " +
      "take " + fmt(duration - hacking) + " of the " + fmt(duration) +
      " minutes. Trim judging rounds or extend the event if teams " +
      "need more build time."]);
  if (facts.requests.length)
    out.push(["advice", facts.requests.length +
      " request(s) are noted but not budgeted (first: " +
      String(facts.requests[0].summary || "").slice(0, 90) +
      "). Approving any of them has to come out of the Rs " + fmt(rem) +
      " still remaining - the plan does not include them."]);
  if (!out.length)
    out.push(["advice", "No risks flagged: budget, venue, judges and " +
      "schedule all have healthy headroom."]);
  return out;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {norm, fmt, parseDate, findKey, normalizeDigits,
    wordsToDigits, scanConflictingDirective, emptyFacts, mergeExtraction,
    currentFoodOptions, buildPlan, evaluateDirectives, recommendations,
    extractionPrompt, classifyPrompt, planSummary, MODEL_NAME, AREAS};
}
