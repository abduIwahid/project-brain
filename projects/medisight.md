# Project: MediSight AI — RENAMED WhyRisk (2026-10-25)

> STATUS BANNER (added by nightly consolidation 2026-10-26 — read this
> first; the early sections below describe the pre-rename state and are
> kept as history): the product is now **WhyRisk**. Repo renamed by Abdul Wahid
> to `abduIwahid/WhyRisk` (old fork `MediSight-Healthcare-Platform`
> deleted by Abdul Wahid 2026-10-25 evening). **Live: https://whyrisk.vercel.app**
> (Vercel project `whyrisk`, Supabase project ref `[project-ref]`).
> Phases 1–5 + Features Phase + reel-improvements round + in-app rebrand
> + Phase 6 deploy are DONE. Remaining: Phase 6 leftovers (HF ML service
> + ML_SERVICE_URL on Vercel, GEMINI/RESEND activation, logo.png upload,
> portfolio demo link → whyrisk.vercel.app, end-to-end test) and Phase 7
> hardening incl. QA Round 1 backlog (2026-10-25 ~20:24, report 14/22)
> and items 141 (PentAGI) + 150 (dependency audit). The old
> medisight-healthcare.vercel.app demo link is DEAD — never reuse it.
>
> UPDATE (nightly consolidation 2026-10-29): Batch C PUSHED + DEPLOYED +
> LIVE-VERIFIED 2026-10-28 (main HEAD d102e9d, deploy dpl_6dGxZPEp;
> honest figures only: AUC 0.8222, 70,692 records; /api/chat 401
> unauthenticated; /api/ml/model-card live:false while ML_SERVICE_URL
> is unset — expected, not a regression). QA ROUND 3 COMPLETE the same
> day (coordinator + 20 fresh reviewers on d102e9d; 297 raw findings,
> 6 criticals all fixed incl. root README's stale 0.8307 claims and the
> symptom wizard's rule-match % shown as clinical severity). Round 3
> push first landed only partially (batches 0–7, HEAD 5b14ae0) after
> Abdul Wahid declined approval cards mid-run, then completed on his blanket
> go-ahead ("allow hain sari permission meri taraf se") — final HEAD
> 6d47c2b, deploy dpl_C1g6pbfP READY, live-verified all-pass
> (/ → 308 → /welcome, honest figures only, /api/chat,
> /api/predict-symptoms, /api/predict all 401 unauthenticated).
> public/logo.png DELETED in Round 3 (manifest now uses the SVG icon;
> /logo.png 404s — the old logo.png web-UI upload item is MOOT).
> QA LOOP CLOSED with ONE combined owner-ask (see MASTER-PLAN §5):
> fresh Supabase token → migrations 20+21 + send-alert redeploy +
> min password 8; HF Space → ML_SERVICE_URL + E2E test; seed-data
> decision (5 invented US patients in prod); test-password re-share
> (all Round 3 interior verification is code-based only); --card
> #E7EDEC veto check; rate-limiting + feature gaps. Remaining:
> that owner-ask, HF ML service + live E2E test, portfolio link,
> Phase 7 hardening (Round 3 DB backstops are in migrations 20+21,
> not yet applied), items 141 + 150. Supabase scoped token expires
> ~2026-11-01 — revoke after use.
>
> UPDATE 2026-10-30 ~20:20 PKT — Supabase owner-ask item DONE: Abdul Wahid
> connected a fresh Supabase access token via the custom.supabase
> connector (verified: WhyRisk project ACTIVE_HEALTHY). Migrations
> 20 (20261025200000_qa_round1_security) + 21
> (20261025230000_qa_round2_hardening) applied through the Management
> API SQL endpoint and verified in the live database (guard
> functions, hospital-reassignment trigger, doctors.reviewed_by/at,
> alerts clinical-read policy, profiles.role default 'patient').
> Auth config: password_min_length 6 → 8, re-read to confirm.
> send-alert Edge Function redeployed as version 2 (carries the
> QA Round 2 'New' alert-status fix). Connector helpers:
> ~/workspace/custom-connectors/custom.supabase/bin/sb.py +
> sb_deploy.py, documented in that connector's CONNECTOR.md.
> Still open from the combined ask: HF Space → ML_SERVICE_URL + E2E
> test, seed-data decision, test-password re-share, --card veto
> check, rate-limiting + feature-gap decisions; old-token
> revocation not separately confirmed.
>
> UPDATE 2026-10-30 ~21:00 PKT — HF ML backend BLOCKED on hosting
> policy: Abdul Wahid connected a fine-grained HF token via
> custom.huggingface (verified whoami: abdu1wahid, repo.write on
> his namespace). Everything for the Space is staged: ml-service
> code + Dockerfile in ~/workspace/.whyrisk-build/ml-service, and
> the trained artifact EXISTS at
> ~/workspace/medisight-p7/ml-service/models/production/
> (LightGBM model.joblib, AUC 0.8222, trained 2026-10-25).
> BUT creating the Docker Space returned HTTP 402: free cpu-basic
> Docker/Gradio Spaces now require a PRO subscription; only
> static Spaces are free. Abdul Wahid's no-card/free rule means this is
> his decision (PRO ≈ paid) vs a packaging change (e.g. Vercel
> Python serverless — bundle size with xgboost/shap untested).
> ML_SERVICE_URL therefore still unset; live prediction still
> live:false. Same 402 constraint applies to the old NearSend
> HF Spaces fallback idea.
>
> UPDATE 2026-10-30 ~21:35 PKT — ML backend LIVE via Vercel Python
> (Abdul Wahid picked "Test the free Vercel Python route"): new Vercel
> project whyrisk-ml (prj_wbeVyL17wnifwq48c39IYvNnXh1J) serves the
> FastAPI service at https://whyrisk-ml-abdu1wahid.vercel.app.
> Staging source: ~/workspace/whyrisk-ml-vercel (api/index.py shim
> + ml_main.py = repo app/main.py verbatim + models + libs).
> Verified end-to-end: /model-status model_loaded:true (LightGBM,
> AUC 0.8222), /predict with key → 200 (0.832 on the standard
> high-risk test profile), /explain SHAP values OK, no key → 401;
> ML_SERVICE_URL + a fresh shared ML_SERVICE_API_KEY set on the
> whyrisk project, whyrisk redeployed (dpl_BjAfj2BtWWVkXtBjrj9),
> and https://whyrisk.vercel.app/api/ml/model-card now returns
> live:true + modelLoaded:true. Packaging lessons: full Docker
> requirements bundle to 707 MB > Vercel's 500 MB function limit —
> the serverless variant drops xgboost (artifact is LightGBM) and
> uvicorn; LightGBM needs libgomp.so.1, absent on Vercel's runtime,
> so a Debian bullseye libgomp (GLIBC ≤ 2.17) is bundled in libs/
> and preloaded by the shim (Ubuntu's build needs GLIBC 2.38 —
> too new); model.joblib and libgomp travel as uploaded byte
> chunks (connector CLI caps a single argument at ~128 KB) and are
> reassembled into /tmp at cold start; Vercel SSO protection had
> to be disabled on the ML project. Known limits of this layout:
> /retrain cannot run (no training files, read-only FS) and
> /drift-status reports the training dataset as unavailable —
> both surface honestly in the app. Item 2 of the combined ask is
> DONE; a signed-in in-app prediction click-through is still
> unverified.
>
> UPDATE (nightly consolidation 2026-10-27): QA Round 2 Batches A + B
> are DONE and live (Batch B HEAD 64c50e4; security headers, contact
> relay closed, phone login removed for real). Batch C code is COMPLETE
> in ~/workspace/medisight-p7 (46 files, tsc/ESLint/build PASS) but was
> NOT pushed as of 2026-10-26 22:44 — the 2026-10-25 ~23:15 GitHub
> connector outage blocked it, but the connector PROVED recovered on
> 2026-10-26 evening (DAA Lecture 1 delete + profile pushes succeeded),
> so the Batch C push chain (~/workspace/.ghcheck/push_r2c.py) is now
> unblocked, not yet run. Public scope live-verified 2026-10-26
> (welcome page renders fully; the 25 Oct Vercel failure emails do NOT
> mean the site is down) — but the signed-in prediction flow was NOT
> tested, so the app is NOT "fully finished". Still owed: migrations
> 20 + 21 + send-alert redeploy (token ask), the single consolidated
> Round 2 report (incl. --card #FFFFFF → #E7EDEC veto flag, seed-data
> decision, test-password re-share ask), then Round 3. Supabase scoped
> token expires ~2026-11-01 — revoke after use.

Healthcare risk-prediction platform from Abdul Wahid's ML internship at Ezitech
Institute (Eziline Software House), Jul–Sep 2026. Monorepo: Next.js
frontend + FastAPI ML service + Supabase backend. Overrides/additions to
`../general/` for THIS project only.

## Facts
- **Repo: github.com/abduIwahid/MediSight-Healthcare-Platform — it EXISTS
  and is publicly readable (verified 2026-10-24 via connector root listing
  + raw README HTTP 200).** This contradicts an earlier same-day
  authenticated repo search that reported no MediSight repo under
  abduIwahid — that search missed it; trust the direct listing. The code
  is not lost.
- **The Vercel project (medisight-healthcare.vercel.app) was deleted by
  Abdul Wahid by mistake on 2026-10-24** — the live demo is down until the
  frontend is re-imported to Vercel. The portfolio's MediSight case study
  links to that dead demo.
- Structure (verified from the repo root, 2026-10-24): `frontend/`
  (Next.js 14, App Router, Tailwind CSS, shadcn/ui — components.json
  present), `ml-service/` (FastAPI `app/`, `model_training/`, `tests/`,
  Dockerfile, requirements.txt), `supabase/` (migrations, RLS policies,
  edge functions per the README), `render.yaml` at root — suggests the ML
  service targets Render; its current deployment status is unverified.
- Seven disease domains (repo README + portfolio content/projects.ts):
  diabetes, heart disease, chronic kidney disease, stroke, liver disease,
  breast cancer, hypertension. Models benchmarked: Logistic Regression,
  Random Forest, XGBoost, LightGBM, with MLflow experiment tracking; SHAP
  explanations served through the FastAPI service.
- Headline metric, as stated in the portfolio/CV: 0.8307 AUC-ROC
  (LightGBM) — task-specific; the portfolio itself warns against
  generalising a single score across clinical use cases.
- Root clutter (verified): `.gitignore.bak` committed, `convert_pdf.py`
  and `START.bat` / `quickstart.bat` / `quickstart.ps1` at root, a
  case-study PDF; the README says extra docs were archived to a
  `backup-md` branch. No LICENSE at root (verified absent from the
  listing).

## Strengths
- Real engineering structure, not a notebook dump: separate frontend /
  ML service / database layers, Docker for the ML service, and a pytest
  suite under ml-service/tests/.
- Explainability is first-class: patient-specific SHAP contributions and
  feature importance, plus clinical risk indicators (BMI classification,
  BP categorisation, eGFR staging) — matches Abdul Wahid's XAI focus.
- Honest framing already in place: medical disclaimer in the README and
  explicit limitations in the portfolio case study (not a certified
  medical device; explanations describe model behaviour, not causality).

## Weaknesses
- Demo is down (Vercel project deleted) — the flagship internship project
  currently has no working live link, and the portfolio points at it.
- Frontend "isn't good, feels AI-generated" (Abdul Wahid's own verdict,
  2026-10-24). Likely cause, grounded in the repo: stock shadcn/ui +
  Tailwind defaults left largely untouched — the anti-fingerprint list in
  `../general/frontend-preferences.md` names exactly this tell (untouched
  shadcn components, default fonts, gradient decoration).
- The README is two documents concatenated — a terse "minimal README"
  followed by a long marketing-style one with emoji section headings.
  Inconsistent voice, and the emoji-bullet style reinforces the
  AI-generated feel the frontend already has.
- Repo hygiene leftovers (see Facts) and no LICENSE.

## Improvement plan (prioritized)
1. **Get it live again.** Confirm MediSight-Healthcare-Platform is the
   complete, current codebase (it exists — see Facts), re-import
   `frontend/` to Vercel so the demo resolves again, check the ML service
   is reachable (render.yaml; redeploy if it died), and update the
   portfolio demo link if the URL changes.
2. **Frontend redesign — kill the generic AI look.** Keep Next.js /
   Tailwind, but restyle away from stock shadcn defaults: adopt Abdul Wahid's
   editorial system (Anton display + Archivo body, near-black ink on warm
   paper surfaces, ONE accent), customise the shadcn primitives (radii,
   borders, layered shadows — never a white glow), and strip the
   fingerprint tells (purple/blue gradients, gradient headline text,
   emoji headings, three-icon-box rows). Make the SHAP explanation the
   hero view: patient-specific feature contributions as clean horizontal
   bars with scannable numbers, skeleton loaders shaped like the real UI
   while a prediction runs, and a deliberate empty state before the first
   prediction.
3. **One README.** Merge the two concatenated READMEs into a single
   concise doc in the honest docs voice (setup, architecture, models,
   disclaimer), drop the emoji bullets, and link or restore the key docs
   parked on the `backup-md` branch.
4. **Hygiene pass.** Delete `.gitignore.bak`, move the root helper
   scripts into `scripts/` (or delete them), add an MIT LICENSE.

_Unverified items are marked as such inline; in particular, whether the
ML service is currently deployed and whether `frontend/` builds cleanly
today have not been checked._

## Deep analysis — 2026-10-24

Full report + phased workflow: `~/workspace/github-audit/medisight-deep-analysis.md`.
Verified this round (supersedes the "unverified" notes above):

- **Nothing is live.** Frontend `medisight-healthcare.vercel.app` → 404;
  `medisight-ml-service.onrender.com` (name from render.yaml) → 404.
  Branches: `main` + `backup-md` both exist (ls-remote verified).
- **Worst bug: silent fake predictions.** `frontend/src/app/api/predict/
  route.ts` falls back to a hand-written heuristic (`fallback-heuristic-v1`,
  confidence hardcoded 0.78) whenever the ML service is down/unset —
  indistinguishable from real model output in the UI.
- **One-model reality.** The FastAPI service trains/serves exactly ONE
  model (diabetes, BRFSS 2015; explanation text hardcodes "Diabetes").
  The other 6 advertised diseases have no models. The `predict-risk` edge
  function stores that diabetes score under any disease label requested,
  maps most features from hardcoded defaults, and computes the BRFSS age
  bucket wrong (`floor(age/5)`).
- **Tests: 59 passed / 10 failed** (fresh venv, repo's own requirements).
  All 10 failures are `test_api.py` asserting a loaded model — the model
  artifact + dataset are gitignored, so a fresh clone 503s. CI masks this
  with `train.py || echo skipped`.
- **Build lies.** `next build` exits 0 only because `next.config.mjs` sets
  `ignoreBuildErrors` + `ignoreDuringBuilds`. Run directly: `tsc` = 17
  errors / 9 files; ESLint = 165 errors + 12 warnings → CI's frontend job
  would fail on main. Zero frontend tests.
- **Dockerfile is two concatenated Dockerfiles** (contradictory build
  contexts; block 1 has an exec-form `$PORT` CMD that can't expand). With
  models/ gitignored and no train step, a from-git deploy can never have
  a model.
- **ML service security:** no auth on any endpoint (incl. `POST /retrain`
  shelling out to training), no input range validation, 500s leak
  exception text, CORS lists literal `https://*.vercel.app` (Starlette
  doesn't expand it — needs allow_origin_regex), "confidence" is a
  fabricated margin formula. Requirements all unpinned `>=` (resolved
  2026-10-24 to pandas 3.1 / numpy 2.5 / mlflow 3.17); mlflow + pytest
  ship in production requirements.
- **Orphaned layer:** all 6 Supabase edge functions are never invoked by
  the frontend (zero `functions.invoke` hits) — the Next API routes do
  the work instead (chat = Gemini `gemini-flash-latest`). Two parallel
  admin areas: `(dashboard)/admin` AND `admin-portal/`, own guards each.
  ML URL env spelled 4 ways (`ML_SERVICE_URL`, `NEXT_PUBLIC_ML_SERVICE_URL`,
  `NEXT_PUBLIC_API_URL`) with localhost fallbacks.
- **AI-feel is a system, not a vibe:** globals.css body = 3 radial
  gradient washes + dot grid, `.gradient-text`, `.glass-panel`,
  `.gradient-border`, `.btn-premium` shimmer, `.kicker`, `.blob`, plus
  three components pasted verbatim from Uiverse.io (comments say so);
  tailwind config defines `gradient-mesh` + `glow` shadows; every Card
  forced `backdrop-blur-xl` + hover lift; fonts Inter + Poppins;
  `--radius: 0.9rem`. Ten fingerprint-list tells at once.
- **Landing page fabricates proof:** "50,000+ Patients Monitored",
  "1,200+ Expert Doctors", "98.4% Prediction Accuracy", six invented
  testimonials, fake emergency number, "30% off" banner (all hardcoded in
  `src/app/welcome/page.tsx`). Real validated number: 0.8307 AUC, diabetes.
- **Strengths confirmed:** middleware role routing is careful (patients /
  clinical / unapproved-doctor / no-role all handled); both admin layouts
  re-check roles server-side; service-role client only used in the two
  admin API routes; no hardcoded secrets found; initial schema = 15
  tables / 48 RLS policies (72 total); features + RLS test suites pass
  cleanly; `/api/predict-symptoms` honestly labels itself a heuristic.
- **Hygiene:** 3 hospital-seed + 3 doctor-seed migrations; stray seed
  .sql inside `frontend/src/components/shared/`; unused Geist font files
  in `src/app/fonts/`; `frontend/README.md` is create-next-app boilerplate;
  no `.env.example` despite .gitignore whitelisting one; START.bat leaks
  the author's personal Windows path; CI triggers on a nonexistent
  `develop` branch.
- **Workflow:** 8 phases (0 decisions/access [Abdul Wahid] → 1 hygiene/docs →
  2 ML service → 3 frontend correctness → 4 redesign [Abdul Wahid sign-off] →
  5 data layer → 6 deploy [Abdul Wahid accounts] → 7 hardening) with a
  production-ready checklist — all in the audit file above. No changes
  were made to the repo; status at analysis time: analysis-only per
  Abdul Wahid's instruction, awaiting his review before the fix loop starts.

## Phase 1 — executed 2026-10-25 (hygiene & honest docs)

Abdul Wahid approved the workflow + Phase 0 on 2026-10-25 (hosting: Vercel
frontend; Render out — card wall — backend target is Oracle Cloud;
Supabase stays; kill the fake fallback; strip fabricated stats; honest
disease labels; MIT license; admin-area pick deferred). Phase 1 landed
as 12 verified commits on `main` (docs `6ef3e0a`, hygiene `60b8380`,
then 10 sha-verified deletions):

- **One honest README** (8,132 bytes) replaces the two concatenated
  ones: honest scope section (one trained model — diabetes, BRFSS 2015,
  LightGBM AUC-ROC 0.8307 on a stratified 80/20 test split; symptom
  checker labelled a rule-based heuristic; six other diseases named as
  roadmap), setup that matches the code (dataset path, train-then-run,
  API tests need the artifact), endpoint table from `app/main.py`,
  disclaimer kept, license = MIT. `frontend/README.md` boilerplate
  replaced with a short pointer to the root README.
- **LICENSE** added (MIT, Copyright (c) 2026 Abdul Wahid).
- **`.env.example`** added: `frontend/` lists all 8 variables the code
  reads (Supabase ×3, ML_SERVICE_URL + the two legacy NEXT_PUBLIC_
  spellings, NEXT_PUBLIC_SITE_URL, GEMINI_API_KEY); `ml-service/`
  lists DATABASE_URL only (the FastAPI app reads no env vars; only
  seed_db.py does). Names only, values empty.
- **`.gitignore`** cleaned: BOM stripped, Vite/setuptools template
  leftovers and duplicate `build/` rules dropped; all repo-relevant
  rules (incl. `!.env.example` whitelist) kept.
- **Root clutter gone:** `.gitignore.bak` deleted; `START.bat` deleted
  (leaked `C:\Users\toshiba\...`; superseded by README setup);
  `quickstart.bat` / `quickstart.ps1` / `convert_pdf.py` moved to
  `scripts/` (launchers got one-line root-resolution fixes so they
  still work from there; their LOCAL_SETUP.md pointers now say
  README.md); `medisight_icon.png` deleted — byte-identical duplicate
  (md5 match) of `frontend/public/logo.png`, zero references.
- **Frontend strays:** unused Geist fonts (`GeistVF.woff`,
  `GeistMonoVF.woff`) deleted — grep-verified unreferenced, layout
  loads Inter/Poppins; the stray seed SQL in `components/shared/`
  deleted (it was the pre-disable active copy carrying seed-account
  passwords; the same-named migration is a disabled stub and doctors
  are seeded by `20260730000000_seed_doctors_profiles.sql`);
  `fill_empty_data.js` moved to `frontend/scripts/dev/` with its
  `.env.local` path adjusted (`../../.env.local`) so it still runs.
- **Deferred / blocked:** (1) Case Study PDF → `docs/` rename+move —
  binary cannot be re-pushed via the connector (delete worked, push
  can't); needs plain git or the web UI. (2) CI trigger references a
  nonexistent `develop` branch — workflow files are never pushed via
  the connector (silent-fail), fix via GitHub web UI or Abdul Wahid's ok to
  try separately.
- **Flags for Phase 2:** both quickstart scripts embed the standard
  local-dev Supabase demo anon key (fake signature, local-only, already
  in git history) — left verbatim so the launchers keep working;
  `ml-service/model_training/seed_db.py` may contain a hardcoded
  DATABASE_URL fallback literal (tooling redacted the value; never
  inspected or copied) — verify and remove in the Phase 2 security pass.
- Root listing after Phase 1: `.github, .gitignore, Case Study PDF,
  LICENSE, README.md, render.yaml, frontend/, ml-service/, scripts/,
  supabase/` — clean.

## Design decision — 2026-10-25
- **Palette FINAL (chosen by Abdul Wahid): Option 2A "Midnight Clinical"** — adapted from his shared @uiux.build Midnight navy ramp. Ink #06141B, primary #0D2B3E, accent steel blue #2E7FA8, light grey #CCD0CF, card #E7EDEC, paper #F4F6F6. Semantic risk colours fixed across the product: moderate amber #D97706, high red #C0392B (data only). Fonts stay Anton / Archivo / JetBrains Mono. He reviewed the palette sheet + three midnight variants (2B green accent, 2C one-hue slate, 2D warm navy) and confirmed the ORIGINAL 2A ("wohi theek hai original wala"). Palette sheets: ~/workspace/your_files/medisight-palettes.html + medisight-palettes-midnight.html. This is the Phase 4 target scheme.

## Phase 2 — executed 2026-10-25 (ML service: real, safe, reproducible)

Executed against the NEW standalone repo `abduIwahid/MediSight` (the old
fork is a frozen backup; never push there). Six verified commits on
`main`: `dc52194` feat(ml) auth/validation/confidence/500s, `1016c91`
test(ml) fixture + security tests, `51b2a6e` chore(ml) pinned reqs,
`1781508` fix(ml) Dockerfile, `5f99480` feat(ml) dataset bootstrap +
MLflow 3 fixes, `b678e44` docs README contract.

- **seed_db.py flag was a false alarm.** Line 15 is a plain
  `os.getenv("DATABASE_URL")` read (env-only, raises when unset) — no
  hardcoded fallback literal exists in the tree or in this repo's git
  history (pattern-scanned without ever printing a value). The Phase 1
  suspicion came from output-layer redaction of the assignment line.
  No change made; no credential rotation needed on this evidence.
- **Auth:** `X-API-Key` header vs env `ML_SERVICE_API_KEY`
  (constant-time compare) on `/predict`, `/explain`, `/retrain`,
  `/drift-status`. `/` and `/model-status` stay open. Key unset =
  explicit DEV MODE with a loud startup warning. Frontend does NOT send
  the header yet — that wiring is a recorded Phase 3 task.
- **Validation:** all 21 BRFSS fields range-checked in Pydantic
  (binaries 0–1, BMI 10–80, GenHlth 1–5, *Hlth 0–30, Age 1–13,
  Education 1–6, Income 1–8) → clean 422s.
- **Error hygiene:** global exception handler returns a generic
  `{"detail": "Internal server error."}`; exception text is logged
  server-side only. Retrain failures sanitised the same way; retrain
  subprocess now uses `sys.executable`; status mutations are locked.
- **Honest score:** `probability` is `predict_proba` output.
  `confidence` is now literally `max(p, 1-p)` — the model's probability
  for the predicted class — replacing the old margin formula (numerically
  identical, now honestly defined in code + README contract).
  `/model-status` reports `diseases: ["Diabetes"]`.
- **CORS:** origins from env `ALLOWED_ORIGINS` (default
  `http://localhost:3000`); the dead literal wildcard entry is gone.
- **Dependencies:** exact pins verified in fresh venvs (Python 3.12):
  prod `requirements.txt` (fastapi 0.162.0, pydantic 2.14.1,
  scikit-learn 1.9.1, pandas 3.1.0, numpy 2.5.4, shap 0.54.1,
  lightgbm 4.7.0, xgboost 3.4.1, uvicorn 0.54.0, joblib 1.6.0);
  `requirements-train.txt` adds mlflow 3.17.2 + psycopg2 + dotenv;
  `requirements-dev.txt` adds pytest 9.1.1 etc. Both LightGBM and
  XGBoost stay in prod (the app unpickles whichever won training).
  A prod-only venv was boot-smoke-tested: 200 /, 401 without key,
  200 with key, 422 on BMI 500, 503 without artifact.
- **Dockerfile:** one coherent file (was two concatenated),
  python:3.12-slim, libgomp1, prod reqs only, non-root user, build-time
  AND start-time checks that fail loudly when
  `models/production/model.joblib` is missing; context = `ml-service/`
  per render.yaml. NOT build-verified locally — the sandbox has no
  Docker; first real build happens at Phase 6 deploy.
- **Tests self-sufficient:** `tests/conftest.py` trains a tiny LightGBM
  on synthetic BRFSS-shaped data (seed 42, genuinely learnable signal)
  only when no artifact exists; a real artifact is never overwritten.
  `tests/test_security.py` adds 23 tests (auth contract, dev mode,
  range 422s incl. boundaries, generic-500 leak test).
  **Evidence: full suite `92 passed, 1 warning in 38.44s` from a fresh
  clone with no artifact, and `92 passed` again with the real trained
  artifact.** (Warning: Starlette's httpx TestClient deprecation —
  cosmetic, watch item.)
- **Dataset bootstrap (verified by real download):**
  `model_training/fetch_dataset.py` pulls the canonical UCI dataset
  891 file (`https://archive.ics.uci.edu/static/public/891/data.csv`,
  253,680 rows, verified header + counts) and derives the 50/50 split
  deterministically (all 35,346 positives + seed-42 sampled negatives
  = 70,692 rows) into the path train.py expects. Not byte-identical to
  the Kaggle upload (different negative sampling) — documented in the
  script + README. The dataset itself is never committed.
- **Training works again under MLflow 3:** train.py crashed on the
  pinned MLflow (file store opt-in + skops refusing tree ensembles).
  Fixed with `MLFLOW_ALLOW_FILE_STORE=true` setdefault and
  `serialization_format="cloudpickle"` for the sklearn flavor. Full
  run on the derived dataset: LightGBM won again, **AUC-ROC 0.8222**
  (vs 0.8307 on the original Kaggle file — the gap is the different
  negative sample, not a regression), and `/drift-status` + `/explain`
  were live-verified against that real artifact (PSI 0.0077).
- **Not done / deferred:** committing the artifact via Git LFS (the
  Phase 2 plan's item 1) — replaced by the train-then-build flow;
  `/drift-status` result caching (auth-gated instead); Docker build
  verification (no Docker in sandbox); CI workflow updates (workflow
  files are never pushed via the connector — the CI ML job still has
  the old `train.py || echo skipped` mask and installs
  `requirements.txt` only, so CI would need requirements-dev.txt +
  fetch step — recorded for a web-UI fix).

## Backlog — Abdul Wahid ideas (not scheduled)
- **Bilingual English/Urdu toggle** (Abdul Wahid, 2026-10-25): a language switch for the product UI. Explicitly NOT now — build only when he asks. Until then all product wording is English only (his standing rule, same date).

## Phase 3 — executed 2026-10-25 (frontend correctness, repo abduIwahid/MediSight)

- **Q5 DECISION (Abdul Wahid, 2026-10-25, "1 theek hai"): keep the in-dashboard admin at `/admin`; the standalone admin-portal is retired.** The portal's live-stats dashboard (server-side Supabase counts: total patients, total doctors, pending doctor approvals, total appointments) was ported as the real `/admin` home (previously `/admin` only redirected to `/admin/users`), with an "Overview" tab added to AdminTabs. The portal's doctor pending-approvals flow turned out to already exist in-dashboard (`DoctorVerificationView` with status filters + approve/reject), so nothing needed porting for it. All 7 admin-portal pages + 4 portal-only components were deleted; `middleware.ts` keeps a redirect stub (`/admin-portal*` → `/admin`) for old links while the general `/admin` role protection stays intact; welcome-page and sidebar links now point at `/admin`. The only "admin-portal" strings left in `src` are that stub + its comment.
- **Standing rule recorded (Abdul Wahid, 2026-10-25): ALL user-visible product wording is English ONLY** — UI copy, errors, labels, buttons, admin areas. No Roman Urdu anywhere in the product; the bilingual toggle stays a future idea (see Backlog). Phase 3 scan of `frontend/src`: zero Roman Urdu strings and zero Arabic-script strings found (nothing needed converting).
- **Fake fallback killed:** `api/predict/route.ts` no longer fabricates a heuristic prediction. Unconfigured/unreachable/failing ML service → 503 `{"error":"Prediction service unavailable. No score was generated."}`; upstream 422s pass through; the two UI callers surface the server's error message. The symptom-checker route stays a clearly-labelled heuristic (unchanged behaviour).
- **ML access consolidated:** new `src/lib/ml-service.ts` is the ONLY reader of `ML_SERVICE_URL` / `ML_SERVICE_API_KEY`; it sends `X-API-Key` (Phase 2 auth) and returns null when unconfigured so callers degrade honestly — the browser never receives the key or the service URL. New server proxies: `/api/ml/model-status` (session-checked) and `/api/admin/ml/retrain` (role-checked). Client-side ML fetches and all legacy env spellings (`NEXT_PUBLIC_ML_SERVICE_URL`, `NEXT_PUBLIC_API_URL`) are gone — grep-verified zero. The only localhost in `src` is the dev-only default in ml-service.ts (NODE_ENV=development + console.warn).
- **Honest disease scope:** no functional multi-disease selector exists — the only model-backed flow is diabetes. The symptom wizard (`/predict`) is relabelled "Rule-Based Symptom Screening" end-to-end (kicker, step name, intro, disclaimer); the About page now states the diabetes LightGBM model (BRFSS 2015) honestly. The frontend never calls the `predict-risk` edge function (zero `functions.invoke` in src) — Phase 5's concern, untouched.
- **Real build gates:** `npx tsc --noEmit` 17 errors → **0**; ESLint 165 errors + 12 warnings → **0 errors + 11 warnings** (9 react-hooks/exhaustive-deps + 2 no-img-element, triaged as acceptable). No blanket disables, no eslint-disable carpets. `typescript.ignoreBuildErrors` + `eslint.ignoreDuringBuilds` REMOVED from `next.config.mjs`; `npm run build` passes with gates ON (43/43 pages; local build needs placeholder Supabase env vars because client pages construct a Supabase client at prerender — on Vercel the real env vars exist). New shared row types in `src/lib/types.ts`; dead sample-doctor array removed from the doctors directory page.
- **Commits (all verified, real refs/heads/main):** `d891d35` (Tasks 1–3), `5700d52` (admin consolidation), 11 deletion commits `102da00`…`86bf500` (admin-portal removal), `6bd38d5` (honest labels), `37d65fb` (tsc/ESLint zero — 52 files + types.ts), `6833828` (build gates on).
- **Leftovers / flags:** (1) the portal-only user-edit UI (AdminUserModal: edit profile / reset password / delete account) was deleted with the portal — the `/api/admin/users/*` routes remain and `/admin/users` still covers role/hospital changes; restore the edit UI inside the dashboard only if Abdul Wahid asks. (2) Welcome page fabricated stats/testimonials + services grid = Phase 4 (needs his copy sign-off). (3) `doctors/[id]` page still falls back to a local sample-doctors list when a profile lookup misses — renders sample data as if real; flagged for a Phase 4/5 honesty decision (left as-is in Phase 3). (4) MLOps page keeps its `_demo` model-status fallback when the ML service is offline (page shows "Not Connected" state). (5) `scripts/fix-vercel-manifests.cjs` postbuild left in place — the gated build passes with it; reassess at Phase 6 deploy. (6) CI workflow edits (install requirements-dev.txt, drop the training mask, fix develop trigger) still need the GitHub web UI. (7) Docker build still unverified → Phase 6.

## Feature ideas — proposed by Muse, told to Abdul Wahid 2026-10-25 (awaiting his picks)
Abdul Wahid asked to be told about any new feature/improvement possible for THIS project. Proposed (not yet approved, not scheduled):
1. **What-if risk simulator** — sliders for BMI/activity/BP re-run the real model live: "what would lower my risk?" The strongest demo feature for an XAI product (counterfactuals from the actual model, no fabrication).
2. **Patient risk report (PDF)** — one-page downloadable report: score + SHAP reasons + clinical indicators, to take to a doctor. Built from existing SHAP + clinical-features code.
3. **Risk trend over time** — sparkline of a patient's past assessments on their dashboard (predictions are already stored).
4. **Doctor high-risk queue** — doctors see their highest-risk patients first, alongside the approvals flow.
5. **Appointment emails via Resend** — confirmations/reminders (he already has a verified Resend domain from the portfolio).
6. **Public model card page** — dataset, AUC, last-trained, live drift (PSI) as a transparency feature; fits the honesty theme.
Rule from Abdul Wahid (2026-10-25): proactively TELL him about possible new features/improvements for the project he is working on — do not silently skip them and do not build them unasked.

**APPROVED by Abdul Wahid 2026-10-25 ("all"):** all six features above are IN. Sequence: they run as a dedicated Features Phase immediately after Phase 4 (before the Phase 5 data-layer work), except appointment-email SENDING, which activates at Phase 6 when the Resend key is set on the MediSight deployment (code written in the Features Phase, sending gated on env).

## Phase 4 — executed 2026-10-25 (frontend redesign, repo abduIwahid/MediSight)
6 verified pushes (5 push_files + 1 delete) on main: acba436 (design system), d5269d3 (landing), 43c7ba5 (SHAP view), 639443a (delete ShapWaterfallChart), 3b4b5a0 (not-found + empty states), a1f9a27 (tell sweep). Gates green locally before pushing: tsc 0 errors, ESLint 0 errors / 10 warnings (pre-existing categories), production build passes with ignore flags still absent; /welcome is now a server component at 870 B / 97.1 kB first load.
- **Design system = 2A as decided:** globals.css rewritten to the hex tokens (paper #F4F6F6 bg, ink #06141B text, primary #0D2B3E, brand #2E7FA8 as a dedicated token because shadcn --accent is a hover surface, card #E7EDEC secondary/muted, border #CCD0CF, destructive #C0392B, radius 10px); dark variant mapped into the ink family. tailwind.config: gradient backgroundImages + glow shadows DELETED, `premium` shadow redefined as a soft layered shadow, `card` shadow added; fonts Anton (heading+display) / Archivo / JetBrains Mono via next/font in layout.tsx (Inter/Poppins gone).
- **Every finding-9 tell removed, grep-verified ZERO in frontend/src:** radial washes + dot grid, .gradient-text, .glass-panel, .gradient-border, .btn-premium, .kicker, .blob, .uiverse-btn/.uiverse-card, .loader-pulse, .fade-in-up, bg-gradient-*, violet/cyan accents. Replacements are in-system: `.eyebrow` (mono uppercase label, not a pill) + `.reveal`/`.reveal-slow` staggered entrance (per-element --d delays, prefers-reduced-motion honoured). Card primitive is flat (no blur, no hover lift); Button lost its gradient/glow variants; RiskBadge uses the semantic tints (Low #1E7A46, Moderate #D97706, High/Critical #C0392B).
- **Landing rebuilt to the approved preview** (server component): hero "Know your risk. See exactly why.", SHAP demo card (chip reads "Demo data"; same sample patient/factors as the preview), honest facts strip (0.8307 / 1 / 21 / 100%), What-it-does cards, "What is real, what is next" scope panels, inside-the-app glimpse with em-dash counts, ink footer with disclaimer. ALL finding-10 fabrications deleted (50,000+/1,200+/98.4%, six testimonials, fake emergency number/support email, 30%-off banner, Unsplash photos, rotating accents, CountUp). Dropped vs the old page (flagged): services grid, why-choose-us, FAQ, live doctors fetch — the approved preview did not include them.
- **SHAP as hero in-app:** new shared ShapFactorList (top 10 by |impact|, centre-zero diverging bars, amber up / green down, mono values, legend) is now the primary visual of PredictionDetailView, beside an Anton probability + severity-coloured gauge + RiskBadge + a confidence line that documents the term (predicted-class probability, not accuracy). ShapWaterfallChart deleted (its only consumer was this view). PatientRiskCard untouched (inherits the flat Card).
- **Honest not-found (Task 4 flag from Phase 3 CLOSED):** doctors/[id] sample-doctor fallback + the 3 invented doctors deleted; a missed lookup renders the shared EmptyState ("Doctor profile not found", CTA back to /doctors). EmptyState is deliberately dependency-light (no UI primitives) so server components can use it — importing the Radix Button into that server page broke page-data collection in the build; caught and fixed pre-push.
- **Empty states applied:** patients list (replaced its near-pattern block), doctor directory (new), patient appointments + staff appointments (bare text replaced) — one pattern: icon tile, specific title, one guidance line, one CTA.
- **Extra honesty catches during the sweep:** About page metrics were also fabricated (98.4% accuracy, 50,000+ records, "<200ms", "24/7 alerting", invented department specialist counts) → replaced with the README facts; departments relabelled Live/Roadmap. Predict page showed a fake 5-star rating on every doctor card → removed. Login panel's unverifiable "HIPAA-minded, enterprise-grade" + "trusted by clinical teams" lines → factual wording.
- **Leftovers/flags:** (1) Screenshots/visual QA impossible in this sandbox (headless Chrome fails) — verification was build + greps + remote re-fetches only; Abdul Wahid's phone glance at Phase 6 deploy is the visual check. (2) GitHub code-search index lagged minutes behind the pushes (stale tell hits) — direct file fetches at HEAD are the truth. (3) Login/signup pages still carry some sky/slate utility classes in small spots (Phase 3 had already mapped the tokens; not fingerprint tells). (4) Features Phase (the six approved features) runs NEXT, before Phase 5, per the approval note above.

## Demo seed data — proposed 2026-10-25 (Abdul Wahid's request, Muse's condition)

- Abdul Wahid asked (2026-10-25) for profiles (doctors, patients, records, hospitals) filled from a "real dataset" (Kaggle) with Pakistani details "so it looks authentic".
- Muse's position, sent to Abdul Wahid: importing real people's identities — or unlabelled realistic profiles — and presenting them as the platform's actual doctors/patients is the same fabrication Phase 3/4 just removed (and the Smart-Doctor-Connect audit flagged invented doctor data as a risk). Kaggle profile datasets are mostly non-Pakistani scraped/synthetic anyway, so they would not even deliver the authentic Pakistani feel he wants.
- Offered instead (awaiting his confirmation): a **clearly-labelled demo seed pack** built for Phase 5 alongside the data-layer work — fictional but realistic Pakistani-flavoured data (Pakistani names, cities, hospitals, specialties, sample records), visibly marked "Demo data" wherever it surfaces (same pattern he approved for the landing SHAP card), kept separate from real signups and removable in one step before any real launch. Exception: **no testimonials** — invented testimonials stay out entirely.
- Follow-up (2026-10-25, verified by web search): Abdul Wahid pushed for Kaggle datasets specifically. Search confirmed they exist (synthetic hospital visits/billing — MIT, Faker-generated; Synthea synthetic medical dataset; a patients/clinics/appointments clinic dataset) — but every one is SYNTHETIC by its own description ("fully artificial — no real patient information"); real identified patient/doctor data is not on Kaggle for privacy/legal reasons, and de-identified sets (BRFSS) carry no profiles. Plan given to Abdul Wahid: Phase 5 seed pack built on a verified synthetic dataset's structure/records, localised to Pakistani names/cities/hospitals, still labelled "Demo data" everywhere. His confirmation on the label condition still pending.
- CONFIRMED by Abdul Wahid (2026-10-25): his reason for preferring Kaggle was provenance — "banda keh skta hai mai ne kaggle se uthaya na ke generate kia" (he can honestly say the data was sourced from Kaggle, not generated). Agreed plan: in Phase 5, first check the verified synthetic Kaggle datasets (MIT synthetic hospital visits; clinic patients/clinics/appointments; Synthea) and use whichever fits the schema, with the source credited in the README; generate locally only if none fit. The "Demo data" label condition stands (and it strengthens his viva answer: sourced from Kaggle + labelled as demo).

## Features Phase — executed 2026-10-25 (all six approved features, repo abduIwahid/MediSight)
6 verified push_files commits on main (each carries its "Closes #N"; issues #8–#13 confirmed CLOSED via the connector afterwards, #7 Vitest confirmed still OPEN for Phase 7). Gates green in the working clone before pushing: tsc 0 errors, ESLint 0 errors / 10 warnings (the pre-existing baseline — no new warnings), production build passes with ignore flags absent; new routes in the build: /model-card (static), /patients/queue, /patients/[id]/predictions/[predictionId]/report, /api/appointments/notify, /api/ml/model-card. Raw re-fetch spot checks of new files returned 200.
1. **What-if risk simulator (issue #8, commit 298398e):** `WhatIfSimulator` on the prediction detail view — BMI slider, general-health segmented control, physical-activity and high-BP toggles; 500 ms debounce re-runs the REAL model through `/api/predict` (no client-side estimation anywhere), shows the new probability, severity and the delta in points vs the stored score, with a Reset and an honest 503 state identical to predictions. The BRFSS payload derivation moved to `lib/prediction-features.ts` (`buildMLPayload`) shared by RunPredictionButton and the simulator so they cannot drift. Same commit: the prediction page now loads the full patient record, and the fabricated SHAP fallback array + template clinical-explanation fallback were DELETED — a missing explanation renders "No clinical explanation was stored for this prediction." Simulations are labelled exploratory and never saved.
2. **Patient risk report (issue #9, commit 70cb296):** dedicated report route under the prediction detail + a print stylesheet in globals.css (only `.print-report` prints, colours preserved; browser Save-as-PDF is the mechanism, no PDF library). Contents all come from the stored prediction/explanation and the patient record: name, MRN, assessment + generated dates, model version, probability, severity, confidence with its honest definition, clinical indicators (latest BMI and systolic BP vitals, age, sex — absent values omitted), ShapFactorList, stored explanation or the honest missing line, medical disclaimer. The "Download report" button lives in PredictionDetailView (shipped in the #8 commit).
3. **Risk trend (issue #10, commit 958cb01):** `RiskTrendChart` — plain SVG (no chart library) of stored prediction probabilities over time in PatientDetailView's left column: brand line, severity-coloured points with title tooltips, date axis, and the change in points since the first assessment. ≥2 assessments → chart; exactly 1 → shared EmptyState ("Not enough assessments for a trend"); 0 → the pre-existing "No Risk Assessment" block. Predictions were verified to live in `public.predictions` (patient_id → the FHIR-shaped `patients` table), so the trend sits on PatientDetailView, not the profiles-keyed patient portal.
4. **Doctor high-risk queue (issue #11, commit 5ebe805):** new `/patients/queue` server page + "Risk Queue" sidebar item. Loads `doctor_patient_assignments` for the signed-in user through their own session (RLS-scoped — a doctor only ever sees their assigned patients), takes each patient's latest stored prediction, sorts probability descending, rows link to the prediction detail with RiskBadge severity. Assigned patients with no assessment are counted in an honest footnote, never ranked; EmptyState when the queue is empty.
5. **Appointment emails via Resend (issue #12, commit d044b89):** code only, per plan — `lib/email.ts` (plain fetch to the Resend API, no SDK) with confirmation + reminder senders; `POST /api/appointments/notify` (session-checked, appointment loaded through the caller's session so RLS confines it to a party) called fire-and-forget from the booking page after insert. Env names `RESEND_API_KEY` + `APP_EMAIL_FROM` added to frontend/.env.example; when either is unset the send is skipped with a server log line; sends never throw into the booking flow. From-name "MediSight"; copy English and factual (names, date/time in UTC, status, reason). Activates at Phase 6 when the key is set on the deployment.
6. **Public model card (issue #13, commit 3296906):** `/model-card` page linked from the landing footer; middleware `isPublicRoute` extended for `/model-card` and `/api/ml/model-card`. Static facts from the README only (CDC BRFSS 2015, 253,680 records, 21 features; LightGBM; AUC-ROC 0.8307 scoped to the stratified held-out test split, diabetes only; one trained model + six roadmap conditions; BRFSS-population limitation). Live values come from the new public proxy `GET /api/ml/model-card`, which composes the open `/model-status` and the key-protected `/drift-status` server-side via mlServiceFetch (key never exposed; the session-checked proxies untouched). The live metrics object is deliberately NOT surfaced — it carries the derived-data AUC (0.8222), which would mix claims with the documented 0.8307. Unreachable service → static facts + "Live status unavailable" line.
- **Leftovers/flags:** (1) No live end-to-end test was possible (no deployment in this phase; ML service and Supabase not reachable from the sandbox) — the simulator, queue, report and model-card live paths get their real verification at the Phase 6 deploy. (2) The sidebar highlights both "Patients" and "Risk Queue" on /patients/queue (generic startsWith active logic) — cosmetic only. (3) Email date/time renders in UTC, labelled as such, because appointment times are stored as UTC ISO strings. (4) Phase 5 (data layer: issues #1, #2 + the demo seed pack) is next per the program sequence.

## Phase 5 — executed 2026-10-25 (data layer, repo abduIwahid/MediSight)
13 verified commits on main (`1175f7f` age fix; `f711fc5`…`2593545` edge-function deletions; `7bf5095`…`9c50aab` seed-migration deletions; `a04bef6` seed pack; `aaa7cb1` teardown + README credit). Gates in the working clone with the age fix applied: tsc 0 errors, ESLint 0 errors / 10 warnings (pre-existing baseline), production build passes. Issues #1 and #2 verified CLOSED via the GitHub API afterwards; #7 (Vitest) remains open for Phase 7 as planned.

- **Edge functions (issue #2) — 5 deleted, 1 kept on evidence.** Re-verified against the current tree: zero `functions.invoke` and zero `/functions/v1/` callers in frontend + docs for predict-risk, ai-assistant-chat, admin-user-invite, export-report, retrain-trigger — all deleted (their jobs live in the Next API routes: /api/predict, /api/chat, /api/admin/users, the print report route, /api/admin/ml/retrain). **`send-alert` is KEPT**: it has a real caller the original audit missed — the database trigger in `20260723143100_critical_alert_webhook.sql` POSTs to it via pg_net whenever a Critical prediction is inserted, and it writes the alerts the dashboard reads. `_shared/cors.ts` was deleted too (only the five removed functions imported it; send-alert doesn't). Leftover flag: the trigger reads `app.settings.edge_function_base_url` / `app.settings.service_role_key` with local-dev placeholder fallbacks, so on a hosted project the webhook only reaches send-alert where those settings are configured — a Phase 6 wiring item, not a code defect.
- **predict-risk age bucket (issue #1) — closed by deletion + a real live-path fix.** predict-risk was deleted with the orphaned layer (its `floor(age/5)` mapping, hardcoded DEFAULT_FEATURES and any-disease labelling died with it). BUT the live path had the same class of bug: `buildMLPayload` (lib/prediction-features.ts) and the new-patient flow both used `ceil(age/10)` — age 65 mapped to band 7 instead of the correct BRFSS band 10. Both now call one shared `brfssAgeBand()` helper implementing the true _AGEG5YR scale (1 = 18–24, five-year bands 2–12, 13 = 80+), grep-verified as the only age derivation left in the frontend.
- **Seed migrations consolidated.** Hospitals: three identical guarded 'General Hospital' inserts → one canonical (`20260725000000` kept; `20260731121000` + `20260731121500` deleted; the guarded insert is a no-op once a row exists, so replay outcome is unchanged). Doctors: two comment-only no-op stubs (`20260726171500`, `20260726172000`) deleted; `20260730000000_seed_doctors_profiles.sql` remains the single canonical doctor-seed migration (accounts can't be migration-seeded — profiles.id FKs to auth.users). `supabase/seed_doctors_via_sql_editor.sql` is KEPT deliberately: it is the account-creation mechanism that canonical migration documents. Net: 21 → 17 migrations.
- **Migration replay: statically verified, NOT executed.** A statement-order audit of the final 17 files found: 19 tables, 5 enum types, 70 live policies, no CREATE TABLE re-creation without IF NOT EXISTS, no duplicate live policy names, no ALTER/INSERT/policy referencing an object before its creation (the only hits were platform schemas: auth.users FK and storage.*). A real replay was impossible in this sandbox (no Postgres, Supabase CLI or Docker installed) — the live `supabase db reset` + `supabase/tests/database/rls.test.sql` run is flagged for Phase 6. Never faked.
- **RLS coverage: 19/19 tables enabled with ≥1 policy — no gaps, no new migration needed.** Per table (live policies): hospitals 3, profiles 5, patients 4, vitals 4, lab_results 4, medications 4, diagnoses 4, predictions 4, explanations 4, doctor_patient_assignments 3, alerts 4, ai_chat_sessions 2, ai_messages 2, model_registry 2, audit_logs 1, contact_inquiries 2, appointments 7, doctors 4, patient_profiles 3. (storage.objects policies live in the platform-managed storage schema.)
- **Demo seed pack (Abdul Wahid-confirmed) — shipped, NOT applied anywhere.** `supabase/seed-demo.sql` + `supabase/seed-demo-teardown.sql`. Sourcing truth: BOTH target Kaggle datasets were actually downloaded on 2026-10-25 via Kaggle's public download endpoint with no account/credentials — "Multi-Location Healthcare Clinic Revenue Dataset" (Nudrat Abbas, CC0) and "Synthetic Hospital Visits and Billing Records" (Aya A Saad, MIT) — and the pack's structure/distributions were derived from the downloaded files (age/gender/chronic mix sampled from the clinic patients table; department/diagnosis vocabulary from the visits file; clinic structure + fee spread localised to PKR). The datasets ship no identities, so all names/hospitals/phones are fictional Pakistani demo personas created for the pack — the README §5 credit line says exactly this. Contents: 4 hospitals, 12 doctors (11 approved + 1 pending for the admin approvals queue), 8 portal patients, 40 clinical patients with demographics/vitals/diagnoses, 44 doctor assignments, 78 stored predictions (latest-per-patient severity spread Low 8 / Moderate 12 / High 12 / Critical 4; 4 patients deliberately unassessed), explanations for all 36 assessed patients' latest assessments, 18 appointments across all four statuses. Identifiability: fixed `d0000000-…` UUID namespace, `@demo.medisight.local` logins (shared demo password documented in the file header), `DEMO-2026-*` MRNs; teardown deletes exactly those markers (FK cascades cover children) and was UUID-coverage-checked against the seed. No ratings/testimonials anywhere. Shared demo doctor for the risk queue: Dr. Ayesha Rahman holds the 8 highest-risk patients.
- **Leftovers / Phase 6 inputs:** (1) live migration replay + pgTAP RLS suite run (needs local Supabase); (2) webhook `app.settings.*` configuration so the critical-alert trigger reaches send-alert on the hosted project; (3) first real application of the demo seed pack happens at Phase 6 local/staging setup — until then its SQL is statically validated only (108 JSONB literals parse-checked, severity/confidence recomputed 78/78 consistent); (4) no demo super_admin account was created (out of the confirmed pack scope) — the pending-doctor approvals queue is reviewable by any existing admin account.

Phase 7 candidate (via saved-references item 141, checked 25 Oct 2026):
PentAGI (github.com/vxcontrol/pentagi) — autonomous AI pentesting
agents, MIT, 32k stars. Possible self-test tool for the deployed app,
run ONLY against a local/staging copy (aggressive scans can clash with
Vercel's platform rules; LLM-token costs are real). Never against third
parties without explicit permission.

## Reel-improvements round — executed 2026-10-25

Mined saved-references items 1–144 (+ add-on item 148) against the finished
Phases 1–5 + Features state. Nine commits on abduIwahid/MediSight main,
HEAD aaa7cb1 → 07a4b52. Baseline gates = final gates: tsc 0 errors,
ESLint 0 errors / 10 warnings, production build passes (49/49 pages).
Working clone: ~/workspace/medisight-p7.

Commits:
- 985f68f feat: SEO/GEO kit (item 134) — public/llms.txt (README facts
  only), app/robots.ts + app/sitemap.ts (public routes /, /welcome,
  /model-card; base from NEXT_PUBLIC_SITE_URL, the project's existing
  canonical-URL variable — a static robots.txt cannot reference the
  sitemap without hardcoding a domain that does not exist yet), layout
  metadataBase + OpenGraph/Twitter from the same facts.
- b5f0a80 fix: contrast-safe brand text (item 131f) — accent #2E7FA8
  measures 4.10:1 on paper #F4F6F6, 3.76:1 on #E7EDEC, 4.45:1 on white:
  fails 4.5:1 for small text on all three. New token --brand-text
  #1F6E96 (5.19 / 4.75 / 5.63) for TEXT usages only (.eyebrow, welcome
  wordmark tagline + demo-card label, WhatIfSimulator reset button);
  graphics/large display keep #2E7FA8. Dark --brand-text = #5EA8C9
  (7.05:1 on ink). Also: body line-height 1.55 made explicit (131e);
  model-card footer py-[30px] → py-8 (131a one-off); model-card H1
  dropped its tracking-wide override → inherits tight tracking like the
  approved hero (item 137).
- d582bf1 fix: sidebar active state = longest matching href wins
  (item 8) in BOTH sidebars — /patients/queue no longer double-highlights
  Patients + Risk Queue; /patient/appointments/book no longer
  double-highlights My Appointments. Patient booking item renamed to
  match its page (see 344105b).
- 5732b60 fix: patients directory — Patient Name column now leads, MRN
  second (item 143 Markings: the fixated first column carries the key
  identifier). Doctor directory + risk queue already compliant. The
  list's "Run Prediction" link unified to "Run AI Prediction".
- 344105b fix: label consistency (item 136) — "Book Appointment" →
  "Book an Appointment" (patient sidebar + patient dashboard card;
  canonical = the booking page's own H1); dashboard quick action
  "Add Patient" → "New Assessment" (canonical = patients-list CTA for
  /patients/new). Kept deliberately: "Book one now" (prose link),
  "Run Updated Assessment" vs "Run AI Prediction" (re-run vs first-run
  are different actions). Flagged, not fixed (behaviour): the patients
  list "Run AI Prediction" link for unassessed patients points at
  /patients/new (the new-patient form).
- c4cc656 fix: item 148 add-on — small text aim 7:1, floor 4.5:1.
  Outright failures fixed: Tailwind amber-600 (#D97706 ≈ 3.0–3.2:1 on
  light tints) → amber-700 in 9 text usages (login error, admin note,
  appointments/predict/AuditLog/DoctorVerification/ModelRegistry
  status chips); RiskBadge Moderate text #B45309 → #A85008 (4.47 →
  4.89:1 on its tint). Line length (50–75ch): model-card Limitations
  list and the report's clinical-explanation + disclaimer paragraphs
  ran ~110–145ch → capped max-w-[70ch]. Welcome section prose ≈86ch =
  mildly over, NOT capped (approved design, not far beyond).
  Findings in the 4.5–7:1 band (pass, reported, not chased): brand-text
  4.75–5.63, muted-foreground 4.68–5.55, RiskBadge Low 4.54 / High 4.63 /
  Critical 5.44. Footer text on ink = 12.54:1 (exceeds 7).
- 1c0d53f fix: hallmark adoptions — overflow-x: clip on html/body,
  overflow-wrap: break-word + min-width: 0 on h1–h6, themed ::selection /
  caret-color / scrollbar-color from tokens; sidebar status dot lost
  its coloured glow shadow (his own no-glow rule).
- b57a552 fix: HONESTY — contact page was fully invented (support@
  medisight.ai, "Response within 2 hours", +1 (800) 700-6200 "Emergency
  Helpline", fake San Francisco HQ, "HIPAA Compliant Channel") and the
  About cards claimed "24 Hours Monitoring", "24/7 Uptime", support
  hours in EST, and a "1-800-MEDISIGHT" line. All replaced with real
  channels (contact@abdulwahid.me, the GitHub repo, the public model
  card) and README facts; the contact form is now honestly labelled
  "not connected yet — does not send anywhere" (same pattern as the
  MLOps Not Connected state). Placeholder names "Jane Doe"/"Dr. John
  Doe" → "e.g. Ayesha Khan".
- 07a4b52 fix: MotionProvider (MotionConfig reducedMotion="user") in the
  root layout — framer-motion now honours prefers-reduced-motion app-
  wide (his own standing rule; CSS reveals already had the fallback).

Already compliant, no change (evidence in the round report): item 131
(b) zero pure black/white as text/surfaces (ink #06141B); (c) no centred
body prose; (d) one filled primary per view everywhere audited (wizard,
verification, detail footer, booking). Item 125 nested radius: no true
violations — inner panels are consistently rounded-lg (10px) inside
rounded-xl/2xl containers, never flush copies of the parent radius.
Item 143 Layer-Cake: model-card headings alone tell the story.
Item 119/118 proportions on /welcome: not touched (approved design).

Hallmark diff (item 122; 42 rules assessed by a read-only subagent):
ADOPTED into code — invented-facts ban (#24, done above), overflow
guards (#17/#18), finish bundle ::selection/caret/scrollbar (#40),
reduced-motion enforcement (#35). REJECTED as conflicts with Abdul Wahid's
approved design voice — no-eyebrow rule (#54), tracked-caps ban (#67),
mono-labels ban (#64), accented-headline-word ban (#38iii — the
/welcome hero's brand-coloured second line is his approved device),
container widening to 1360px+ (#20), em-dash ban (#23). PROPOSALS for
Phase 7 — token-discipline sweep (raw Tailwind swatches/hex literals,
worst: signup page), transition-all sweep (25+ places + ModelRegistry
width animation → scaleX), tabular-nums on stat figures, contact form
(#25: wire it — contact_inquiries table already exists — or remove it;
WADI's decision), about-page icon-tile cards are the one interior
"three icon boxes" pattern left (vary when next touched), chat panels'
canned replies still contain emojis (strip at next edit), stop adding
new middle-dot meta strings.

## Contact form wired via Resend — 2026-10-25 (Abdul Wahid's decision: "resend wala kam kr do")

Commit `7cdc015` on abduIwahid/MediSight main (HEAD 07a4b52 → 7cdc015; remote verified via ls-remote + raw re-fetch). Gates on the pushed tree: tsc 0 errors, ESLint (src) 0 errors / 10 warnings (baseline), production build passes with `/api/contact` in the route table.

- **New route `POST /api/contact`** (`frontend/src/app/api/contact/route.ts`), codebase conventions (manual typeof/trim validation like the notify route; zod is in package.json but imported nowhere). Caps: name 100, email 254 + format check, department 120 (optional), subject 120, message 5000. Unconfigured email → honest 503 (nothing stored); Resend failure → honest 503. Success → `{ sent: true }`.
- **Email:** `lib/email.ts` gained `sendContactInquiryEmail()` on the existing plain-fetch Resend helper (now supports `reply_to`): from `MediSight <APP_EMAIL_FROM>`, to `CONTACT_TO_EMAIL || contact@abdulwahid.me` (his public email), reply-to = the sender, subject `[MediSight Contact] <subject>`, factual plain-text body. Also exported a generic `isEmailConfigured()`.
- **DB verdict: persistence WIRED.** `contact_inquiries` (migration 20260729182000: full_name/email/subject/message NOT NULL, department nullable, status default 'New') has an RLS insert policy `with check (true)` ("allow anonymous insert"; reads admin-only), so the route archives every inquiry through the caller's session client after a successful send. Best-effort exactly as specced: insert failure is logged server-side and the request still reports success; the email is the delivery of record. No migrations or policy changes were made.
- **Form UI:** controlled fields, real submit with Sending... state, success banner ("Your message has been sent. Replies go to the email address you entered above."), honest error banner surfacing the server message, not-connected label REMOVED. All copy English, no response-time promises.
- **Docs:** `CONTACT_TO_EMAIL` added to frontend/.env.example with a comment. README untouched (it never mentioned the form).
- **Note:** the app middleware requires sign-in for all non-public routes (only /api/ml/model-card is public), so anonymous curl to /api/contact 307-redirects to /login — same as /api/appointments/notify; the form only exists inside the dashboard, so this is consistent. End-to-end send verification happens at Phase 6 with a signed-in session.
- **Activation (Phase 6, with the other Resend envs):** set `RESEND_API_KEY` + `APP_EMAIL_FROM` on the deployment; `CONTACT_TO_EMAIL` is optional (default is his public contact@abdulwahid.me). Issue #25's wire-or-remove decision is now resolved: WIRED.

## Rename — MediSight → WhyRisk (executed 2026-10-25)

Abdul Wahid picked the final name **WhyRisk** on 2026-10-25 (single word,
English; the name is the question the product answers — SHAP explains
WHY the risk is high; whyrisk.vercel.app + github.com/whyrisk verified
free; whyrisk.com is a parked premium domain, the only same-name
business found is a small UK insurance broker — acceptably clean).
Code/copy rebrand executed the same day on abduIwahid/MediSight main,
HEAD 7cdc015 → 56da893, 3 commits: `97742cc` frontend (21 files),
`26767ca` ML service strings (5 files), `56da893` README + quickstart
scripts (3 files). 29 files, 74 insertions / 74 deletions (pure string
swaps; wording otherwise unchanged). Gates on the renamed tree: tsc
0 errors, ESLint 0 errors / 10 warnings (baseline), production build
passes; py_compile OK on the two edited Python files; remote head
verified and the working clone re-synced.

Changed: every user-visible brand string — layout metadata
title/siteName/OG/Twitter, sidebar + auth + report wordmarks, welcome /
model-card / about / contact / onboarding copy, chat assistant
identities + canned responses (API system instructions, AIChatPanel,
PatientChatPanel), print-report header + disclaimer, `llms.txt`,
README title + body + disclaimer, frontend README, email.ts (sender
display name "WhyRisk <…>", subjects "Your WhyRisk appointment" /
"Reminder: …", contact subject "[WhyRisk Contact]", sign-offs and body
mentions), ML service FastAPI title + root-endpoint welcome message
(the only brand strings the ML service returns — /predict, /explain
etc. response bodies carry no brand strings, grep-verified), train.py
docstring + generated evaluation-report title, and product-name
comments in .env.example files, Dockerfile, requirements.txt and the
quickstart banners.

Known leftovers (deliberate, do not "fix" piecemeal):
- Contact page GitHub link (href + text `github.com/abduIwahid/
  MediSight`) — must stay until Abdul Wahid renames the repo, or the link
  breaks; update it in the same step as the repo rename.
- MLflow experiment name `MediSight_Diabetes_Prediction` (train.py
  `set_experiment` + the README tracking table that documents it) —
  internal identifier; renaming it orphans the existing experiment
  history. Rename only as a deliberate migration, if ever.
- Internal identifiers: FastAPI logger `medisight-ml`, render.yaml
  service `medisight-ml-service`, README docker-tag example
  `medisight-ml`, `scripts/convert_pdf.py`'s local filename
  `MediSight_AI_PRD.pdf`, test docstrings (ml-service/tests,
  supabase/tests/rls.test.sql).
- Supabase seeds untouched by design: `seed-demo.sql` /
  `seed-demo-teardown.sql` (incl. "MediSight Hospital …" demo hospital
  names in the seed data itself, `@demo.medisight.local` logins,
  DEMO-2026-* markers), `seed_doctors_via_sql_editor.sql` and
  `ml-service/model_training/seed_db.py` demo accounts on the
  medisight.ai domain (incl. their shared seed password literal —
  never copied here).
- CI workflow display name "MediSight CI" (.github/workflows/ci.yml) —
  workflow files are never pushed via the connector; web-UI edit only,
  cosmetic.

Pending Abdul Wahid web-UI steps (bundle with the Phase 6 session): rename
the GitHub repo MediSight → WhyRisk (then update the contact-page link
above), delete the frozen old fork (MediSight-Healthcare-Platform),
and at Phase 6 import the Vercel project as **whyrisk** so the
deployment lands on whyrisk.vercel.app. Portfolio's project entry +
dead demo link also need the new name/URL at Phase 6.

## Brand assets wired — Signature Flow loader + Icon A (2026-10-25)

2 commits on abduIwahid/MediSight main, HEAD 56da893 → `bbe4d83`
(remote verified via list_commits + per-file blob-SHA match; clone
re-synced, tree clean). Gates on the final tree: tsc 0 errors,
ESLint 0 errors / 10 warnings (baseline, none new), production build
passes; compiled CSS verified to contain the keyframes + the
stroke-brand/fill-brand utilities, and icon.svg is emitted as a route
and referenced in prerendered HTML.

- **`cd053be` — PulseLoader + root loading UI.** New
  `frontend/src/components/shared/PulseLoader.tsx` (dependency-light
  server component, EmptyState pattern; props `showWordmark` /
  `showLabel`, both default true): the approved Signature Flow exactly
  as specced in ~/workspace/your_files/whyrisk-splash-final.html —
  viewBox 230×100, faint full trace at opacity 0.22, beat segment
  (pathLength 100, dasharray 16 84) travelling on a 2.4s loop, landing
  dot with the double-thump keyframes. Colours are NOT hardcoded: the
  paths use the `stroke-brand` / `fill-brand` Tailwind utilities (→
  var(--brand)), so the loader follows the theme toggle by itself —
  #2E7FA8 on light, #5EA8C9 on dark. Wordmark is Anton "WhyRisk." with
  the accent full stop; label is the mono uppercase "Loading".
  Keyframes `pulse-beat` / `pulse-dot` / `pulse-label` live in
  globals.css beside `reveal`; the existing prefers-reduced-motion
  block now also stops them, and the beat's dasharray is removed there
  so reduced-motion users see the full trace + dot statically.
  New `frontend/src/app/loading.tsx` centres PulseLoader
  (min-h-[70vh]) — no root loading.tsx existed before (only the
  dashboard skeleton, which keeps precedence for its segment).
- **`bbe4d83` — app icon.** `frontend/src/app/icon.svg` = Icon A
  verbatim (navy #0D2B3E tile, paper pulse, accent dot) via Next's
  file convention. The pre-existing `src/app/favicon.ico` is kept as
  the fallback (Next emits both links; layout.tsx has no explicit
  icons metadata, so nothing else changed). Note: `public/logo.png`
  (the old logo, still referenced by OG/Twitter metadata) is
  untouched — replacing it is a separate brand-asset decision.

## Phase 6 — LIVE (2026-10-25 evening, moved up at Abdul Wahid's instruction)

- **https://whyrisk.vercel.app is LIVE.** Vercel project `whyrisk`
  (prj_RL8x76oNtsixKXioQTglO4mlIROm), git-linked to abduIwahid/WhyRisk,
  root directory `frontend`; domain whyrisk.vercel.app attached to the
  project; production deployment from main @ d0f431d READY
  (/, /welcome, /login all 200).
- **Supabase hosted project:** WhyRisk, ref `[project-ref]`,
  ap-southeast-1 (Singapore), free NANO. URL
  https://[project-ref].supabase.co (public project URL).
- **Migrations route — IMPORTANT:** direct Postgres from the Muse VM is
  BLOCKED (the sandbox NAT kills the raw PG protocol: TCP opens, TLS
  dies, sslmode=disable gets terminated). `supabase db push --db-url`
  cannot work from here. The working route is the **Management API over
  HTTPS**: POST /v1/projects/<ref>/database/query for each migration in
  order + manual rows in supabase_migrations.schema_migrations. All
  17 repo migrations applied this way; 19 public tables verified.
- **Webhook settings moved to Vault (migration 18, commit d0f431d):**
  `app.settings.*` GUCs are platform-reserved on hosted Supabase — the
  SQL API returns 42501 permission denied even for ALTER DATABASE/ROLE.
  `notify_critical_prediction()` now reads `edge_function_base_url` and
  `service_role_key` from `vault.decrypted_secrets` first (GUC reads +
  local fallbacks kept). Both Vault secrets are set. `send-alert` edge
  function deployed via CLI with the access token.
- **Access token:** Abdul Wahid created a scoped token (Project = WhyRisk,
  Full access preset, 7-day expiry) on 2026-10-25 — expires ~2026-11-01.
  Value NOT recorded anywhere. Revoke it after Phase 6/7 use.
- **Vercel envs set (5):** NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy JWT), SUPABASE_SERVICE_ROLE_KEY
  (sensitive), NEXT_PUBLIC_SITE_URL=https://whyrisk.vercel.app,
  ML_SERVICE_API_KEY (fresh random, type `encrypted` so it can be read
  back once for the HF Space handoff). PENDING: ML_SERVICE_URL (after
  HF), GEMINI_API_KEY, RESEND_API_KEY + APP_EMAIL_FROM (activation).
- **Demo seed pack NOT applied to production** — its own header forbids
  it (staging-only; shared known password [shared demo password]). Migration-level
  seeds (hospitals, doctors) are in via the 17 migrations.
- **Remaining Phase 6:** retrain model artifacts on the VM
  (model.joblib + metadata.json → ml-service/models/production/;
  wrapper staged at ~/workspace/whyrisk-phase6/hf-space/), Abdul Wahid creates
  the HF Space + uploads bundle + sets ML_SERVICE_API_KEY/ALLOWED_ORIGINS,
  set ML_SERVICE_URL on Vercel + redeploy, logo.png web-UI upload
  (prepared file ~/workspace/whyrisk-phase6/logo-new.png — connector
  can't push binaries), GEMINI/RESEND activation, end-to-end test
  (signup → login → prediction), portfolio dead demo link →
  whyrisk.vercel.app. Leftover: old Vercel project
  `medi-sight-healthcare-platform` still exists (Phase 7 cleanup).

## Phase 6 addendum — live-fix round (2026-10-25 ~20:05)
- LOGIN FLIP-FLOP root cause: hosted project created with auto-expose OFF → API roles had NO baseline table grants → profiles RLS subquery on doctors threw 42501 → profile read returned null → both portal-mismatch branches fired. Fixed by migration 19 `20261025191000_baseline_table_grants.sql` (applied to hosted DB + pushed). Verified by replicating the browser flow (200, role super_admin).
- FONT DECISION (supersedes trio-as-headings): headings = Archivo app-wide (tailwind `heading` -> var(--font-sans)); Anton is DISPLAY-ONLY (landing hero, big numerals, wordmarks on landing). Cause of the "ajeeb bold": Anton has one weight; font-heading+font-bold synthesized faux bold on every h1-h6.
- BRAND LOCKUP: new shared `components/shared/BrandMark.tsx` (Pulse icon, tile + glyph variants, geometry = app/icon.svg). Replaced the leftover "M" letter tiles (welcome header, login panel) and the old /logo.png images (both sidebars); signup gained a lockup. logo.png now only feeds OG/Twitter metadata (new render still to be uploaded by Abdul Wahid via web UI).
- AUTH PAGES: Lucide Eye/EyeOff toggles on login+signup (native Edge reveal/clear hidden), Apple OAuth REMOVED (login+signup; code narrowed to Google), internal Supabase-settings note removed from login UI, Google button kept but provider DISABLED in Supabase (needs Abdul Wahid's Google Cloud client id/secret to enable). Feel pass: entry motion, field/tab hover states, primary-button depth (shared Button), pulse watermark on login panel.
- All pushed to main + production deployment READY; live HTML verified (pulse mark present, M tile gone). Gates: tsc 0, eslint 0 errors.
- Abdul Wahid's frustration noted: earlier phase reports were gate-based (build/tests) — the app had never run against a live backend before Phase 6, so surface defects only appeared at go-live. Lesson: any "complete" claim for UI work needs a live click-through first.

## QA Round 1 — hospital-admin persona addendum (2026-10-25 ~20:24, report 14/22)
New findings folded into the Round-1 fix backlog (beyond the consolidated list):
- **P1 fake-success admin controls:** admin/layout admits data_scientist to ALL admin tabs, but DB write policies allow only super_admin/hospital_admin → RLS filters updates to 0 rows, no error; UserManagementView/DoctorVerificationView update local state as if success. Fix: role-scope admin tabs to roles that can truly write + surface zero-row updates as failures.
- **P1 promote-to-doctor trap:** setting profiles.role='doctor' in User Management creates NO doctors-table row → middleware bounces the user to /pending-approval forever and they never appear in the verification queue. Fix: role→doctor must create/require a verification application (or block with a warning).
- **P1 privilege escalation:** prevent_self_role_escalation lets a hospital_admin set ANY target role incl. super_admin for same-hospital users; UserManagementView offers super_admin in the dropdown to all admins. Fix: hospital_admin cannot grant super_admin (DB guard + UI filter).
- **P1 audit trail gaps:** audit triggers attached only to patients/predictions/lab_results — NOT profiles/doctors, so role changes, hospital reassignments, doctor approvals/rejections leave no audit row. AuditLogView has an impossible SELECT filter (triggers can't log reads), never displays captured old/new values, hard-caps at 200 rows client-side. Fix: attach triggers to profiles+doctors, show old/new detail, drop SELECT filter, paginate.
- **P2 credentialing accountability:** doctor approve/reject is one-click — no confirm, no rejection reason, no reviewed_by/reviewed_at columns; license is a free-text field with nothing to verify against. Fix (min): record reviewer+timestamp, confirm dialog, rejection reason.
- **P2 no confirmations anywhere in admin** (role change fires on dropdown change; rejection one click) — add confirm dialogs for consequential actions.
- **P2 Model Registry is read-only over seed data;** empty state points to a "register a model" action that doesn't exist in MLOps (retrain only). Note as honesty/governance gap.
- **P2 admin counts don't reconcile:** Overview "Total Doctors" = profiles role='doctor' (incl. pending/rejected) vs Verification queue = doctors-table rows (extends backlog #18).
- **Feature gap:** no facility/hospital management UI (hospitals are read-only seed rows, yet assignment drives RLS + admin authority).
- Nits: settings subtitle claims "clinical role" is manageable (it's read-only); role naming inconsistent ("Admin" vs "super admin" vs "Admin Console") — one glossary.
- Credit confirmed: doctor gate works end-to-end; self-approval impossible (prevent_self_status_change); admin APIs properly super-admin-guarded; retrain proxy keeps ML key server-side.

## Features round — SHIPPED 2026-10-30 evening (all 8 approved items)

Full report: ~/workspace/whyrisk-qa/features-round-report.md. Commits 47d58bf → 4484016 on main.
- **Demo swap DONE:** 5 invented US patients deleted (before: 5 patients/5 predictions/15 vitals/1 alert); seed-demo.sql applied → 40 DEMO-2026-* patients, 80 vitals, 78 predictions, 36 explanations, 54 diagnoses (all labelled), 44 assignments, 18 appointments, 12 demo doctors, 4 demo hospitals, 20 demo auth users. Alerts 0 (seeded Critical predictions did NOT fire alert rows — known, accepted).
- **Rate limiting:** lib/rate-limit.ts, in-memory per-instance (honest scope: no shared store). predict 60/min/user, chat 20/min/user, guest-risk 10/min + 50/day per IP, contact anon 5/hr per IP. 429 verified LIVE on guest-risk (11th keep-alive call).
- **Migration 22** (patient_record_link): patients.user_id + own-record SELECT policies (patients/predictions/explanations/vitals). Backfill linked exactly 8 demo portal patients by phone match.
- **My Risk page** /patient/risk + sidebar + dashboard card: own latest score, severity pill, SHAP via ShapFactorList, honest empty states.
- **Add/edit vitals** on the chart (PatientDetailView): typed vital list with fixed units + plausibility ranges, .select()-verified writes, gated by canAddVitals (doctor/hospital_admin/super_admin = the actual RLS writers).
- **Migration 23**: doctors may INSERT follow-up appointments for assigned, portal-linked patients. Chart has a Book follow-up card (Confirmed status, appears in patient portal); staff appointments list resolves user→chart via patients.user_id and shows "View chart" only when the record is visible to that staff member.
- **Guest risk check** live on /welcome#check: real ML via /api/guest-risk (validated, IP-limited, returns only probability+severity, nothing stored); disclaimer + signup CTA in the result panel. Verified live: high-risk profile → 0.824/Critical.
- **Public contact page** /contact-us LIVE (middleware public + sitemap). /api/contact gained a rate-limited anonymous path (signed-in behavior unchanged: session email wins, archive insert only for signed-in). **BLOCKER: email delivery is NOT configured in production — RESEND_API_KEY / APP_EMAIL_FROM are unset on the whyrisk Vercel project, so BOTH contact forms currently answer the honest 503. Abdul Wahid must add those two env vars (his Resend account) + redeploy.**
- **Skeletons:** components/shared/Skeletons.tsx + loading.tsx for patients, patients/[id], appointments, alerts, analytics, doctors, patient dashboard/risk/appointments.
- **Privacy/Terms:** DRAFT ONLY at ~/workspace/whyrisk-qa/privacy-terms-draft.md (5 decisions listed at its top) — pages NOT shipped, per the copy rule.
- Still needs the parent's signed-in click-through: My Risk as a demo patient (patient4@demo.medisight.local), vitals add/edit as a demo doctor, follow-up booking, staff View-chart link, predict/chat 429s under an authenticated burst.

## Legal pages + hero sentence — BUILT 2026-10-30 night, PUSH BLOCKED ON APPROVAL CARDS
Abdul Wahid approved the privacy-terms draft + hero addition ~22:20 PKT ("han kr do"). Built in ~/workspace/.whyrisk-build on top of 4484016; tsc clean + full `npm run build` PASS (/privacy + /terms in route table).
- NEW: src/app/privacy/page.tsx, src/app/terms/page.tsx, src/components/shared/LegalPage.tsx (shared public chrome mirroring /contact-us; footers carry Privacy/Terms links).
- Draft decisions resolved: retention = draft's own wording as a "How long we keep it" section (no invented period); deletion contact contact@abdulwahid.me (as drafted); governing law Pakistan (as drafted); age line added to Terms §2 from the draft's decisions note (adults 18+, or patients registered by their care team); operator kept as "its maintainer" (no personal name, as drafted). "Last updated: 30 October 2026" on both pages.
- Signup consent: the draft had no literal checkbox wording → required checkbox "I agree to the Privacy Policy and Terms of Use" (links to both pages) gating handleSignup with an honest error. Google OAuth button is disabled (GOOGLE_OAUTH_ENABLED=false), so there is no consent bypass today.
- Middleware: /privacy + /terms added to isPublicRoute. Sitemap: both added (2026-10-30, priority 0.5). Footer Privacy/Terms links added on /welcome, /contact-us, /model-card + the legal pages.
- ITEM B DONE in code: hero sentence now "…patients use the portal for appointments, their profile and their latest risk assessment."
- PUSH STATE: remote main still 4484016 (verified by ls-remote + raw 404s). Push script: ~/workspace/whyrisk-qa/push_batch.py (3 batches). Every connector push attempt is stuck behind GitHub push_files approval cards in the parent WhatsApp chat (mine: connector-65d2e85e-d6b8-4c65-ba9a-29b2ae0372d1 from 17:24 UTC and connector-56b107c9-eece-47de-bf11-6c5ae148bb8b from 17:39 UTC); while one equivalent write awaits approval, new attempts fail with "an equivalent connector write is already running". Two OTHER pending cards (connector-7b316e12, connector-992d6c97) belong to the separate demo-login seed fix — not this task.
- NEXT (once cards are approved): confirm remote advanced past 4484016, wait for Vercel deploy, live-verify /privacy + /terms 200 + shipped copy, footer links, signup consent control, new hero sentence on /welcome; then flip this note to SHIPPED.

## Demo-login fix — ROOT CAUSE FOUND + FIXED LIVE 2026-10-30 night
Symptom: every seeded demo login (patient4, dr.ayesha.rahman, all 20) failed on the live site with the generic "Sign-in failed. Please try again."; the vault admin test@abdulwahid.me worked. The features-round note above blamed "seed inserted auth.users rows directly via SQL without the full GoTrue rows (e.g. auth.identities)" — that suspicion was HALF the cause; there were TWO defects:
1. **No auth.identities rows:** seed-demo.sql inserted auth.users only. SQL check: demo_users_with_identity = 0/20 (admin = 1). GoTrue email sign-in needs the provider='email' identity.
2. **NULL token strings (the subtler one):** the seed's auth.users INSERT omitted the token columns, and on this project they defaulted to NULL, not '' — demo rows had email_change + email_change_token_new (+ confirmation/recovery token columns) = NULL vs admin ''. After identities were inserted, sign-in advanced but GoTrue returned HTTP 500 `unexpected_failure` / "Database error querying schema" — GoTrue scans those columns as plain strings and chokes on NULL. Everything else matched the working admin row (email confirmed, bcrypt $2a$ password present, aud/role authenticated, not banned/deleted; all 20 profiles exist with correct roles).
FIX APPLIED LIVE (Management API SQL, demo users only, UUIDs + [shared demo password] password untouched, admin untouched):
- INSERT INTO auth.identities — one 'email' identity per demo user, shaped exactly like GoTrue's own (provider_id = user id text; identity_data {sub, email, email_verified:false, phone_verified:false}).
- UPDATE auth.users SET confirmation_token/recovery_token/email_change_token_current/email_change_token_new/email_change/phone_change/phone_change_token/reauthentication_token = COALESCE(col,'') for demo users.
PROOF (Auth REST, anon key, POST /auth/v1/token?grant_type=password): patient4@demo.medisight.local → HTTP 200 + access_token, user id d0000000-0000-4000-8000-000000000204 ✓; dr.ayesha.rahman@demo.medisight.local → HTTP 200 + access_token, user id d0000000-0000-4000-8000-000000000101 ✓. Final counts: 20/20 demo users have email identities, 0 demo users have any NULL token column. NOTE: this proves AUTH-level sign-in; the in-browser click-through checks (My Risk as patient4 etc.) still need one browser re-run now that logins work.
SEED FILE: supabase/seed-demo.sql gained section 2b (same UPDATE + identities INSERT, NOT EXISTS-guarded) + a warning comment in section 2, so a re-seed can't recreate the bug. Local commit 5285cb9 (detached HEAD on 4484016, .whyrisk-build). REMOTE PUSH NOT LANDED (verified 3 ways after multiple attempts: list_commits head, raw-file sha256, get_file_contents blob e5ed0e5e — all still the old version, remote main still 4484016): the ~124 KB single-file push_files call repeatedly killed the subagent's exec session, and one background attempt exited 0 with a garbled response body but provably changed nothing — do NOT trust exit-0 alone for this push. New content sha256 = 8ca53b9e7f1d8d6abe9b517f3dd2d9c5e1c9b731b389efe177c419469712364c. Parent routes to land it: retry push_files from the parent session, fold the file into a parent push batch, or upload via the GitHub web UI; verify by the raw hash afterwards. (The live DB fix does NOT depend on this push — only future re-seeds do.)
LESSON (general): direct-SQL auth.users seeding must ALWAYS add (a) auth.identities email rows and (b) '' for every token string column, or use the Auth Admin API instead.

## My Risk "no factors" — ROOT CAUSE = PAGE QUERY BUG, FIXED IN WORKTREE 2026-10-31
Browser re-verification (2026-10-31 ~01:45) found patient4's My Risk showing 84%/Critical but "No factor contributions were recorded for this prediction." The assumed cause (missing explanation row for his latest prediction) was WRONG.
- DIAGNOSIS (live SQL, ref [project-ref]): explanations link 1:1 via explanations.prediction_id → predictions.id; factors live in explanations.shap_payload (jsonb array of {feature,value,impact}); there is NO shap_values column on the table. Patient4's latest prediction d0000000-…-004006 (0.8363, Critical, 2026-10-21) HAS explanation d0000000-…-005004 with 16 factors (top: GenHlth 4.0 +0.4903, Age 7 +0.2213, HighBP 1 +0.1734, PhysActivity 1 −0.1442, BMI 36.6 +0.124). ALL 8 portal-linked patients' latest predictions have explanations (8/8); ALL 36 assessed demo patients' latest predictions have one (36/36). Overall live counts: 79 demo predictions (78 seeded + 1 live admin-run prediction for DEMO-2026-0001 on 2026-10-30, which carries a real 21-factor explanation), 37 explanations, 42 without — and every one of the 42 is a non-latest history prediction (seed pack stores latest-per-patient only, by design).
- ACTUAL BUG: frontend/src/app/patient/risk/page.tsx queried .select("shap_values") — a column that does not exist. PostgREST returns HTTP 400 code 42703 "column explanations.shap_values does not exist", supabase-js yields data=null, the page ignored the error, factors stayed [] for EVERY patient. Staff pages were unaffected (they correctly read shap_payload). 
- FIX (worktree ~/workspace/.whyrisk-build, NOT yet pushed — sits alongside the un-pushed legal-pages batch, parent to land): page.tsx now selects shap_payload, checks Array.isArray(explanation.shap_payload), and console.errors a failed explanation load like the page's other queries. tsc --noEmit PASS. One-file diff, no other files touched.
- PROOF at data layer as the patient (script ~/workspace/whyrisk-qa/my-risk-fix/prove_patient.py; anon key via Management API keys endpoint, value never printed): patient4 password-grant → HTTP 200; GET /rest/v1/patients as patient4 → only DEMO-2026-0004 (RLS); predictions → latest 004006 0.8363 Critical; GET explanations?select=shap_payload&prediction_id=eq.004006 → HTTP 200, 1 row, 16 factors + clinical_explanation; same query with select=shap_values → HTTP 400 / 42703 (the pre-fix failure, reproduced). Remaining: parent's browser re-check after the fix deploys.
- DELIBERATELY NOT DONE — backfilling the 42 history explanations: (1) their per-prediction feature rows were never stored (seeded predictions have predictions.features = NULL; patient demographics hold no BRFSS fields), so there is no stored feature row to run; (2) validation run (venv ~/workspace/.tools/venv-train, production LightGBM at ~/workspace/medisight-p7/ml-service/models/production/) reconstructing patient4's latest vector from its stored explanation + FEATURE_DEFAULTS for the 5 omitted features gave fresh prob 0.7912 vs stored 0.8363 and divergent SHAP (Age fresh −0.0513 vs stored +0.2213; HighChol fresh −0.3682 vs stored 0.0) — the seed header itself declares seeded predictions/explanations "illustrative stored examples … not live model output", and no generator script exists in the workspace. Inserting model runs over invented/default features would attach factors inconsistent with the stored scores — refused under the honesty rule. Zero explanation rows were inserted; no stored predictions changed.
- SEED NOTE ADDED (worktree seed-demo.sql header, EXPLANATION COVERAGE paragraph): latest-only coverage is by design in this pack; a future re-seed wanting factors on every prediction must generate per prediction AND store predictions.features snapshots; stored column is shap_payload, not shap_values. (Seed file's GitHub push remains the separate known-blocked item — not attempted.)
- Working files: ~/workspace/whyrisk-qa/my-risk-fix/ (q1–q6 SQL, validate_model.py, prove_patient.py, prove_step6b.py).

## 2026-11-01 nightly consolidation note
- /privacy STILL 404 live (browser check 31 Oct 07:16) — legal/hero batch not shipped. Approval-card count CORRECTED: 2 legal/hero cards pending (connector-65d2e85e…, connector-56b107c9…); the 2 demo-login seed-fix cards TIMED OUT (plus 2 later attempts) and need fresh approval on retry. Remote main still 4484016. My Risk shap_payload one-file fix still unpushed in the worktree, rides with the seed batch, then needs deploy + patient4 browser re-check.
- Seed-push size lesson confirmed by the Study Hub round: single --arguments-json caps at ~128 KB — the ~124 KB seed-demo.sql push failures belong to the same class; split the file or use the GitHub web UI, and verify by raw sha256 afterwards.

## 2026-11-01 — Header nav fix SHIPPED (commit 45f4352, remote main advanced past 4484016)
- Abdul Wahid's screenshot + order (2026-11-01 ~09:42): landing nav links wrapped onto two lines mid-header and the "Create your account" CTA clipped at the right edge. His spec: links in ONE horizontal line, slightly smaller font, centred, responsive like the rest of the site.
- Fix (welcome/page.tsx): header row now flex-wrap — brand + CTA on row 1; nav takes its own full-width row on mobile (order-3, justify-center, whitespace-nowrap, overflow-x-auto safety, text-[12.5px], gap-3.5/4); from md up the nav is inline again, flex-1 + justify-center (centred between brand and CTA), text-[13px]. CTA smaller on mobile (px-3 py-2, text-[13px]) so it never clips. Anchored sections' scroll-mt bumped 24→28 on mobile (taller header).
- Same no-wrap/smaller treatment applied to the secondary public headers: model-card (live, pushed in the same commit) and — staged in the .whyrisk-build worktree only, riding the legal batch — contact-us/page.tsx + components/shared/LegalPage.tsx.
- Pushed as an ISOLATED commit from a fresh clone (~/workspace/.whyrisk-hdr) so the pending legal batch stayed untouched: 45f4352, verified byte-for-byte by raw.githubusercontent read-back; Vercel production deploy dpl_Cx1trE9 READY; live HTML on whyrisk.vercel.app serves the new nav classes.
- IMPORTANT for the pending batches: the .whyrisk-build worktree copies of welcome/page.tsx + model-card/page.tsx contain BOTH the legal changes and these identical header edits, so the legal batch push (push_batch.py) supersedes 45f4352 cleanly — no rebase needed. My Risk fix + seed file state unchanged.

## 2026-11-01 — Doctor directory outage FIXED (commit 280a4f6) + AI chat key gap confirmed
- Abdul Wahid's screenshots (~09:53 PKT): /doctors showed "The doctor directory could not be loaded"; AI Assistant replied with the "Built-in template response" badge.
- ROOT CAUSE 1 (directory): PostgREST PGRST201 — `doctors` has TWO FKs to `profiles` (user_id + reviewed_by, the latter from the Oct 30 migrations 20/21; runtime errors start 2026-10-30T17:17Z), so the bare `doctors!inner(status)` embed in profiles queries became ambiguous and PostgREST refuses it (HTTP 300). Runtime-log proof + live reproduction as demo doctor.
- ROOT CAUSE 2 (same flows, silent): doctors-table SELECT RLS only allowed own row + admins, so the !inner embed filtered to ~nothing for doctors (1 row = self) and patients (0 rows — booking list empty). Profiles already had a "public doctor directory read access" policy; doctors table lacked its twin.
- FIXES: (a) code — embed disambiguated to `doctors!doctors_user_id_fkey!inner(status)` in doctors/page.tsx, predict/page.tsx, patient book/page.tsx (×2); pushed isolated from .whyrisk-hdr as commit 280a4f6, raw read-back verified, deploy READY. (b) DB — new policy "Doctors: public directory read access" (SELECT, authenticated, status='approved') via Management API; role tests after: doctor → 12, patient → 12 approved doctors (data: 12 approved of 12 doctor profiles).
- AI CHAT: GEMINI_API_KEY is NOT set on the whyrisk Vercel project (env keys verified 2026-11-01: ML_SERVICE_URL, ML_SERVICE_API_KEY ×2 targets, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SITE_URL — no GEMINI, no RESEND). Chat template mode is the designed degradation; activation = Abdul Wahid adds a free AI Studio key (use the "Default Gemini Project" — the 2026-10-24 lesson: fresh-project keys got 403 denied) as GEMINI_API_KEY + redeploy. Model in route: gemini-flash-latest (fine).
- Also seen in runtime errors: 2× AuthApiError "Invalid Refresh Token: Already Used" in middleware (2026-11-01T04:50Z) — multi-tab token rotation noise, not acted on.

- VERIFIED LIVE 2026-11-01 ~10:05 PKT: browser signed in as test@abdulwahid.me (SUPER ADMIN) → /doctors loads clean, 12 doctor rows with hospital/fee/contact, no error banner. Directory + booking + predict doctor lists fixed end-to-end.

- FOLLOW-UP (same morning): Abdul Wahid added GEMINI_API_KEY (Production, 05:08 UTC) + redeployed, but gemini-flash-latest kept returning 503 from Google (two live attempts logged). FIX SHIPPED (commit 3319a77): /api/chat now walks a model fallback chain — GEMINI_MODEL env override → gemini-flash-latest → gemini-3.5-flash → gemini-2.5-flash → gemini-2.5-flash-lite — retrying on 404/429/5xx, failing fast on 400/401/403; per-model status logged. VERIFIED LIVE ~10:21 PKT: runtime log shows flash-latest 503 at 05:21:13Z and the same request still returned a real, badge-free answer — fallback answered. AI Assistant is LIVE.

- RESEND ACTIVATED 2026-11-01 ~10:27 PKT (Route A): Abdul Wahid created the Resend account on his personal email (his personal email) + API key (All domains, Sending access), and set RESEND_API_KEY + APP_EMAIL_FROM=onboarding@resend.dev + CONTACT_TO_EMAIL=his personal email on whyrisk (Production) + redeployed (READY 05:29Z). Contact-form test by Muse ~10:30 PKT: UI success ("Message sent — your message has been emailed to the maintainer"), no [email] failure/skip lines in runtime logs → /api/contact no longer 503s; contact + appointment emails are live. Final inbox-delivery sighting by Abdul Wahid still pending at write-time. Route B (verify abdulwahid.me at Namecheap DNS → APP_EMAIL_FROM=contact@abdulwahid.me) remains the optional professional upgrade.
- WhyRisk SEO: sitemap.xml (3 public URLs), robots.txt, llms.txt all live (checked 2026-11-01). GSC not yet created for whyrisk — Abdul Wahid to add property + send Muse the HTML-tag content value; then tag + verify + sitemap submit + Bing import.

- Delivery CONFIRMED 2026-11-01 ~10:33 PKT: Abdul Wahid screenshotted the test email in his personal inbox ("[WhyRisk Contact] Other", 10:30 AM) — Resend round fully closed.
- GSC for whyrisk: verification meta added via layout metadata (commit c702339, deploy READY, tag confirmed live in homepage HTML 2026-11-01 ~10:34 PKT). Remaining on Abdul Wahid: click Verify in Search Console → submit sitemap.xml → Bing import from GSC.

- OG card redesign for WhyRisk + Portfolio: DROPPED by Abdul Wahid 2026-11-01 ("chor do") after 3 iterations (his corrections: use each site's own colours, then its own fonts, then composition — v4 WhyRisk finally matched the site's own OG layout). The live generated OG cards stay as-is; do NOT re-propose redesigning them. Lesson kept in brain/general/frontend-preferences.md (per-site brand rule). Drafts remain in ~/workspace/og-cards/ if he ever returns to it.

## 2026-11-02 consolidation note (nightly pass)
- 1 Nov rounds, all live-verified unless noted: header nav fix (commit 45f4352; desktop-verified, ~390px phone glance still owed by Abdul Wahid); doctor directory outage fixed (commit 280a4f6 — PGRST201 disambiguation `doctors!doctors_user_id_fkey!inner(status)` in 4 places + new "Doctors: public directory read access" RLS policy; browser-verified 12 doctors as SUPER ADMIN); Gemini key added by Abdul Wahid ~10:08 + chat fallback chain shipped (commit 3319a77; live test showed flash-latest 503 absorbed, real badge-free reply); Resend Route A activated + inbox delivery confirmed (~10:33, #28 CLOSED; Route B optional); GSC property live + tag commit c702339 + sitemap submitted ("Couldn't fetch" = fresh-property lag, do NOT resubmit; only Bing import remains); OG-card redesign iterated 3x then DROPPED by Abdul Wahid ("chor do") — do not re-propose.
- Remote main is past c702339 (no longer 4484016). STILL PENDING: legal/hero batch (/privacy last live-checked 404 on 31 Oct 07:16 — re-check owed), seed-push re-request (cards timed out), demo-patient browser re-check (checks 3/5), My Risk shap_payload fix deploy. Lesson: migrations 20/21's second FK (`reviewed_by`) makes bare `doctors` embeds ambiguous — always disambiguate + check RLS alongside syntax.

## 2026-11-02 — Font switched to Quicksand (Abdul Wahid's pick) + landing "boxes" redesign ordered
- Abdul Wahid reviewed font preview sheets (13 memory fonts + 10 light serifs + Quicksand), approved a full-site Quicksand MOCKUP ("han ye sai hai acha lag rha") → implemented exactly as mocked: layout.tsx loads Quicksand for --font-sans (400–700), --font-display (700), --font-mono (500/600); RiskTrendChart SVG labels JetBrains Mono → Quicksand. Anton/Archivo/JetBrains Mono retired (supersedes the 2026-10-25 lock).
- Push 1bc97d9 FAILED on Vercel: the staged layout.tsx was a half-edited copy (new consts, old html className) — a parallel edit/copy race. Reproduced from the commit tarball (ESLint unused-vars), fixed by re-staging with sha256 equality, push 6baa96a, Vercel success, live CSS verified __Quicksand only.
- SAME DAY: Abdul Wahid's landing feedback (4 phone screenshots): "boxes hi boxes han, aik hi cheez repeat" → ordered an editorial de-boxed redesign with LEFT→RIGHT sliding reveals, "jo ho skta hai sirf wo" (feasible subset, honestly reported). Build delegated (welcome/page.tsx + GuestRiskCheck.tsx; copy/form logic frozen); parent pushes + live-verifies.
- REDESIGN SHIPPED + LIVE-VERIFIED 2026-11-02 (commits 4fac7c3 redesign, 29adf9f header opacity fix, ed01f41 SlideIn strengthening): SlideIn.tsx (framer-motion whileInView, x -76→0, 0.8s, once) wraps all landing sections; StatsBand = ONE navy panel, hairline dividers, count-up 0.8222/1/21 (SSR renders finals); AnimatedFactorBars grow hero SHAP bars; GuestRiskCheck de-boxed with 01–04 StepHeadings (form logic byte-identical); #how = 01/02/03 editorial rows; #scope = open 2-col hairline lists, pills kept; inside-app preview in browser-chrome frame; honesty banner = slim ribbon (3px amber rule + icon, no fill). Copy frozen throughout; header fix + legal hero sentence + footer links preserved (welcome push also carried the legal hero sentence + footer links live — the rest of the legal batch still pending).
- Live-check findings folded in: sticky header was bg-background/95 → text bled through on scroll (also visible in Abdul Wahid's own 15:14 screenshots) → now fully opaque + soft shadow, re-verified PASS at 5 scroll stops. SlideIn at -44px/0.65s was too subtle to observe (only fade caught) → strengthened to -76px/0.8s, re-verified PASS on #how + #scope (mid-flight captures ~35–40px offset + pale→dark). NOT verified: phone ~390px (check browser viewport fixed at 1919px) — Abdul Wahid's own phone is the check, as with the header item.
- Judgment calls kept: guest RESULT panel stays a framed card (single artifact, like hero card); stats band sits in the content column, not 100vw bleed (mobile overflow safety).
- LEGAL BATCH SHIPPED + LIVE-VERIFIED 2026-11-02 (push_batch.py batches 1–3, commits f33a1df LegalPage+privacy+terms, ff7279c middleware/sitemap/contact-us/model-card (welcome was content-identical, skipped by connector), d210ed7 signup consent): /privacy + /terms return 200 and render with "Last updated: 30 October 2026"; signup shows the required "I agree to the Privacy Policy and Terms of Use" checkbox; contact-us + model-card footers carry Privacy/Terms links — browser check 4/4 PASS. NOTE: push_batch.py prints a false "UNCONFIRMED" (its success-string check misses the escaped JSON) — always verify by commit API instead. Pre-push audit: no remote-only lines in middleware/sitemap/model-card/signup; contact-us remote-only lines were the old header being replaced by the fixed one.
- MY RISK FIX SHIPPED + VERIFIED 2026-11-02 (commit ac42d33): patient/risk/page.tsx shap_values → shap_payload (+ error logging). Browser re-check as patient4@demo.medisight.local: My Risk shows 84% Critical WITH factors (General health 21.5%, Age 18.5%, High BP 15.5%, Physical activity 9.6% reduced) — the "No factor contributions" message is gone. The 42 history predictions remain explanation-less by design (honest backfill impossible — features never stored); Abdul Wahid's keep-vs-reseed decision still open.
- 2026-11-02 (later): Abdul Wahid ordered the SAME premium treatment for the signed-in interior (landing's hovers/animations/transitions), suggestions-first. Plan presented (SlideIn reveals inside, count-up stat cards, animated SHAP bars everywhere, hover lifts, micro-transitions; NO de-boxing of data UI; order: dashboards → patients/detail/predict → lists → auth polish). Awaiting his go.
- SEED LANDED 2026-11-02 (commit 97ddcfde): supabase/seed-demo.sql (125,332 B) pushed via the file-based push-files route (source-dir + paths file) — the old --arguments-json cap no longer applies on this route. Verified byte-identical on GitHub (sha256 d03e79ef…). Work order now: Phase 7 hardening, then the 42-history decision.
- PHASE 7 #150 DEPENDENCY AUDIT DONE 2026-11-02 (report: ~/workspace/whyrisk-qa/dep-audit-2026-11-02.md): npm audit endpoint is BLOCKED from this VM (403 policy_denied on registry.npmjs.org quick-audits) → audited via OSV.dev instead: 730 packages, 126 advisory hits. Interpretation: the deployed app's real exposure concentrates in next@14.2.35 (26 advisories, several C:H/I:H; OSV lists fixes only in 15.5.x/16.x → remediation = Next 15 upgrade, a Phase 7 project of its own, NOT a patch). Most other hits are transitive/tooling chains (MCP SDK, hono, undici, systeminformation — dev-tooling side of the lockfile) plus build-time postcss and availability-only zod. No exploitation evidence; app sits behind Supabase auth + Vercel. Remaining Phase 7: Next 15 upgrade evaluation, UptimeRobot (his signup), error tracking, Vitest, PentAGI (local/staging), stale Vercel project delete. ADDED 2026-11-02 (from reel #204, @lincolndevine "15 tells your app was vibe coded"): double-submit audit — verify auth/contact/prediction submit buttons disable while submitting (tell #9); button height h-10 (40px) → 44px Fitts floor (tell #4, already Step C debt).
- DESIGN REFERENCE filed 2026-11-02 (saved-references #198): Onix Theme "VitalAI" medical template (onixlab.studio) — calm trust-first wellness design: green gradient hero, floating live-data cards, reports with mini-charts, cream body. Transferable to WhyRisk = composition patterns only (floating cards over hero, calm whitespace, trust tone); palette stays locked Midnight Clinical + Quicksand; no cloning (his rule).
- INTERIOR PREMIUM STEP 1 (dashboards) SHIPPED 2026-11-02 (commit 310c9cd7): SlideIn direction prop (left|up), shared CountUp, staff/admin/patient dashboards + both sidebars (stagger-in, hover indicators/lifts). Live check (demo accounts): functional PASS everywhere (staff totals 10 patients / 12 doctors / 19 predictions; Patients page consistent; sign-outs fine). Motion evidence partial: stat-card fade caught mid-flight; count-up/rise/stagger directions finished before screenshots (mount-triggered, 0.35–0.8s); HOVER effects not observed in two direct tests (sidebar indicator, stat-card lift) — inconclusive (automation hover vs genuinely subtle 4px lift); Abdul Wahid's own eyeball check is the decider (folded into his phone-check item). DEMO ACCOUNTS (from seed-demo.sql, do not guess again): patients patient1–8@demo.medisight.local; doctors dr.<name>@demo.medisight.local (fictional demo personas); password [shared demo password] for all. There is NO doctor1@ account. NOTE: ~/.whyrisk-vercel-token no longer exists in this VM — Vercel deployment polling via that file fails; use the vercel connector or live checks.
- TOOLING NOTE 2026-11-02: the Vercel MCP connector's OAuth scope does NOT cover Abdul Wahid's team (list_deployments → 403, needs authorize_team_access + his approval) — do not burn turns on deployment telemetry; GitHub commit-on-main + live user-level checks are the verification route.
- ROOT-CAUSE + RECOVERY 2026-11-02 (evening): the Step-1/hover "not live" mystery was a PATH BUG in my pushes — commits 310c9cd7/fc5c13c4/a235195e wrote to a root-level src/ tree instead of frontend/src/, so Vercel (root dir = frontend) built none of it while reporting success. Proven by commit file-list inspection + live-CSS marker counts. Recovery commit 22565279 re-landed all 15 files (Steps 1+2 + hover strengthening) at frontend/ paths; live CSS hash changed (afbd6bda → 57667cf2) with all utilities present; final browser verification PASSES: stat-card hover lift+shadow, sidebar indicator bar (6×28px), quick-action tile hover (icon invert + shadow), patients-list entrance fade + row hover, patient-detail staggered reveal, prediction-detail count-up CAUGHT mid-flight (10.9→20.2→29.2→29.8%), My Risk final state correct (84% Critical, centre-line bars). NOT OBSERVED (screenshot timing only): reveal directions, My Risk count-up/bar mid-flight, border tints. A stray root src/ tree (15 files) remains in the repo — harmless, cleanup pending. Step 2's ShapFactorList gained an opt-in animate prop (signed bars grow from the centre line; print report stays static by design).
- STEP 3 SHIPPED + VERIFIED 2026-11-02 (commits e7a1120 + fix 1e57161): appointments (staff+patient), alerts, doctors, analytics got the Step 1/2 motion language (headers left, lists/panels up staggered, CountUp on analytics KPIs — count-up caught mid-flight live 9→19, 23.1%→47.7%; all 6 chart panels fine; filters/tabs/booking form verified working). Doctor-detail About card now equal height with Profile card (h-full chain added to its Step-3 wrapper; spot re-check PASS). NOT VERIFIED: alerts row stagger — Dr. Zainab's account has zero unacknowledged alerts, nothing to observe; page loads fine. FOUND NIT (pre-existing, NOT Step 3): patient appointments render "Dr. Dr. Ayesha Rahman" — stored doctor names already carry the "Dr." prefix and the UI prepends another. Fix as its own tiny round (find all render sites first; normalise in one place).
- STEP 4 SHIPPED + VERIFIED 2026-11-02 (commit 98989a8) — INTERIOR PREMIUM PASS COMPLETE (Steps 1–4): login/signup/forgot/update-password + staff settings + patient profile got the same motion language (brand blocks left, form cards up, portal tabs tap-press, settings cards staggered, notification rows hover). Live check 5/5 PASS: login portal-tab switching intact, signup consent checkbox + /privacy + /terms links intact and unsubmitted, settings + patient profile render fully with nothing saved/toggled. Entrance direction again not capturable in stills (fade frames caught) — same SlideIn system verified in Steps 1–3. Remaining WhyRisk queue: Dr. Dr. doubling fix, stray root src/ cleanup, Bing import (Abdul Wahid), Phase 7 remainder (Next 15 upgrade is the big one).
- 'DR. DR.' FIX SHIPPED + VERIFIED 2026-11-02 (commit 3393a9b): new shared helper src/lib/doctor-name.ts (doctorDisplayName — strips any existing prefix, returns exactly one "Dr. ", "" for empty so caller fallbacks apply) applied at all prepend/render sites: patient appointments (+cancel text), patient dashboard, booking picker, lib/email.ts (3 appointment emails), DoctorListView, DoctorDetailView, predict picker. Stored names DO carry the prefix in seed data; real signups may not — helper normalises both. Live spot-check PASS: dashboard card, appointments Upcoming/Past, booking picker and doctors directory all show a single "Dr.".
- NEXT 15 UPGRADE EVALUATION 2026-11-02 (from dep-audit #150 follow-up): current next 14.2.35 + react ^18. Breaking-change surface is SMALL and mapped: sync `params.` access = 22 hits in 4 dynamic page files (doctors/[id], patients/[id], predictions/[predictionId] + report); searchParams in 6 files (login, queue, patients, 2 layouts, auth/callback); next/headers cookies() concentrated via the Supabase server helper (10+ importing pages, fix centralises in lib); 13 route handlers (1 dynamic: admin/users/[id]; GET caching default change = low impact, data comes via Supabase SDK not fetch cache). Official @next/codemod automates most async-API transforms; React can stay 18 for the jump (19 as a separate later step). Plan: one focused round — codemod + manual pass + FULL click-through verification (auth callback + login are the sensitive paths). RECOMMENDATION: post-midterm window; production stable on 14.2.35, advisories have no exploitation evidence — do not freeze the app during exam week.

## 2026-11-02 (evening) — Widening Step A shipped + verified; Step B awaiting photo pick
- Step A commit **edab438e**: exactly the 40 staged files (content-diff vs GitHub main proved the set; the local git index shows phantom diffs — verify pushes by content/API, not git status). Live check at 1919px: main area ≈1,615px wide (was 1280 cap), hero panel 1,536px, 5 stat cards full row, patients table full width, analytics KPIs ~365px each, NO horizontal overflow, patient shell equally wide. PASS all.
- Imagery taste (Abdul Wahid, 2026-11-02): for the product site he wants REAL premium photography, not AI-generated (4 AI hero candidates rejected). Source from Unsplash/Pexels (free license, high-res). 6 real candidates R1–R6 downloaded to ~/workspace/whyrisk-qa/hero-real/ (R1 Unsplash tablet duo = my pick, R2 imaging screens, R3 Pexels chart doctor, R4 doctor+nurse, R5/R6 masked corridor teams). Step B = landing widening (cap 1400 + fluid hero) + his picked photo as responsive hero background; build only after he finalizes.

## 2026-11-02 evening — Step B imagery, de-slop pass, theme-alpha ROOT FIX
- Step B (de956cf0): real-photo backgrounds (F1 hero ECG, F3 #how flasks, F7 #check CT, F2 footer pills, F5 auth stethoscope, F4 About vials). Contrast checks FAILED repeatedly on #how/#check/login/About.
- De-slop (507edbef, 66 files): scanner 63/100 → all 9 patterns removed site-wide (counts in the builder report, whyrisk-qa/deslop-fix).
- Round 3 (d1141518): login navy tint bracket syntax; #how photo pulled; hero callout solid backing — 3 surfaces PASS.
- ROOT FIX (b5a2aa18): tailwind theme colours lacked <alpha-value> → all theme-colour opacity utilities were dead CSS app-wide (the real cause of the contrast saga; also bare /92 not in scale). Vars → RGB triplets, config → rgb(var(--x) / <alpha-value>), chart hsl(var()) → rgb(). Full-site live check PASS (19:19 PKT): auth photos faint, #check title clean, analytics charts + SHAP in colour, no regressions. Scanner post-fix score unverifiable (tool caches receipt 1E389F).
- Standing lessons: prove critical tint classes exist in compiled CSS; photos that fight text twice get pulled; audit-first (Colors→Typography→Spacing→Components) is the Step C Phase 1 frame.
- Step C decisions (Abdul Wahid, 2026-11-02 19:29 — "meri taraf se all permissions allow han"): plan defaults LOCKED — hero stays split (center headers/CTAs only), transitions public+auth only, tilt marketing cards only, scroll-ECG = sticky strip under landing header, toasts OUT. Full go-ahead for C1→C7, each step build → push → file-list verify → live check before the next. Phase 1 analysis: ~/workspace/whyrisk-qa/step-c/phase1-analysis.md.

## Step C — Motion & Alignment (SHIPPED + LIVE-VERIFIED 2026-11-02 evening)
Plan: ~/workspace/whyrisk-qa/step-c/phase1-analysis.md (audit Colors/Typography/Spacing/Components, then C1-C7). Locked: hero stays split; transitions public+auth only; tilt on marketing cards only; ECG = sticky strip under landing header; toasts out.
- C1 60779a8c: components/motion primitives (usePointerFine, CursorGlow, TiltCard, Magnetic) + shared SlideIn unification + CountUp house ease.
- C2 5f2b6571: landing section headers + LegalPage/contact/model-card titles centered; H2s on the fluid scale.
- C3 61de00e8: hero CursorGlow + TiltCard on demo card + Magnetic primary CTA + Parallax primitive (photo drift 10px). Scrims byte-identical. Motion feel not machine-provable in stills; code + bundle presence audited by hand.
- C4 45cd9ebd: ScrollTrace — header strip draws the hero ECG path with page scroll (spring pathLength); static trace for reduced motion. Verified 0% top / ~50% mid / full at footer.
- C5 cb1e028c: PageTransition via root template.tsx whitelist (public+auth only); app shells bare/instant. SSR proof: in-scope pages carry the initial-style wrapper, /patient has none.
- C6 1bdf506b: Button press active:scale-[0.98] unified in base cva; .card-interactive hover utility (lift -6px + shadow-premium + border-primary/30) on the #how showcase rows only.
- C7 52005301: shared PublicFooterLinks (Home, Model card, Contact, Privacy, Terms, Sign in, Create account) on all 5 public pages — verified identical live; GuestRiskCheck result score centered.
- OPEN (owner decision): guest result is score-only BY DESIGN (api/guest-risk route comment: response carries only score and band; nothing stored), but the landing #how line "Every result lists the factors that pushed the score up or down" overclaims for guests. Proposed one-word fix "Every saved result lists..." — copy, needs Abdul Wahid approval before shipping.
- Recorded debt (conscious): status-colour token refactor (47 files), button h-10 vs 44px Fitts floor, two easeOut in app-shell layouts, .dark dead vars.

## Data-nit audit (2026-11-02, live DB checked directly)
The 19:11 full-site check's two soft observations do NOT reproduce in the data: every prediction's severity matches its probability band (Low <.2 / Moderate <.5 / High <.8 / Critical >=.8, ml-service get_severity), every patient's headline category matches its score, headlines match latest predictions (one exception: Ayesha Khan DEMO-2026-0001 headline 0.3933 vs latest prediction 0.3066 — same Moderate band, invisible), and ZERO appointments fail to resolve a patient name via patients.user_id / profiles (appointments.patient_id references the AUTH USER id, not patients.id — wrong join key produces false orphans). Verdict: seed + live data are consistent; the observations were checker misreads. No fix applied.
- OG CARD — SHIPPED + LIVE-VERIFIED 3 Nov 2026: the generated /opengraph-image route took ~3.5s to respond (WhatsApp's fetcher timed out → text-only previews on his phone). Replaced by a STATIC frontend/public/og-card.png (36,163 bytes, ~0.49s) with the centre-safe design Abdul Wahid approved (centred composition: pulse logo, "Know your risk. / See exactly why.", enlarged "WhyRisk" wordmark 58pt Quicksand, descriptor line). Metadata updated in THREE places (consistency sweep): src/app/layout.tsx (og + twitter), src/app/welcome/page.tsx (og), src/app/model-card/layout.tsx (og); generated route file deleted; old /opengraph-image URL now 404s. Commits 0a63e640 (image), ed398fa0 (layout), ebb3b16b (route), 2a67b4de (welcome+model-card).
- OG 2x (3 Nov 2026): og-card.png re-rendered natively at 2400x1260 (same approved design) and replaced in place (commit 3cfad81), served bytes sha-verified live — WhatsApp thumbnail sharpness.
- OG THUMBNAIL-BOLD (3 Nov 2026, SUPERSEDES the 2x card): Abdul Wahid still saw blurry WhatsApp thumbs and ordered "svg bna ke lga do" — REFUSED with the mechanism (WhatsApp/Facebook/Twitter scrapers do not render SVG og:images at all; an SVG would have killed previews back to text-only). Proof sheet shown: the live 2400px file is sharp; the blur is born in WhatsApp's own shrink to ~130px JPEG. Real lever approved ("kro"): thumbnail-bold redesign — ONLY name/logo/headline, much larger/bolder, small lines dropped (descriptor, tagline, domain) so the name stays legible in WhatsApp's small thumbnail. SHIPPED LIVE for all three sites (Portfolio, WhyRisk, Study Hub), live-verified as served; WhatsApp's per-URL cache means old chats keep the old card, fresh shares fetch the new one. This supersedes the centre-safe/2x versions.

## Phase 7 dependency hardening — DONE (22 Nov 2026, evening)
- Method: npm audit endpoint blocked in sandbox → OSV.dev querybatch over the full lockfile (730 pairs, 131 hits), triaged with npm ls.
- Fixes shipped (commit verified by blob SHA on main; live routes re-checked 200):
  - `shadcn` CLI moved dependencies → devDependencies (zero runtime imports; its subtree — MCP SDK, hono, express chain, undici, systeminformation — carried ~97 hits and no longer ships in production installs).
  - postcss pinned via override to top-level ^8.5.22 (resolved 8.5.33); next's nested 8.4.31 eliminated.
  - zod updated within ^4 (GHSA cleared).
- Result: production tree (139 pkgs) has exactly 26 remaining hits — ALL in `next@14.2.35`. Verified via Context.dev search: 14.2.35 IS the last 14.2.x and is Vercel's fixed version for the Dec-2025 RSC issues; the 26 newer advisories are fixed only in Next 15.5.21 / 16.2.11. **Remaining Phase 7 item = planned Next 15/16 migration (React 19 considerations) — Abdul Wahid's call on timing.**
- Rest of the 123 total hits are dev/build tooling only.

## Palette references Abdul Wahid liked (22 Nov 2026, via Context.dev web-styleguide) — NOT applied, his pick pending
1. **PrimeDental** (preview.themewagon.com/primeDental): accent `#6b63ff` (violet), bg `#f3f4fb` (soft lavender-white), text `#212529`, button text `#f5f6ff`, card border `#e5e7eb`, radius 8px, font Poppins (headings 700–800).
2. **Clinic** (preview.themewagon.com/Clinic): accent `#175cdd` (medical blue), bg `#ffffff`, card border `#e5e7eb`, radius 8px (buttons 4px), fonts Montserrat headings + Roboto body (light 300 weights).

## Palette A (PrimeDental violet) ADOPTED — 22 Nov 2026, Abdul Wahid picked "A"
- Tokens: --primary/--brand #6B63FF, --brand-text #574CD6 (5.61:1 on bg — house text-safe pattern), dark surfaces (hero scrims, login panel, icon, theme_color) #574CD6, --background #F3F4FB, --foreground #212529, --card white, --border #E5E7EB, --input #848AA3 (3.12:1), muted-fg #5F6376, light-on-dark labels #E0DCFF.
- Sweep: 27 files (globals.css tokens + every hardcoded brand hex: #0D2B3E→#574CD6, #2E7FA8→#6B63FF, #1F6E96→#574CD6, #8FC3DC→#E0DCFF, #C8D6DA→#D8DAEA, #F4F6F6→#F3F4FB, #CCD0CF→#E5E7EB, #5A6B73→#5F6376, #06141B→#212529, #E7EDEC→#EEEFFA). Risk-status semantic colors (green/red/amber) deliberately KEPT.
- Font unchanged (Quicksand) — his praise was for the colors; Poppins is a separate call.
- Commit d80c9081: 27 files all under frontend/, globals blob SHA verified; live CSS contains 107 99 255 + 243 244 251; routes 200. Local build needs dummy Supabase envs (prerender) — Vercel has the real ones.

## Watermelon template components ADOPTED into WhyRisk landing (22 Nov 2026, later round)
- Abdul Wahid clarified the 16 template files were ALSO meant for WhyRisk ("jidr jidr use ho sken") — first reading (future-only) was wrong; he corrected it and the integration shipped the same evening.
- USED (adapted, violet/light re-skin, commit 90227f78): bento grid layout for "What it does" (new BentoCapabilities.tsx — asymmetric cells, mono [ LABEL ] tags, dot-grid texture cell, demo SHAP bars inside the prediction cell; content/wording unchanged), corner-accent ticks (new CornerAccents.tsx — bento cells, hero demo card, StatsBand panel), `// CAPABILITIES` mono eyebrow on the section.
- NOT used, deliberately: CountingNumber (WhyRisk's own CountUp is better — decimal + SSR-safe + reduced-motion), testimonial marquee (no real testimonials exist; fabricating any for a health product breaks the honesty rule), hero/navbar/footer wholesale (WhyRisk's own are product-specific), component/template bentos + MorphingButton/KnobSlider/SelectAIAgent/CarouselSlider (their source files were never among the 16 sent — missing sub-deps in MANIFEST.md).
- Verified: local build + desktop/mobile screenshots, push blob-SHA match, live /welcome 200 with the new labels in HTML.

## Template-system redesign (22 Nov 2026, evening — Abdul Wahid's order: FULL website, not just landing)
- Direction LOCKED by Abdul Wahid: Watermelon template supplies DESIGN + ANIMATION/SMOOTHNESS only; colors = PrimeDental Palette A violet (template lime/dark explicitly rejected for WhyRisk). Same flow/alignment/detailing on EVERY page.
- ROUND 1 SHIPPED (commits eb7fb3af images, d1415132 system, 1a6c1b99 cleanup, f833a004 fresh captures; live-verified, deploy success):
  - Landing /welcome rebuilt wholesale in `src/components/landing/` (chrome/LandingNav/LandingHero/FeatureBento/ScoreBento/PartsBento/PagesBento/FactsMarquee/LandingFooter): template section order + motion numbers (stagger .1–.12, y16–20, ease [.16,1,.3,1], rotating word 2.8s blur-swap, marquee 42s CSS, count-ups), rails/crosshairs/dot-grids/corner accents, `// LABEL` mono eyebrows. GuestRiskCheck + honest scope KEPT. Marquee carries model-card FACTS (no testimonials exist — honesty rule). Collage/pages images = self-hosted captures in `frontend/public/landing/shot-*.png` (mshots failed in sandbox; local captures pushed via a Git Data API binary-push script — the standard push route rejects binaries).
  - SITE-WIDE LEVERS: ui/button, ui/input, ui/select, ui/card → rounded-none (square technical edges app-wide); auth pages (login/signup/forgot/update/pending-approval) radius sweep + corner accents on login/signup cards; GuestRiskCheck squared. BentoCapabilities deleted (superseded).
  - BUG caught in QA: CornerAccents' root span was a static grid item and broke the login split layout — root is now `absolute inset-0` (fixed + re-verified).
- ROUND 2 (next): dashboard views + sidebars headers detailing (mono eyebrows, accents on display cards), public pages (model-card, contact-us, LegalPage privacy/terms) template headers, table wrapper radii sweep. Then Abdul Wahid's phone feel-check is the verdict.
