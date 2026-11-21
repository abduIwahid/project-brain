# Project: Agentic RAG Agent — Q&A over web sources with the reasoning left visible

## Facts
- Repo: github.com/abduIwahid/agentic-rag-agent (created 2026-10-24, adapted from awesome-llm-apps, Apache-2.0 LICENSE present)
- Stack: Streamlit UI + Agno (Knowledge, ReasoningTools) + LanceDB vector store; single file `rag_agent.py` (244 lines — the largest of batch B) + requirements.txt; whole repo is 4 files
- Models in code: chat `gemini-3.8-flash`, embeddings `gemini-embedding-001` — one Google key powers both; README still says "Gemini 2.5 Flash" — stale
- Key flow: `st.secrets` prefill → `GOOGLE_API_KEY` env / `.env` (python-dotenv) → manual entry, in that order
- Hosting: not deployed as far as this audit can tell; LanceDB lives at `tmp/lancedb` (relative, ephemeral)
- Lineage: the README explicitly ties this pattern to Study Hub's Ask-the-Hub assistant — it is the public demo of the same retrieval approach

## Strengths
- Best-engineered of batch B: knowledge base and agent are built once via `st.cache_resource` instead of being rebuilt per rerun (the mistake ai-data-analyst makes)
- Streaming two-pane UI — reasoning on the left, answer on the right, citations collected and rendered as a Sources list; this is the "explainable AI" story Abdul Wahid sells, actually demonstrated
- Sensible defaults everywhere: secrets/env prefill, one-click sample prompts, per-URL load-once tracking in session state
- Instructions force the two behaviours that make RAG trustworthy: always search knowledge first, always include sources

## Weaknesses / risks
- No error handling around `knowledge.add_content(url=...)` or the streaming `agent.run` — one dead URL or API hiccup crashes the flow with a raw traceback
- Subtle staleness trap: the key is captured inside the cached `load_knowledge`/`load_agent` closures, so pasting a different key after first load silently keeps using the old one until restart
- Ephemeral storage: `tmp/lancedb` vanishes on any hosted restart and the table is still named `agno_docs` (upstream leftover), so a deployment would re-embed everything per cold start
- The default knowledge source is an upstream-flavoured article (theunwindai MCP-vs-A2A post) with matching canned prompts — the demo answers questions about someone else's content, not Abdul Wahid's
- README model name stale vs code; no .gitignore, no `.env.example` (ironic — the code loads one), no tests, no screenshot
- GitHub repo description/topics: unknown (not verified in this audit)

## Improvement plan
1. Wrap URL ingestion and the streaming run in try/except with plain-language errors (bad URL, quota, network) — this is the demo most likely to be shown live
2. Fix the key-staleness trap: include the key in the cache key or rebuild when it changes
3. Repoint the default source and sample prompts at Abdul Wahid's own material (e.g. a Study Hub course page or his portfolio articles) so the demo is personal, and rename the table to match
4. Fix the README model name; add a screenshot of the reasoning/answer split — it is the feature, and nobody will run the code to discover it
5. Deploy to Streamlit Cloud with the secrets key (pattern already proven by ai-data-analyst) and link it from the Study Hub case-study section of the portfolio
6. Add `.gitignore` and the `.env.example` the code already expects

## Audit — 2026-10-24 (GitHub-wide review)
- Read README, root listing via GitHub connector, and `rag_agent.py` end to end on 2026-10-24
- Verified: 4-file root (LICENSE, README.md, rag_agent.py, requirements.txt)
- Verdict: the strongest engineering and the strongest portfolio story of batch B (it is Study Hub's RAG, productised) — held back only by missing error handling and an un-personalised default demo
