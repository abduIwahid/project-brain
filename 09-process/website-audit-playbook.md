# Website Audit Playbook — STANDING (set by Abdul Wahid 2026-11-21)

Abdul Wahid's order (2026-11-21, verbatim intent): this audit system applies to EVERY website project, strictly, without him having to ask again. Muse must use its brain/knowledge proactively — suggest and apply improvements like an intelligent agent, not wait like a chatbot. Source: the "Master Website Audit, Optimization & Premium Redesign Prompt" + QA additions he supplied 2026-11-21 (15 phases + cross-browser, dark/light, Core Web Vitals, real-device, backup/regression).

## When it runs
- On every NEW website project: a full audit pass before calling it done.
- On every EXISTING site when work resumes on it: audit the touched areas + anything the audit would flag.
- Proactively: when Muse notices an audit-class defect during any work, fix it in the same round (consistency sweep) and report it.

## The checklist (condensed from the 15 phases)
1. **Analyse first** — read the whole project (pages, CSS, JS, config, assets) before changing anything. Note dead code, duplicates, broken imports, security issues, bottlenecks.
2. **Page-by-page UI/UX** — every component: alignment, spacing, typography, colour, contrast, dimensions, responsiveness, accessibility, interaction. Fix in the site's own design language; never redesign for change's sake.
3. **Design system** — tokens for colour/type/spacing/radius/shadow; one grid system; consistent breakpoints; every page feels like one product.
4. **Responsive** — fluid by default (clamp, grid minmax/auto-fit, flex). Verify the width matrix 320/360/390/414/480/768/820/1024/1280/1440/1920: no overflow, no clipping, no overlap, no squeezed multi-column layouts — mid widths get intentionally stacked layouts.
5. **Touch** — targets ~44-48px, no hover-only functionality, visible feedback for every action.
6. **Motion** — transform/opacity only, consistent easing/durations, no purposeless animation, prefers-reduced-motion respected.
7. **Functionality** — every button/link/form/flow tested; error, loading and empty states designed; never fake interactions.
8. **Charts/data viz** — labels, legends, distinct colours, readable on mobile, real data only, never invent values.
9. **Performance** — small bundles, optimised images, font display=swap + preconnect, caching done right (versioned assets + a service worker that cannot strand users on stale files), no layout shift.
10. **Accessibility + SEO** — semantic HTML, one h1 per page, focus-visible styles, AA contrast (check BOTH themes), alt text, unique title + meta description per page, canonical URLs, absolute OG URLs, robots.txt + sitemap.xml.
11. **Cleanup** — remove only verified-dead code/CSS; keep the codebase readable.
12. **Security** — no secrets in frontend code (server proxy + env vars), escaped rendering of user text, security headers (nosniff, referrer-policy, frame-options, permissions-policy).
13. **Testing** — after changes: full width matrix + console-error sweep on every page, both themes, key flows end-to-end. Never claim tested what wasn't.
14. **Polish** — final visual pass as a visitor: alignment, spacing rhythm, balance; anything unnecessary removed, anything missing added.
15. **Report** — what was found, fixed, improved per page; files changed; what remains and why.

## Extra QA (from Abdul Wahid's additions)
- Cross-browser: Chrome/Firefox/Safari/Edge; iOS Safari quirks (viewport units — use dvh where it matters, font rendering, touch).
- Dark AND light mode audited separately — hardcoded SVG/canvas colours are the classic dark-mode bug.
- Core Web Vitals mindset: LCP/INP/CLS — keep pages light, reserve space, avoid late layout shifts.
- Real-device check: Abdul Wahid's phone feel-check is the final verdict on his own sites.
- Regression protection: verify before/after; his git-on-main workflow + read-back SHA verification is the backup discipline.

## House rules that stack with this playbook
- Pre-ship gate + consistency sweep + responsiveness rule (AGENTS.md) remain in force.
- Public-facing copy: propose wording first, ship on approval. Everything else: do it, report after.
- Previews as images/GIFs in chat, never links only.

## Vibe-code security sweep — the 14 things a hacker tries first (from reel #286, @ryannaghib, 2026-11-23)

Run this as an extra phase on any app with auth, payments, uploads or AI — most of Abdul Wahid's apps are AI-assisted builds, so these are the exact holes to check before calling a project production-ready:
1. **/admin route** — is an admin panel reachable/unguarded by URL alone? Server-side role check on every admin route.
2. **ID in the URL (IDOR)** — change `?id=` / path id to someone else's; the server must verify ownership, not just login.
3. **API key in the browser** — no secret keys in client code, ever; proxy through the server + env vars (the MTM Groq-key lesson).
4. **Edit the price** — prices computed server-side; client-sent amounts are never trusted.
5. **Order −1 items** — quantity validated server-side (positive integers, stock limits).
6. **Fake a payment** — payment success verified with the provider server-side (webhook/signature), never from a client redirect.
7. **Redeem 100 times** — coupons/codes are single-use, enforced in the DB, not the UI.
8. **Admin at signup** — role fields in signup payloads ignored server-side; roles assigned only by admins/defaults.
9. **Guess the login code** — OTPs rate-limited, short-lived, attempt-capped.
10. **Prompt-inject the AI** — user input to an LLM is untrusted; instructions hierarchy + output checks on AI features.
11. **Script in the username (XSS)** — all user text escaped/sanitised on render, everywhere it appears.
12. **Upload a non-photo** — file type validated by content (magic bytes), not extension; uploads never execute; size capped.
13. **Find your ENV** — .env never committed; repos scanned for secrets; keys rotated if ever exposed.
14. **Type a query into your database (SQLi)** — parameterised queries/ORM only; no string-built SQL.
