# MTM Hackathon '26 — Event Brain (standing, living)

Created 2026-11-01 at Abdul Wahid's instruction: "main main cheezan save kr lo taky us din
time waste na ho — just problem bhejun ga; us ke hissab se full brain bna lena;
us ke bad full end tk jo bhi process ho ga usi brain ke according ho ga, or brain
improve/update hota jye ga har implementation pe."

This file is the STANDING brain: everything decided and prepared BEFORE the day.
On the day, the problem-specific FULL brain is generated from it (Project Brain
Prompt, LEAN mode) inside the project workspace, and the whole build runs from
that brain. Both files are living documents — updated after every implementation
step, never left stale.

## Mission
Win MTM Hackathon '26 (Mind-to-Machine), GDG On Campus CUI Wah — Wed 18 Nov 2026,
COMSATS Wah Campus, Study Hall (v2.0 guidelines 15 Nov 2026 — NOT B26 New Hall).
Prize pool PKR 50,000.
Abdul Wahid's words: "jeet ke ana hai."

## Event facts (official handbook, verified 2026-11-01)
- Check-in 9:00–10:00 AM — v2.0 (15 Nov 2026) CORRECTS this: every team must ARRIVE BY 9:00 AM (hard line). Opening + challenge reveal 10:00–10:30. **Build
  10:30–14:00 (3.5 h only)**. Submission + lunch 14:00–14:30. Jamming/evaluation
  14:30–16:30. Awards 17:00.
- Team: 3 members (decided 2026-11-01), Abdul Wahid = team lead + presenter.
- Challenge, permitted tools, submission format and judging criteria are
  revealed/announced by the organizers — NOT known in advance. Judges: 3, TBA.
- Registration: Tally form, fee early bird PKR 2,500 until 10 Nov (per-person vs
  per-team UNCONFIRMED — confirm before paying). Goal record:
  goal_25461c3563bc (win-mtm-hackathon-26-mind-to-machine).
- **Registration update (2026-11-11):** a NEW payment route was announced by the
  organizers — Easypaisa **03038120273 (Iram Khalil)**, replacing the earlier
  Maleeha bibi number in the handbook. Flow per the announcement: pay → send
  the transaction screenshot to the organizer → they send back a picture → that
  picture is uploaded in the form's payment section. Abdul Wahid paid on 2026-11-11
  (~14:03 PKT) and sent the screenshot (~14:19 PKT). Amount paid not stated by Abdul Wahid.
- **Registration CLOSED (2026-11-15):** Abdul Wahid confirmed "registration or payment sab done hai" — the form is submitted and registration is complete. The organiser-picture / members'-details wait is over; do not raise it again.
- **Gemini key CLOSED (2026-11-15):** Abdul Wahid minted the key in AI Studio and saved it via the secure connector (custom.gemini; key never entered chat). VERIFIED live the same evening: list-models 200 (50 models) and generateContent 200 on **gemini-3.5-flash-lite**. Model churn caught by testing: gemini-2.0-flash is RETIRED (404), 2.5-flash/2.5-flash-lite are closed to new users, 3.8-flash was congested (503/timeout). The kit boilerplate default (lib/ai.ts + .env.example) was updated from gemini-2.0-flash to **gemini-3.5-flash-lite**.
- **OFFICIAL DOC — MTM Version 2.0 (received 2026-11-15, ~/workspace/user/files/MTM_Version_2.0.pdf):** (1) **Venue = Study Hall, CUI Wah Campus** (supersedes the earlier "B26 New Hall" note). (2) **Every team must ARRIVE BY 9:00 AM** for check-in — hard line, not just the 9–10 window. (3) **Evaluation (Section 1) = problem-solving approach, AI implementation, working demo/MVP, AND quality of the GitHub repository + deployment** — the repo itself carries marks, so the day-of repo gets a proper README and clean structure, not just code. (4) **AI tools are explicitly allowed and named** — "Antigravity, Claude, NotebookLM, Google AI Studio, or any other AI/ML platform" — AI assistance is officially sanctioned; the old "rules might restrict AI help" risk is CLOSED. (5) Schedule confirmed as already recorded (reveal 10:00–10:30, build 10:30–14:00, submit+lunch 14:00–14:30, evaluation 14:30–16:30, awards 17:00). Equipment: own laptop + extension cord + charger (already on the venue checklist).
- **Groq fallback VERIFIED (2026-11-15):** Abdul Wahid asked for a Groq key; one already existed (custom.groq connector, saved 2026-10-30 — separate from the Study Hub Vercel key). Re-tested live: models list OK (11 models), chat completions OK on openai/gpt-oss-120b and qwen/qwen3.8-27b. Catch: the kit's Groq default llama-3.3-70b-versatile no longer exists on the account (404) — kit default changed to **openai/gpt-oss-120b** (lib/ai.ts + .env.example). Fallback chain status: Gemini ✓ verified, Groq ✓ verified, OpenRouter = no key (optional third link; two verified links are sufficient).
- **10-REPOS DIRECTIVE (Abdul Wahid, 2026-11-15 23:05):** use the Altin list repos (saved-references #273, all GitHub-verified) in the hackathon where they fit. Realistic day-of mapping: **taste-skill** → design-token extraction for a reference site (alongside the Context.dev fast lane); **Hallmark + Impeccable** → anti-AI-slop design polish in the polish hour; **Ponytail** → least-code discipline (already house style); **Diagram Design** → a clean architecture diagram for the submission if wanted; **last30days** → time-boxed domain scan in the analysis phase if the problem is unfamiliar; **Scrapling** → only if the problem needs live scraped data; **REA** → only if a feature must be reverse-engineered; **Graphify** → low value in 3.5h (build starts small); **Humanizer** → marginal (submission copy). PREP DONE (Mon 16 Nov 2026): all four candidate SKILL.md files read and distilled into ~/workspace/mtm-kit/TOOLBOX-PREP.md, and folded into the kit's brain-templates TOOLS.md + DESIGN.md — nothing installed. Key catches: (1) senlindesign/taste needs Playwright MCP, which this setup does not have — use Context.dev for tokens and write the output in Taste's Design Map + Taste DNA format instead; do NOT confuse it with Leonxlnx/taste-skill (different, heavier skill, not planned). (2) Hallmark's no-italic-headers rule applies to the hackathon build only — Abdul Wahid's portfolio serif-italic system is untouched. (3) Impeccable polish is bounded: one inspect + one fix batch, then stop. (4) Ponytail at full intensity is the day's default.
- **AI AGENT AUTOMATION — Abdul Wahid's day-of directive (2026-11-15 21:25):** if the revealed problem/website fits it, integrate an AI-agent automation layer (n8n-style) into the build. Decision rule: only where the problem has a natural workflow (intake → AI processing → notify/summarise/act). Feasibility order for the 3.5h window: (1) in-app agent chain (multi-step AI calls in API routes — planner/generator/critic, chained tool steps) — zero extra accounts, demo-safe; (2) n8n via webhook nodes IF his n8n instance is reachable on the day — **CORRECTED 16 Nov 2026: the n8n Cloud trial ENDED 15 Nov (email from Max @ n8n); 90 days to upgrade/export, no workflows were ever built there, so the cloud instance is NOT reachable — do not plan on it, and do not spend day-of time on it**; (3) simple outbound webhooks from the app to an automation endpoint. If the problem has no natural workflow, do NOT force automation — a forced layer costs build time and judging clarity.
- **MOCK RUN DONE (2026-11-15, ~35 min wall clock):** full pipeline rehearsed on a mock education problem — built **NoteQuiz** (paste notes → AI MCQs → instant marking + explanations → score) from the kit boilerplate in ~/workspace/mtm-mock-run/. Real Gemini output via the app's exact prompt (200 in ~3s, 5 valid questions), production build clean, app run + screenshot-verified at 414px. Presenter brief written (60s pitch + demo script + judge Q&A). **Catches fixed IN THE KIT the same night:** (1) Tailwind alpha trap — kit colours were plain hex vars, so tint classes (bg-accent/10, danger shades) silently generated no CSS; kit globals.css → RGB triplets + config → rgb(var(--x)/<alpha-value>), danger + accent-text colours added, verified present in compiled CSS. (2) /api/ai prompt slice 4000 → 12000 chars. (3) Kit Next.js pin 15.1.6 → 15.5.29 (15.1.6 flagged with CVE-2025-66478 during install). (4) New day-of safety pattern proven: a built-in demo mode (?demo=1 + pre-generated real AI output as /demo-quiz.json) so a dead venue connection can never kill the demo. Prep is now fully closed; Wednesday is execution only.
- **Event-day clash lesson:** the hackathon day overlapped regular university labs — for future events, inform instructors and arrange excusals in advance; do not leave it to event week.
- **Team name context (2026-11-11):** at his previous hackathon outing the team
  name was **Axions** (his proven taste: short, one-word, science-backed
  names). **DECIDED 2026-11-11 ~14:35 and ENTERED IN THE FORM (screenshot
  14:38): team name = AXIONS** (plural; he briefly weighed singular AXION and
  settled back on AXIONS). Note: an axion is a hypothetical particle in physics
  (dark-matter candidate, named by Frank Wilczek after the Axion detergent
  brand); the biology signal-carrier is the *axon*. The name works on both
  readings — do not correct Abdul Wahid on it unprompted.
- **Form progress (2026-11-11 14:38, his screenshots):** form is hosted on
  gdgcommunitycuiwah.dev; participation = Team of 3; lead = Abdul Wahid;
  university = COMSATS University Islamabad, Attock Campus (field truncated in
  the screenshot — full entry to confirm); CNIC and WhatsApp number entered by
  Abdul Wahid himself (values deliberately NOT recorded here). **Community Name
  CORRECTION (2026-11-11 14:38):** Abdul Wahid is a member of **GDG On Campus CUI
  Attock, AI/ML team** — so "None" is WRONG; advised entry = "GDG On Campus
  CUI Attock" (team detail in the follow-up if the form asks).

## Day-of operating model (agreed 2026-11-01)
- Abdul Wahid sends ONLY: problem statement (photo/text), the permitted-tools rules,
  judging criteria, submission format — as they are announced.
- Muse does everything else remotely: brain generation → build → deploy →
  submission pack → presenter brief.
- Abdul Wahid presents and explains the solution himself; judges probe the approach,
  so the brief must make him able to explain every part (no black box).
- Everything stays within the event's announced rules.

## Pre-saved assets — stack (no decisions left for the day)
- **Frontend:** Next.js + Tailwind on Vercel (his default; fastest path he owns).
- **Backend:** Next.js API routes first; FastAPI only if the problem demands a
  Python/ML service (pattern proven in WhyRisk: Vercel Python project).
- **DB/Auth:** Supabase free tier (500 MB DB, 1 GB storage, 50k MAU) — his
  default; RLS on. Neon as pure-Postgres fallback.
- **AI (free tiers, from brain/general/free-stack.md):** Google AI Studio
  (Gemini) as primary — GDG event, Google stack scores goodwill; Groq for fast
  inference (key connected + verified 2026-10-30); OpenRouter free models,
  GitHub Models and HF Inference as fallbacks. Fallback chain pattern (like
  Study Hub's Ask-the-Hub) so one dead API never kills the demo.
- **Never on the day:** any service needing a card on file (Render, Koyeb,
  Railway, Fly.io) — his card is empty. HF Docker Spaces are paid; Gradio
  ZeroGPU only.
- **Deploy:** GitHub → Vercel auto-deploy on main (his standing git rule:
  main only, no branches/PRs).
- **Accounts ready:** GitHub (connector + vault login saved 2026-11-01),
  Vercel, Supabase, Groq, Hugging Face — all connected/verified already.
  Prep-week TODO: one Gemini API key minted + tested; boilerplate repo built.

## Pre-saved assets — design & quality (distilled)
- UI copy English ONLY (standing product rule). 20 UX laws checklist
  (~/AGENTS.md) applies: big tap targets, chunked choices, <400 ms feedback,
  skeletons, visible reaction to every action.
- Demo-critical subset of the 100-point production checklist
  (brain/general/production-checklist.md): loading skeletons, helpful empty
  states, clear error messages, client+server validation, responsive mobile
  layout, hover/focus states, SEO/OG meta, no secrets on the frontend.
- Post-change rule stays in force even at the event: every shipped piece is
  tested LIVE as a user before it is called done.

## Brain folder — final file set (standard set + 5 additions approved by Abdul Wahid 2026-11-01)
Standard (from the Project Brain Prompt, LEAN): 00-START-HERE, PRD,
ARCHITECTURE, DATA_MODEL, API_SPEC, DESIGN, TOOLS, BUILD_PLAN, WORKFLOW,
DEPLOYMENT, DECISIONS, RISKS, DEMO_PITCH (+ AGENT.md, README, .env.example at
repo root; SECURITY/TESTING/ENV/GLOSSARY as short stubs).
Additions (suggested by Muse, approved by Abdul Wahid 2026-11-01 — now standard for
this event's repo):
- **TEAM.md** — roles + contacts: Abdul Wahid (lead/presenter), member 2
  (demo/testing), member 3 (support). No "whose job was this?" confusion.
- **SUBMISSION.md** — living checklist of the organizers' submission
  requirements, captured the moment they are announced and ticked off one by
  one; the #1 last-minute failure point at hackathons.
- **JUDGE_QA.md** — likely judge questions + short confident answers, kept
  separate from the pitch script; feeds the presenter brief.
- **DEMO_DATA.md** — ready demo accounts, sample entries and the exact inputs
  for the live demo, so the demo shows a populated, real-feeling system.
- **RETRO.md** — 10-minute post-event log (what worked, what failed, what the
  brain missed); its lessons distill back into brain/general so the next
  competition's brain starts better.

## Day-of protocol (the clock rules everything)
0. **Refined by Abdul Wahid 2026-11-01, in his words:** "jesy hi problem send krun ga,
   usy deeply analyze kro ge, phir github repo bna kr initial files or documents
   or brain folder ready kro ge us specific hackathon project ke lia — then mai
   us pe further kam krun ga." So the handoff point is: deep analysis + repo +
   brain + initial files FROM CLAUDE; further building ON TOP from WADI (with
   Muse assisting, verifying, deploying and keeping the brain updated).
1. **10:00–10:15 — Deep analysis + repo + brain.** Problem lands → Muse
   analyzes it deeply (scope, winning angle, judging-criteria fit, feasibility
   inside 3.5 h) → creates the GitHub repo under abduIwahid (named
   mtm-hackathon-26-<project-slug>) → generates the FULL problem brain inside
   the repo (Project Brain Prompt, LEAN mode, preset "4h hackathon"): AGENT.md
   entry, README, .env.example + /brain/ with 00-START-HERE, PRD (one-sentence
   core feature, MUST/SHOULD/COULD, wow factor), ARCHITECTURE, DATA_MODEL,
   API_SPEC, DESIGN, BUILD_PLAN (timeboxed checkboxes + cut list), TOOLS,
   DECISIONS, RISKS, DEMO_PITCH (script + criteria mapping + backup demo
   plan) → pushes the initial scaffold files (Next.js boilerplate wired to
   the deploy pipeline) → Abdul Wahid gets a 5-line summary + repo link on WhatsApp.
2. **10:15–12:30 — Core build.** MUST features only, in BUILD_PLAN order.
   Abdul Wahid builds on top of the scaffold; Muse implements/verifies alongside.
   Loop per feature: implement → deploy → live-verify → **update the brain**
   (checkbox, status line, decisions/learnings) → next.
3. **12:30–13:30 — Polish + wow factor.** SHOULD features only if MUST is fully
   green. Demo path rehearsed once end-to-end.
4. **13:30–14:00 — Freeze + submit.** Feature freeze; submission pack in the
   organizers' format; backup demo recorded (screen capture) in case live
   demo fails; presenter brief sent to Abdul Wahid.
5. **14:30–16:30 — Evaluation.** Abdul Wahid presents from the brief. Technical
   emergencies (deploy/link/API) → Muse fixes remotely on his message.

## Living-brain rule (Abdul Wahid's words, standing for this event)
- The brain is updated after EVERY implementation step: what was built, what
  was verified live, what was cut and why, what broke and how it was fixed.
- If reality disagrees with the brain, the brain is corrected immediately —
  the build never runs on a stale plan.
- After the event: a closing entry — result, what the brain got right/wrong —
  and reusable lessons are distilled back into ~/workspace/brain/general/.

## Comms protocol (WhatsApp, this chat)
- Abdul Wahid → Muse: problem photo/text, rules, criteria, submission format,
  organizer announcements, demo-day issues. Nothing else is his job.
- Muse → Abdul Wahid: 5-line plan, live demo link, submission confirmation,
  presenter brief (explanation + likely judge Q&A), fix confirmations.

## Risks + fallbacks (pre-decided)
- **Venue internet fails** → Abdul Wahid's mobile-data hotspot is the lifeline;
  all builds/deploys happen on Muse's side anyway. Demo backup video covers
  a total outage at presentation time.
- **An AI API dies mid-build** → fallback chain (Gemini → Groq → OpenRouter),
  decided in TOOLS before it happens.
- **Deploy fails** → second Vercel project / HF Gradio fallback; never debug
  one path longer than ~15 minutes inside the build window.
- **Scope creep** → BUILD_PLAN cut list is law; new ideas go to the brain's
  later-list, not into the build.
- **Rules restrict AI assistance** → Muse shifts to planning/coaching only
  and Abdul Wahid implements; the brain and brief still come from here.

## Abdul Wahid's venue checklist (also reminded 17 Nov)
Laptop + charger, student ID, payment reference/screenshot, mobile data
package loaded, GitHub/Vercel logged in on the laptop, team briefed on roles
(member 2: demo/testing, member 3: presentation support).

## Winning edges (suggested by Muse 2026-11-01, acknowledged by Abdul Wahid)
- **Mock hackathon in prep week:** one full timed practice run (sample problem →
  analysis → brain → repo → build → deploy → pitch) to expose pipeline
  bottlenecks before the real day.
- **Demo-first principle:** judges score the 5–10 min presentation, not the
  code. BUILD_PLAN order = what shows in the demo first; one working wow
  moment beats a large half-finished system.
- **Team selection by skill, not friendship:** a fast coder + a confident
  presenter + Abdul Wahid as lead/demo driver.
- **Register early:** seats are limited; prep can wait, a lost seat cannot.
- **Judges research:** when the 3 judges are announced, research their
  backgrounds and tune the pitch (industry vs academic, startup vs impact).
  Google-stack usage (Gemini etc.) is already the plan — GDG events reward it.
- **Logistics that quietly win:** extension board + power bank (socket fights
  waste build time), HDMI cable, a memorable product name + one-line tagline,
  screenshots in the submission README (judges re-open submissions later).

## Blanks to fill when known
- Other 2 team members (names, universities, CNICs, WhatsApp numbers): ___
- Fee basis confirmed (per person / per team): CLOSED — paid 11 Nov via the new organiser route (Easypaisa 03038120273, Iram Khalil); the question is settled by the payment itself. Do not re-ask.
- Problem statement: ___ (18 Nov, 10:00)
- Permitted tools / rules: ___ (18 Nov)
- Judging criteria: ___ (18 Nov)
- Submission format: ___ (18 Nov)

## Reminder — Motion library (set by Abdul Wahid, 2026-11-03)
Abdul Wahid pasted `npm install motion && npx motion-ai` during the portfolio night and, after Muse's explanation (Motion = Framer Motion's successor animation library; motion-ai = its AI Kit installer for Claude Code/Cursor/Copilot-style agents, not needed in this setup) and advice against adopting it for the portfolio (dependency-light rule; only Lenis approved there), he said "yad krwa dena" — REMIND him about Motion when hackathon prep starts (13–17 Nov) and on the day (18 Nov) if the revealed problem suits a polished animated UI: it is a legitimate candidate for building animations fast inside the 3.5-hour build window. Surface it in the prep briefing, not as a random nag.

## Design-reference fast lane — Context.dev (added 2026-11-12)

Proven workflow for the 3.5-hour build window, if the problem needs a polished frontend fast:
1. Scrape a reference site's page with Context.dev (Markdown) to get its content structure and information architecture.
2. Run web-styleguide on its domain to extract the design system: colours, typography, spacing, button and card styles.
3. Rebuild the design language in original code with our own product, name and content. Never a 1:1 clone, never the reference's logo, photos, fonts or copy.
Proof: on 2026-11-12 this produced the Nova concept storefront and an Apple-style portfolio preview, each built and responsive-verified (320–1920 px, zero overflow) in one sitting.
Cost note: a styleguide call used about 10 credits of the 1,000 monthly Context.dev credits. Connection is read-only (api.read) through the custom connector.
Judge Q&A line: "We studied a reference design system programmatically, then implemented our own interface from those tokens."

## Prep progress — day-of kit built (2026-11-12)

Built at Abdul Wahid's request ("kuch aisa jo abhi se ready kr len"): ~/workspace/mtm-kit/ (35 files).
- boilerplate/ — Next.js 15 + Tailwind app: design tokens in globals.css, UI states (skeleton/empty/error), null-safe Supabase client, and the AI fallback chain (Gemini → Groq → OpenRouter) behind POST /api/ai with friendly 400/502 errors. Model names are env-overridable.
- brain-templates/ — the full LEAN brain set for the day's repo, including TEAM, SUBMISSION, JUDGE_QA, DEMO_DATA, RETRO.
- DAY-OF-CHECKLIST.md — clock protocol + venue checklist as tick boxes.
This closes the "boilerplate repo built" prep TODO (as local files; the GitHub repo itself is created on the day per the protocol). CLOSED 2026-11-15 (supersedes the "Still open" line below it): Gemini API key minted + tested, Groq fallback verified, timed mock run DONE (NoteQuiz), registration + payment FULLY DONE — prep is now closed; Wednesday is execution only. The only remaining prep-week items are the 17 Nov prep reminder and the 18 Nov 07:00 leave reminder.
- Prep briefing delivered Sat 14 Nov ~17:11 (proactive): prep window 13–17 Nov open; Motion reminder given per his 3 Nov instruction (Motion is a candidate for fast polished animation in the 3.5-hour build window only, not for the portfolio); Day-Of Kit already ready (not re-announced as new). SUPERSEDED 15 Nov: the items listed as still open after the briefing (Gemini key, mock run, members' details, organiser's picture) are ALL closed — see "Registration CLOSED", "Gemini key CLOSED", "MOCK RUN DONE" above.

## Day-of log — Wed 18 Nov 2026
- 09:17 PKT: Abdul Wahid asked for the GitHub repo to be created and fully pre-set BEFORE the reveal, with permission for Muse's own additions + suggestions.
- Repo: https://github.com/abduIwahid/mtm-hackathon-26 (public). Connector create_repository = 403 (integration lacks permission, reconfirmed); created via browser after GitHub 2FA — first authenticator code expired before entry, Abdul Wahid completed the retry sign-in himself in the live browser.
- 10:08 PKT: pre-reveal setup pushed (commit 2d659f3, 37 files): kit boilerplate (Next.js 15 + Tailwind, AI fallback chain, design tokens, UI states), brain/ (18 lean templates, 00-START-HERE pre-filled with event facts), README (judge-facing, status section), LICENSE (MIT), .gitignore. Verified by read-back: README blob SHA on GitHub matches local exactly.
- Note: repo also has an "Initial commit" (0a4c807) beneath the setup commit.
- Next: problem statement expected from Abdul Wahid during the 10:00–10:30 reveal; then the clock protocol runs (analysis → fill brain → build → Vercel deploy linked to this repo → live-verify → submission pack + presenter brief).
- 10:27 PKT: PROBLEM RECEIVED (Hackathon_Students_Brief_Final.pdf): build an agent system that reads a message pack and plans a 4-hour hackathon (venue/schedule/food/judging/budget); unseen pack at judging; freeze 13:25, test run 13:30, judges 14:30-16:30 (lot-drawn member answers). Scoring: Output 30, Wrong-message catch 20, Understanding 20, Handling change 10, UI 10, Prediction 5, Tokens 5, small-model bonus +10.
- SYSTEM BUILT + VERIFIED (stub transport + live model via connector): main.py, stdlib-only Python. Model = openai/gpt-oss-20b via Groq (small; every call). Design: 1 extraction call (reading) -> fact base with date supersession + fuzzy item matching -> code planners -> 6-check validator -> trace (numbered calls, area tags, API-reported tokens) -> run/index.html UI. Updates: classify call (reading, <=400 tok) + deterministic quantity-conflict scan + 1 area extraction call; only affected areas recomputed.
- Verified figures on the sample pack: Hall A Rs 120,000; 177 people (150+10 staff+17 judges); standard box Rs 1,200 -> 212,400; honorarium 85,000; total Rs 547,400 / cap 650,000; schedule sums to 240 incl. prayer break; all 6 checks PASS. Practice change (printing 15,000) -> 552,400, budget only. Practice wrong (100 boxes) -> REJECTED by code validator with reason, plan intact. Full run ~5s (limit 120s).
- Bugs caught in testing (all fixed): HTML %-format crash; Hall A/B/C collapse via first-word name matching (rewrote find_key to word-set containment); caterer price supersession OK; model promoted "generator available" to a requirement once (prompt hardened: requirements only when a message says MUST); Groq free TPM 8,000/min for gpt-oss-20b (max_tokens tuned: extraction 6000, classify 400; 429 retry with 15s pause in call_model).
- Repo: Next.js kit files DELETED (13 files); system pushed (feat commit 2f312f5); final head after deletions = 51ecc3f1accbdab81353781c0a4d86476d4736ea. main.py + RUNBOOK read-back SHAs match local.
- RUNBOOK.md + MEMBER_BRIEF.md are in the repo root - Abdul Wahid + team read MEMBER_BRIEF before judges (14:30).
- Remaining on Abdul Wahid (asked 13:0x): clone on laptop, .env with Groq key, run the 3 test commands, delete run/, submit repo link + hash 51ecc3f at the 13:25 freeze.
- ~13:1x PKT: brain/ files in the repo filled for the revealed problem (ARCHITECTURE, BUILD_PLAN, DECISIONS, JUDGE_QA, DEMO_PITCH + START-HERE/PRD/SUBMISSION) and pushed — NEW head = a533931671c4eea889b90836d74e277efe7646a3 (supersedes 51ecc3f). Abdul Wahid informed: submission hash is a5339316..., and given a brief problem summary on request.
- Abdul Wahid pushed a local commit "Update" (16148bd): removed .env.example, added .kiro/settings/mcp.json; main.py untouched (verified byte-identical).
- On Abdul Wahid's order, suggestions implemented + pushed (head 06622caa0b5af4a4b5ad39c019cca39ae1c89b58, main.py blob verified): (1) trilingual handling - extraction/classify prompts cover English, Urdu script, Roman Urdu; extracted numbers forced to Western digits; code-side normalize_digits (Arabic-Indic + Extended Arabic-Indic + thousands separator) applied in the quantity scan and parse_date - unit-tested: Urdu-digit wrong message (100 boxes) rejected with the standard reason; (2) UI h1 now "Hackathon Plan - Team AXIONS"; (3) PREDICTION.md cheat-sheet added; (4) .env.example restored. Stub regression re-passed: 547,400 -> 552,400 -> REJECTED. Submission hash is now 06622ca...; Abdul Wahid must git pull before his laptop test.
- Number-words scan patch + live verification (on Abdul Wahid's "kro"): scan converts English number phrases (one hundred and twenty -> 120) before matching; 7/7 unit cases pass; stub regression re-passed; LIVE real-model run of the final code via connector transport: Rs 547,400, all checks PASS, 4.7s. Pushed - head 06622ca superseded, see next line.
- UI polish round (Abdul Wahid chose Option A: generated HTML/CSS + his component patterns over React/Next - freeze-risk + one-command rule): status banner, schedule timeline, budget meter (84%), venue feature chips, red rejected box, RTL dir=auto quotes, print button + print CSS, model-calls/tokens stats line, mobile fixes. One bug caught in testing: bare % in CSS (height:100%) crashed template formatting - escaped to %%. Stub regression + desktop/414 screenshots verified. Pushed; head supersedes eac15835 (see repo).
- UI round 2 (Abdul Wahid: use the components he provided): adapted from his UI Layouts library (ui-layouts.com, brain ledger #206-#217) - Scroll Text Marquee (#207) as a live-figures band, Footer giant wordmark (#212) "AXIONS" at page base, Expanding pill (#211) for the print button; hand-rolled CSS per house rules (no motion lib, solid colours, reduced-motion + print handling). Verified via stub + desktop/414 screenshots; pushed (head in repo, supersedes 79a39f0).
- Inspection-report round (Abdul Wahid approved items 1,2,3 + Vercel deploy + a structure/text/CSS pass): (1) tests/ suite in repo - 23/23 PASS (scan in digits/words/Urdu digits, dates, find_key; e2e sample->547,400, change->552,400, DUPLICATE change no double-count, wrong->rejected, ledger+history in plan.txt and UI); (2) fact ledger (source message # + date per fact) and update history (seq/type/detail/total-after) in plan.txt + UI; transactional rollback was already the design and is now also logged; DECISIONS.md gained entries 7-11 (transactions, NO authority weights, NO confidence scores, ledger-over-database, n8n future seam - not built); (3) semantic header/main/footer structure, judge-facing section notes, always-present Rejected section with designed empty state, food per-person line, CSS rhythm/focus/selection. Vercel: project mtm-hackathon-26 created via API (git-linked, rootDirectory=demo), deployment READY, https://mtm-hackathon-26.vercel.app returns 200 with the plan page; README carries the demo link. Rejected from the report: source-authority ranking and confidence scores (would hurt on the unseen pack / decide nothing).
- UI round 3 (Abdul Wahid: one long merged page felt wrong/static): page restructured into 4 tabbed views (Plan / Facts & messages / Updates with rejected-count badge / Trace) - UI-Layouts tab pattern, vanilla JS, hash deep-links (#view-updates), print CSS shows ALL views so printed output stays complete. Other-constraints now rendered in Facts view. 23/23 tests still pass; screenshots verified (Plan + Updates views). Demo regenerated + pushed; Vercel auto-redeploys from git link.
- FINAL BUILD (Abdul Wahid's directions, pre-freeze): (a) Risks & recommendations engine added to main.py + planner.js - code-generated from plan figures (over/thin budget with saving levers, venue headroom + next option, judge shortfall/dropout math, single-food-tier, squeezed hacking time, unbudgeted requests); sample plan yields venue-headroom + DJ-request advice; in plan.txt, generated UI and web app. (b) demo/ is now a multi-page WEB APP (index/how-it-works/privacy/terms + style.css + planner.js + app.js): upload-only start (NO test data), visitor's own key in-browser (Groq CORS verified *), planner.js is a faithful port (node parity: 547,400/552,400/rejection/Urdu+words scans all pass), tabbed results, clickable provenance, plan diff, try-to-break panel, AGENT CHAT (updates applied transactionally + questions answered from plan figures with Roman Urdu intents, no model call), header+hamburger+breadcrumbs+footer on every page. Old static sample demo page removed. Dummy datasets from Abdul Wahid tested: Python on Practice Pack 1 = Rs 416,800, all checks PASS (120 students/30 teams/136 people, Jasmine Hall).
- Features 1+3 (Abdul Wahid, pre-freeze): what-if simulator (6 scenarios on cloned facts, feasibility verdicts; node-verified: venue-out -> Hall B 577,400 feasible; +50 students -> Hall C 634,000 NOT feasible, judges check fails honestly) and decision evidence (clickable venue/food/judging cards: source message, decision_log replacements, why-chosen, per-alternative rejection reasons) + decision history in Facts view. Persistent sessions shipped earlier (localStorage restore verified by reload screenshot). Server-side key via demo/api/chat.js (awaits Abdul Wahid's GROQ_API_KEY env var + redeploy). Brief re-analyzed line by line: no gaps - trace format, call limits, timing, bonus model, disqualifiers all covered. README rewritten to match the final system.

## RESULT — 18 Nov 2026 (logged 21:04 PKT)
- Winner: the team behind github.com/codebreaker-sketch/cui-- (Abdul Wahid shared the repo himself as "aj ke winner ki github repo"). AXIONS' placement/score: not reported — do not invent.
- Winner's system (verified from their repo, README + code): Python package `planner/`; same core philosophy as AXIONS — "read with a model, decide with code". Model default qwen2.5:1.5b via local Ollama (Groq llama-3.1-8b-instant as alt) — small-model list either way.
- Deltas vs AXIONS worth stealing next time: (1) exactly 1 model call per message, always tagged "reading" → prediction slip trivially predictable; (2) rules.py labels obvious numbers in code BEFORE the model, model labels only the rest → fewer tokens, less variance; (3) fact store WITH authority checks (their tests include a wrong-authority message; AXIONS had deliberately chosen no authority weights, Decision #8); (4) product surface: email-OTP login on the web UI, English/Roman Urdu UI toggle, inbox-folder ingestion, fetch_mail.py; (5) judge-oriented README (test-day procedure, "what breaks without it" table).
- Checked and NOT found: no explicit accessibility/step-free/ramp matching in their plan.py, rules.py, facts.py or reader.py — no evidence they specifically solved the synonym point that cost AXIONS its 6th check on the judging pack (AXIONS scored 5/6 there; venue requirement "step-free access" not matched to Hall 2/3's "ramp access"; correct Hall-2 total was Rs 332,600 vs system Rs 312,600).
- AXIONS final submitted head: d3df36fa (footer fix in). Full day record in the 18 Nov session notes.
- **Team (names confirmed 18 Nov, closing the goal's open "who are the other 2 members" question):** Abdul Wahid (lead), **Abdul Moiz** and **Jawad Hassan** (GDG On Campus CUI Attock).
- **Certificate + LinkedIn:** certificate of participation received 18 Nov; LinkedIn post drafted (mentions both teammates, live demo https://mtm-hackathon-26.vercel.app + repo link). AXIONS' own placement/score beyond "did not win": still NOT reported — do not invent.
- **Benchmark delivered to Abdul Wahid (Muse's, NOT the judges' scores):** AXIONS 75/100 vs winner 86/100 — Planning 15 vs 16, wrong-message 14 vs 18, updates 8 vs 9, model+tokens 7 vs 9, prediction-slip 3 vs 5, UI/product 9 vs 7 (AXIONS ahead), architecture 11 vs 13, docs 8 vs 9. Winner's system was never run by Muse (needs a local model); AXIONS' numbers rest on verified runs. Gap = authority checks, smallest local model + rules-first tokens, one-line prediction story — first-day design items for the NEXT hackathon.
- **Judging-pack weak spots (frozen code, no fix possible):** (1) venue/accessibility synonym — see line above (Hall 2, Rs 332,600 correct). (2) "10% service charge" misread by the quantity guard as a directive setting food quantity to 10 and excluded; with the charge food would be Rs 127,160, not Rs 115,600. Judge talking point given: the validator failed LOUDLY with a reason rather than passing silently.
- **Post-freeze hash change (OPEN on Abdul Wahid's side):** submitted freeze hash was c8610f3c; the footer fix pushed after extra time made HEAD d3df36fa. Organisers must be told the NEW hash and Abdul Wahid must `git pull` so `git log -1` matches — neither confirmed.
- **Vercel demo key:** GROQ_API_KEY confirmed set in Vercel + redeploy live-tested (api/chat reaches Groq). The public demo key can be used by anyone visiting the site — DELETE the env var after the hackathon (Abdul Wahid's step, told to him).

## Reel #283 additions for the NEXT hackathon (filed 2026-11-21, @imrayng — see saved-references #283)
- **Research before building:** before the event, pull the last 3 years' first-place winners of the same hackathon (what they built, who they were) and look for judge↔winner links — judges are human and biased; leave nothing to luck. (At MTM '26 this analysis happened AFTER the event, on the winner's repo; next time it is a pre-event step.)
- **Checklist discipline:** judges score off one checklist — map every scoring line to a feature/answer before freezing (already an AXIONS lesson; reinforced).
- **Uniqueness in the first minute:** judges see hundreds of teams; the demo's opening must be the memorable thing (AXIONS' one-call-always-"reading" story is the asset here).
- **Hardware where the format allows:** a physical, touchable prototype + visible iterations gets remembered; software-only demos blend in.

## POST-HACKATHON — product renamed Plan Banao (2026-11-21, appended later — the file above is the EVENT brain; this section is the product's live state)

- **Rename chain (all 21 Nov 2026):** AXIONS Planner → **PlanKaro** (~17:45, Abdul Wahid picked it from Muse's suggestions) → **Plan Banao** (evening, his final pick after rejecting coined names Zavik/Zelora/Arvex; he had suggested planbanao himself earlier). Display name "Plan Banao" (two words) everywhere; slugs/URLs/repo lowercase one-word `planbanao`. **AXIONS remains ONLY as team credit** — site footer wordmark + About story + portfolio/CV activity entries.
- **Current live state:** repo **github.com/abduIwahid/planbanao** (renamed from mtm-hackathon-26; GitHub auto-redirects the old URL); demo **https://planbanao.vercel.app** (Vercel project renamed planbanao). **CORRECTION to links above:** mtm-hackathon-26.vercel.app and plankaro-planner.vercel.app were DELETED from Vercel on Abdul Wahid's order 21 Nov ("redirect na kro, pehly wali domains hta do") — they now return DEPLOYMENT_NOT_FOUND; the demo link in the RESULT section above is dead, use planbanao.vercel.app. Portfolio entry renamed too (slug planbanao; /cv order WhyRisk → Plan Banao → Churn → Study Hub); CV.pdf synced 21 Nov evening.
- **MTM versioning (Abdul Wahid, 21 Nov):** V1 = May 2026 (Smart Doctor Connect), V2 = Nov 2026 (this project, Team AXIONS). Certificates repo folders renamed mtm-hackathon-v1/ and mtm-hackathon-v2/ (V2 certificate verify link held with the certificate).
- **21 Nov product rounds (all shipped live):** design system v3 (c494d39) → skeleton loader / OG / 404 / PWA (2c3905e + c8447ac) → **Neubrutalism v4** (f699f9a + f04380b, Abdul Wahid picked "1" = whole site) → dashboard sidebar removal + one-line header (a7fb347) → DEMO DETAILS labelling (4010776) → middle-dot fix (396f4eb) → stepped plan-layers stack (7632d72) → 12-column dashboard grid + tighter footer (d916fa2) → alignment pass (0cd1abb) → Master Website Audit rounds 1 (ffffc4e) + 2 (f40ec98) → JS asset-version fix (1a2f542) → request tracker + one recommendation + dashboard phone fixes (b3d98af). Full detail in the owner's local master plan (21 Nov 2026 additions).
- **Still open on the product:** live DOM confirmation of the fixed Risks/recommendations card on the assessment page (headless visit came back blank; Abdul Wahid asked to reload + confirm with a screenshot); his phone feel-check of v4; the two older planner-engine defects (step-free venue matching, 10% service-charge handling) are in the Python/planner system, NOT the website audit — flagged as the next job, not yet started.
- **Standing rules born from this day (apply everywhere, not just here):** Website Audit playbook (09-process/website-audit-playbook.md in this repo) — full audit on new projects, touched-area audit on resumed ones; ASSET-VERSION RULE — any changed file gets its `?v=` bump + service-worker cache-name bump in the SAME push (JS stayed at ?v=2 while its content changed twice — the reco fix never reached his browser until ?v=3); DYNAMIC-VIEWS rule — a page counts as tested only when its dynamic views render with real data (seeded session); name suggestions must be Vercel-availability-checked before being shown.
