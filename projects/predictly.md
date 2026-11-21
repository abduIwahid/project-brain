# Project: Predictly — Pakistan property-price estimator (Flask; rule-based pricing + PIL photo scoring)

Repo: github.com/abduIwahid/Predictly (main). A polished demo shell around a
heuristic valuation — market it as an estimator, not a trained model.

## Audit — 2026-10-24 (GitHub-wide review)

### Facts
- Stack: Flask 2.0.2 (2021-era pins in requirements.txt) + gunicorn (Procfile),
  one template (templates/index.html, 18.5 KB) + static/style.css (4.8 KB).
  Bootstrap 5.1.3, Chart.js, Leaflet, html2pdf.js — all CDN.
- There is NO trained model and no dataset in the repo. app.py's pricing is a
  function literally named `mock_pakistan_price()`: a hardcoded per-marla rate
  for 6 cities (Lahore 2.5M, Karachi 3.0M, Islamabad 3.5M, Rawalpindi 2.0M,
  Faisalabad 1.5M, Multan 1.2M PKR) × property-type multiplier (House 1.2,
  Farm House 1.5) + bedroom/bathroom bumps + amenity uplifts (gated +5%,
  commercial +3%, metro +2%).
- The "on-device AI vision" is PIL pixel statistics on a 200×200 downscale:
  brightness, channel stdev ("richness"), luminance range (contrast) and
  luminance variance ("sharpness") → a 0–100 Visual Score → condition tier
  (Luxury / Modern / Standard) → a price interpolated inside fixed PKR bands
  (15–80M / 6–15M / 2–6M). The photo score ignores city and area entirely —
  any bright, colourful photo scores "Luxury" regardless of the property.
- More mocks live in the template's JS, labelled in comments: 5-year trend
  chart data `[1.8, 2.0, 2.3, 2.2, 2.5] // Mock data` (same series for every
  city), mortgage rate `0.15 // 15% annual mock interest`. The result
  "breakdown" sets base == total, so there is no real itemization.
- POST handler sleeps a deliberate 1.0 s (time.sleep) to simulate processing;
  uploads are saved into static/uploads/ with secure_filename but no type/size
  validation and are never cleaned up; raw exception text is rendered back to
  the user; app.run(debug=True). No live URL in the README.

### Strengths
- Product instincts are good: dual estimates (form valuation + photo estimate)
  side by side, Leaflet map that flies to the selected city, EMI calculator,
  amenity toggles that visibly move the price, one-click PDF report.
- CSS-variable theming is systematic (full light/dark token swap in style.css),
  and the monochrome art direction is a deliberate, consistent choice.
- README is honest about the mechanism (pixel statistics, no API key) even
  though the headline language ("state-of-the-art, AI-powered") oversells it.
- Zero-cost architecture: everything runs offline with no keys — demo-proof.

### Weaknesses / risks
- Credibility gap is the core risk: "AI-powered valuation" over a function
  named mock_ and three hardcoded price bands. Anyone technical who opens the
  repo (recruiters do) finds the gap in one click — it undercuts his real ML
  work (MediSight, Churnex) by association.
- Frontend fingerprint (templates/index.html + static/style.css):
  **Inter** loaded from Google Fonts and set as the body font — the #1
  default-font tell on his anti-fingerprint list. Cards are literally classed
  `.glass-card` under the comment "Glassmorphism Cards but Monochrome" (in
  practice solid fills, no backdrop-filter — glass in name only). Default theme
  is pure black `#000000` background with `#f5f5f5` text, breaking his
  never-pure-black dark-mode rule. Worst offender: the one accent that breaks
  the monochrome system is the AI-condition badge styled
  `linear-gradient(135deg,#6366f1,#8b5cf6)` (index.html line 162) — the
  canonical indigo→violet AI gradient. Emoji are UI chrome: the theme toggle's
  label is "🌙 Dark Mode" / "☀️ Light Mode", and the condition emoji
  (✨ / 🏡 / 🏠) is rendered at 1.4rem beside the result. Stock Bootstrap
  form-floating components are used largely untouched.
- Flask/Werkzeug 2.0.2 pins are old; the app predates his FastAPI work and
  it shows (single route handling GET+POST, stringly error handling).

### Improvement plan (prioritized)
1. Make it a real model: scrape/collect a Zameen.com-style listing set (city,
   area, beds, baths, price) and train a gradient-boosting regressor — he
   already has this exact skill from his internship. Keep the rule table as
   the fallback and label each estimate's source honestly.
2. Until then, rename honestly in the UI/README: "heuristic estimate" and
   "photo condition score", and drop "state-of-the-art AI-powered".
3. Frontend pass against his fingerprint list: Archivo/Anton instead of Inter,
   warm off-black (#111 range) instead of #000, delete the indigo-violet
   gradient badge (monochrome chip instead), replace emoji toggles/labels with
   one icon family (Lucide, as on his portfolio).
4. Remove the fake 1 s sleep; either compute per-city trend series from the
   same listing data as (1) or drop the trend chart; make the EMI rate an
   input with a labelled default.
5. Upload hygiene: validate image type/size, store outside static/, delete
   after analysis; stop rendering raw exceptions; bump Flask pins.
