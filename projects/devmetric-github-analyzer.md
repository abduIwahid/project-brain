# DevMetric — GitHub Profile Analyzer (devmetric-github-analyzer)

## Facts
- Built 2026-11-10 from the FREE-APIs guide; repo github.com/abduIwahid/devmetric-github-analyzer, initial commit fe2256a (23 files, verified).
- Pure HTML/CSS/vanilla JS. GitHub REST API (60/hr unauthenticated; optional visitor token in localStorage only).
- Features: profile card incl. account age, repo sweep per_page=100 (cap 5 pages), language aggregation from the repo list (forks/null excluded — avoids the per-repo /languages N+1 trap), top-5 starred + 5 most recent, live quota line from X-RateLimit headers, 404/403 states, shareable ?user= URLs, ETag cache in localStorage.

## Strengths
- Verified live incl. a full ETag round-trip (If-None-Match → 304).

## Weaknesses / open
- DEPLOYED 2026-11-11: GitHub Pages LIVE at abduiwahid.github.io/devmetric-github-analyzer (200, verified). Personal pass LIVE (2184113/e169e02). Frontend v2 LIVE (e71608d/334f062, GitHub-native dark), v3 LIVE (eabc266 + 689c335 + 7eb7a10: Profile Score 80/100 "Strong" for his profile, Try chips + token UI removed, premium pass, two-line language rows — Safari fix phone-confirmed 11 Nov), scroll animations + hover depth LIVE (2fe7160). README live-demo link added (28a4c83). MIT LICENSE staged, NOT yet pushed (on his go).
- Phase 2 unbuilt: two-user compare.

- PERSONAL PASS 2026-11-10 (evening): first-person About section in-app + README author byline + one genuine signature feature per repo (DevMetric: Footprint panel + language-share denominator fix; Pokédex: Seen collection; SkyLens: daily rain probability; NASA: NeoWs week highlights; CineLog: watchlist Top-rated sort + genreIds mapper fix) + a real bug/gap fixed in each. Brain session 2026-11-10-02 filed in every repo.
