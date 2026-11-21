# 02 · Frontend

**What this folder is:** how interfaces here are actually built — the stacks, the traps, and the patterns that survived production.

## File
`frontend-toolkit.md` — one file, four sections:
- **Core stack** — when to pick Next.js/React/TypeScript vs. plain HTML/CSS/JS with no build step (demos, tools, content sites age better vanilla; apps earn the framework).
- **The Tailwind theme-alpha trap** — if theme colours are plain `var(--x)`, every opacity utility silently generates no CSS while the build passes. The fix, and how to prove a class exists in the compiled CSS.
- **Component & effect sources** — UI Layouts, getlayers.ai, Sileo toasts, GSAP/three.js — where components come from (verdicts live in `../01-design-system/ui-layouts-library.md`).
- **Patterns that earned their place** — design tokens as CSS variables, service-worker cache discipline (bump `?v=` + SW cache name with every asset change), skeleton loaders, designed empty states, one filled primary button per view.

## When to use it
- Choosing a frontend stack for a new project.
- Debugging "the class is there but nothing renders" (start with the Tailwind trap).
- Setting up caching/PWA behaviour on a static site.

Pair with `../01-design-system/` (how it should look) and `../09-process/pre-ship-gate.md` (how it gets verified live).
