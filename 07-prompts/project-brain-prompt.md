# Project Brain Prompt — GENERALISED working version

> Generalised by Muse on 2026-10-25 at Abdul Wahid's instruction ("agar kuch specific
> ho to usy generalise kr lena") from the original he shared — the verbatim
> original is `project-brain-prompt-original.md` in this folder.
> What changed: (1) hackathon-only framing → any timeboxed project, with the
> 4-hour hackathon kept as a preset; (2) Claude-specific files → agent-agnostic
> entry file (mirror into CLAUDE.md / AGENTS.md / whatever the agent reads);
> (3) judging/demo files → conditional, only when an evaluation or pitch
> exists; (4) fixed clock times → budget proportions with a dependency-freeze
> point. Everything else (brain structure, design rules, tools discipline,
> logging system, output rules) is preserved.

# ROLE
You are a senior full-stack engineer and technical project manager. Create the
complete project "brain" (documentation + rules + tool choices) BEFORE writing
any app code, so any AI agent or human can resume work at any time with full
context, from start to end.

# PROJECT INPUTS
- Idea: {{IDEA}} (if empty: propose 3 ideas with a 1-line pitch + feasibility
  inside the time budget, pick the best, justify briefly)
- Team: {{SOLO / N people + roles}}
- Preferred stack: {{STACK}} (if empty, choose from DEFAULT STACKS and justify
  in DECISIONS.md)
- Time budget: {{TIME_BUDGET}} — total, deploy-ready. Presets: "4h hackathon",
  "1 build day", "1 week part-time". Phase timings below scale proportionally.
- Evaluation: {{EVALUATION}} (judging criteria, a client, an exam rubric — or
  "none": then skip DEMO_PITCH.md and map features to user value instead)
- Core feature (one sentence): {{CORE_FEATURE}} (if empty: propose one)
- Wow factor / differentiator: {{DIFFERENTIATOR}} (if empty: propose one)
- Mode: {{FULL / LEAN}} — LEAN fully writes PRD, ARCHITECTURE, DESIGN,
  BUILD_PLAN, TOOLS, WORKFLOW, DEPLOYMENT, the agent entry file and README;
  the rest get short stubs (headings + TBD). FULL writes everything.

# TASK
Create ONLY documentation files now. Do NOT write app code. Structure:

/AGENT.md (entry point — mirror as CLAUDE.md / AGENTS.md as the tooling needs)
  ← project summary, "read /brain/00-START-HERE.md first", hard rules, commands
/README.md          ← what, live demo link, screenshot placeholders, badges,
                      architecture diagram, setup, env vars, scripts, stack,
                      team credits, license
/CONTRIBUTING.md    ← (team projects) branch/PR rules, folder ownership
/.env.example       ← all env var names, no real values
/brain/
  00-START-HERE.md  ← reading order, one-liner, current phase, links to all files
  PRD.md            ← opens with the one-sentence core feature; problem, target
                      users, goals, non-goals, user stories, MUST/SHOULD/COULD
                      scope, wow factor, success + acceptance criteria, roadmap
  ARCHITECTURE.md   ← stack, folder structure, data flow, auth flow, components,
                      services, Mermaid diagrams, code conventions
  DATA_MODEL.md     ← tables/entities, relations, indexes, RLS/access rules,
                      seed data + demo account plan
  API_SPEC.md       ← endpoints/actions, request/response, auth, error format,
                      rate limits
  DESIGN.md         ← design system (rules below)
  TOOLS.md          ← services, why, free-tier limits (verified), setup links,
                      accounts checklist, fallbacks (rules below)
  BUILD_PLAN.md     ← timeboxed plan with checkboxes, owners, cut list (below)
  TESTING.md        ← strategy, critical-path manual checklist, minimal
                      automated tests, performance targets, definition of done
  DEPLOYMENT.md     ← deploy steps per service, env vars, domains, DB setup,
                      preview vs prod, rollback, post-deploy smoke test
  ENV.md            ← every env var: name, purpose, where used, secret?, where
                      to get it (NO real values)
  WORKFLOW.md       ← humans + agents: roles, branching, commit format, task
                      loop, logging rules, freeze rules
  DECISIONS.md      ← ADR log: decision → options → why → date
  SECURITY.md       ← auth, secrets, RLS, validation, rate limiting, CORS,
                      security headers, dependency checks
  PRODUCTION_READINESS.md ← checklist, each item tagged MUST / SHOULD /
                      SKIP-FOR-NOW with status
  RISKS.md          ← top risks + fallback for each (API down, deploy fails,
                      scope creep, free-tier limits, connectivity failure)
  DEMO_PITCH.md     ← (only if Evaluation exists) demo script, pitch outline,
                      criteria mapping, submission summary, backup demo plan
  GLOSSARY.md       ← domain terms, naming conventions
  ETHICS_PRIVACY.md ← (if AI or user data is used) data handling, model limits,
                      bias, consent
  /changes/
    changelog.md    ← verified changes only
    current-state.md ← what actually exists right now
    /sessions/      ← one file per work session/feature
  /prompts/
    audit-changes.md ← the read-only audit prompt (below)
    new-feature.md / bugfix.md / refactor.md / review.md / deploy-fix.md /
    ui-polish.md     ← task templates

# DESIGN RULES (DESIGN.md)
- Solid colours only. NO gradients, NO "AI-style" purple/blue glow palettes,
  no glassmorphism. (Matches Abdul Wahid's standing anti-AI-fingerprint rules.)
- Palette tokens: background, surface, border, text-primary, text-secondary,
  accent, success, warning, danger — each 3–5 shades (50–900) as hex.
- Near-black/white base + ONE accent by default. Depth from shadows only:
  4 token levels (sm/md/lg/xl).
- Typography: state the choice and why — a system stack (Helvetica Neue →
  Helvetica → Arial) costs nothing and loads instantly; a self-hosted font
  (Inter/Geist, or a display face like Anton when the brand needs it) gives
  consistency. One display + one body family maximum.
- Type scale, weights, line heights, spacing scale (4px base), radius scale,
  breakpoints, grid, and ONE icon library.
- Component states (default/hover/focus/disabled/loading) for: button, input,
  card, modal, toast, table, nav, empty state, skeleton, error state.
- Accessibility: WCAG AA contrast, visible focus, alt text, keyboard navigation.
- Output tokens as CSS variables + a Tailwind config snippet. UI libraries
  (shadcn/ui, Radix) restyled to these tokens, no default gradients.

# TOOLS RULES (TOOLS.md)
- ONE tool per category from the catalog (same catalog as the original:
  hosting, DB, auth, storage, email, realtime, AI APIs, jobs, analytics,
  errors, uptime, maps, domains, UI, icons, fonts, forms, testing, docs).
- Prefer the FEWEST services possible — each adds setup time and failure points.
- Per pick: purpose, free-tier limits VERIFIED on the official pricing page
  (limits change — never guess a number), env vars, setup-time estimate, fallback.
- "Accounts to create first" checklist sized to the time budget.
- Flag every free-tier gotcha that could break the demo/launch; add a short
  cost/scaling note for beyond the free tier. Log each choice in DECISIONS.md.
- Known gotchas to always check: free services that sleep when idle; trial-only
  plans (never a hard dependency); free DB projects pausing on inactivity;
  hobby-tier commercial-use and execution-time limits; email tiers that need a
  verified domain before sending to arbitrary recipients.

## DEFAULT STACKS (pick one, justify in DECISIONS.md)
- A. Fastest: Next.js + TypeScript + Supabase (DB + Auth + Storage + RLS) +
  Resend + Vercel. Fewest accounts, no separate backend.
- B. Separate API: React/Vite on Vercel + Express/FastAPI on a backend host +
  Neon + Clerk.
- C. ML/AI project: Next.js on Vercel + FastAPI backend + Supabase +
  Gemini/Groq.

# BUILD_PLAN.md (proportions of the total budget, checkboxes + owners)
- 0–8%   setup: repo, stack, accounts, env — deploy an EMPTY app FIRST
- 8–25%  data model + auth + seed skeleton
- 25–60% core feature + wow factor (mock-first: UI on stubbed data, then wire)
- 60–75% secondary features + polish
- 75%    DEPENDENCY FREEZE (no new packages/services without human approval)
- 75–82% seed data + demo account ready (hard deadline)
- 82–90% production-readiness MUSTs, mobile, error/empty/loading states
- 90%    record a 60–90s fallback demo video (if a demo exists)
- 90–100% final deploy, smoke test, rehearsal, submission summary
Rules: if a phase runs >20% over, cut SHOULD/COULD per the explicit CUT LIST
(items dropped first, in order). Team work split by folder/owner. At each
phase end report: on track / behind / cut list applied. Keep the deployed app
working at all times — deploy early, deploy often.

# PRODUCTION_READINESS.md
Adapt the original's checklist (auth/account, UX states, UI features,
backend/security, observability, legal/compliance flagged "not legal advice",
accessibility, plus SEO meta/OG, favicon, robots/sitemap, env separation,
health-check endpoint, seed/demo data, CORS, security headers, image
optimisation, performance budget, git hygiene, CI, license, dependency audit,
verified email sender, keep-alive for sleeping servers) — merge, dedupe, and
tag every item MUST / SHOULD / SKIP-FOR-NOW for THIS project's budget.

# CODE CONVENTIONS (in ARCHITECTURE.md)
TypeScript strict, no `any`; consistent naming; feature-based folders; one
error-handling pattern (typed errors, one API error format); validate all
input (Zod or equivalent) at boundaries; no hardcoded colours — DESIGN.md
tokens only.

# TESTING TARGETS
Manual critical-path checklist (signup → core feature → logout) before every
deploy; minimal automated tests for the core feature only; Lighthouse targets
Performance ≥ 90, Accessibility ≥ 95, LCP < 2.5s (adjust if justified).

# WORKFLOW RULES
- Roles (separate sessions, no overlap): Planner (docs/plan), Builder (one
  task), Reviewer (checks against PRD, DESIGN, SECURITY).
- Task-size rule: max ~30 minutes per task; commit after each; deploy at least
  once per phase.
- Every /brain file stays under ~300 lines; agents read only task-relevant
  files plus the mandatory start-of-work files.

# LOGGING SYSTEM (/brain/changes) — "git for conversations" (HARD RULE)
1. Before work: read 00-START-HERE.md, current-state.md, last 3 session files.
2. After EVERY feature/fix/decision: create
   /brain/changes/sessions/YYYY-MM-DD-NN-short-title.md with: goal/request
   (key prompts quoted), what was done (files), decisions + reasoning,
   problems + fixes, status (Done/Partial/Blocked) + next steps, commit hash.
3. Append to changelog.md: Change → Reason → Affected Area → Impact →
   Evidence → Status.
4. Update current-state.md (what exists, incomplete work, inconsistencies,
   deprecated/removed).
5. Update BUILD_PLAN.md checkboxes; DECISIONS.md / TOOLS.md if relevant.
6. Conventional Commits (feat:/fix:/docs:/chore:), referencing the session file.
7. Never invent history. Tag claims Verified / Inferred / Unknown.

## /brain/prompts/audit-changes.md (verbatim audit prompt)
"Analyze the project read-only and create/update only /brain/changes/changelog.md and current-state.md. Do not modify, delete, refactor, rename, or move source code; do not change dependencies, config, database, APIs, or behavior. Inspect the project structure first, then read only the files needed. Never invent history; label every claim Verified / Inferred / Unknown. Preserve existing docs and update instead of overwriting. Detect contradictions between docs and implementation. changelog.md: significant verified changes (added/removed/modified, behavior, architecture/API/DB, security/deployment, bug fixes, breaking changes, migrations), each as 'Change → Reason → Affected Area → Impact → Evidence → Status'. current-state.md: what exists now, active features, deprecated/removed components, incomplete changes, pending migrations, inconsistencies. Finish with a Change Audit: files created/updated, major verified changes, inconsistencies, unknown history, items needing human confirmation. Stop after documentation. Do not fix or implement anything."

# AGENT ENTRY FILE MUST CONTAIN
- 5-line project summary, core feature, wow factor, current phase
- Reading order of /brain files
- Hard rules: DESIGN.md tokens only (no hardcoded colours, no gradients);
  never commit secrets; validate all input; keep the deployed app working;
  log every change per WORKFLOW.md; mock-first; dependency freeze at 75%;
  ask before adding dependencies, new services, or changing architecture;
  tasks under ~30 minutes
- Commands: install, dev, build, test, lint, seed, deploy
- Definition of done for any task

# OUTPUT RULES
- Specific to the idea: concrete entities, routes, tables, screens. No generic
  filler or lorem ipsum. Bullets and tables over prose; Mermaid for diagrams.
- Unknowns are "TBD (needs human decision)", never guesses. Never invent
  free-tier numbers or URLs — mark "verify on official page".
- If an Evaluation exists, map every MUST feature to at least one criterion
  in DEMO_PITCH.md.
- Initialise changelog.md and current-state.md with "Project initialized. No
  code yet." and write the first session file documenting this scaffolding.
- At the end, output: files created, open questions (max 5), accounts to
  create now, and the exact next step to start Phase 0.
- STOP after documentation. Do not scaffold code.
