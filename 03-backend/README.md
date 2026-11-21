# 03 · Backend

**What this folder is:** the server-side playbook — APIs, proxies, email, and free hosting that actually works.

## File
`backend-toolkit.md` covers:
- **Core stack** — FastAPI for ML serving, Flask for small services, Next.js API routes / Vercel serverless for co-located endpoints, and plain stdlib Python when zero-dependency portability matters (a judge's laptop is an environment too).
- **The secrets rule** — never put an API key in client-side code; the browser calls YOUR endpoint, your endpoint calls the provider. Cap the proxy: POST-only, one allowed model, a token ceiling.
- **Email** — Resend via plain fetch, session-checked routes, and graceful skip when env vars are unset.
- **Free hosting** — Render free tier + UptimeRobot `/health` pings every 5 minutes to beat spin-down; Groq/Gemini free tiers and their rate caps; Hugging Face Spaces as ML fallback.

## When to use it
- Designing the API for any full-stack project (pair with the project's `API_SPEC.md` from `../07-prompts/project-brain-prompt.md`).
- Adding an AI feature without leaking a key.
- Deploying a backend for free without a card.
