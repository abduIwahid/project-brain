# Project: AI Data Analyst — chat with a CSV/Excel file in plain English, answers come from real SQL

## Facts
- Repo: github.com/abduIwahid/ai-data-analyst (created 2026-10-24, adapted from awesome-llm-apps, Apache-2.0 LICENSE present)
- Stack: Streamlit UI + Agno agent + DuckDB/Pandas tools; single file `ai_data_analyst.py` (131 lines) + requirements.txt — whole repo is 4 files
- Model in code: `gemini-3.8-flash` (Agno `Gemini`); README still says "Gemini 2.5 Flash" — stale
- Live: deployed on Streamlit Cloud at smart-csv-data-analyst.streamlit.app (demo mode — reads `GOOGLE_API_KEY` from `st.secrets` first; sidebar key entry is the fallback)
- Data flow: upload → pandas preprocessing (date/numeric coercion) → temp CSV → DuckDB table `uploaded_data` → agent writes/runs SQL and Pandas ops, answers in markdown

## Strengths
- The only batch-B repo with a live public demo, and the secrets-first key flow means visitors need no key of their own
- Real computation, not vibes: answers are grounded in executed SQL against the actual table
- Sensible preprocessing (NA variants, date parsing, numeric coercion) and try/except around file handling and the agent run
- requirements.txt is the best-pinned of the batch (streamlit and numpy pinned, floors elsewhere)

## Weaknesses / risks
- README model name is stale vs code (2.5 Flash vs gemini-3.8-flash) — same drift in 3 of the 5 batch-B repos
- Agent + DuckDB tools are rebuilt on every Streamlit rerun; no `st.cache_resource` — slow and wasteful per interaction
- Temp CSVs are written with `delete=False` and never cleaned up
- Dead state: `generated_code` session key is initialised but never used; the "check your terminal" info line is a local-dev leftover that confuses hosted users
- No row/file-size guard — a huge upload goes straight into pandas + DuckDB in memory
- No .gitignore, no .env.example / secrets template, no tests, no screenshot or demo GIF in README
- GitHub repo description/topics: unknown (not verified in this audit)

## Improvement plan
1. Fix README model name; add the live demo URL near the top with a screenshot of a real Q&A exchange
2. Wrap agent/tool construction in `st.cache_resource`; delete the temp file after the DuckDB load; drop the terminal info line and dead session state
3. Add an upload size/row guard with a friendly message, plus a bundled sample CSV + "try a sample question" path so the demo sells itself in 10 seconds
4. Add `.gitignore` and `.streamlit/secrets.toml.example`; pin remaining requirements
5. Longer term: render result charts (the agent already returns data — a chart toggle would differentiate it from the upstream template)

## Audit — 2026-10-24 (GitHub-wide review)
- Read README, root listing via GitHub connector, and `ai_data_analyst.py` end to end on 2026-10-24
- Verified: 4-file root (LICENSE, README.md, ai_data_analyst.py, requirements.txt); key flow matches the known live behaviour (secrets first, sidebar fallback)
- Known live caveat from the Streamlit 403 saga: Streamlit Cloud session state can hold a stale key until app reboot — operational, not a code defect
- Verdict: strongest of batch B — the only one demo-ready today; its gaps are polish and efficiency, not correctness
