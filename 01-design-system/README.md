# 01 · Design System

**What this folder is:** the visual law of every build — the rules, tokens and verdicts that make a website look premium instead of generated. Read this folder before designing or building any interface.

## Files, and when to use each

| File | What it is | When to use it |
|---|---|---|
| `frontend-preferences.md` | The house style: bold editorial minimal, tokens-first design, and the full anti-AI-tell list (no purple-blue gradients, no badge-above-headline, no 3-icon-box rows, no untouched component defaults…) | **First read for any UI work.** Give it to your AI agent as standing context |
| `ux-laws.md` | The 20 classic UX laws as a checklist (Fitts, Hick, Doherty, peak-end…) | While designing any screen; run through it before shipping a flow |
| `color-palettes.md` | Proven colour palettes with design tokens | When a project needs its palette — pick tokens from here, don't improvise hex values |
| `layout-vocabulary.md` | Named layout patterns | When discussing or specifying a layout, so "stacking cards" or "bento grid" means the same thing to everyone |
| `ui-layouts-library.md` | A large ledger of components & effects (from ui-layouts.com) with verdicts: adopt / adapt / rejected, and why | **Before building any component or effect** — someone has usually already judged it here |
| `copywriting-frameworks.md` | Headline and copy formulas (including the case-study headline: Result + Number + Who it helped) | When writing hero copy, section headings, case studies |
| `responsive-rules.md` | The fluid-by-default system: clamp(), auto-fit grids, and the width/zoom ship matrix | For every layout; the matrix is a ship gate, not a suggestion |
| `aurora-template.md` | **The highest-priority frontend reference** (standing rule, 2026-11-23): ThemeWagon's Aurora distilled — design tokens, landing structure, login-page layout | **Default starting point for any new project's frontend**, unless the owner picks otherwise |
| `grunge-template.md` | A monochrome giant-type brutalist portfolio template, distilled to tokens + structure | The saved alternative when a bold type-led look is wanted |
| `watermelon-landing-template.md` | A dark technical landing system + how it was adapted into WhyRisk (design yes, its colours no) | When adapting any supplied template: take the design + motion, keep the project's own tokens |
| `animation-and-motion.md` | Animation vocabulary (16 types), motion principles, and the 10 scroll effects with verdicts | When a surface needs motion — pick from the vocabulary, respect the cautions |

## How to use this folder on a new project
1. Copy the palette + type choices into the project's `DESIGN.md` as tokens (see `../07-prompts/project-brain-prompt.md`).
2. Design with `frontend-preferences.md` and `ux-laws.md` open.
3. Before building a component, search `ui-layouts-library.md` for its verdict.
4. Before shipping, run the responsive matrix from `responsive-rules.md` and the audit in `../09-process/`.

## Rules that override everything else here
- Solid colours, near-black/white + ONE accent. No gradients, no AI-glow palettes.
- Tokens only — no hardcoded colours in components.
- Real photography as backgrounds (scrim for legibility), never AI-generated product imagery.
