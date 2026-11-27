# Face Attendance System — face + live-location attendance (anti-proxy by design)

- **What:** Face-recognition + live-location attendance web app. A student marks attendance with a live selfie on their phone — attendance records ONLY when the face matches their registered photo AND live GPS is within the class radius. Anti-proxy by design.
- **Origin:** a saved reel demonstrating the concept (full entry: `../08-references/saved-references-part-5.md` #287); the owner saw it on 2026-11-23 and ordered the build the same day.
- **Live:** https://face-attendance-ai.vercel.app — repo `face-attendence` on the owner's GitHub (the name carries a typo made at creation; rename pending — lesson: verify names before creating resources, renames are cheap but links scatter).
- **Stack:** Next.js (TypeScript, App Router) + Supabase (Postgres + Row Level Security + Auth) + face-api.js in the browser (128-d face descriptors) + Geolocation API + SheetJS .xlsx export. Built brain-first: a complete project brain (PRD, architecture, data model, API spec, design, security, ethics, testing, deployment) existed before any code.

## Architecture decisions worth reusing

- **The server decides everything.** The browser computes the live face descriptor, but the match decision is made server-side: the API reloads the stored descriptor, recomputes the euclidean distance itself, and applies the threshold (0.6, strict). A tampered client cannot assert its own match. Consequence: **no descriptor ever leaves the server** — there is deliberately no "get descriptor" endpoint, which also removes an enumeration surface.
- **One PRESENT per student per day**, enforced twice: a route-level check plus a database partial unique index as the race backstop.
- **Writes go through the service role; reads go through the teacher's session under RLS.** Verified by probing signed-out: teacher data endpoints return 401 and no records appear in any signed-out response.
- **Consent before camera.** Registration shows the consent text and requires an explicit tick *before* the camera opens. Biometric data gets a real deletion path: deleting a student removes the stored photo, the attendance rows, then the student row.
- **Rate limits** are simple in-memory fixed-window counters (per roll number / per IP) — honest at classroom scale on serverless; the documented upgrade path is a database counter table.

## The GPS pattern (the project's biggest lesson)

**Problem:** indoor GPS drift is the *normal* classroom case, not an edge case. In the first real phone test, the owner sat in the exact spot where the class location had been set — and verify reported him 160–170 m away. A single-shot browser geolocation fix indoors is routinely off by 100–200 m (the first answer is often a Wi-Fi/cell fix). The original semantics (single-shot fix, raw haversine distance vs radius, hard 50 m accuracy cap) made the core feature fail in the exact setting it was built for.

**Fix (shipped the same evening, verified by the owner's retest — PRESENT):**
1. **Best-of-several sampling on the client.** Both the verify page and the teacher's "set class location" control sample fixes with `watchPosition` for up to ~10 s, keep the reading with the smallest reported accuracy, and stop early at ≤ 20 m. The UI shows live sampling status ("Improving location accuracy… ±X m"). Both sides of the comparison are measured the same way.
2. **Accuracy-aware decision on the server.** The radius check uses the **effective distance** = `max(0, raw distance − GPS accuracy)`. "Too far" only when the effective distance exceeds the radius. The phone's own accuracy figure is the honest measure of how much the raw distance can be trusted; subtracting it (floored at 0) is the standard way to ask "could this student actually be inside the radius?"
3. **Hard cap raised, not removed.** A fix worse than 250 m accuracy is still rejected outright (and writes no attendance row) — above that, a fix is meaningless.

**Auditability preserved:** attendance rows still store the RAW distance + accuracy — only the decision changed — so a teacher can see and question a marginal pass. Accepted trade-off: a student genuinely just outside the radius with a terrible fix can pass; the alternative (rejecting genuine in-room students) breaks the core feature in its primary setting, and the face match + one-per-day rules are unaffected.

**Test evidence:** the decision function is pure and unit-tested, including the owner's exact failing case (raw 165 m / ±160 m accuracy / 100 m radius → PRESENT) and the boundary cases (effective distance exactly at the radius → PRESENT; accuracy 260 m → rejected).

## Phase learnings

- **Brain first, phases with exit checks.** Each phase closed only on evidence: schema applied → verified by probing with the anonymous key (reads return nothing, insert blocked by RLS); core feature → verified by a real phone test, not by the build passing.
- **The frontend was rebuilt wholesale, once, in a decided system — and that rebuild was presentation-only.** The first frontend (stone neutrals + one green accent, system fonts) was replaced 2026-11-23 late by the **Aurora system** (owner's order; Aurora = his highest-priority frontend reference): Plus Jakarta Sans, accent #3385F0, 8px radii, soft layered shadow; rotating-word hero, split-screen login, dashboard app shell. No API/lib/logic changes in the rebuild — the lesson is to keep a rebuild to one layer, so it can be verified by the same tests. A landing page, motion layer (entrance rises, hover lift, `prefers-reduced-motion` respected) and all-state polish (empty/loading/error) shipped in the same round as the teacher features.
- **Excel export verified by round-trip:** the workbook builder is unit-tested build→parse (headers intact, distances stay numeric) — the file a teacher downloads is the rows on screen, nothing else.
- **Deployment route matters:** the hosted connector's base64 deployment route hit argument-size limits on the 6.8 MB self-hosted model weights; deployment went through the platform REST API with binary digest uploads instead. Self-hosting the model weights (no runtime CDN) is deliberate.
- **Known v1 limits, stated honestly:** no liveness check (a photo of a face may pass the matcher); rate limits are per-instance in-memory; face-match threshold tuning with a real demo cohort is still pending.

## Status (2026-11-26)
Phases 0–3 closed and live: landing → register (consent-gated camera) → verify (selfie + sampled GPS, server-decided) → teacher log with date filter + .xlsx export → class settings + student management. 35/35 tests passing. Frontend rebuilt in the Aurora system 2026-11-23 (presentation-only; logic/tests untouched). Remaining (Phase 4): demo-cohort seed (consenting classmates vs clearly-labelled fictional entries — decision open) + threshold tuning (needs real faces) + a real-data .xlsx download check on the owner's phone, then production readiness.
