# 09 · Process

**What this folder is:** how work gets started, shipped and proven — the difference between "the build passed" and "it works".

## Files, in the order a project meets them
| File | Stage | What it does |
|---|---|---|
| `project-setup.md` | Start | How a project is set up so it stays coherent: fewer features, no half-rewrites, no leaked secrets |
| `production-checklist.md` | Build → launch | The production-readiness checklist (auth flows, secrets hygiene, password UX, and the rest) |
| `website-audit-playbook.md` | Before "done" | The 15-phase master audit: design system, responsive matrix, dark/light, Core Web Vitals, security headers, cross-browser, regression QA. Applies to EVERY website project automatically |
| `pre-ship-gate.md` | Every change | No change is final until its LIVE check passes; the consistency sweep (a change is checked across the whole site in the same round); the asset-version rule (bump `?v=` + service-worker cache name with every asset change); post-change testing with seeded real data, not empty pages |

## The short version
Brain first (`../07-prompts/`) → build → deploy → **verify live as a user** → then, and only then, call it done. Every rule in this folder exists because skipping it once caused a real failure; the files say which.
