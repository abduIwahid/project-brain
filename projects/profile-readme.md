# Project: Profile README (abduIwahid) — his GitHub profile page repo, with an auto-regenerating projects table

## Facts
- Repo: `abduIwahid/abduIwahid`, `main` — the special repo whose
  README renders on his GitHub profile. README is 244 lines / 15 KB:
  capsule-render header, typing SVG, CV download badge, Python-class
  "About Me", connect badges (portfolio, GitHub, LinkedIn, email,
  WhatsApp, ORCID), tech-stack badges, stats/activity graphics.
- Automation: 4 GitHub Actions workflows — `update-readme.yml`
  (runs `scripts/update_readme.py`), `metrics.yml`,
  `profile-3d.yml`, `snake.yml`. The repo also carries the generated
  artifacts: `metrics.activity.svg`, `profile-3d-contrib/`, `assets/`,
  `scripts/__pycache__/` (committed by accident, minor).
- `update_readme.py`: fetches his repos from the GitHub API sorted by
  latest push, excludes forks/archived and a hard-coded EXCLUDE set
  (featured projects + this repo + certificates), promotes repos with
  a `pin` topic, takes the top 8, and rewrites the table between
  `<!-- PROJECTS:START -->` / `<!-- PROJECTS:END -->` markers using
  each repo's **GitHub description + topics** as the row content.
- Known connector quirk (from the main Portfolio brain file): pushes
  containing `.github/workflows/*` via the connector silently fail —
  workflow changes here must go through the GitHub web UI.

## Strengths
- The auto-table is a genuinely smart system: push any repo and the
  profile refreshes itself; exclusions keep featured projects curated
  in the hand-written section above it.
- Profile is complete and current: correct links, correct email
  (his secondary email), live domain, ORCID — consistent
  with abdulwahid.me.

## Weaknesses / risks
- **The automation amplifies missing repo metadata.** In the current
  generated table, 5 of 8 rows (psx-investment-agent,
  agentic-rag-agent, ai-data-analyst, github-mcp-agent,
  ai-deep-research-agent) render with EMPTY descriptions and no topic
  chips — because those repos have no GitHub description/topics set.
  The profile therefore shows blank rows for his newest AI agents,
  the exact projects he most wants seen.
- Display names fall back to raw repo names ("psx investment agent")
  unless added to the script's NAMES map — lowercase, undesigned.
- `__pycache__` committed; metrics/3D/snake graphics add visual noise
  risk if any workflow breaks and renders a dead image.

## Improvement plan (prioritized)
1. **Set GitHub descriptions + topics on the 5 agent repos** (and any
   future repo at creation time). This one settings pass fills the
   profile table properly — highest leverage fix in this whole repo,
   and it also helps the repos' own discoverability.
2. Add friendly display names for the agent repos to NAMES in
   `update_readme.py` (e.g. "PSX Investment Agent").
3. Add a fallback in the script: skip repos with no description, or
   substitute "Description coming soon" — blank rows should be
   impossible.
4. Remove `scripts/__pycache__` and add a `.gitignore`.
5. Leave the workflows alone otherwise — they work; remember the
   web-UI-only rule for editing them.

## Audit — 2026-10-24 (GitHub-wide review)
Verdict: strong profile system let down by empty inputs. The fix is
not in this repo at all — it's adding descriptions/topics to five
other repos; do that and the profile polishes itself on the next run.
