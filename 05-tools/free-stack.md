# Free stack — tools Abdul Wahid can actually use (verified 2026-10-24/25)

Abdul Wahid's constraint: his card is EMPTY, so any service that demands a card
on file (even for a $0 plan) is effectively paid for him until the card
is loaded. "Free" below means usable without a working card unless noted.

## Hosting / infra
- **Vercel** — frontend hosting (his default; Study Hub, portfolio live).
- **Oracle Cloud Always Free** — the only real always-on free VPS
  (2 OCPU / 12 GB ARM after the Jun 2026 halving, 200 GB disk, 10 TB
  egress). Signup needs a REAL credit card for identity verification
  (~$1 refundable hold; prepaid/virtual rejected) — the one blocker.
  Best home for backends: MediSight ML service, NearSend signaling,
  PSX agent. Home Region choice at signup is permanent (pick UAE East
  Dubai). See saved-references item 100.
- **Hugging Face Spaces** — free Gradio SDK on ZeroGPU only; Docker
  Spaces are paid. Sleeps after 48h idle; wake ~30–60s. Workable but
  janky (NearSend saga, 2026-10-24).
- **Render** — has a free web-service tier (spins down when idle) BUT
  requires a card on file → blocked for Abdul Wahid today.
- **Koyeb** — card required since Feb 2026. **Railway** — one-time $5
  trial credit, then paid. **Fly.io** — no real free tier for new users.
- **Supabase** — DB + Auth + Storage; free tier (500 MB DB, 1 GB
  storage, 50k MAU) is plenty for his projects. His default database;
  MediSight's auth + 72 RLS policies already live there — switching
  costs a rewrite for zero gain. (Pure-Postgres alternative: Neon.)
- **Cloudflare** — DNS, free R2 object storage (10 GB), Workers,
  Turnstile (free captcha).

## AI APIs (free tiers)
- **Groq** — live in Study Hub's Ask-the-Hub fallback; fast, no card.
- **Google AI Studio (Gemini)** — his main stack; separate key per app.
- **OpenRouter** — free-model tier; OpenAI-compatible.
- **GitHub Models** — free with his GitHub account (rate-limited,
  good for prototyping).
- **Cerebras / Mistral / NVIDIA NIM / HF Inference** — listed in the
  awesome-freellm-apis directory (saved-references item 99; live
  companion freellm.net).
- **DeepSeek** — cheap, not free: his key works but balance is $0
  (item 97); Search/Fetch "free" window only covers harness tool calls.

## Dev / ops helpers
- **GitHub Actions** — CI minutes free for public repos.
- **Resend** — transactional email (portfolio contact form, live).
- **UptimeRobot** — free uptime monitoring + keeps endpoints warm-ish.
- **Sentry** — free error tracking tier.
- **Umami** — free analytics (self-host or cloud trial); Vercel
  Analytics free tier also exists.

- **Cloudflare Tunnel (from reel item 110, dev.baytchain, 2026-10-25):** expose a local/self-hosted service (e.g. a Docker container) at a public Cloudflare URL for $0, no open ports. Catch: the host machine must stay on — useful for demos/devices at home, not an always-on server substitute.

- **Cloudflare free tier vs Vercel (from reel item 288, @codewithnishant, 2026-11-23):** Cloudflare free plan gives free SSL + unmetered DDoS protection, static sites (Pages) with unlimited requests, domains at cost (zero markup), R2 storage with ZERO egress fees, and 100,000 Workers requests/day free. The comparison that matters for Abdul Wahid: **Vercel Hobby is personal, non-commercial use ONLY** — a client/commercial site on Hobby breaks Vercel's terms; Pro starts at $20/mo. All his current sites are personal/student projects, so Hobby is fine today; the day he ships paid client work, the choices are Vercel Pro or Cloudflare. Also noted: Vercel's terms allow AI training on content unless you opt out; Cloudflare blocks AI-training crawlers with one setting. Cloudflare is already connected here (custom.cloudflare) and his is-a.dev DNS runs through Cloudflare DoH — so a future static/client project can go on Pages at $0 without new accounts.
