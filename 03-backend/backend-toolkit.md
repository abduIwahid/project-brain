# Backend toolkit

## Core stack (proven in production)
- **FastAPI** — ML model serving (SHAP explanations behind an API for the healthcare app), typed, fast to ship.
- **Flask** — small services and quick APIs.
- **Next.js API routes / Vercel serverless functions** — thin proxies and form endpoints co-located with the frontend.
- **Plain Python (stdlib only)** — the hackathon agent system: one command, zero dependencies, runs anywhere including a judge's laptop. When portability matters more than features, stdlib-only is a feature.

## Rules that came from real incidents
- **Never put a secret in client-side code.** An API key found in a frontend bundle gets moved to a server proxy + environment variable the same day. The browser calls YOUR endpoint; your endpoint calls the provider.
- **Cap what a proxy will spend:** POST-only, one allowed model, a max-tokens ceiling.
- **Email from the server:** Resend via plain `fetch` (no SDK needed) — confirmation/reminder senders behind session-checked routes; when the env vars are unset, skip the send with a server log line instead of throwing into the user flow.
- **Free backend hosting that actually works:** Render free tier for a Node/Express (or Python) service + **UptimeRobot** pinging `/health` every 5 minutes to keep it awake (free tier spins down; a cold start "can delay requests by 50 seconds or more"). Filed from a verified walkthrough — re-test card requirements before relying on them.
- **Model APIs:** Groq (fast open models; free tier has per-minute token caps — design retries with backoff around them) and Gemini (key via AI Studio) for LLM features; Hugging Face Spaces as a fallback host for ML services.
- **Auth:** session-checked API routes, role checks on admin routes, password minimums enforced server-side, RLS on the database (see `../04-database/`).
