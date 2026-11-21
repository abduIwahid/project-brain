# Project setup — before and around the build

Standing setup knowledge from Abdul Wahid's saved references (2026-10-23).

## Seed every AI-built project with 6 gatekeeper files (@ksiijexplains)

Before an AI editor writes an app from scratch, the repo root gets:

1. **PRD** — product requirements: what it is, who for, features in/out.
2. **ARCH** — architecture: tech stack, folder structure (src/, components/,
   api/, db/), database choice, and the data flow (App → API → DB).
3. **DESIGN** — the visual system (palette, fonts, components).
4. **MEMORY** — decisions and context the agent must not forget.
5. **RULES** — the project's hard rules and don'ts.
6. **TRACKER** — what's done, in progress, and next.

Why: they are persistent guardrails — the agent drifts less, hallucinates
fewer features, doesn't rewrite half the codebase, and doesn't leak secrets.
(Same spirit as this brain folder, per project.)
The same six-file pattern appears twice in Abdul Wahid's saved collection
(@ksiijexplains #7 and @ai.with.dilip/@avani.codes #32) — treat it as the
standard seed for any new AI-built project.

## Free deployment stack (@areeb.theaikhan)

When the bill must be $0: frontend on Vercel, backend on Render (or
Hugging Face), database on Neon (or Supabase), media on Cloudinary.
(Pairs with item 31's Railway option for free backend hosting.)
Variant (@aarohi.inframe): Cloudflare Workers or Vercel serverless for
backend logic, Supabase free tier for DB + storage, and the free ops
layer — Matomo (analytics), Sentry (error tracking), Resend (email),
Dodo Payments / Razorpay (payments).
Traditional/static options (@shaheer__build): InfinityFree for PHP/MySQL
and WordPress (free subdomain + SSL), GitHub Pages for static sites and
portfolios, Netlify for frontend deploys; free domains via DigitalPlat
FreeDomain (item 50).

## Agent tooling worth installing (@avani.codes)

For Claude Code / Codex-style agents: Supabase (database + auth),
Playwright CLI (browser automation), Strix (web search/research),
Skill UI (ready UI components), Context7 (live library docs, so the agent
doesn't code against stale training data).
Also: **Reticle** (@divbyai) — verifies what an AI-built app actually did
(behaviour checks, not screenshots); agents say "done" without running
the code, and the worst bugs hide under a fine-looking UI.

## Build order for an AI-built app (@lincolndevine)

Sequence matters more than skill — build in this order or rebuild later:
1. Data model (how data moves through the app)
2. Auth — reach a blank logged-in screen first
3. ONE core user loop, end to end (log in → do the thing → see the thing)
4. Payments / subscriptions
5. Polish the core flow
6. Launch prep

## Domain setup — 3 steps after buying a domain (@buildwithnico)

1. **App on a subdomain** (app.yourdomain.com), marketing site on the root —
   decoupled deployments and teams from day one.
2. **Email from separate domains** — product/cold email goes from two
   dedicated extra domains, never the main one, so a deliverability problem
   can't burn the main domain's reputation.
3. **sitemap.xml from the start** so Google indexes the public pages.
   (Abdul Wahid's sites already do this — see the SEO entries in saved references.)
