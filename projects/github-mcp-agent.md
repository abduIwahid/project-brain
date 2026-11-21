# Project: GitHub MCP Agent — ask questions about any repo, answered via the official GitHub MCP server

## Facts
- Repo: github.com/abduIwahid/github-mcp-agent (created 2026-10-24, adapted from awesome-llm-apps, Apache-2.0 LICENSE present)
- Stack: Streamlit UI + Agno `MCPTools` over stdio + Docker running `ghcr.io/github/github-mcp-server`; single file `github_agent.py` (150 lines) + requirements.txt — whole repo is 4 files
- Local only by design: needs Docker installed and running on the user's machine, a GitHub token (repo scope) and an LLM key, both pasted into the sidebar
- Toolsets are sensibly scoped: `GITHUB_TOOLSETS=repos,issues,pull_requests`; queries run under a 120 s timeout

## Strengths
- Real MCP, not a mock: it drives GitHub's official MCP server in its official container, so the tool surface stays current with GitHub
- Security posture is reasonable for a local tool: token stays on the user's machine, toolsets are limited to read-oriented repo/issue/PR access
- Good failure handling around the agent call (explicit timeout message, token checks before running, error strings surfaced in the UI)
- Query templates per type (Issues / PRs / Repository Activity / Custom) lower the blank-page problem

## Weaknesses / risks
- **The Gemini adaptation is unfinished — the headline defect of batch B.** The sidebar collects a "Google Gemini API Key" (variable still named `openai_key`, stored as `GOOGLE_API_KEY`), but `run_github_agent` refuses to run unless `OPENAI_API_KEY` is set, the `Agent` is created with **no model at all** (Agno then defaults to OpenAI), and the UI copy still says "powered by OpenAI" / "Enter your OpenAI API key". As shipped, following the README with only a Gemini key ends in an error loop
- The default repository in the UI is still the upstream author's `Shubhamsaboo/awesome-llm-apps` — the adaptation pass never touched it
- `google-genai` sits in requirements.txt but is never imported or used by the code
- Keys are copied into `os.environ` globally — acceptable locally, but worth a comment so nobody deploys this pattern
- No .gitignore, no .env.example, no tests, no screenshot in README; requirements file lacks a trailing newline (cosmetic)
- GitHub repo description/topics: unknown (not verified in this audit)

## Improvement plan
1. Finish the Gemini swap: pass `model=Gemini(id="gemini-3.8-flash", api_key=...)` to the Agent, check for `GOOGLE_API_KEY` in `run_github_agent`, and scrub every "OpenAI" string from UI copy and error messages — or honestly revert the README to say it needs an OpenAI key. One story, told consistently
2. Change the default repository to one of Abdul Wahid's own (e.g. abduIwahid/fa24-bai) so the first run demos his own work
3. Remove the unused `google-genai` requirement if the OpenAI route is kept, or keep it once the Gemini model is actually wired
4. Add a preflight check with a clear message when Docker isn't running (currently that failure surfaces as a raw exception string)
5. Add `.gitignore` / `.env.example` and a screenshot of a real answer

## Audit — 2026-10-24 (GitHub-wide review)
- Read README, root listing via GitHub connector, and `github_agent.py` end to end on 2026-10-24
- Verified: 4-file root (LICENSE, README.md, github_agent.py, requirements.txt)
- The README's claim "reworked to run on Gemini instead of OpenAI" is contradicted by the code — flagged here as an accuracy risk on a public portfolio repo, not just a bug
- Verdict: a good concept with real MCP plumbing, let down by a half-finished model swap — the cheapest high-value fix in batch B (one focused edit session)
