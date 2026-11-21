# NASA Space Dashboard (nasa-space-dashboard)

## Facts
- Built 2026-11-10 from the FREE-APIs guide; repo github.com/abduIwahid/nasa-space-dashboard, initial commit 09f675e7 (24 files, verified).
- Pure HTML/CSS/vanilla JS. NASA APIs — defaults to the public DEMO_KEY (shared 30/hr, disclosed in the UI); visitor can paste their own free key (localStorage only).
- Features: APOD with date picker (video vs image handling, copyright/public-domain label, last-good cached fallback), NeoWs 7-day table (string numerics parseFloat-ed, sorted by miss distance km + lunar, hazard badges), quota meter from rate-limit headers, one backoff retry on 5xx/network, never on 429.

## Strengths
- Verified live with DEMO_KEY: APOD fields (copyright optional — absent on public-domain entries), NeoWs shapes confirmed as strings.

## Weaknesses / open
- DEPLOYED 2026-11-11: GitHub Pages LIVE at abduiwahid.github.io/nasa-space-dashboard (200, verified). Personal pass PUSHED + live (b3abe0f feat / cf2e630 docs). README "Live demo: TBD" → real Pages link + MIT LICENSE staged, NOT yet pushed (on his go).
- DEMO_KEY is shared and slow under load; personal key recommended for real use. Phase 2 unbuilt: scatter plot, EPIC imagery.

- PERSONAL PASS 2026-11-10 (evening): first-person About section in-app + README author byline + one genuine signature feature per repo (DevMetric: Footprint panel + language-share denominator fix; Pokédex: Seen collection; SkyLens: daily rain probability; NASA: NeoWs week highlights; CineLog: watchlist Top-rated sort + genreIds mapper fix) + a real bug/gap fixed in each. Brain session 2026-11-10-02 filed in every repo.
