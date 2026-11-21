# Project: AI Deep Research Agent — topic in, planned multi-step research and an executive report out

## Facts
- Repo: github.com/abduIwahid/ai-deep-research-agent (created 2026-10-24, adapted from awesome-llm-apps, Apache-2.0 LICENSE present)
- Stack: Streamlit UI + google-genai SDK only (no Agno); single file `research_agent.py` (102 lines) + a 2-line requirements.txt — whole repo is 4 files
- Uses Gemini's stateful Interactions API: phases chained via `previous_interaction_id` with `store=True`
- Models in code (all preview IDs): planning `gemini-3-flash-preview` + google_search tool; research agent `deep-research-pro-preview-12-2025` (background mode, polled); synthesis `gemini-3-pro-preview`; infographic `gemini-3-pro-image-preview`
- Hosting: not deployed (local only, as far as this audit can tell); API key is sidebar-entry only — no `st.secrets` support

## Strengths
- Genuinely agentic flow: plan → user selects tasks → deep research → synthesis + TL;DR infographic, with context carried across phases instead of one giant prompt
- User stays in control: plan is reviewable and tasks are checkbox-selectable before the expensive research step runs
- Background execution with a progress bar and elapsed timer (polls every 3 s up to 300 s) suits a 2–5 minute research job
- Report is downloadable as markdown; each phase has its own try/except with an on-screen error
- Compact, readable code; helper functions (`get_text`, `parse_tasks`, `wait_for_completion`) are cleanly separated

## Weaknesses / risks
- Every model/agent ID is a preview build — preview IDs are the first thing Google retires or renames; this repo has the highest model-churn exposure of batch B
- `parse_tasks` depends on the planner returning an exact numbered format; a format drift silently yields an empty task list with no fallback message
- No `st.secrets` demo mode (unlike ai-data-analyst / agentic-rag-agent) — every visitor needs their own key, so a public demo would burn Abdul Wahid's quota or not work at all
- Dense one-liner style in places (the Reset button packs a list comprehension of setattr calls) — hard to extend safely
- Polling loop has no handling for a failed/cancelled final status beyond displaying it
- No .gitignore, no .env.example, no tests, no screenshot/sample report in README; requirements are bare floors
- GitHub repo description/topics: unknown (not verified in this audit)

## Improvement plan
1. Pin the model IDs in one config block at the top with a comment to re-check them monthly; add a graceful error that names the model when the API rejects an ID
2. Add `st.secrets` support mirroring ai-data-analyst's pattern, then deploy to Streamlit Cloud so the portfolio can link a live demo
3. Commit a sample generated report (markdown + infographic) into the README — this project's output is its best advertisement
4. Harden `parse_tasks`: if zero tasks parse, show the raw plan text and let the user proceed with the whole plan as one task
5. Add `.gitignore`, `.env.example`, and pin requirements floors to tested versions

## Audit — 2026-10-24 (GitHub-wide review)
- Read README, root listing via GitHub connector, and `research_agent.py` end to end on 2026-10-24
- Verified: 4-file root (LICENSE, README.md, research_agent.py, requirements.txt)
- Context from earlier work: the DeepSeek Search/Fetch API was tested for this project on 2026-10-24 and deliberately NOT wired in (Abdul Wahid's DeepSeek balance is $0.00); Gemini remains the only engine
- Verdict: the most ambitious of batch B and the most fragile — its value is locked behind preview model IDs and the lack of a hosted demo
