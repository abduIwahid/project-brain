# Project: PSX Investment Agent — an AI analyst for the Pakistan Stock Exchange, on Agno AgentOS

## Facts
- Repo: github.com/abduIwahid/psx-investment-agent (created 2026-10-24, adapted from awesome-llm-apps, Apache-2.0 LICENSE present)
- Stack: Agno + AgentOS server app (NOT Streamlit) + yfinance tools; single file `investment_agent.py` (27 lines) + requirements.txt — whole repo is 4 files
- Model in code: `gemini-3.8-flash`; README still says "Gemini 2.5 Flash" — stale
- Key handling: none in code — Agno reads `GOOGLE_API_KEY` from the environment (README documents the export step)
- Localisation is prompt-level: the agent description teaches the PSX `.KA` Yahoo suffix (OGDC.KA, LUCK.KA, HBL.KA, …) and demands markdown tables + actionable insights
- Hosting: not deployed — needs a real host (Render/Railway/VPS-class); AgentOS serves a browser playground UI when run

## Strengths
- The most original adaptation of batch B: a generic stock agent re-aimed at an underserved market (PSX) that global templates ignore
- Tiny, honest codebase — the entire product is one agent definition, easy to reason about and extend
- README carries an "educational tool only — not financial advice" disclaimer and concrete PSX example questions
- AgentOS gives it a proper chat UI and API surface without hand-rolled frontend work

## Weaknesses / risks
- `debug_mode=True` is left on in the only file — verbose Agno debug output in any deployment
- `agent_os.serve(..., reload=True)` is a dev setting shipped as the entry point
- No API-key validation or friendly failure: a missing `GOOGLE_API_KEY` surfaces as a raw framework error
- yfinance data quality for PSX tickers is unofficial and can lag or break without notice; nothing in the app checks for empty/stale tool results before the model "analyzes" them
- requirements.txt is fully unpinned (`google-genai` has no version at all)
- No .gitignore, no .env.example, no tests, no screenshot of an actual comparison table in README
- GitHub repo description/topics: unknown (not verified in this audit)

## Improvement plan
1. Turn off `debug_mode`, drop `reload=True`, and add a startup check that prints one clear line when `GOOGLE_API_KEY` is missing
2. Deploy it (it is the batch-B repo most blocked by hosting): a small always-on host + the AgentOS URL linked from README and the portfolio; note the Oracle Cloud Always Free lead filed 2026-10-24 as a candidate host
3. Add a screenshot of a real OGDC.KA vs PPL.KA comparison table to the README — proof beats description for a finance tool
4. Add a guard in instructions: if tool data is missing or stale, the agent must say so instead of filling gaps; repeat the not-financial-advice line in the agent's own instructions
5. Pin requirements; add `.env.example`

## Audit — 2026-10-24 (GitHub-wide review)
- Read README, root listing via GitHub connector, and `investment_agent.py` end to end on 2026-10-24
- Verified: 4-file root (LICENSE, README.md, investment_agent.py, requirements.txt); no Streamlit anywhere — the AgentOS framing in the README is accurate
- Verdict: highest identity/originality of batch B, lowest operational readiness — 27 lines of code still waiting for a host and two one-line fixes (debug, reload)
