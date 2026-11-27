# FYP — Final Year Project (BS AI, 6th–8th semesters)

The owner's final-year project, guided across three semesters (6th–8th). The living idea bank is a separate **private** repo — this file records the system for judging ideas and the official rules, not the bank itself.

## Standing role (2026-11-25)
Muse is the owner's personal FYP guide for the next 3 semesters — continuously research and bring fresh FYP ideas, and guide every stage: idea selection, supervisor, proposal, build, thesis, viva. A weekly research pass feeds and ranks the bank in guide mode.

## Hard filters — apply before scoring, to every idea
1. **Real-world problem + genuine user pull** — the idea must solve a real problem and new users must be attracted to it themselves.
2. **ML / deep learning / OpenCV / CNN at the core** — the owner's field is AI.

## Standing priority — judge every idea FIRST by these 4 questions, in order (highest priority)
1. Real-world problem ko kesy solve karta hai? (How does it solve a real-world problem?)
2. Koi new user khud se attract ho sakte hain ya nahi? (Can new users attract themselves?)
3. Meri domain relevant hai ya nahi? (Is it relevant to my domain — AI/ML/DL/CV?)
4. Kya ye idea already implement hai ya nahi? (Is it already implemented?) — Q4 is a researched originality check: exact existing implementations count against an idea; partial implementations must be recorded with the difference.

## Calibration (2026-11-25)
- Round-1 Top 3 were "basic basic projects" — too incremental/sequel-like. **Ambition/novelty weigh most; sequels of the owner's existing projects are ineligible for #1.**
- Scoring (Round 2): 2×Novelty + Feasibility + Advantage + Demo + 2×User-Pull, /70.
- Standing rule: save anything FYP-useful to the idea bank autonomously — ideas, official docs, references, guides — without waiting to be asked. Complete reference projects found elsewhere are saved as links + license notes only, never copied third-party code.

## Current Top 4 (26 Nov 2026 — combined bank of 26 ideas)
1. **Ishara** — real-time Pakistani Sign Language translator (MediaPipe Holistic landmarks → LSTM vs temporal transformer; Urdu/English text + speech out; first user = a partner deaf school; dataset self-collected, ~40–60 signs × 5–8 signers over 3–4 weekends; the released PSL word-level landmark corpus is itself a contribution) — 60/70, the #1 recommendation.
2. **CampusGPT** — the owner's own idea (26 Nov 2026): a university personal GPT — past papers, assignments, projects, timetable, class finder, faculty info, class-arrangement requests in one place. Banked in reshaped form: real ML core = Past Paper Intelligence (question classification, topic-wise weightage, paper-pattern prediction over past papers), GPT chat as the interface; MVP = chat + Past Paper Intelligence only — 56/70; risks: data needs university cooperation, related to the owner's Study Hub.
3. **RetinaScreen** — diabetic-retinopathy screening for camps/BHUs (multi-task grading + lesion segmentation, sensitivity-first referral; fully public data APTOS/IDRiD) — 58; becomes #1 automatically if the deaf-school partnership doesn't materialise in semester 6.
4. **BowlGuard** — cricket bowling-action legality checker (pose estimation, elbow-extension vs 15° tolerance) — 58; highest novelty, hardest measurement risk, hand-recorded dataset.
- Best Round-1 non-sequel: GroundTutor (#5 overall, 57). Face Attendance 2.0 scores 59 (2nd on points) but is benched as a sequel per the owner's rule.
- **26 Nov additions:** GariCheck banked as Idea 16 (AI used-car inspection via guided phone photos; #22, weighted 44 — Tchek/ALTO AI already sells this; CarDD benchmark + public YOLOv8s-seg weights exist; only a Pakistani-market layer is original). Two screened reels rejected under the same rules: a 20-project copy-grade carousel, and CafeFlow (live product, no ML core).
- **TOP100 (honest count: 46 verified topics, not 100 — no padding):** 1,326 items screened across 5 sources (25 Nov); Tier 1 = 10, Tier 2 = 30, Tier 3 = 6; 13 already in the bank, 33 new. The list grows only via the weekly pass. New bank candidates from the sources: SketchMatch (forensic sketch→photo, 47), ElderCare (45), FlameWatch (44), MindEcho (43).

## Official documentation (found 25 Nov 2026)
- The university's Attock campus itself publishes **no FYP rulebook/calendar/coordinator page** on any public official domain. The pack is the university Registrar's **BS AI Fall 2024 scheme (university-wide — settles AIC498/AIC499 directly)** plus Lahore-campus CS documents labelled as Lahore's everywhere.
- **FYP-I = AIC498 (2 credits); FYP-II = AIC499 (4 credits).** Proposal is made at the end of 6th semester on the official template with supervisor signature, Turnitin report and Gantt chart, and submitted in the first 4 weeks of 7th semester — a late proposal means no FYP registration. Group maximum is 3; one supervisor takes at most 3 groups per semester. Similarity must be under 20% with IEEE-style references (at least 10 for the R&D track). **In FYP-II the external examiner carries 40%.**
- **UNRESOLVED discrepancy (do not guess):** FYP-I split — the Lahore Rules page says Supervisor 50 / Internal 50; the Grading Scheme PDF says 60/40.
- Plan changes from the docs: semester 6 must end with a full template-format proposal draft (not just a concept note); the external examiner's 40% makes outsider-facing demo/presentation a first-class semester-8 workstream.
- FYP selection guide (distilled in the bank's `references/`): in an R&D (AI) FYP, accuracy alone is not enough — evaluators expect experiments, comparison against baselines, and failure analysis.

## Facts on record
- Group of 3 (members unnamed). The other two members + supervisor fit are the most plan-changing open questions. Guide advice given and acknowledged: (1) choose the other 2 members by work, not friendship, before semester 6 — most urgent; (2) supervisor shortlist/approach race in early semester 6 (concept note is Muse's to prepare); (3) treat the FYP as portfolio + paper attempt + interview story, not just a degree requirement; (4) forward any department FYP notice to Muse immediately so the plan re-paces the same day.
- Department has announced nothing yet — no idea/proposal deadline known, nothing done so far. Timeline: 6th sem idea/supervisor, summer groundwork alongside the internship (kept light), FYP-I in 7th sem, FYP-II + thesis in 8th. Idea lock deliberately deferred until after the supervisor meeting.
- Scope flags in the pack: XAI evaluation study too small for a 3-person team unless expanded; federated learning over-scoped, explicitly not recommended; Roman-Urdu idea needs a self-built corpus; StudyLens-type idea collapses without real cohort marks data.

## Links
- Idea bank repo: github.com/abduIwahid/fyp-ideas (private) — IDEAS.md, PLAN.md, TOP100.md, RESOURCES.md, official/, references/, brain/
