# Study Hub — Anna Edition (marketplace app, in planning)

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
2. Owner registers on the platform + activates developer access (self-serve). Status 2026-11-23: deferred by the owner — registration happens only after the program contact replies to the 23 Nov email.
3. Study the platform's developer docs — app = tool(s) + app manifest + SPA bundle; storage via APS scopes (user/app), files via the object-store presigned flow.
4. Build the MVP: sign-in (Anna account) → add resource (PDF/PPT/text) → AI summary + quiz + viva → save to profile (APS) → history.
5. Submit for review → publish → monthly maintenance + MAU watch.

## Open questions
- Exact APS behaviour for app-scope shared data (per-user only per docs — confirm during the build if any shared/global feature is ever wanted; the current design needs none).
- Which models the host sampling offers for summarisation/quiz generation, and their credit pricing.
