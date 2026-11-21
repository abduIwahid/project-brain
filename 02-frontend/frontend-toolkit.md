# Frontend toolkit

## Core stack (proven in production)
- **Next.js + React + TypeScript** — the portfolio and the healthcare app (WhyRisk). App Router, server components where they help, `next/font` for self-hosted fonts.
- **Vanilla HTML/CSS/JS** — the hackathon demo (Plan Banao), the class hub (Study Hub) and five free-API mini-apps. No build step, deploys anywhere, ages well. Pick this for demos, tools and content sites.
- **Tailwind CSS** — with a warning earned the hard way: if theme colours are defined as plain `var(--x)` (hex-valued, no `<alpha-value>`), every opacity utility (`bg-background/95`, `border-primary/30`) silently generates NO CSS while the build passes. Fix: RGB-triplet variables + `rgb(var(--x) / <alpha-value>)` in the config — and prove a critical class exists in the compiled CSS before calling it shipped.
- **Fonts** — Anton (display), Archivo (body), Instrument Serif italic (accents), JetBrains Mono (labels/data). Self-host via `next/font` or `@font-face`; `display=swap` + preconnect.

## Component & effect sources
- **UI Layouts** (ui-layouts.com + cursify.ui-layouts.com) — the standing first check for components/effects. Verdicts, adaptations and which code is held locally: `../01-design-system/ui-layouts-library.md`. Adapt code to house style; never paste demo styling.
- **getlayers.ai** — finished websites written out as full build prompts (see `../07-prompts/mega-prompt-method.md`).
- **Sileo** (`npm install sileo`) — React toasts with every state, action buttons and a promise API.
- **GSAP + ScrollTrigger** — for deliberate scroll choreography (see the Helix Hero prompt in `../07-prompts/`); three.js when a scene genuinely needs WebGL.

## Patterns that earned their place
- Design tokens as CSS variables (colour/type/spacing/radius/shadow) — one source of truth, dark mode as a token swap.
- Service worker + cache discipline: **whenever a cacheable asset changes, bump its `?v=` query AND the SW cache name in the same commit** (see `../09-process/pre-ship-gate.md`).
- Skeleton loaders and designed empty states on every data surface.
- One filled primary button per view; everything else outlined/ghost.
- Real photography (Unsplash/Pexels) as backgrounds with a scrim — never AI-generated product imagery, no faces in general imagery.
