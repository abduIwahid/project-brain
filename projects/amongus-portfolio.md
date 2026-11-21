# Project: Among Us Portfolio — his first portfolio: a playful Among Us-themed Next.js site, now superseded by abdulwahid.me

## Facts
- Repo: `abduIwahid/amongus-portfolio`, branch `main`. Next.js App
  Router + TypeScript + Tailwind CSS v4, Framer Motion, GSAP, shadcn
  components. `package.json` actually pins Next **16.3.0** / React
  19.2.8 — the README still says "Next.js 15" (docs drift).
- 7 routes: `/` (impostor intro animation with sound), `/about`
  (interactive ghost mini-game room, keyboard + mobile joystick),
  `/hire-me` (CV/experience), `/profile`, `/projects`, `/skills`,
  `/contact`. Plus floating crewmate characters across pages, click/
  typing sound effects, custom hooks (`useFloatingCharacters`,
  `useClickSound`).
- README is polished: features, route table, tech stack, setup steps —
  113 lines. It links a live demo, but link text and href disagree:
  text says `amongus-portfolio.vercel.app`, href points to
  `abduiwahid-portfolio.vercel.app`. Which one is live is unverified.
- `CV.pdf` (223 KB) is committed in the repo root, plus a 2 MB
  `designIdea.png` and a committed `.kiro/` tool-config folder.
- README claims "MIT License (LICENSE)" but **no LICENSE file exists**
  in the repo.

## Strengths
- Real creative ambition: a themed, animated, game-like portfolio is
  far more memorable than a template clone — it shows personality and
  front-end skill (animation, sound, custom hooks, responsive game UI).
- Documentation quality is the best of his older repos.

## Weaknesses / risks
- **It competes with his real portfolio.** Two live portfolios split
  his identity: recruiters who land here get the playful older site
  instead of abdulwahid.me with his ML/XAI positioning, internship and
  current projects. Content here is older (projects, CV) and will keep
  going stale.
- README/stack drift (Next 15 vs 16), broken-or-wrong demo link, and a
  missing LICENSE file it claims to have — small credibility leaks.
- Phone number published in the README contact table (also on profile
  README via WhatsApp link — his choice, but worth noticing).

## Improvement plan (prioritized)
1. **Decision first — archive, don't maintain.** Keep it as a fun
   artifact, stop updating it. Add a banner at the top of the README:
   "My first portfolio — a creative experiment. My current portfolio
   lives at abdulwahid.me", and if the site stays deployed, add the
   same redirect note on its home page.
2. Do NOT fold the theme into the main portfolio — the professional
   site's restraint is its strength; the Among Us concept works as a
   standalone playful piece, not as his primary identity.
3. Cheap one-pass cleanup if archiving: fix the demo link (whichever
   URL is actually live), correct "Next.js 15" → 16, add the MIT
   LICENSE the README claims, drop `designIdea.png` + `.kiro/` from
   the repo.
4. Keep it un-deleted: it is good evidence of range to show a human
   who asks "show me something fun you built".

## Audit — 2026-10-24 (GitHub-wide review)
Verdict: a charming first portfolio whose only real problem is that it
still competes with the real one. Archive with a pointer to
abdulwahid.me; spend zero further build time on it.
