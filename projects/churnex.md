# Project: Churnex — FastAPI churn-prediction platform (MLP + exact SHAP) over the IBM Telco dataset

Repo: github.com/abduIwahid/Churnex (main). Semester CS/AI project; the deployed
form of his Customer Churn Prediction work (notebook + VIVA_Explanation.md included).

## Audit — 2026-10-24 (GitHub-wide review)

### Facts
- Stack: FastAPI (app.py, ~390 lines) serving a vanilla HTML/CSS/JS single-page
  app from static/ (index.html 7.2 KB, style.css 7.5 KB, script.js 9.8 KB, Chart.js via CDN).
- Model: scikit-learn MLP (128→64→32→16, ReLU, max_iter 500) on 8 engineered
  features from the IBM Telco CSV (7,043 rows, committed to the repo, ~977 KB).
  model.joblib (~401 KB) bundles model + StandardScaler + 3 LabelEncoders +
  feature order + SHAP background (50 k-means centers).
- Explainability is NOT the real `shap` package: `shap_lite.py` is a vendored,
  dependency-free replacement that computes EXACT Shapley values by enumerating
  all 2^8 = 256 coalitions in numpy. It exists because real shap's numba/llvmlite
  chain kept breaking Vercel builds — documented in the module docstring.
- Endpoints: POST /predict (Pydantic body, unseen-category guard), POST
  /predict_bulk (auto-detects Telco vs an alternative CSV dialect, case-insensitive
  column mapping, utf-8-sig → latin-1 fallback, median imputation, returns a
  downloadable predictions.csv), GET /api/stats, POST /api/export_pdf (fpdf2).
- Deployment: Vercel — vercel.json rewrites everything to /api/index (an 85-byte
  shim re-exporting `app`); main.py is a second, redundant shim doing the same.
  Dependencies exist in three places: requirements.txt (what Vercel uses),
  pyproject.toml, uv.lock. No live URL in the README (localhost instructions only);
  actual deployment state unknown.
- Housekeeping: __pycache__/ committed; no tests; no LICENSE file.

### Strengths
- shap_lite.py is genuinely strong engineering: exact Shapley values instead of
  KernelExplainer sampling, zero compiled dependencies, honest docstring explaining
  the trade-off. The most original code in any of his ML repos.
- Bulk-CSV path is unusually careful for a student project: two real-world CSV
  dialects mapped with fallbacks and defaults, encoding handling, clear error when
  features can't be mapped.
- Business layer beyond the model: rule-based retention recommendations per
  prediction and a one-click branded PDF report.
- Model bundle design (model + preprocessors + SHAP background in one artifact)
  means inference never retrains; README is thorough and its API reference
  matches the code.

### Weaknesses / risks
- **No holdout anywhere.** train.py trains on the full dataset and reports
  mlp.score on the same data; the README openly defends this ("trained on the
  full dataset to maximize generalization"). Any accuracy figure quoted from
  this pipeline is training accuracy — the notebook compares 7 algorithms, so an
  honest held-out number exists within reach but is not what the app ships.
- /api/stats re-reads and re-aggregates the full 977 KB CSV on every request —
  no caching; wasteful on serverless cold starts.
- /api/export_pdf duplicates the predict pipeline but skips the unseen-category
  check, so a bad categorical value crashes le.transform instead of returning
  the clean 400 /predict gives.
- API errors leak raw exception strings (detail=str(e)) to clients; no input
  range validation (negative tenure, absurd charges pass Pydantic types).
- Frontend fingerprint (static/style.css): textbook glassmorphism — panels use
  `backdrop-filter: blur(20px)` over a radial-gradient near-black backdrop with
  two giant blurred decorative blobs (.shape-1 600px, .shape-2 500px — the
  "radial orbs" tell); recommendation list uses coloured left-border cards
  (`border-left: 3px solid var(--accent)`, line 109) — both patterns are on his
  anti-AI-fingerprint list verbatim. Body font is Calibri, outside his
  Anton/Archivo system. Dark-only theme. Mitigating: the palette is monochrome
  grey, no purple-blue gradient, uppercase letterspaced buttons read editorial.

### Improvement plan (prioritized)
1. Fix the evaluation story: hold out 20% (or cross-validate) in train.py, store
   the honest metrics in model.joblib, and show them on the Dashboard tab.
   Retraining on full data afterwards is fine — if the README says so plainly.
2. Kill the glass: replace blur panels + blobs with solid warm-dark panels,
   hairline borders, and the monochrome editorial look his portfolio uses;
   swap Calibri for Archivo body + Anton display.
3. Cache /api/stats at startup (compute once when the CSV loads with the model).
4. Unify predict logic: one internal function used by /predict and
   /api/export_pdf, with the category guard; stop leaking exception text.
5. Repo hygiene: delete __pycache__ + add .gitignore, drop one of the two
   Vercel shims and one dependency source, add the live URL to the README.
