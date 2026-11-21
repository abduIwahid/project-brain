# Project: Smart Doctor Connect — symptom-to-doctor recommender for Pakistan (MTM Hackathon 2026 build)

Repo: github.com/abduIwahid/Smart-Doctor-Connect (main). Built at the
Mind-to-Machine (MTM) AI Hackathon 2026, COMSATS University Wah Campus.
Live demo (per README): smartdoctor-ai.vercel.app.

## Audit — 2026-10-24 (GitHub-wide review)

### Facts
- Reality vs README (AUDIT 2026-10-24 — README CORRECTED 2026-11-07, see
  item 4 below): the README *had* claimed Next.js/React + "Python / Machine
  Learning Integration". The actual build is Express 4 (server.js, ~230 lines)
  + ONE vanilla HTML file (public/index.html, 32 KB / 641 lines, all CSS and
  JS inline) + data/doctors.json. No Python, no React, no ML model anywhere.
- Data: doctors.json holds 8 doctors across 7 specializations (Cardiologist,
  Dermatologist, GP, Neurologist, Orthopedic, Pediatrician, Psychiatrist) in
  4 cities (Islamabad, Lahore, Karachi, Rawalpindi) — real, named senior
  doctors at real hospitals (Shifa International, Shaukat Khanum, UHS) with
  real-looking phone numbers and emails.
- Recommendation logic (server.js): a hardcoded symptomMap of 21 keywords →
  specializations; POST /api/recommend-doctor keyword-matches the symptom
  text, filters by location, sorts by rating, returns top 3. An optional
  Gemini call (model string `gemini-1.5-flash`, API key sent as a URL query
  parameter) adds a short advice paragraph; if GEMINI_API_KEY is unset or the
  call fails it silently falls back to a generic line — the rule engine is the
  real product, Gemini is garnish.
- Other endpoints: GET /api/doctors, /api/doctors/:id, /api/doctors/search/:q,
  POST /api/doctors/filter, POST /api/doctors (add — appends and rewrites the
  JSON file on disk), GET /api/symptoms. The file is re-read from disk on every
  request; there is no database.
- Deployment: vercel.json uses the legacy builds/routes format routing all
  traffic to server.js as a function. package.json author is still the
  placeholder "Your Name".

### Strengths
- The graceful-degradation design is right for a hackathon: no key → the demo
  still works end-to-end on rules alone. Nothing in the user flow hard-depends
  on an external API.
- API surface is complete for the concept (browse, search, filter, detail,
  recommend, add) and the frontend wires every endpoint, including an
  add-doctor form and a detail modal.
- The frontend is hand-rolled and systematic: Sora body + Lora serif display,
  an emerald/slate CSS-token palette, custom tabs, cards, modal, toast and
  spinner — no framework, no stock component library showing through.
- Small, readable codebase (~870 lines total) that a teammate can run with
  `npm start` in one step.

### Weaknesses / risks
- **Add-doctor cannot work in production.** Vercel functions have an ephemeral
  filesystem, so saveDoctors() writes vanish (or throw) between invocations —
  a headline feature silently broken on the live demo. Same class of bug:
  `nextId = doctors.length + 1` collides the moment any record is removed.
- POST /api/doctors has no authentication or validation beyond four required
  fields — on the public demo, anyone can inject a fake doctor that then gets
  recommended to patients.
- Real people's data: named doctors, hospitals, phone numbers and ratings
  (4.9★ etc.) that they never supplied. For a healthcare demo this is the
  riskiest content choice in the repo — invented ratings on real clinicians.
- The Gemini path is pinned to `gemini-1.5-flash`; Google has been retiring
  that model generation (his Study Hub key returned 404s on retired Gemini
  models on 2026-10-24), so the advice path will quietly die and only the
  fallback line will ever show. His Ask-the-Hub model-discovery fix is the
  template for repairing this.
- Polish slips: /api/symptoms returns a garbled duplicated string ("Use these
  symptoms to receive Use these symptoms to receive Gemini AI powered…");
  README clone URL points at a different repo name (smartdoctor-ai).
- Frontend fingerprint (public/index.html): a **hero pill badge above the
  headline** (.hero-pill, translucent emerald chip) and the H1
  "Find the *right doctor* for your symptoms" with the accent word in **Lora
  italic serif** — two tells straight off his anti-AI-fingerprint list.
  Emojis are the icon system throughout (🤖 ×4, 🏥 ×3, 🔍 ×3, ✉, 📞, 📍, 🩺,
  ★ ratings) instead of one icon font. One error string is Roman Urdu inside
  the otherwise-English UI ("❌ Server se connect nahi ho saka. npm start check
  karein."), breaking his English-only public-copy rule and leaking a dev
  instruction to end users. Mitigating: flat colours (no purple-blue gradient,
  no glassmorphism), real token system, clamp() responsive type.

### Improvement plan (prioritized)
1. Fix persistence properly: move doctors to Supabase (already in his stack)
   or make the demo read-only and remove the add-doctor write path; put the
   POST behind a simple admin key if it stays.
2. Replace the doctor data with clearly fictional doctors (or keep names but
   drop invented ratings/contact details) before promoting the demo anywhere.
3. Repair the Gemini call: current model name + his model-discovery fallback,
   key in a header instead of the URL; fix the garbled /api/symptoms string.
4. ~~Correct the README to the real stack (Express + vanilla JS + Gemini
   optional) — the honesty upgrade costs ten minutes and removes the
   Next.js/Python mismatch a reviewer finds immediately.~~ **DONE 2026-11-07**
   (README refresh round, 9 repos): README now states the real stack
   (Express + Gemini API + doctors.json) and the wrong clone URL
   (smartdoctor-ai) was fixed too. Remaining mismatch risk is now nil on
   the README; the Gemini model pin (item 3) is still open.
5. Frontend pass: drop the hero pill, set the H1 in one voice (no italic
   serif accent), swap emoji icons for Lucide, and make all UI strings
   English — including error states.
