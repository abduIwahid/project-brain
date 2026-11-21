# Code — actual, reusable code

**What this folder is:** real code, not descriptions of code. Everything here either shipped in a production project or was collected as a component source for future projects. Each subfolder says where the code came from and how to reuse it.

> **The house rule for all of it:** adapt code into the project's own design system (tokens from `../01-design-system/`) — never paste demo styling, demo colours or placeholder data into a real project. Several files below are references with verdicts attached; a file being here does not mean "approved to ship as-is".

---

## `ui-layouts/` — the UI Layouts component collection (61 files)
The exact component code the owner collected from [ui-layouts.com](https://www.ui-layouts.com) and [cursify.ui-layouts.com](https://cursify.ui-layouts.com) (open-source, copy-paste React/Next components; Tailwind + motion based). Cursors (blob, character, text-icon, smooth-follower), canvas effects (dot particles, vertical bars noise, WebGL blob, neural noise), carousels (Embla variants, framer), modals & drawers, stacking cards, sticky scroll, marquees, galleries, form primitives (phone input, datetime picker, multi-select), the TimelineAnimation engine (inside `code-display.md`), and more. `image-ripple-effect/` holds the multi-file WebGL ripple (scene/shaders/model/hooks).

**Before using any of it, read the verdicts** in `../01-design-system/ui-layouts-library.md` — every component there is marked adopt / adapt / rejected, with reasons. Known traps already documented: the FAQ accordion in `code-display.md` has an unwired-button bug as pasted; its sample hero carries fabricated social proof ("Join 80,000+ designers") — a banned pattern, never ship; cursor trails and glass/gradient families are rejected in house style. Credit: UI Layouts and its community creators; this collection is kept for the owner's project use.

## `plan-banao-web/` — a complete shipped site's engine room
From the live Plan Banao site (planbanao.vercel.app), a no-build vanilla web app:
- `style.css` — the full neubrutalist design system (tokens, hard shadows, components, dark mode, responsive matrix) of a shipped site. The best single reference here for "how a complete vanilla design system looks".
- `planner.js` — the deterministic planning engine: fact base with supersession, constraint validator, plan builder. The JavaScript twin of the Python system below.
- `app.js` — the UI layer: tabbed results, the request tracker (live pipeline steps), agent chat with transactional updates, what-if simulator, risks/recommendation rendering.
- `api-chat.js` — the server-side LLM proxy pattern: POST-only, one allowed model, token ceiling, key in env only. (Lives at `api/chat.js` in the real project.)
- `sw.js` + `vercel.json` — cache-first service worker with a versioned cache name, and the header set (no-cache for assets, security headers) that keeps deploys honest.

## `agent-system-python/` — the judged agent system
- `main.py` — the complete MTM Hackathon '26 agent system in one stdlib-only Python file: the model only extracts facts; planning, validation and transactional updates are deterministic code; every model call is traced with tokens. Run it: `python3 main.py <messages.txt>`. The architecture is explained in `../06-agents/agent-playbook.md`; the full story is in `../projects/mtm-hackathon-26.md`.

## `portfolio-effects/` — shipped scroll effects
- `scroll-effects.css` — extracted verbatim from a production portfolio: the 3D Card Zoom (cards settle out of a 3D tilt on reveal + fine-pointer hover zoom) and the Line-by-line Reveal (hero lines rise out of masks, staggered). Transform-only, one-shot, reduced-motion safe.
- `reveal.tsx` — the IntersectionObserver reveal component that drives `.reveal` / `.is-visible`.

## `vanilla-apps/pokedex/` — a complete mini-app
The Pokédex Explorer v2 (`index.html`, `styles.css`, `app.js`) — a full free-API app in vanilla JS: live search/filter over 1,351 Pokémon, type chips, detail modal, "Seen N of 1351" progress. A clean reference for the no-framework pattern used by all five free-API projects.

## Full apps that live in their own repos (not copied here)
- Study Hub — github.com/abduIwahid/fa24-bai (files.json-driven catalogue, download system with progress + ZIP)
- WhyRisk — github.com/abduIwahid/WhyRisk (the Next.js healthcare app; see `../projects/medisight.md`)
- The five free-API apps — one repo each; Pokédex above is the pattern
