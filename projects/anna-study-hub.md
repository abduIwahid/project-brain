# Study Hub — Anna Edition (marketplace app, built — publish pending)

Created: 2026-11-23, on the owner's go.

## What this is
A NEW, separate app for the Anna AI OS marketplace, built under the Anna Founding Builder Program (invitation received from a program contact at anna.partners). NOT a port of the existing Study Hub — the original stays exactly as-is for its class cohort, and **no class resources go to Anna** (the owner's explicit condition, settled 2026-11-23).

## Concept
- A study platform published on Anna: each user signs in with their Anna account (profile = Anna account, no separate auth), adds THEIR OWN resources (lecture files, slides, notes), and the core AI workflow turns them into summaries, quizzes and viva questions; results are saved to their profile.
- The AI workflow is the CORE (Anna review requires AI-native primary value; a pure file-sharing app can be rejected). Flow: input → processing → results → storage.
- Backend + storage: Anna provides both — Anna Persistent Storage (APS), per-user KV + object store, 5 GB per user default; LLM calls via the host (sampling/credits/BYOK), no API key or bill for the builder. Per-user storage means NO global public library on APS — the design stays per-user (each user sees only their own resources).

## Program facts (from the official program rules + the invitation, 2026-11-23)
- Zero cost to join/publish; hosting/execution by Anna. Payout fees/taxes are the developer's; monthly meaningful maintenance required to stay grant-eligible.
- Window: qualification through 31 Mar 2027; monthly cycles. Qualified MAU = a signed-in Anna user completing the app's main AI function with a meaningful result (installs/opens don't count; dev/QA accounts excluded).
- Grants: Tier E 200+ MAU = $50/mo; 500+ = $100; 1,000+ = $200; 4,000+ = $1,000; 10,000+ = $2,500; 20,000+ = $5,000. One grant per builder portfolio per month. Founding Builder status is permanent once qualified; the grant pauses in months below 200 MAU.
- 70% revenue share on eligible usage profit AFTER model API costs (not gross). BYOK counts toward MAU, earns no Token share.
- App review normally 3–5 business days; the app must have an interactive UI + working backend, clear inputs/outputs, loading/error states.

## Decisions
- 2026-11-23: Proceed, small and smart — one focused workflow, not a full Study Hub rebuild. Effort is the only cost; the reward is uncertain (depends on Anna marketplace traffic), so scope stays small.
- 2026-11-23: Class resources NEVER included. The original Study Hub stays untouched.

## Plan / status
1. Reply to the program contact confirming interest + concept — SENT 2026-11-23 (owner approved the exact text).
2. Owner registers on the platform + activates developer access — **DONE 24 Nov**: account created (GitHub sign-in), developer access activated, handle `@abdulwahid`.
3. Study the platform's developer docs — **DONE 24 Nov**: full docs pass (program post + hub: concepts, quickstart, manifest, UI runtime, LLM/agent API, APS, sampling, upload/files/storage host APIs, publishing, local dev, FAQ, Verified Developer, beginner's guide). Key build facts: app = SPA bundle (schema-4 manifest, iframe window) + bundled Python Executa; LLM via host sampling (structured json_schema output, 8,192-token output cap) or iframe `llm.complete`; APS per-user KV + R2 objects (own app bucket needs no manifest declaration); review = submit-review → 3–5 business days typical, no SLA, NO email notification.
   **Project brain built 24 Nov** (PRD with the Qualified-Run mapping, build plan targeting submit 29–30 Nov, decisions ADR-001…008).
   **PHASE 0 COMPLETE 25 Nov** — toolchain verified (Node v24.22.1, Python 3.12.3, uv 0.13.10, @anna-ai/cli 0.1.68; `anna-app doctor` all passed); scaffold built + validated (`validate` + `validate --strict` pass; Executa describe/health/ping OK; dev server boots, dashboard HTTP 200); extraction spike PASSED on the owner's real 53-page DAA Dynamic Programming lecture (28,142 chars, 0 near-empty pages) — ADR-009: own-Python (pypdf) extraction inside the study engine is the primary path. **SINGLE BLOCKER was `anna-app login` (device flow).**
   **LOGIN DONE 26 Nov ~08:17 PKT** — owner confirmed the device flow; PAT saved (~90 days); `whoami` verified host + scopes. **PHASE 1 COMPLETE 26 Nov** — live LLM call → google/gemini-3-flash-preview (~1.25s); Executa sampling round-trip ~1.85s; APS smoke (KV set/get/list/delete; 100 KB value OK); APS helpers (40,000-char chunked text, etag/if_match); Materials end-to-end PROVEN on the real 53-page DAA lecture (sha256 identical to the Phase 0 spike hash); PPTX proven on a real 101-slide deck. **ADR-010:** an Executa's storage token NEVER covers scope=app — the bundle owns ALL APS writes; the Executa is stateless (bundle-minted download URL in, text out, 3.5M-char guard).
   **PHASE 2 COMPLETE 26 Nov** — the full flow live end-to-end (upload → generate → quiz → feedback); generate ~9.4s per pack; pack = summary + 7 key points + 5 viva Q&A + 8 quiz questions; quiz spot-checked against the lecture, no hallucinated facts; scripted attempt 5/8 with correct weak topics. **PHASE 3 COMPLETE 26 Nov** — Plus Jakarta Sans vendored (one variable woff2, OFL); narrow pass at exactly 380px (overflow 0); manifest window 480×640 default, min 380×520; listing screenshots captured from the REAL app (icon + 5 screenshots, visually inspected). **LISTING COPY APPROVED by the owner 26 Nov** — name "Study Hub"; tagline "Turn your lecture files into a summary, key points and a practice quiz — with instant feedback."; category education; pricing free. **PHASE 4 PREP COMPLETE 26 Nov** — approved copy applied + re-validated green; stranger self-test **15/15 PASS** (incl. failure cases: wrong file type, 21 MB file, scanned PDF; ZIP-renamed-as-.pdf now rejected up front).
4. Build the MVP: sign-in (Anna account) → add resource (PDF/PPT/text) → AI summary + quiz + viva → save to profile (APS) → history. **Phases 1–3 DONE 26 Nov (see item 3); Phase 4 prep DONE (15/15 self-test).**
5. **HARD GATES ahead, in order:** (1) the owner uses the app end-to-end himself once; (2) his final publish yes → publish v1.0.0; (3) submit-review; (4) tell the program contact the same day + ask Q9 (the contact's 30 Nov deadline vs the official window to 31 Mar 2027). **Publish target Sun 29 Nov. Nothing published/submitted yet.**

## Open questions
- Exact APS behaviour for app-scope shared data (per-user only per docs — confirm during the build if any shared/global feature is ever wanted; the current design needs none). Per-user TOTAL APS quota figure also to re-verify (23 Nov pass recorded 5 GB default; the 24 Nov pass found object cap 256 MB but no total figure).
- Which models the host sampling offers for summarisation/quiz generation, and their credit pricing.
- **Deadline tension (Q9, open):** the program contact's 30 Nov date vs the official qualification window to 31 Mar 2027 — to be asked when submitting.
