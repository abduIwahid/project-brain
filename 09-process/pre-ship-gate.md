# Pre-ship gate, post-change testing & the asset-version rule

Three standing rules, each learned from a real failure. Together they are the difference between "the build passed" and "it works".

## 1. Pre-ship gate
- **No change is "final" until its LIVE check passes.** Order: build → deploy → live-verify → report. Build gates (tsc/eslint/build) and a builder's word never justify a "done" claim.
- If a surface can't be machine-checked (e.g. a phone width you cannot render), ship the **conservative** version (stronger overlays/contrast) and label it unverified until a real check happens.
- **Consistency sweep:** whenever ANYTHING changes, check everything related to it across the WHOLE website in the same round — a treatment applied to one surface applies to all sibling surfaces (all auth pages, all sections, all cards, every place a shared component appears). Differences only with a stated reason.
- Text-over-image: design for the WORST crop (mobile portrait); a uniform scrim under text, not a directional gradient alone.

## 2. Post-change testing
After EVERY shipped change to any website, verify LIVE as a user before saying done — click through the changed surfaces plus their relevant neighbours; full-site pass for big rounds, scoped pass for small changes; loop fix → deploy → re-check until clean.

An audit/verification is incomplete until every DYNAMIC view has been rendered with real data — a page that only renders after a run/API call must be exercised with a seeded session, not just loaded empty. (A recommendations-overlap bug once hid for a whole day in a render path that was never exercised locally.)

## 3. Asset-version rule
Whenever ANY asset file's content changes (CSS, JS, anything cacheable), bump its `?v=` query AND the service-worker cache name in the SAME push. A changed file under an unchanged URL means real users keep the stale copy while every sandbox check passes.

## Supporting habits
- Verify a push by the commit's FILE LIST and read-back hashes, not by the ref alone — files once landed in a shadow directory tree while the live site silently stayed on the old build.
- Verify in a FRESH browser profile when a service worker is involved; the SW will happily serve you yesterday's CSS.
- When a checker and a human disagree about how something looks, pixel measurement settles it.
