# Project Brain: Portfolio — abdulwahid.me

The single source of truth for Abdul Wahid's portfolio. Read before ANY portfolio
work; the project's own rules here beat `../general/` defaults.
Last full audit: 2026-10-24 (measured from live `main`).

## 1. Identity

- **Live site:** https://abdulwahid.me (also abdul-wahid-portfolio.vercel.app)
- **Repo:** `abduIwahid/Portfolio`, branch `main` (ALL work direct to main —
  no branches/PRs). Local clone `~/workspace/portfolio-analysis` is
  dirty/behind: NEVER git-push from it; read fresh files from
  raw.githubusercontent and push with the GitHub connector (`push-files`,
  text files only).
- **Owner:** Abdul Wahid — AI/ML Developer. The site's job: make a visitor
  (recruiter, professor, client) trust the work fast — evidence-first,
  no hype.
- Domain abdulwahid.me at Namecheap (valid to May 2027).

## 2. Stack & architecture

- Next.js 15 (App Router) + React 19 + TypeScript. Deployed on Vercel.
- Styling: hand-written `app/globals.css` (4,305 lines / ~79 KB) does
  almost everything; Tailwind is present but only lightly used (config maps
  a few CSS vars). Most classnames are semantic custom classes.
- Content lives in `content/` (`profile.ts`, `projects.ts`, `articles.ts`) —
  pages render from data, so text changes usually happen there.
- Fonts: Anton via `next/font/google` as `--font-display` (display only);
  body font is Archivo (Google Fonts, 400–800) — chosen by Abdul Wahid from a
  live preview 2026-10-24, replacing the old Helvetica stack; eyebrows /
  meta labels are JetBrains Mono. (Consolidation fix 2026-10-26: the
  Helvetica line here was stale; §10 already recorded the Archivo pick.)
- Icons: Lucide only, everywhere.
- Contact form: Resend (`app/api/contact/route.ts`), enabled by env vars.
- SEO done (2026-10-23): generated OG card (1200×630), `public/llms.txt`,
  sitemap + robots via `app/sitemap.ts` / `app/robots.ts`, full meta in
  `app/layout.tsx`.

## 3. Routes & shared pieces

- `/` Home — hero, selected work (4 projects), principles, writing list,
  stats strip, closing CTA.
- `/projects` + `/projects/[slug]` — explorer with search/filter/sort;
  case-study pages.
- `/writing` + `/writing/[slug]` — article list + articles.
- `/about` — PFP with orbit rings + badge, timeline (experience,
  education), credentials grid, community, GitHub snapshot.
- `/cv` — web CV sheet (`.cv2-*`) mirroring the PDF + View CV button.
- `/contact` — contact link rows + Resend form.
- `/links`, `/privacy`, 404 page.
- Shared: floating pill `SiteHeader` (brand + nav + "Let's talk" +
  theme toggle + hamburger), `SiteFooter` (big CTA + round arrow +
  socials), `Reveal` (IntersectionObserver scroll reveal, staggered),
  `ProjectShot` (live-preview thumbnails on cards), `PageSkeleton`,
  `IntroLoader`.

## 4. Signature pieces — DO NOT casually change

- **Intro loader:** AW monogram draws itself as one stroke with a comet,
  progress % and stage labels, then flies through the orange dot.
  His signature — never touch.
- **Hero (Oct 2026, ECHO-style):** centered composition; eyebrow, giant
  two-line Anton headline "MAKE THE MODEL." (solid) / "QUESTION THE
  RESULT." (faded gradient), portrait cut-out overlapping line 2,
  "Available for roles" badge under the photo, centered copy, two buttons,
  socials row. Headline sizing is measured-fluid (container units from
  real Anton metrics) — never revert to vw guesswork.
- **Floating pill header** — restored alone at his request; the rest of
  that shell pass (Anton section headings site-wide, giant LET'S TALK
  closing) was REVERTED and stays reverted.
- **Projects presentation:** cards grid + 1-by-1 scroll reveal. Sticky /
  scroll-driven project flows were rejected twice — never re-propose.

## 5. Design system (measured 2026-10-24)

### Palette (CSS variables)
- Light: `--background #f8f8f8`, `--surface #ffffff`, `--surface-alt
  #f2f2f2`, `--foreground/--ink #171717`, `--muted #626262`,
  `--border #e5e5e5`, `--border-strong #c8c8c8`, `--accent #f97316`,
  `--accent-soft #fff0e4`, `--accent-ink #7c2d12`.
- Dark (`[data-theme="dark"]`): bg `#171717`, surface `#202020`,
  alt `#262626`, fg `#f5f5f5`, muted `#b2b2b2`, border `#363636`,
  accent lightened to `#fb923c` (desaturated correctly). No pure
  black/white — complies with the dark-mode rules.
- Footer is a dark band in both themes (`--footer-muted #b2b2b2`,
  `--footer-border #383838`).

### Type
- Display: Anton, uppercase — hero + project card names
  (`.project-card-name` clamp(20px, 5.4vw, 25px)).
- Page H1 (`.page-heading h1`): clamp(28px, 4vw, 54px) — but see audit
  A2, a second conflicting rule exists.
- Section H2: clamp(22px, 2.6vw, 30px) area; footer/closing H2s use
  larger clamps (~52–57px) — near-duplicates, see A2.
- Eyebrow: 11px, uppercase, letterspaced — the consistent label style.
- Body: 16px / 1.55 (an `html { font-size: 15px }` rule exists deep in
  the file, L3387 — check its media scope before touching).

### Layout rhythm
- `--content: 1200px`; `.container` = min(1200px, 100% − clamp(24px,
  4vw, 80px)) — a second `.container` rule exists at L2193 (media-scoped).
- `.section` padding: clamp(40px, 6.5vw, 84px) vertical, hairline
  `border-top` between sections.
- `.page-hero` padding: clamp(48px, 10vw, 74px) top.

### Radii / shadows / motion (as found)
- Radii are scattered: 4, 5, 6, 7, 8, 10, 16, 20px + 50% + 999px —
  no scale (audit A3).
- Shadow tokens are single-layer: `--shadow-sm 0 1px 2px rgb(0 0 0/.04)`,
  `--shadow-md 0 8px 28px rgb(0 0 0/.06)` (dark: .2/.18 alpha). Brain
  rule says layered shadows read premium — upgrade candidate (B1).
- Transitions: .15s / .18s / .2s mixed across controls (audit A4).
- Hover: 38 `:hover` rules, 37 correctly guarded by
  `@media (hover: hover) and (pointer: fine)` — 1 unguarded (A5).
- `prefers-reduced-motion`: 5 blocks present.
- Breakpoints in use: max-width 200 / 480 / 560 / 700 / 768 / 860 / 900 /
  1024 / 1280 + min-width 760 / 1280 / 1400 / 1600 — scattered, no single
  scale (A6). Consolidate opportunistically, never big-bang.

## 6. Audit findings — 2026-10-24 (measured, with locations)

- **A1 Touch targets under 44px:** `.icon-button` 38×38,
  `.project-github-btn` 29×29, `.project-arrow` 29×29, `.filter-chip`
  ~29px tall, `.footer-links a` sized by a 17px icon only,
  `.clear-search` no explicit size. (Fitts's law; his explicit ask:
  "touch responsive ho website".)
- **A2 Conflicting duplicate heading rules:** bare `h1` twice
  (L305 clamp(38px,6.5vw,96px) vs L562), `.page-heading h1` twice
  (L562 clamp(28px,4vw,54px) vs L1149 clamp(40px,6vw,72px)),
  `.footer-top h2` (L2027) vs `.closing-cta h2` (L2700) — same job,
  different clamps (57px vs 52px max). Same element must feel identical
  everywhere (his explicit ask).
- **A3 No radius scale** (see §5).
- **A4 Transition timings inconsistent** (.15/.18/.2s on sibling
  controls).
- **A5 One unguarded `:hover`** among 38 — find and guard it.
- **A6 Breakpoint scatter** (see §5).
- **A7 About page inline styles:** eyebrows use `style={{ marginTop: 42 }}`
  ×3 instead of a spacing class — inconsistent with the system.
- **A8 `layout.tsx` viewport:** `colorScheme: 'light'` only — browser
  chrome/scrollbars stay light in dark mode. Should be `light dark`.
- **A9 Card markup duplicated** in `app/page.tsx` and
  `components/project-explorer.tsx` (identical classes — visually
  consistent today, but two sources of truth; extract a `ProjectCard`
  component when next touching either).
- **A10 globals.css size:** 4,305 lines / 79 KB in one file — split was
  already an open item; do it incrementally (e.g. cv2 block out) and only
  with full live verification.

## 7. Improvement plan (this round, in order)

**Phase A — consistency (his explicit asks):**
1. A2: collapse duplicate heading rules to one value each; align
   footer/closing H2 clamps.
2. A3: adopt a radius token set (`--r-sm 6px` controls, `--r-md 10px`
   cards, `999px` pills, `50%` circles) and apply to interactive
   controls first.
3. A1: raise hit areas to ≥40px (44 where layout allows) without
   changing the visual size language — padding/negative-margin technique
   for the 29px round card buttons; footer links get 40px boxes.
4. A4: standardise control transitions to `.2s ease` (transform/colour),
   reveals stay as-is.
5. A5 + A7 + A8 quick fixes.

**Phase B — depth & feel:**
6. B1: layered `--shadow-md` (two-stop) + a consistent card hover
   (lift 2–4px + shadow deepening) applied identically on home and
   /projects cards.
7. B2: focus-visible styles audited to match hover states (keyboard
   parity).

**Phase C — repo & production:**
8. Repo cleanup (§8), README upgrade (§8), remove publicly-served dev
   preview pages.
9. Verify live on the width matrix 320/360/390/414/768/1024/1280/
   1440/1920 and zooms 50/75/85/100 — no horizontal scroll, no clipped
   text, header stays one line.

## 8. Repo hygiene

- **Delete candidates:** `public/icons/logo-preview.html` and
  `public/icons/logo-svg-preview.html` (dev previews, publicly served),
  `.kiro/settings/mcp.json` (editor/AI-tool settings, not product),
  `tsconfig.tsbuildinfo` (build artifact — should be gitignored).
  Root also carries `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, a
  `brain/` folder, `scripts/`, `tests/` — check each is current/useful
  before touching; delete only what's clearly dead.
- **README (current: his 2026-10-21 rewrite, good bones):** upgrade with
  a top visual (OG card image), a features section (intro loader, theme
  toggle, project explorer, case studies), local-run instructions, and
  repo structure. Wording = public copy → show him the draft first
  (standing rule), ship on his OK.
- **Open items carried in:** project-card lag fix, skeleton loading on
  reload, CV page mirroring the site card pattern, icon compression.
- **RESOLVED 2026-10-24 (consolidation fix 2026-10-26 — this line was
  stale):** Resend domain verification is DONE — DNS verified and a live
  test POST to /api/contact returned {"ok":true}; the contact form works.
  The README upgrade + repo cleanup listed above also SHIPPED per the
  2026-10-24 audit (README on main is the upgraded one; tsconfig.tsbuildinfo
  is gone). Still open: hero mobile look — his on-device confirmation
  still pending; project-card lag fix, skeleton polish, CV page,
  icon compression; and the flagship demo link — it still points at the
  DEAD medisight-healthcare.vercel.app and must move to
  https://whyrisk.vercel.app (WhyRisk rename + Phase 6 go-live, 2026-10-25)
  with the project renamed WhyRisk in content/projects.ts.

## 9. Working rules for this project

- Measure before changing (responsive pre-ship skill): derive sizes from
  real metrics; verify on the LIVE site after deploy, widths + zooms
  above; report what was checked.
- Change one system at a time; a fix at 320px usually fits upward —
  verify, don't assume.
- Public-facing copy: exact wording to Abdul Wahid first, ship after approval.
  Code/styling/structural work ships immediately and is reported after.
- Never touch: intro loader, hero sizing system, pill header, project
  cards grid pattern.
- After each round: update this brain (findings closed, new decisions)
  the same day.

## 10. Round log

- **2026-10-24 — Font decision (Abdul Wahid picked from a live preview):** body font
  = **Archivo** (Google Fonts, weights 400–800, `--font-sans`); eyebrows/meta
  labels = **JetBrains Mono** (`--font-mono`, 500, .14em tracking); Anton
  unchanged. Replaced the device-dependent Helvetica stack — the site now
  renders identically on iPhone/Windows/Android. Satoshi + Manrope were the
  runners-up in the preview.
- **2026-10-24 — Consistency + scroll-motion round SHIPPED (live-verified):**
  duplicate `.page-heading h1` declaration collapsed to a single source;
  closing-CTA H2 aligned to footer H2 (clamp(32px,5vw,57px)/1.06); control
  radii unified to 6px (cards: project 12px, principle+credential 8px);
  transitions on controls standardised to .2s ease; touch targets raised
  (icon-button 40px, card round buttons 34px, footer socials 40px boxes,
  filter chips min-height 36px, clear-search 34px); `--shadow-md` layered
  (two-stop) in both themes; About inline `marginTop:42` styles replaced by
  `.eyebrow-spaced`; layout viewport now `colorScheme: light dark` with
  per-scheme themeColor; **Reveal scroll animations extended** to section
  headings, principles (staggered), writing rows, stats strip, closing CTA,
  About statement + credential cards + GitHub snapshot, Contact columns, CV
  sheet, Writing rows, Links cards (staggered) + a print-safety rule so
  revealed content always prints. A5 CLOSED: a proper brace-matched parse
  confirmed ALL :hover rules already sit inside (hover:hover) blocks.
  Build note: first deploy failed on a misplaced `</Reveal>` (string
  replace hit the wrong section tail) — fixed same round; process lesson:
  anchor multi-line JSX edits on unique context, verify with the build.
- Still open after this round: Phase C repo cleanup + README upgrade
  (draft to Abdul Wahid first), ProjectCard extraction (A9), globals.css split
  (A10), card-lag + skeleton polish, icon compression.

## Audit — 2026-10-24 (GitHub-wide review)

- **Verified repo state:** root now includes .github/, brain/, lib/,
  scripts/, tests/ alongside app/components/content; tsconfig.tsbuildinfo
  is gone. The README on main is the UPGRADED one (OG preview image,
  features, featured projects, run-locally, structure) — §8 above still
  describes it as future work.
- **Drift vs this file:** (a) §2 still says the body font is the Helvetica
  stack — superseded by the Archivo decision in §10; §2 was never updated.
  (b) §8's "Blocked on Abdul Wahid: Resend domain verification" is resolved — DNS
  verified and a live test POST returned {"ok":true} on 2026-10-24; the
  contact form works. (c) content/projects.ts sends the flagship MediSight
  case study's demo link to medisight-healthcare.vercel.app — the Vercel
  project Abdul Wahid deleted by mistake on 2026-10-24, so that demo link is dead
  until redeploy. (The MediSight repo itself exists:
  abduIwahid/MediSight-Healthcare-Platform — verified in the same review.)
- **New suggestions:**
  1. Fix the dead MediSight demo link first (redeploy the frontend, or
     drop the demo field until it's back) — it's the #1 featured project
     and the link currently dead-ends for recruiters.
  2. Correct the README's contact-form line — it still says Resend
     "requires domain verification in production" although verification is
     complete and the form is live; the README undersells a working
     feature.
  3. Refresh §2 and §8 of this file in place (Archivo as body font; Resend
     + README upgrade + repo cleanup marked done) so the next round
     doesn't re-plan finished work.

Saved-reference application (item 128, 25 Oct 2026, @uixwithcoffee —
topic-level): write the flagship projects up as proper case studies
(problem → process → decisions → result) instead of plain project cards.
MediSight first — a case-study PDF already exists in its repo to build
from. Directly supports the Summer 2027 internship outreach.

Saved-reference application (item 165, 25 Oct 2026, vamshi.work):
when the item-128 case studies get written, their headlines follow
his formula — Result + Number + Who it helped — with real numbers
only (0.8307 AUC / cohort size / 84%), never process-titles like
"My process for X". Formula lives in
brain/general/copywriting-frameworks.md.

Saved-reference application (item 158, 25 Oct 2026, CMSKite explainer —
video-verified): IF the portfolio's articles ever outgrow the main
site, blog.abdulwahid.me is the clean home — on Vercel it is one
Namecheap CNAME (to cname.vercel-dns.com) plus adding the domain to a
project; SSL is automatic. No third-party blog service needed. Only
an option on file, not a plan — nothing to build unless Abdul Wahid asks.

## Consolidation note — 2026-10-27 (nightly pass; GitHub profile, abduIwahid)
- Avi Vashishta terminal-style profile redesign SHIPPED 2026-10-26 ~21:55 (terminal frame, real-data heatmap SVG, ASCII portrait, stats SVG) then FULLY REVERTED ~22:05 at Abdul Wahid's instruction ("acha nahi laga mujhe... pehly jesi thi same wesy hi kr do") — README restored byte-identical, all 6 added files deleted. TASTE RECORD: the Avi-style terminal/ASCII profile is REJECTED for his own profile — do NOT re-propose it. Item 176 remains filed as reference only.
- GREEN HACKER THEME 1 SHIPPED 2026-10-26 ~22:12–22:50 (his final pick after previewing 5 themes incl. Black/Dark Gray monochrome — green beat monochrome on direct comparison): contribution-graph palette (#010409/#0D1117 base, #0E4429/#006D32/#26A641/#39D353 greens); header/footer capsule gradients re-based to start at #0E4429 (fixed a black-corner complaint); typing SVG Fira Code → JetBrains Mono; about-code.svg custom code card in Theme 1 greens; update_readme.py badge colour 21262D → 006D32 (workflow regenerated the table green, so future auto-updates stay green); links/certificates badge-ified green (GitHub text links cannot be recoloured — platform limit, explained to him).
- HEADER NAME FONT: capsule Impact applied, then he picked #2 DANCING SCRIPT from joining/script previews — custom header.svg built with the name as OUTLINED GLYPH PATHS (capsule cannot serve non-system fonts), Montserrat subtitle, capsule-style MORPHING waves restored after he rejected sliding waves ("jesy pehly tha wesy lao"). Typing line stays JetBrains Mono deliberately.
- BLANK-ROWS FIX CLOSED 2026-10-26 ~22:37–22:40: the 5 agent repos' empty descriptions/topics (the standing blank-rows wound) fixed by Abdul Wahid via web UI from Muse's drafts (incl. his own "embadding" typo, which he then fixed himself); profile table refreshed immediately via a no-op workflow trigger, live-verified.
- PENDING (his side, web UI only): update-profile-art.yml sits at the profile repo ROOT (inert there; its generator scripts no longer exist after the revert) — delete it or move it to .github/workflows/; nothing else to remove from the revert. Commit count 2026-10-26: 66 total (profile 22, fa24-bai 44); WhyRisk/Portfolio had no pushes that day.
- Portfolio SITE pending unchanged: mobile-width check (his phone glance), ProjectCard extraction, globals.css split, card-lag/skeleton polish, icon compression, CV page, flagship demo link + rename → WhyRisk (still the #1 recruiter-facing fix), item-128 case studies (WhyRisk first), portfolio GSC property + sitemap submissions + Bing import.

## Saved-reference application — 2026-11-02 (@zrk.pptx portfolio-structure carousel, refs #205)
Checked slide-by-slide against abdulwahid.me the evening it was filed. Holds: opening states business/role/contact (slide 2), brief who-you-are with core skills first (3, 5), custom build + principles stated as his system (8), notable-affiliation signal honestly carried by Experience = Ezitech/COMSATS/GDG (9). Loose fit: numbered summary (4) — multi-page site, not a deck. Not applicable: brand-logo grids and client-collab framing (10–11), slide 12 is a template ad. OPEN GAP from slide 6 (Paul Rand point): case studies show problem/results but thin PROCESS narrative (brief → decisions → dead ends → result). Candidate: deepen the WhyRisk case study with a process section after midterms; visible copy proposed first per the standing copy rule.

## Mobile scale decision (2026-11-03)
Abdul Wahid asked for "default zoom 75% on mobile". Muse explained a real viewport initial-scale=0.75 would change the layout width (390px phone behaving as 520px) and could undo the same night's mobile fixes (e.g. the ≤480px header subtitle hide). He approved the fluid alternative ("han kro"): a deliberate small-screen scale-down inside the responsive audit round — large type one notch smaller via clamp() minimums at ≤640px + tighter section spacing (~0.85–0.9 optical scale), body ≥15px, tap targets ≥44px, desktop sizes unchanged.

## Responsive audit round (2026-11-03, HEAD d441d041)
Six commits, all API-verified; harness = local Playwright width matrix (10 pages x 320/360/390/414/768/1024/1280/1440/1920), post-fix ZERO overflow at all 90 combinations (run twice).
- 38f0164e touch glow: the 2-3s linger was a JS 2600ms "recent move" window + slow lerp (NOT CSS); touch now fades in ~130ms on pointerup/cancel; mouse unchanged.
- 4b1c4f95 header fit: pre-fix the header pill overflowed +69px@320 (fit only from ~390); at <=420px the brand NAME hides (mark only, aria-label keeps the name) — next rung of the <=480 subtitle ladder. Flagged to Abdul Wahid as a judgment call.
- 5e5ef8b9 fluid scale-down <=640 (~x0.87 on the clamp small ends; hero H1 -13% at 390; desktop computed sizes identical; body >=15px, tap floor 44px untouched).
- 638089f3 Kaggle link: profile record pointed at kaggle.com root; fixed to /abdulwahid1212 (Abdul Wahid spotted it from /links).
- b62aa3ed 404 dots-field (components/dots-field.tsx, his InteractiveDots rebuilt in house style): 404 only, ~273 dots @320 / ~1998 @1920 (spacing grows, cap 2600), tap-only ripples on touch, pauses off-screen/hidden, reduced-motion static; removal = delete component + its not-found.tsx wiring.
- d441d041 home project-grid sideways scroll @320/360: .project-grid>*{min-width:0} (the Churn card's nowrap Anton name forced a 359px track); name ellipsises at 320/360, full at 390.

## X-marquee decision (Abdul Wahid, 2026-11-03)
The single home marquee becomes TWO crossed bands (X), from his awrs.me reference, previewed three ways (3/4/5 deg) — he FINALIZED 4 degrees ("ye 4 theek hai"). Final spec from the approved preview v2/v4 renders (~/workspace/x-marquee/): FRONT band ink with paper text, rotated -4deg, list A unchanged (MACHINE LEARNING — EXPLAINABLE AI — FULL-STACK SYSTEMS — MLOPS — PREDICTIVE ANALYTICS — DATA PIPELINES — MODEL DEPLOYMENT — HEALTHCARE AI), orange separators, moving leftward; BACK band orange #E8622C with ink text and ink separators, rotated +4deg, list B (EVIDENCE OVER HYPE — REAL DATA — HONEST METRICS — DEEP LEARNING — PYTHON — API DEVELOPMENT — DASHBOARDS — OPEN SOURCE), moving rightward. His explicit mechanics: the bands need NOT show the same words at the same time (independent phases/lists), and each list loops seamlessly forever with no refresh/jump at the wrap. Install queued behind the sticky-footer round (same worktree), then live-verify.
   Word lists finalized by Muse at Abdul Wahid's instruction ("meri profile or skills ke hissab se add kr do jo relevent lagy", 2026-11-03): Band A unchanged. Band B extended with his actual stack — EVIDENCE OVER HYPE — REAL DATA — HONEST METRICS — DEEP LEARNING — DATA SCIENCE — PYTHON — FASTAPI — NEXT.JS — SUPABASE — DOCKER — DASHBOARDS — OPEN SOURCE (12 items; API DEVELOPMENT dropped as subsumed by FastAPI/Next.js; every word traces to his CV/profile skills).
- PRINCIPLES SECTION REDESIGN (2026-11-03): Abdul Wahid rejected the principle-card boxes ("yeh boxes mujhe achy nahi lag rhy") and picked **Option C — numbered columns** from 3 previews (~/workspace/principles-options/: A editorial rows, B ink slab, C numbered columns): per column a hairline with a 34px orange tick, giant faded Anton numeral (01/02/03), title with the Lucide icon (Gauge/Eye/Rocket, accent, ~20px) after it, muted text below; NO card boxes. Applies to home AND /about (consistency). Build queued after the diamond-separator round.
- ZOOM DECISION (2026-11-03): Abdul Wahid asked for a forced default 75% zoom ("mobile pe 75% pe website perfect dikh rhy"). Explained the mechanism: literal initial-scale=0.75 runs the site at a 552px layout on his 414px phone (phone-specific layout switches OFF) and shrinks body text to ~12px. He chose **option 1 — the fluid route**: deepen the ≤640px fluid scale-down toward the 75% feel (large elements + spacing smaller; body text floor 15px and 44px tap floor untouched; desktop unchanged). Do NOT implement viewport initial-scale. Build queued after the principles-C round.
- HEADER REDESIGN FINAL (Abdul Wahid, 2026-11-03, after 5 preview rounds — folder ~/workspace/header-preview/): the floating pill header is REPLACED by the "cheat-sheet #3" full-width bar. Desktop (≥1024px): left = all text links (Projects, Writing, About, CV, Links), centre = big AW mark alone (links home; no name text), right = theme toggle + **"Hire me"** ink rounded-rect button (renamed from "Let's talk" at Abdul Wahid's order — his pick over "Contact me", Muse recommended). Mobile (<1024px): bar with hamburger (left), centre mark, toggle + Hire me (right); menu = full-width panel under the bar with all 6 links as rows that **slides down from the top on open and slides back up on close — no pop-up/fade** (Abdul Wahid's explicit requirement). Layout switches purely on CSS width, so browser zoom in/out crosses it naturally (Abdul Wahid stated this himself as the desired behaviour). Bar is theme-token surface (not fixed white) so dark mode adapts. Sticky offsets (projects stack top) and anchor scroll-margins must be re-checked against the new bar height at build.
- HEADER SHIPPED 2026-11-03 (HEAD 064f0c53, live-verified): bar live with Hire me, slide panel (translateY, .32s house ease, sampled), stack offsets retuned to 72/64px, dead pill CSS removed. "Let's talk" existed only in the header; /contact H1 and the home closing CTA ("Get in touch") intentionally left as prose/other labels.
- REVIEW-DRIVEN QUICK WINS 2026-11-03 (from the 9-persona review, REPORT.md in ~/workspace/portfolio-review/): item 1 metrics note (3013a802: WhyRisk 'Score check' evidence entry + 0.83 scoped on /cv), item 2 badge 'Available for Opportunities' (ca245f82, his exact wording), item 3 contact Option A form-first + 'Get in touch'->'Hire me' (a8369be3), item 4 a11y (ebc69c05: search aria-label, /projects titles h3->h2, home project names ->h3, zero visual change measured). Leftovers (UPDATE 3 Nov: /cv H1 fixed — see the /CV SINGLE-H1 FIX line under the GitHub section round; the two-H1 item is CLOSED): items 5-8 (evaluation table, per-project evidence, testimonials, SEO/name ownership) are POST-MIDTERM.
- GITHUB SECTION ROUND 2026-11-03 (HEAD 4ac42975): stats reworked (repos/contributions/streak headline; stars-forks demoted to small line), top-4 repo cards (Portfolio, WhyRisk, fa24-bai, NearSend), community merged PRs block (5), latest-push line, this-month count in graph caption; all figures live from /api/github (repos 26, contributions ~1173, streak 5, Nov 106 at check). FOOTNOTE FIX same round: /cv footnote clipping root cause = 1200px fixed pointer-glow disc giving iOS Safari sideways pan room; fixed site-wide with overflow-x: clip on html/body (no scroll container, sticky/Lenis safe) — phone acceptance is Abdul Wahid's check.
- GITHUB STATS ROW FIX 2026-11-03 (commit 2227e7f7, CSS only): Abdul Wahid's phone screenshot showed the three /about GitHub headline stats stacked in one column ("isy horizontaly kro aik hi line mai"). Fix: removed the ≤768px 1-column override; base 3-column grid with vertical hairlines now runs at all widths, numerals fluid clamp(18px, 5.4vw, 26px); desktop geometry unchanged; live CSS verified. OPEN OFFER (unanswered): the home/About stats strip (.stats-strip, word-based stats) is a DIFFERENT component — 4-across desktop, 2x2 ≤768px, single column ≤480px — and Muse offered 2x2 on his 414px phone instead of the single stack; he has not replied.
- /CV SINGLE-H1 FIX 2026-11-03 (CORRECTS the quick-wins "Leftovers" line above): after Abdul Wahid's "han kro fix", the printable CV sheet's name heading was demoted H1→H2 with size/weight unchanged (60px desktop, 38px mobile); /cv now has a single H1. The contact-form not-configured fallback's h3-under-h1 renders only without email env, not live.

## Hero noise texture — SHIPPED 2026-11-03 (commit 95a20420, live-verified)
Abdul Wahid approved saved-reference #222 (VerticalBarsNoise) with "kro phir 1 use". House-built as components/hero-noise.tsx (not a verbatim paste): hero-bounded canvas, ResizeObserver sizing, token colours (muted lines a=0.10→0.22 near cursor; ink bars a=0.06–0.32 above a 0.68 noise threshold, ~1 in 7 accent), DPR cap 1.5, IntersectionObserver + visibility pause, reduced-motion single static frame, touch = ambient only. It REPLACED HeroGlow in the home hero (About keeps HeroGlow). PointerGlow is route-gated OFF on `/` only (usePathname check in pointer-glow.tsx) so the two cursor-reactive layers never stack; all other routes unchanged. Zero overflow across the 320–1920 matrix locally; live browser check passed: texture subtle + headline legible, glow absent on /, present on /about, X-marquee intact. Removal = delete component + page.tsx wiring + .hero-noise CSS + the glow gate. Abdul Wahid's phone feel-verdict still pending, as usual.

## Centre-alignment round — SHIPPED 2026-11-03 (commit 12d34f39, globals.css only, 5 hunks)
Abdul Wahid circled, in three screenshots: (1) /about Experience/Education/Credentials/Community, (2) the stats strip on /about AND home, (3) /contact link cards. Measured root causes: (1) `.about-col` (940px cap) had NO auto margins — the column hugged the container's left edge (−180px off page centre at 1440/1920) while headings were page-centred; fix `margin-inline: auto` → offset 0 at all widths. (2) `.stat-item` cells were plain padded blocks (value+label left-aligned, offsets −28…−168px) → flex column centred; `.fine-print` centred too; same classes centre the home strip identically. (3) /contact column was already correct (780px, same axis as form); the LABELS were off-centre (+10px LinkedIn/GitHub, +24.5px Location) because the flex row's icon slot (36px) was wider than the arrow slot (16px) and Location has no arrow; fix: `.contact-link` → 3-col grid 36px/1fr/36px + arrow justify-self:center → all labels at 0. Gates: typecheck clean, tests 6/6, build ok; zero overflow. Live browser check delegated separately (hero+cursor check also in flight).

## Hero noise FIX round — SHIPPED 2026-11-03 (commit 7bad7533, hero-noise.tsx only)
Abdul Wahid rejected the first version: texture crossed BEHIND the hero text and motion wasn't as smooth as the original. Fix: (a) exclusion zone — the .hero-stage block is measured per frame, padded 24px, all drawing fades to zero inside via an 80px smoothstep feather + an even-odd clip guarantee; pixel audit: 0 painted pixels inside the text rect at 1440 light/dark/reduced-motion. (b) Original motion ported: sin(t + y·0.0375)·20·noise sway, bars fade across a 0.24 alpha band at the threshold instead of popping; frame-to-frame painted-alpha change 0.2–0.5% (600ms). 60fps, zero overflow 320–1920. CONSEQUENCE at 390px: text block + pad + feather consume the whole hero, so the phone hero has NO texture at all — builder did not improvise; surfaced to Abdul Wahid 2026-11-03 (his call whether to add a whisper back in the phone top strip).

## Cursor size fix — SHIPPED 2026-11-03 (commit 0df1b019, custom-cursor.tsx only)
Abdul Wahid: resting disc too big; "pehla chota rhy, hover or click ke time bara ho". New state model on the same dt springs: rest 16px disc + 8px dot (both visible), hover over interactive = 52px, press anywhere = 64px, release settles back via spring. Before: rest circle was effectively invisible (opacity 0) with a 10px dot, hover jumped to 64px, press SHRANK to 0.85. Measured in Playwright (rest 16 / hover 52 / press 64). Touch + reduced-motion behaviour unchanged. NOTE: stage-cursor/ still holds stale 2026-11-02 leftovers (app/globals.css, app/layout.tsx, paths.bin) — do not push from that folder blindly; this round pushed via stage-cursor-push/ with only the cursor file.

## 2026-11-03 afternoon — hero noise REMOVED, pfp hover fix, cursor/scroll previews pending
- HERO NOISE REMOVED at Abdul Wahid's order (he reported LAG while the hero was on screen + disliked it): commits 90e9c864 (page.tsx unwired + .hero-noise CSS removed) and 2360c852 (components/hero-noise.tsx deleted via connector delete_file). Live-verified: hero plain paper, zero canvas, content/marquee intact. Saved-ref #222 VerticalBarsNoise = TRIED & REMOVED same day — do not re-propose. Phone hero texture question is moot (no texture anywhere now).
- PFP HOVER FIX shipped (commit 2b66c1a4, live-verified): the difference-blend disc turned BLUE over the hero portrait (known inversion-over-photo flaw). Fix: portrait wrapped in span.hero-portrait[data-cursor="native"] — over it the custom cursor fades out + native arrow returns (same mechanism as text inputs/selects, new NATIVE_ZONE selector in custom-cursor.tsx + cursor:auto rule in globals.css); the portrait itself gets hover zoom/depth (scale 1.04, translateY -2px, drop-shadow deepens, 0.45s house ease, gated hover:hover + pointer:fine + no-preference reduced-motion). Home hero only; About cutout untouched. FUTURE cursor builds MUST preserve the data-cursor="native" zone behaviour.
- CURSOR REDESIGN — decision path: house designs A–E + Sweezy S1–S5 sheets were shown; Abdul Wahid instead supplied his own idea (chunky rounded black arrow photo) and clarified it was an IDEA, not to be copied as-is. v2 preview = clean vector redraw of that chunky arrow + velocity-direction head tilt (max ~24°), existing spring physics, hover grow, press dip, soft shadow; previews in ~/workspace/cursor-previews/ (tilt2-shape.png, tilt2-preview.gif). AWAITING his final.
- SCROLL FEATURES previewed, AWAITING final: smart header (hides scrolling down, slides back from top on scroll-up), 5px accent progress bar pinned to very top, floating circular go-to-top button bottom-right appearing after ~420px. Preview: ~/workspace/cursor-previews/scroll-preview.gif. NOTE: header is currently sticky — this changes it to hide/show; /projects stack offsets + scroll-padding must be re-checked when built (consistency rule).
- AFTERNOON BATCH SHIPPED + LIVE-VERIFIED, 3 Nov 2026 (supersedes the two "AWAITING" lines above): (1) SCROLL UI (a1d62643): smart header (hides scrolling down past 140px, returns on any scroll-up, never hides with the mobile panel open), 3px accent progress bar (fixed top, scaleX 1:1 — live-measured 0% / 51% / 99.2%), back-to-top button (>600px). Live check caught the button staying visible after click-return; root cause = visibility derived only from discrete scroll events (the smooth scroll's final event can be coalesced away in a real browser, stranding state); FIX (0e4ccbce): perpetual change-guarded rAF loop re-deriving visibility from live window.scrollY — live re-check PASS. (2) X-MARQUEE FILL (8897a41e): lists were rendered only 2x; word size freezes at ~1438px viewport (clamp cap) while bands grow at 1.4x viewport, so lists ran out at ~2006px (front) / ~2267px (back) — Abdul Wahid's ~2048px screenshot. Fix: COPIES=4 in text-marquee.tsx, wrap still exactly one list width; live-verified full at effective widths up to ~7680px (zoom-out checks). (3) TRIANGLE CURSOR (ee5f5821) — Abdul Wahid's own design, FINAL after 6 preview rounds (house A–E and Sweezy S1–S5 rejected; v1 traced photo rejected as copy, v2 redraw rejected, v3 classic rejected; v4 = triangle only, bottom edge concave, defined corners — approved; v5 full-360 heading approved in principle; v6 spring PHYSICS approved "han ye sai hai": underdamped angular spring with overshoot + position lag, NOT a motor lerp). Built: dot + difference-blend disc deleted (blue-over-photo flaw gone with it), single inline-SVG wedge (viewBox 112x98, tip hotspot = transform-origin), rest 21px / hover 31px / press DIP ~0.8x, heading from EMA-smoothed rendered velocity with engage/release hysteresis (raw velocity flipped the heading on the position spring's hard-stop bounce — found + fixed in verification), rest-pose return at stop, data-cursor="native" portrait zone + text-input fade + pointer:fine/RM/touch gates all preserved. Live check PASS (rest pose, right + down rotation captured, portrait → native arrow, Hire-me grow). Feel verdict on Abdul Wahid's own mouse still his.
- CURSOR HEADING HOLD (c392da7c, live-verified, 3 Nov 2026): Abdul Wahid's live-use verdict on the triangle cursor — the idle return-to-rest annoyed him ("cursor chorta hun to head left point krna shuru kr deta"). OWNER RULE now in the code: when the mouse stops, the head HOLDS the last travel heading indefinitely; only a page refresh restores the resting up-left pose (initial state). Local holds: RIGHT 133.2 / DOWN -136.5 / LEFT -46.5 at +2s, drift <=0.9 deg; reload = 0.0. Live check PASS (3s holds right + down, fresh-page rest pose, hover/portrait intact). Lesson: his live feel beats preview approval — the previews HAD shown the return and he approved them; using it himself reversed it.
- 404 DOTS — WADI CONFIRMED KEEP (3 Nov 2026, "404 page pe wo dot patterns na hatana"): the dots-field background on the 404 is approved as-is; his earlier pending verdict is now closed in favour. Do not remove or alter it in any future round (glow/consistency work included).
- STACK BAND FILL (d1b2b9c8, live-verified, 3 Nov 2026): Abdul Wahid circled the /about tech stack band running empty (same disease as the X-marquee: 2 copies, one set = 1513px, band full-bleed -> ran out above ~1513px viewport; reproduced his screenshot at 2048/phase .97, items ending at "Git" + ~490px bare). Fix: 8 sets per track (two halves of 4), wrap still exactly one half (-50% keyframe), animation 32s -> 128s preserving px/s speed (47.48 vs 47.28 measured), reduced-motion static state unchanged. Sweep: text-marquee COPIES=4 intact; no other translating-track loops exist. Live PASS at effective widths to ~7600px.
- POINTER GLOW RESTORED ON HOME (ee0dfd0f, 3 Nov 2026): Abdul Wahid reported the orange mouse glow missing on the landing page. Audit found it worse: PointerGlow had a pathname==='/' early-return gate (added in 95a20420 for the hero-noise texture; the component's own comment said to delete it with the texture) — texture was removed in 90e9c864 but the gate stayed, killing the GLOBAL glow on home entirely, and HeroGlow was never restored to app/page.tsx (About kept its HeroGlow, hence the visible difference). Fix = faithful restoration of the pre-texture state (from ebc69c05): gate removed from pointer-glow.tsx, <HeroGlow/> back as home hero's first child. Re-audit: all 11 routes light+dark PASS; touch contact-gate + reduced-motion preserved; 404 dots byte-untouched (dots-field.tsx + not-found.tsx identical to live), glow coexists with them. Live check: see chat 3 Nov.
- INTRO LOADER REDESIGN — APPROVED DESIGN (Abdul Wahid, 3 Nov 2026, "is loading bar ko save kr lo apny memory mai"): the AW mark DRAWS ITSELF as ONE single line — the pen starts at the BOTTOM tip of the 'a', follows the stroke's centreline around the loop, out through the 'w' wave, and finishes with the separate final flourish (the mark genuinely has two strokes; the flourish is a pen-lift). Explicitly rejected on the way: (v1) ink-soak/geodesic fill spreading through the shape, (v0) the original straight left-to-right fill wipe, and any travelling pen DOT riding the line ("extra wo dots wali animation htao" — the dot is banned; the 404 dots are unrelated and stay). EXIT (Abdul Wahid, 3 Nov 2026): when the draw finishes, the WHOLE loader page slides UP and the portfolio main page is revealed from behind it. Preview films: ~/workspace/logo-preview/loader-preview2.gif (draw, approved) + loader-preview3.gif (full sequence incl. slide-up exit). Current live loader (fill wipe, 3350ms, session gate aw-intro-v1) stays until he finals the full-sequence preview.
- INTRO LOADER — SHIPPED + LIVE-VERIFIED 3 Nov 2026 (commit 04a26b16, supersedes the approval note above): components/intro-loader.tsx rewritten — inline mark masked by the two centreline paths from ~/workspace/logo-preview/aw-centreline.json (main 1367.7 + tail 211.8 units, mask stroke 62), ONE rAF timeline: draw 2400ms (near-constant pen speed, smoothstep blend only in the first/last 8%) → hold 350ms → slide-up 850ms (house ease, transform-only, soft shadow riding the panel's bottom edge) → unmount; 4.6s fallback timer; session gate aw-intro-v1, reduced-motion/repeat skip, scroll lock and pointerdown-skip all preserved; the old 13% ghost copy and fill CSS removed. Local Playwright: 13/13 phase checks, tail offset stayed exactly 211.8 until the main path finished (zero early bleed); live check caught the draw mid-flight (bottom arc of the 'a' only) and the slide mid-flight (panel top half, page revealed below). Owner's smoothness verdict on his own devices still pending.
- PRINCIPLES + BADGE round — SHIPPED + LIVE-VERIFIED 3 Nov 2026 (commits 2dc850f9 + tick fix ff91f186): on Abdul Wahid's order (phone screenshot + "number hta do, icons bhi, center align kro, stacking wala concept lgao" + "available for opportunities ke sath wala dot bhi hta do", right after his vibe-check scan showed 21/100 with flags +4 numbered markers / +4 blinking dot): (1) faded Anton numerals and title icons REMOVED from the principles items on home AND the /about focus grid; (2) items centre-aligned; (3) HOME principles are now STACKING CARDS (components/principles-stack.tsx, a faithful mirror of project-stack: sticky shells, 14px steps, same scale/dim driver, paper cards, equal 264px min-height, centred tick+title+body) — Option C numbered columns are SUPERSEDED on home by this owner order, so stacking is now owner-approved on TWO surfaces (/projects + home principles); /about keeps its flat hairline grid (no stack), titles centred; (4) the availability badge's dot removed in both heroes (it was pure CSS .pfp-badge::before — a green disc the scanner read as a pulsing dot). Live check: home stack confirmed frame by frame (cards slide over, edges peek, clean release into Field notes); badge text-only in both heroes; /about needed a follow-up fix — the accent tick still sat at the LEFT of the hairline while titles were centred; tick centred (ff91f186) and re-verified by pixel measurement (tick centre = column centre within 0.5px on all four). Expected next vibe-check score ~13/100 (both +4 flags gone).
- LOADER SPEED (Abdul Wahid 3 Nov, "kafi slow feel hoti hai") — SHIPPED + LIVE-VERIFIED (commit 45dfb6b0): DRAW_MS 2400→1900, HOLD_MS 350→250, SLIDE_MS 850→700, FALLBACK 4600→3800; total 3.6s→~2.85s; pen profile/split is proportional so nothing else changed. Live: sequence now completes inside one screenshot interval, end state clean across fresh tabs.
- CENTRE-AXIS AUDIT (Abdul Wahid 3 Nov, zoomed-out /about screenshot, Experience/Education/Credentials/Community circled) — measured 0.00 offsets for ALL FOUR circled sections at 1440+390 (they were already perfectly centred; his impression was the differing column widths). ONE real defect found just above them: section-heading EYEBROWS were pushed left by the 640px cap on .section-heading p (the eyebrow is a <p>) — /about "What I care about" eyebrow box at -291.5px, home "Working principles" eyebrow at -47.2px. FIX SHIPPED + LIVE-VERIFIED (commit 5f191f41): one global rule .section-heading .eyebrow { margin-inline: auto; } in globals.css (the builder's opt-in class version was promoted to global by the parent for consistency; about/page.tsx change dropped as unnecessary). Live pixel check: both labels now within 1-2px of their headings' centres.
- PROJECT STACK FIX — SHIPPED + LIVE-VERIFIED 3 Nov 2026 (commit 912a45c1), from Abdul Wahid's iPhone screen recording of /projects ("cards break ho rhy han, smooth kro" + "live site wala tag hta do" + "last 2 projects live nahi, khali jagha buri lag rhi"): DIAGNOSIS (measured): on mobile the stack cards had UNEVEN natural heights (488.7-594px @414) with the title band mid-card, so transitions travelled different distances, two title bands shared the viewport, and the badge repeated in every peek strip; the two cover cards were far shorter than screenshot cards. FIX (≤759px only, desktop untouched): one shared card geometry (grid rows: auto + fixed text allowance capped by the visible sticky window so a stuck card is always fully on screen; all 8 cards exactly 656.3px @414 / 642.8 @390 / 603.4 @320), peek step aligned to 14px in CSS + driver. The "Live site" pill (one element, .project-shot-badge in project-shot.tsx) removed everywhere — stack cards AND home Selected Work cards (case-study pages' own live links untouched; .live-dot kept for the case-study live-preview bar). The two non-live projects (Freelance Marketplace Database, Inventory Management System — the only two without a demo URL) got DESIGNED COVERS: token gradient + dot grid + oversized faded Anton monogram (FM/IM) + name/kind; mobile cover is exactly the 16/9 screenshot slot. Home principles stack checked at 390: CLEAN, unchanged (short uniform cards). Live desktop check: pill gone on all 6 screenshot cards, even stack, covers render as intended, clean ending. Phone feel = Abdul Wahid's on-device verdict (pending).
- 404 HERO CENTRING — SHIPPED + LIVE PIXEL-VERIFIED 3 Nov 2026 (commits ef20698b + 4c83e666), from Abdul Wahid's circled laptop screenshot ("center allign kro"): TWO stacked causes. (1) Chip + pixel code are <p>s under the generic .page-heading>p 680px cap; their own margin rules' higher specificity beat the centre pass's margin-inline:auto, so their boxes hugged left and their centred ink sat EXACTLY 85px off-axis at desktop (phone unaffected, container < cap). Fix: margin 0 auto on both rules. (2) The pixel DIGITS' ink still sat -9.5px after that: Press Start 2P's ink fills only the left 87.5% of each glyph advance (0-875 of 1000 units), shifting centred ink -0.0625em; fix = padding-left: 0.125em on .nf-pixel-code (em-based, scales with the fluid size). Also: the chip's blinking .nf-cursor was taken out of flow (absolute, calc(50% + 65px)) so the WORDS centre exactly; the cursor hangs off the text end by design — pixel scans that include it read ~+8px, which is intended, not a defect. Final live pixel proof: digits centre 951.5 == headline centre 951.5 (0.0px diff); chip words ~950.5. Dots-field untouched (owner-confirmed keep). NOTE for future pixel checks: distinguish ink-union-with-cursor from words-only.
- OG CARD — SHIPPED + LIVE-VERIFIED 3 Nov 2026: Abdul Wahid re-opened the OG redesign (his 1 Nov drop superseded by his option-B choice + per-card verdicts) after his WhatsApp self-chat screenshot showed the wide cards centre-cropped ("JL WAHID") and WhyRisk text-only. FINAL: Concept C "Paper" (light #F8F8F8, black AW mark + Anton name, orange role line, small abdulwahid.me) chosen by Abdul Wahid from 3 from-scratch concepts (A Mark Hero / B Editorial / C Paper; A+B rejected). Served as a STATIC public/og-card.png (27,808 bytes, ~0.49s); layout metadata points og+twitter images at https://www.abdulwahid.me/og-card.png; the generated app/opengraph-image.tsx route DELETED (commits 815e2e6 image, 32958f34 metadata, ec39fa05 route removal). Served bytes sha-verified == shipped file.
- OG 2x (3 Nov 2026): all three cards re-rendered natively at 2400x1260 (same approved designs, pixel-diff vs 1200 versions ~0.6/255 — AA edges only) and re-shipped under the same filenames (portfolio 8ce7b92, whyrisk 3cfad81, studyhub c5f40500), served bytes sha-verified live. Reason: WhatsApp thumbnails looked blurry from the 1200px source. og:image width/height declarations intentionally left at 1200x630 (standard slot hint, same aspect ratio).
- FOOTER WORDMARK SCROLL ANIMATION — SHIPPED + LIVE-VERIFIED 3 Nov 2026 (commit 8b7a90f7): Abdul Wahid's order — the giant faded "ABDUL WAHID" footer wordmark now animates with the scroll: scrubbed rise (+90px max, = band height x 0.34 clamped 24-96px) + fade (0 -> rest), house ease, played identically in reverse on scroll up; mid-scroll freezes mid-state. It REPLACED the older fire-once IntersectionObserver letter-stagger reveal (.wm-letter-in). Implementation: ScrollProgress-pattern rAF driver in footer-wordmark.tsx writing transform/opacity on a new .wm-track wrapper only; band overflow hidden clips the sunken name; footer height constant (626px measured); end-snap + change-guard fix so the settled state is EXACTLY rest (proven byte-identical strip PNG vs the pre-change build). Reduced motion: static at rest. Live check: bottom rest identical, half-entry mid-state fainter+lower (checked twice), returns to identical rest; back-to-top unaffected. Shipped on Abdul Wahid's "oky kro, agar na achi lagi to btaon ga, phir wapis aisy hi kr dena" — if he dislikes it, REVERT = restore components/footer-wordmark.tsx + app/globals.css from 66026aa6. His on-device verdict pending.
- FOOTER WORDMARK ANIMATION — REVERTED 3 Nov 2026 (commit 44fbe851) at Abdul Wahid's order minutes after shipping ("nahi hai, pehly jesa wapis purany wala kr do"): footer-wordmark.tsx + globals.css restored byte-exact from 66026aa6; live served CSS verified back to .wm-letter-in/.in-view with zero .wm-track. The scrubbed-rise experiment is CLOSED — do not re-propose it. His stated reason was only "nahi hai pehly jesa" (not like before) — his device feel verdict overrode the passing machine/live checks, same lesson as the hero texture and cursor return-to-rest.
- MOBILE MENU — BUG FIX + PREMIUM PANEL, SHIPPED 3 Nov 2026 (commit 1a59a49f), preview approved by Abdul Wahid first ("kro do"). BUG MECHANISM (reproduced): the menu's open-state body lock (overflow:hidden on body) made body the scroll container for the sticky header, so opening the panel at scrollY ~2445 teleported the header+panel to the document top (panel at viewport y -2381) — menu "dead" when scrolled down, fine at top. FIX: lock removed entirely; per Abdul Wahid's spec any deliberate scroll closes the panel (large move >48px always; small >6px after 250ms grace so the surfacing flick's momentum can't eat the tap). PANEL REDESIGN: slides from top (360ms house ease) over a soft ink scrim (tap closes), 20px/600 link rows with hairlines + stagger-in (fade+10px rise, 30ms steps) + arrow slide-in and accent wash on hover/active, active page keeps orange tick, foot row = Hire me button + GitHub/LinkedIn/mail icon buttons, hamburger morphs to X, height capped 100dvh-64px with internal scroll, RM = instant. Desktop header/nav untouched. Verified locally at 390+414 (open at depth: panel top 64/bottom 510 fully in view; scrim/Esc/scroll close) + served CSS live; phone feel = Abdul Wahid's check.
- MENU PANEL TRIMMED — SHIPPED 3 Nov 2026 (commit f109b700): after the premium-panel ship, Abdul Wahid cut the panel's foot row in two steps — first the duplicated "Hire me" button ("itni zyada ho gya"), then the GitHub/LinkedIn/mail icon buttons too ("links wala aik alag page hai" — socials belong on /links). Of three offered fillings for the empty space (nothing / a muted status line / a Download CV row), he chose NOTHING: "bas theek hi aisa simple". Final panel = six link rows only, ending cleanly after Links (+14px bottom padding). Live CSS verified free of the foot-row rules. Lesson reinforced: on this site he prefers ONE home for each thing — no duplicated CTAs/socials across surfaces.
- /CV PROSE — JUSTIFY + FULL-WIDTH SUMMARY, SHIPPED 4 Nov 2026 (justify: f435c07c; width: 4800ae1c): at Abdul Wahid's order the /cv prose paragraphs (summary, Experience bullets, project/education paragraphs) are now text-align: justify + hyphens: auto; headings, contact strip, dates, org/stack lines and the Skills lists stay left. His follow-up screenshot ("ye agy extra empty space kion hai") pinpointed the real second issue: .cv2-summary carried max-width: 78ch (~646px), so it stopped ~140px short of the sheet's content width with an empty band at its right — the cap is REMOVED; live pixel measurement: summary now spans x560-1344 (785px), edges identical to the contact strip, all non-final lines flush. Note for future disputes: the first visual live-check misjudged the justified summary as ragged — the pixel measurement (all line-ends at one x) overruled it; measure, don't eyeball, when he and a checker disagree.

## Serif-italic accent system (2026-11-04, shipped 2cb623b3, live-verified)
From reel #258's format, owner-tuned over ~10 preview rounds. THE RULE (owner's words): whichever font is in place stays; apply only the design logic — ONE word per heading in Instrument Serif Italic (next/font, --font-serif), sitting on the same baseline. Final map: home intro name "Abdul Wahid" orange serif 1.15em; CTA "problem" + footer "inspecting." orange serif at 1.05em (owner: the 1.18em read too big in Archivo statement headings — statement modifier .accent-serif-statement); /projects "hood" + /writing "evidence." orange serif inside Anton at 1.18em; home hero "result." + /about "system." take the FADED gray recipe instead (.accent-serif-faded = the .hg-faded gradient/opacity) after the owner compared full-line orange vs full-line gray previews and chose gray for both faded lines. The full-Archivo hero restyle (serif3) was built, previewed and REJECTED by the owner in favour of Anton + accent — do not re-propose replacing Anton. A full-italic line-2 variant (whole second line in serif italic, faded gray) was previewed 2026-11-04 late; the owner ordered it SAVED as an option ("save kr lo", 22:14) — NOT shipped; the live mixed version (Anton faded + one serif word) stays final. Preview files: ~/workspace/accent-preview/hero-full-italic.png + about-full-italic.png. It is a stored alternative he may ask to apply later; do not push it unasked. Owner verdict pattern this round: approves spot-by-spot via quoted replies; a quoted "ye theek hai" attaches to the whole bundle message, so confirm the running tally back to him rather than assuming which spot.

- CORRECTION 2026-11-05 (nightly consolidation — supersedes the
  "saved, NOT shipped" note on the full-italic line-2 variant
  above): Abdul Wahid APPROVED the full-italic line-2 variant late
  4 Nov and it SHIPPED LIVE as commit c7df3fe8 — home + /about
  hero line 2 are now the WHOLE line in Instrument Serif italic,
  faded gray; the mixed Anton + one-serif-word line 2 is gone.
  Same commit renamed the home closing CTA "Hire me" →
  "Start a conversation" (header "Hire me" kept — exactly one
  remains on the site).
- COMFORT ROUND SHIPPED + LIVE-VERIFIED 2026-11-05 ~00:00
  (commit 490eb777): first-visit system theme, --accent-text
  #C2410C light / #FB923C dark for text only, Live-preview
  scrim → 5.25:1, size floors ≥11px (sole exception the
  approved cv2 contact values 10.36px @414), /projects dead
  bands ~320px → ~148–160px, NO PURE WHITE (field #F7F7F5,
  surfaces #FCFCFA). Dopely warm-cream ladders REJECTED
  (\"ye sab taiz hai\") — do not re-propose. Current main HEAD
  490eb777. SUPERSEDED 2026-11-06 (nightly consolidation):
  the PENDING chart-cards + leftovers below SHIPPED +
  LIVE-VERIFIED 5 Nov ~08:41 as commit
  0986152c3b425f9d13bd568f484ce8a8f3b1fcea (see next bullet).
- GITHUB CHART CARDS + 4 LEFTOVERS — SHIPPED +
  LIVE-VERIFIED 2026-11-05 ~08:41 (commit 0986152c):
  /about GitHub section renders chart cards from the
  LIVE /api/github payload — 5 stat tiles, monthly trend
  area (13 months), languages donut, LAST-30-DAYS daily
  bars (his correction of "recent weeks"), latest-activity
  card; heatmap + community block preserved; scroll-triggered
  once-only animation; reduced-motion = final state.
  Leftovers in the same round: --border #D9D9D9,
  --muted #595959, inputs 13→16px (incl. /projects
  search/sort + writing playground inputs), footer
  48/40px, /links air trimmed. Verified: tsc/build
  clean, tests 6/6, overflow 45 checks clean, counters
  exact on live values (1,229 / 7-day streak / 162 Nov).
  LIMITATION: live scroll-animation feel on a real phone
  remains Abdul Wahid's check (sandbox could not tunnel).
- BUILDER-STALL LESSON (5 Nov ~01:23, durable): two
  builders ran ~47 min combined writing NOTHING; both
  closed. Never trust "running" — check for actual file
  writes within ~10 min. Main agent built the round
  personally (~08:24–08:41). Contributing cause:
  ~/workspace/.portfolio-build is a STALE checkout
  (mtime 2026-11-02 20:45, not a git repo, pre-comfort
  tokens) — sync/diff against the GitHub tree; charts
  build used a fresh codeload-zip copy in
  ~/workspace/.portfolio-build-charts.
- THEME-TOGGLE REPORT — CLOSED 5 Nov, NOT A SITE BUG:
  on a family member's phone the icon flipped (sun→moon) and the
  site switched to light, but the background stayed dark
  — the phone browser's forced-dark mode re-darkens the
  site (looked like Samsung Internet, not Chrome).
  Abdul Wahid confirmed "han google pe sai chal rha hai".
  No site change. Evidence: ~/workspace/theme-toggle-check/.
- PORTFOLIO BUSINESS CARD — DESIGNED 5 Nov, print NOT
  ordered (from reel #263): dark front (AW logo, ABDUL
  WAHID Anton, "ai / ml developer" orange serif italic)
  + light back (QR to abdulwahid.me), 3.5×2 in,
  1050×600; vertical 600×1050; template variant
  (matte-black top, giant bold "Wahid."); front footer =
  2×2 orange-icon contact grid (email, phone — his
  public-CV number at his explicit request — GitHub,
  LinkedIn). Watermark tried twice, REMOVED at his
  order ("nahi hta do") — do not re-add. Template
  verdict PENDING. NFC: CardClick custom-printed
  Rs 1,500 recommended; Daraz blank NTAG215 Rs 449
  cheapest trial; NO order placed, his pick pending.
  Files: ~/workspace/portfolio-card/.
- INK-BLEED THEME TOGGLE — SHIPPED LIVE 2026-11-10
  (commit 9c5eb13): theme toggle runs a WebGL2 ink-bleed
  transition — blot in the OLD theme's --background colour
  spreads from the click point (fbm-warped edge), theme
  flips under full cover, blot noise-dissolves onto the new
  theme (~1.2s). V1 CLEAN style is Abdul Wahid's explicit pick —
  he first approved V2 (feathered/fibred) as a GIF, then
  corrected to "v1 wali" before approving the port; do not
  add the V2 detailing. No new deps (GSAP/html2canvas from
  the source repo NOT adopted; transparent-canvas design
  needs no page capture). Fallbacks: reduced-motion /
  no-WebGL2 / shader error / mid-transition click → instant
  flip. Phone feel = Abdul Wahid's check. Preview artifact:
  ink-theme-preview-portfolio; GIFs in ~/workspace/your_files/.
- WORKING PRINCIPLES TITLE (2026-11-10, shipped + live-verified): home principles heading now uses the hero pattern — Anton caps line 1 + faded Instrument Serif italic line 2 (.principles-title, scoped to this heading only by Abdul Wahid's explicit pick; other section headings remain Archivo). Fluid clamp sizes, nowrap — fixes the phone-width hyphen break of "impressive-looking." Commit ffe00e8.
- REVERTED SAME NIGHT (2026-11-10, commit d384909): ink-bleed toggle AND Anton principles title both removed on Abdul Wahid's order ('toggle wala sab purany pe hi le jao'); toggle = plain instant flip, heading = original Archivo. Both are REJECTED ideas — do not re-propose. Lag note: ~8 always-on rAF systems identified as the phone-lag cause; perf fix proposed, awaiting his go.
- PERFORMANCE PASS (2026-11-10, shipped + live-verified, commit 800d62b): Abdul Wahid reported phone lag/stalling animations. Glow rAF loops now idle-stop + hidden-tab pause; cursor loop stops when settled with pointer out; back-to-top is scroll-listener driven (was permanent rAF poll); glow layers display:none on touch devices. Audit found stack/marquee already IO-gated, Lenis leaves touch native. His phone feel-check pending.

## 22 Nov 2026 — gallery + hero + ledger day (sessions 04-28)

- **HOME GALLERY — FINAL (sessions 04-13, commits 7b0469c9, 8ce990b6, 63d6a0d4, 1d5f6877, bda26256, 8ed549bd, 8b06891a):** expanding-panel gallery on home + horizontal scroll on /projects (his pick from 5 GIF previews; #4 Gallery recommended, #1 Tilt safe, #5 scroll-driven warned as twice-rejected). FINAL interaction: ONE project always open — Plan Banao open by default, hover/tap switches, pointer leaving closes NOTHING, clicking the open panel opens its case study; scrim .40 + strong bottom band + 4-line clamp; touch: first tap expands a collapsed project, second tap on the open one opens its case study. Order: Plan Banao FIRST, WhyRisk second, Study Hub third. 'Explore all projects' = centred pill button directly below the home gallery (48px, bordered, accent hover). The session-08 idle-spread treatment is REJECTED — do not re-apply it. Home shows exactly 4 projects (Churnex removed from HOME only, 0acf83d2; its case study + /projects listing remain live).
- **HERO REBUILT (session 15, commit 8701206f):** Home + About heroes use the PREVIEW composition — left-aligned eyebrow/headline/copy/actions, sentence-case headline, serif line as ONE solid muted tone, portrait at the RIGHT of the headline (About's below its long Anton line); badge REMOVED entirely (session 17, 377d811a). Header, copy wording and HeroGlow untouched.
- **CURSOR (session 16, commit dc0dad56):** spring physics GONE — SmoothFollower-style lerps (0.20/0.12/0.22, zero overshoot); SVG arrow look and his 2026-11-03 heading-freeze rule stay. **POINTER-FOLLOW GLOW REMOVED (session 20, commits 34c1977d + bd78a467):** global PointerGlow + hero HeroGlow deleted entirely (components/pointer-glow.tsx deleted); magnetic buttons + custom cursor untouched.
- **FOOTER WORDMARK REPLAY (session 14, commit c2744c5d):** animation replays on every refresh and every new page (IntersectionObserver reset on route change + bfcache pageshow); same letters/timing/style.
- **ABOUT LEDGER SYSTEM (sessions 18-19, commits 6fe0abbf + 240f8840):** Experience, Education, Credentials, Community ALL on one ledger from the UI Layouts 'Portfolio Experience' block (demo violet -> house orange, DM Sans -> Anton/Archivo, Tailwind -> token CSS, motion package -> site's own Reveal; no new deps). Experience + Education = full three-column ledger; Credentials + Community = slim two-column variant. All wording/figures verbatim from content/profile.ts.
- **WORKING PRINCIPLES — STACKING IS FINAL (sessions 21-24):** scroll-text on heading (76367118), slide-reveal on cards (session 22), bare text-points (session 23) — ALL tried and REJECTED the same evening; original stacking cards restored VERBATIM (sticky 64px, covered scale 0.9475) in session 24. Do NOT re-propose slide/text-point variants for this section. Home principles stacking is the FINAL standing form; /about principles keep a flat grid.
- **DEFAULT ZOOM — APPLIED THEN ROLLED BACK SAME EVENING (sessions 27-28):** CSS `zoom` 0.9 on >=1025px / 0.75 on <=1024px shipped live (2f6e629d, live-verified); ~15 minutes later he ordered "aik commit peechy jao" and session 28 (60c18ed1) removed ONLY that commit — site is at 100% default scale. Do NOT re-apply a default-zoom treatment unless he asks again.
- **CASE FIXES (22 Nov):** case-study hero actions centred (ce0913ce, applies to every case page); card-header CSS restored (cad9a0ad — base rules for .project-card-top/.project-card-name/.project-card-top-actions/.project-github-btn were MISSING from globals.css, same clipped-rules failure as the 21 Nov visit-pill loss; restored title-left + 34px circle buttons right); Abdul Wahid asked whether the colour had changed — confirmed NO: accent still original #f97316 (light) / #fb923c (dark).
- **WHYRISK PANEL STALE SCREENSHOT (sessions 25-26, commits 5b47bd53 + 27e4200b):** mShots captures are keyed on the EXACT target URL — bumping `?w=` 1200->1240 only resizes, does NOT recapture. Fix: WhyRisk `demo` URL now https://whyrisk.vercel.app/welcome (root 308-redirects there anyway); fresh capture verified showing the new violet landing. AGENTS.md lesson filed.
- **CURSOR-REACTIVE HERO BACKGROUND — PARKED (22 Nov, ~18:35):** 3 GIF previews delivered (Magnetic Dots / Magnetic Orbs / Spotlight Grid; Muse recommended Dots). Abdul Wahid: "background choro" / "background bad mai final krty han". Do NOT ship any of the three until he finalizes later.
- **21 Nov state carried forward:** scroll effects (3D Card Zoom + Line-by-line Reveal, commit 479d4397) live; his phone feel-check of the scroll effects + the new gallery/hero still pending — his live feel is the verdict.
