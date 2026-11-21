# Project Brain

**A living knowledge base for building premium, full-stack websites and apps — the design laws, tools, prompts, references, checklists and hard-won lessons behind a real portfolio of shipped projects.**

Maintained by [Abdul Wahid](https://github.com/abduIwahid) (AI/ML developer) together with his AI agent. It started as the private "brain" that powered a portfolio site, a healthcare ML product, a class resource hub used by a whole cohort, and a hackathon-winning-calibre agent system. It is now public so anyone can build with it.

> **How to use this repo:** give it to your AI coding agent (or read it yourself) before starting a project. Start with the Project Brain prompt in `07-prompts/`, design with `01-design-system/`, pick tools from `05-tools/`, and don't call anything done until it passes `09-process/`.

---

## What's inside

### `01-design-system/` — how things should look and feel
| File | What it gives you |
|---|---|
| `ux-laws.md` | The 20 classic UX laws used as a standing checklist on every build |
| `frontend-preferences.md` | The house style: bold editorial minimal, tokens-first, and the full anti-AI-tell list (no purple gradients, no badge-above-headline, no untouched component defaults…) |
| `color-palettes.md` | Proven palettes with tokens |
| `layout-vocabulary.md` | Named layout patterns so designs can be discussed precisely |
| `ui-layouts-library.md` | A large ledger of components & effects (from ui-layouts.com) with verdicts: adopt, adapt, or rejected — and why |
| `copywriting-frameworks.md` | Headline/copy formulas that convert |
| `responsive-rules.md` | The fluid-by-default system: clamp(), auto-fit grids, the width/zoom ship matrix |
| `animation-and-motion.md` | Animation vocabulary (16 types), motion principles, the 10 scroll effects with verdicts |

### `02-frontend/` — building the interface
`frontend-toolkit.md` — Next.js/React and vanilla stacks, the Tailwind theme-alpha trap (opacity utilities silently generating no CSS), component sources, service-worker cache discipline, and the patterns that earned their place.

### `03-backend/` — building the server side
`backend-toolkit.md` — FastAPI/Flask/Node, serverless proxies, the never-a-secret-in-the-frontend rule, Resend email patterns, free hosting that actually works (Render + UptimeRobot), and designing around free-tier API caps.

### `04-database/` — data that stays honest
`database-toolkit.md` — PostgreSQL/Supabase, MySQL, migrations discipline, RLS, and seed data that is fictional, labelled, and removable.

### `05-tools/` — the bench
- `tools-by-job.md` — every tool categorised: design, frontend, backend, hosting, database, SEO/audit, domains, learning
- `agent-skills-toolbox.md` — the AI-agent toolbox (Ponytail, Hallmark, Impeccable, Graphify, Scrapling, Humanizer, Diagram Design, last30days, REA, /taste) with verified repos
- `free-stack.md` — the free-tier stack the projects actually run on

### `06-agents/` — building agent systems
`agent-playbook.md` — the architecture that survives judging: *the model reads, code decides*; fact bases with supersession, transactional updates, honest traces, token discipline — plus what the winning hackathon team did better, and the winner's checklist.

### `07-prompts/` — prompts that produce real work
- `project-brain-prompt.md` — the full scaffold: create a `/brain` folder (PRD, architecture, data model, API spec, design, testing, deployment, security…) before writing any code
- `helix-hero-prompt.md` — a complete scroll-animation build prompt (three.js helix + GSAP), kept verbatim
- `mega-prompt-method.md` — describe the finished site as one detailed spec, then build to it

### `08-references/` — everything that was ever sent and filed
- `reels-and-resources-index.md` — 295 indexed reels, posts and resources
- `saved-references-part-1..5.md` — the full archive: design reels, tools, tutorials, audits — each with creator, link, key points, and an honest evidence note (what was verified vs. what is a creator's claim)
- `websites-and-resources.md` — the standing websites: design libraries, free domains, free hosting, free learning

### `09-process/` — how work gets finished
- `website-audit-playbook.md` — the 15-phase master audit (design system, responsive matrix, dark mode, Web Vitals, security, regression QA) applied to every website project
- `pre-ship-gate.md` — no "done" before a live check; the consistency sweep; the asset-version rule; post-change testing with seeded real data
- `production-checklist.md` — the launch checklist
- `project-setup.md` — how a project starts

### `10-stack-and-ideas/`
- `my-stack.md` — the owner's actual stack (languages, ML, web, DevOps)
- `future-projects.md` — the idea backlog

### `projects/` — per-project brains
27 project records (WhyRisk healthcare ML, the portfolio, Study Hub, Plan Banao, five free-API mini-apps, and more): what was built, the decisions, the defects found, and the lessons — the raw material most of the general files above were distilled from.

---

## The five rules that matter most

1. **Brain first.** No project code before its brain exists — PRD, architecture, design tokens, risks. (`07-prompts/project-brain-prompt.md`)
2. **Tokens, not vibes.** Every design decision is a named token; if it isn't in the design system, it doesn't ship.
3. **Fluid by default.** Interfaces scale down as space tightens; a change ships only after passing the full width/zoom matrix. (`01-design-system/responsive-rules.md`)
4. **Live-verified, or it isn't done.** Build gates are not evidence. Deploy, click through it as a user, exercise dynamic views with real data — then report. (`09-process/pre-ship-gate.md`)
5. **Honest numbers.** Metrics are reported as measured (AUC 0.8222, not "0.83"), demo data is labelled demo, and a creator's claim is filed as a claim, never as a fact.

## How this repo stays alive

This is a **living repo**, not a snapshot. It is updated whenever:
- a project ships something new (the lesson is distilled here in the same round),
- a useful reel, tool, website or repo is found and filed,
- a periodic research pass turns up something worth adopting (trending repos and tools are vetted before they are added — a star count is not a verdict).

Personal data is deliberately **not** part of this repo: no credentials, no private records, no personal details — only knowledge that is safe to share.

## License

MIT — use it, fork it, build with it. Attribution appreciated. See `LICENSE`.

---

*Built and maintained in the open. If you build something with it, that's the point.*
