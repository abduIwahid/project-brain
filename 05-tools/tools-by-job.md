# Tools by job

The agent/AI toolbox (Ponytail, Hallmark, Impeccable, last30days, REA, Graphify, Scrapling, Humanizer, Diagram Design, /taste) lives in `agent-skills-toolbox.md` in this folder. The free-tier stack lives in `free-stack.md`. This file is the wider bench — every tool here is either proven in the owner's projects or a long-established free resource.

## Design
- **Figma** — interface design; also used for as-is replicas of live sites (the replica must be faithful: real screenshots, real layout, real details — never an approximate copy).
- **Canva** — social posts, posters, quick graphics.
- **Unsplash / Pexels** — real premium photography (house rule: photos are backgrounds with a scrim, never AI-generated, no faces in general imagery).
- **Google Fonts** — Anton, Archivo, Instrument Serif, JetBrains Mono are the house faces.
- **Context.dev web-styleguide tool** — extract a site's design tokens (colours, type, spacing) before building your own fresh version in that language. Tokens first, never a clone.

## Frontend
- **UI Layouts** (ui-layouts.com) — component/effect library; verdicts in `../01-design-system/ui-layouts-library.md`.
- **getlayers.ai** — finished sites as full build prompts (method in `../07-prompts/mega-prompt-method.md`).
- **GSAP + ScrollTrigger**, **three.js** — deliberate motion/WebGL (see the Helix Hero prompt).
- **Sileo** — React toasts done properly.

## Backend & hosting (free tiers that work)
- **Vercel** — Next.js and static sites, serverless functions, custom domains.
- **GitHub Pages** — vanilla sites, zero config.
- **Render** (free web services) + **UptimeRobot** `/health` pings — free backends that stay awake.
- **Hugging Face Spaces** — ML demos and fallback model hosting.
- **Cloudflare** — DNS, and Pages/Workers when a second host is useful.

## Database & BaaS
- **Supabase** — Postgres + auth + RLS + storage (the default for new full-stack work).
- **Neon** — serverless Postgres when Supabase is more than the job needs.

## Quality, SEO, audit
- **is-it-vibecoded** (is-it-vibecoded.vercel.app) — a slop-score sanity check for AI-built sites; pair with the de-slop list in `../01-design-system/frontend-preferences.md`.
- **Google Search Console** — verify, submit sitemap.xml, keep robots.txt + llms.txt + OG cards in place (raster og:image, same-domain, redirect-free).
- The 15-phase audit: `../09-process/website-audit-playbook.md`.

## Domains (free names, honestly labelled)
- **is-a.dev** — free `yourname.is-a.dev` via a GitHub PR; for developer projects; no renewal.
- **runs-on.dev** — free name with CNAME/TXT records; can front a Vercel project properly.
- **eu.org** — free since 1996, volunteer-run, slow manual approval, bring your own nameservers.
- **JS.ORG** — for JavaScript projects, PR-based.
- Cautionary tale: Freenom's free TLDs died in 2023 — **a free name is never truly yours; anything on a CV or in print belongs on a paid registrar domain.**

## Learning
- **NASA Open Science training** (science.nasa.gov/open-science/training) — free, certificated: Open Science Essentials (~2h) and Open Science 101 (~12h); FAIR data and reproducible research, directly useful for ML work.
- **roadmap.sh** — public learning roadmaps for almost every stack role.
- **free-for-dev** (github.com/ripienaar/free-for-dev) — the maintained index of free tiers for developers; check it before paying for anything.
