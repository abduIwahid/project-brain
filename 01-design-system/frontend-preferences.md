# General frontend preferences — Abdul Wahid's defaults

Standing taste, gathered from his projects and corrections (latest first).
A project's own file in `../projects/` overrides anything here for that project.

## Design language

- **AURORA IS THE HIGHEST-PRIORITY FRONTEND REFERENCE (Abdul Wahid, 2026-11-23 — first set as the standing reference, then raised the same evening to highest priority):** when a new project's frontend starts, REMIND Abdul Wahid of Aurora and default to its system unless he picks otherwise — ThemeWagon's Aurora (React + MUI): clean SaaS look, white bg, soft-black text #1B2124, blue accent #3385F0, Plus Jakarta Sans, 8px radii, soft borders (#E5E7EB) + whisper shadow, rotating-word hero, trust strip, showcase cards. Full distillation: `aurora-template.md` in this folder (raw captures and a full all-pages library are kept privately, outside this public repo). Companion component source: **UI Layouts** (ui-layouts.com — see `ui-layouts-library.md`) — check it alongside Aurora for components/effects. Grunge (monochrome, giant Road Rage type) is the saved alternative — `grunge-template.md`.

- **Bold, editorial, minimal.** Big display type, lots of air, restrained color.
- **Typography:** Anton for display/headline work (uppercase, condensed) is his
  signature; a clean sans for body. Uppercase Anton section titles read as
  "his" style.
- **Color (defaults):** near-black/white monochrome + ONE strong accent
  (portfolio accent: orange `#f97316`). Light themes are the default on his
  sites; dark mode is a toggle, not the default.
- **Iconography:** one icon family per project, used consistently
  (Bootstrap Icons on Study Hub, Lucide on the portfolio).
- **Motion:** purposeful only — quick feedback (<400ms feel), skeleton
  loaders while data loads, scroll reveals one-by-one. Respect
  `prefers-reduced-motion`.

## Typography — choose the family by the feeling (@designshala.co)

- **Serif** → premium, luxury, elegant.
- **Sans-serif** → clean, modern, professional (his default for product UI).
- **Script** → soft, personal, romantic — rare, use deliberately.
- **Display** (e.g. Anton) → bold, attention-first; headlines only.
- **Monospace** → tech, coding, futuristic; code and data accents.

## Visual styles vocabulary (@aydadex)

Glassmorphism = frosted-glass transparency · Claymorphism = soft inflated
3D · Skeuomorphism = mimics real objects · Neumorphism = soft surfaces,
subtle depth. Rule of thumb: the style must support the product, not chase
the trend.

## Hero anatomy (@marcelodesignxh)

A strong hero = logo/nav, a badge or icon, a bold title, supporting text,
and two CTAs, usually in a centered composition. Premium feel comes from
styling layers (accent colour, pill buttons) over a sound wireframe — not
from a complicated layout.

## Layout patterns he has approved

- Floating **pill header** (glassy, blurred, rounded) — approved on the
  portfolio, 2026-10-23.
- **Cards grid** for collections (projects, courses), with a 1-by-1 scroll
  reveal.
- Giant two-line hero headline with an image/portrait overlapping the type.
- Sticky footer that sits at the screen bottom on short pages.
- Centered, minimal footers — only what earns its place.

## Avoid the AI-default fingerprint (from @krishanu.builds, saved 2026-10-23)

Before shipping a design, scan for the tells that make a site read as
AI-generated and strip them: purple-to-blue gradients, gradient headline
text, a badge above the headline, three icon boxes in a row, emojis in
headings, stock shadcn components left untouched, the same icon set
everywhere, default fonts (Inter; Space Grotesk + Instrument Serif),
serif-italic accent words, glassmorphism, coloured left-border cards,
every section fading in on scroll, low-contrast dark mode, inconsistent
spacing, decorative grain. If a draft has several of these, run a cleanup
pass specifically against this list.

## Mobile navigation (@iconlypro, @aydadex)

One consistent icon set; ~4 items matched to the app's core tasks; theme
the bar to the product; the primary action gets an accent colour or a
raised central button so it's found instantly.
Know the pattern menu and pick per product: tab bar, side menu/drawer,
bottom sheet, FAB, or an icon grid (Home/Search/Orders/Profile/Settings/
Help) — the right pattern is the one that fits the product's tasks.

## Hard don'ts (learned from his rejections)

- **No scroll-driven / sticky project flows** — rejected twice; keep the
  simple cards grid.
- **No exact copies of someone else's site** — take the style/technique,
  write fresh code with his content.
- Don't ship public-facing copy without showing him the exact wording first.

## Dark mode rules (@supercharge.design)

Never pure black + pure white (harsh) — soften both. No large bright
surfaces in dark UI; show depth with overlap, colour and opacity, not
shadows. Desaturate colours in dark mode (saturation vibrates). Always
offer the light/dark choice; typography must stay highly readable.

## Shadows (@uxbrainy)

Never a plain white drop-shadow glow — it reads cheap, even on dark
backgrounds. Build shadows from layered drop shadows for a soft,
premium result.

## Design resource directories (@codewithnishant)

Inspiration/assets when starting a design: landdding.com (landings),
godly.website (award-winning sites), footer.design (footers),
recent.design, 60fps.design (mobile UI animation), wonderlist.design
(full Figma designs), backgrounds.supply (backgrounds), fontinlogo.com
(fonts behind brands), on.design (community).

## Interface patterns (@iconlypro)

Design empty states deliberately — simple visual + one clear next action,
never a blank screen. Make numbers scannable: charts, allocation
breakdowns, compact summary cards instead of bare figures. Surface
progress at a glance (visual indicators), personalize with avatars and
greetings, and use whitespace so key content is easy to find.

## Professional polish (@eric_the_coder)

Skeleton loaders shaped like the real UI instead of spinners; transitions
and small animations between screens; an onboarding flow for first use;
and never dark patterns (buried unsubscribe, no easy "reject all") — they
cost trust and some are illegal.

## Handy design tools (from saved reels)

- **Realtime Colors** — preview a palette on a realistic site mockup
  before committing to it.
- **Haikei** (haikei.app) — generate SVG assets: gradients, blobs, waves.
- **Mobile View** (Chrome extension) — preview many device sizes
  side-by-side on one page with synced scrolling, for responsive checks.
- **M3E Canvas** (open source) — drag-and-drop Material 3 UI builder that
  exports an AI prompt from the design, for design-first vibe coding.
- **SaveWeb2ZIP** — downloads a reference site's frontend code/assets as a
  ZIP; for studying structure and techniques, never for 1:1 cloning.
- **Flowbite** — free Tailwind CSS component library (logins, navbars,
  blocks); copy, paste, customize instead of hand-writing repetitive UI.
- **Premium-look UI libraries** (names only, links DM-gated): Animaster,
  Skiper UI, Vengeance AI — layer onto AI-generated frontends that look
  basic by default.
- **anime.js** — lightweight JS animation engine (stagger, timelines, SVG
  morphing, scroll observer) for motion polish.
- **Shadcnblocks** (VS Code extension) — browse and one-click install
  1,800+ shadcn/ui blocks inside the editor.
- **Motion.dev** — animation library for scroll effects, layout
  animations and gestures; **React Bits** (reactbits.dev) — React
  component library for vibe-coded builds.

## Working rules

- **UX laws checklist** — the 20 classic laws (Hick's, Fitts's, Jakob's,
  Miller's, Doherty threshold, Von Restorff, Peak-End…) live in `~/AGENTS.md`
  and apply quietly to every frontend build.
- **Verify responsive properly:** sizes derived from real measurements, not
  guesses; check mobile widths (phones ~360–430px) as carefully as desktop.
- **Public-facing content is always in English.**
- **Git:** everything direct to `main`, no side branches/PRs.
- **Production readiness:** see `production-checklist.md` in this folder —
  apply the items relevant to the app, security and core function first, and
  verify each implemented feature actually works.

## Taste notes — 2026-10-23 (from Abdul Wahid's corrections)
- Pure/full white surfaces: NO — always warm the white toward cream (Study Hub cards #fdfaf1 on #f0ede4).
- Headers must never wrap to two lines: one horizontal line at every width; on phones go icon-only nav before allowing a break.
- Narrow tall modals feel "lengthy" — prefer wider, shorter windows.
- AI-generated text in UI must be clean and organized: no raw markdown symbols, no LaTeX junk — plain readable formatting.
- His nickname (Abdul Wahid) never appears on public material — always full name Abdul Wahid.

## Pattern: staged progress for multi-step processes (2026-10-24, saved-references item 95)
When a flow has real stages (upload -> extract -> process -> done), show them as named steps with per-step state (pending/active/done/flagged) and a final summary line, instead of a single spinner or bar. Users tolerate waits they can see through. Reference: @looop.co_'s upload microinteraction (Upload/Unpack/Scan/Clean/Organize).

## Motion + empty states (from Abdul Wahid's reels, 2026-10-25)
- **Staggered motion (saved-references item 103):** never animate headline/text/button with identical 0ms delay and identical duration — uniform timing is exactly what makes a site feel cheap. Premium feel = choreographed timing: small staggered delays, varied durations and easings per element. Apply to portfolio scroll-reveals and Study Hub micro-interactions.
- **Empty states (item 105, ShaDevelopers):** never a bare "No data available" dead end. Every empty state gets: a small illustration/icon, a specific heading (e.g. "No Projects Yet"), one line of why/what-to-do-next copy, and ONE primary CTA that starts the flow. Apply across Study Hub, MediSight, NearSend.

- **Product wording = English only (Abdul Wahid, 2026-10-25):** every user-visible string in his products — UI copy, errors, labels, admin areas — is English; no Roman Urdu anywhere in a product. A bilingual English/Urdu toggle is a possible future feature at his word, never built unasked.

## Font pairings (@gfx.om, saved-references item 117)

Pairing rules: 2–3 fonts per design maximum; create contrast (a display
font + a clean font); hierarchy by weight (headings bold/display,
subheadings medium/semibold, body regular/light); keep the same pairing
across the whole brand. Twelve ready pairings (headings + body):
Playfair Display + Montserrat (modern & clean) · Montserrat + Lato (bold &
minimal) · Bodoni Moda + Poppins (elegant) · Pacifico + Montserrat
(creative) · Lora + Open Sans (strong) · Helvetica Neue + Source Sans Pro
(minimal) · Abril Fatface + Raleway (vintage) · Rajdhani + Roboto (tech) ·
Quicksand + Nunito (soft & friendly) · Cormorant Garamond + Lato (luxury) ·
Anton + Muli (edgy & bold — the Anton entry validates Abdul Wahid's own signature
pairing logic: Anton display + a clean sans body, as in Anton/Archivo) ·
Fraunces + Inter (fresh & modern).

## Golden-ratio layout splits (@vivianc.webdev, saved-references item 119)

Avoid dead-even 50/50 splits in two-column sections. Divide space by the
golden ratio instead — roughly 62/38 — so the layout breathes and the
larger side clearly leads. Pairs with the 60-30-10 colour rule (item 118):
62/38 proportions for SPACE, 60-30-10 proportions for COLOUR. Applies to
about/contact/feature split sections; a deliberately centered composition
(his portfolio hero) is an exception, not a split.

## Design size cheat sheet (@gfx.om, saved-references item 124)

Social: Instagram post 1080×1350 (4:5); stories/reels 1080×1920 (9:16);
LinkedIn post 1200×1200; Facebook post 1200×1200, cover 820×312; X post
1200×675, header 1500×500; YouTube thumb 1280×720, banner 2560×1440.
Web: hero/landing 1920×1080; featured/OG-class image 1200×675 (his OG cards
run 1200×630); email header 600×200. Icons: iOS 1024×1024, Android 512×512
(the Study Hub PWA icon rows). Print: A4/letterhead 210×297mm, A3 poster
297×420, A5 flyer 148×210, business card 91×55 — always 300 DPI for print.
Formats: JPG photos, PNG transparency, SVG logos/icons, PDF print/sharing.

## Nested border radius rule (saved-references item 125)

For an element nested inside a rounded parent with padding: inner radius
= outer radius − padding (equivalently, outer R = inner R + padding).
Example: 8px padding inside a 24px-radius card → the inner element gets
16px. Never copy the parent's radius onto the child — the arcs stop
sharing a centre and the inner corner bulges. Sanity test: scale the inner
frame up to the outer frame's size; the corners should coincide.

## Grouped-list pattern (saved-references item 127, @aryan_choudhary08_)

For menu/settings/resource lists: ONE grouped list inside a single card
beats many separate floating mini-cards. Supporting rules from the same
before/after: show any status exactly once (no badge + duplicate row);
icons in one neutral monochrome style — colour is spent on state, not on
every icon; identity/status as a compact header above the list; on mobile
tab bars, a floating pill with only the active tab visually filled.

## Six pro-detail checks (vamshi.work, saved-references item 131)

Audit any UI against these before calling it done: (1) spacing on an 8pt
grid — gaps in 8/16/24 steps, never random values; (2) no pure-black text
— use a soft near-black (his systems already do: MediSight ink #06141B);
(3) body text left-aligned, never centred paragraphs; (4) exactly ONE
filled primary button per view — secondary actions are outline/ghost;
(5) body line-height between 1.4 and 1.6; (6) body-text contrast at
least 4.5:1. Two additions (@gfx.om, item 148): body line length of
50–75 characters (cap prose width accordingly), and for small text aim
for a 7:1 contrast ratio, not just 4.5:1.

## Logo fonts — feeling to font (@gfx.om, saved-references item 132)

For wordmark/logo choices, famous-brand anchors: bold clean sans =
strong/modern (Nike — Helvetica Bold; Adidas — Futura Bold); geometric
sans = friendly tech (Google — Product Sans; Tesla — Montserrat custom);
neutral sans = readable digital (YouTube — Roboto; Apple — SF Pro);
classic script = heritage (Coca-Cola — Spencerian); playful script =
kids/entertainment (Disney); high-contrast serif = luxury (Vogue —
Didot); serif = elegant corporate (Sony — Times New Roman modified);
rounded serif = fun/creative (Lego — Bree Serif). His display workhorse
Anton sits in the bold-sans slot.

## Typography vocabulary + spacing rules (brandingbybhawika, item 137)

Kerning = spacing between two letters; tracking = spacing across a
word; leading = line spacing. Working rules: large display headings get
TIGHTER tracking (his Anton headlines), small captions/eyebrows get WIDER
tracking (his JetBrains Mono eyebrows); body text flush left; decorative
categories (script, blackletter, handwritten) sparingly, never for
sentences; never stretch, shadow, glow, emboss or outline body text.
Terms: typeface = the letterform design, font = one variation of it,
family = the full set of styles. Font anatomy (brandingbybhawika,
item 163): the lines are ascent / ascender / cap height / x-height /
baseline / descender; the parts worth knowing by name are stem,
counter (the enclosed space), apex, bowl, shoulder, arm, crossbar,
ear, loop, leg, tail, spine, swash and the dot (tittle). Working
subset: x-height drives body-text legibility (judge body fonts by
it), cap height vs ascender explains why display fonts feel tall or
calm, and the counter is what clogs first at small sizes.

Font weights (@gfx.om Font Weight Guide, item 171): build hierarchy
from ONE family's weights before reaching for another family — 2–3
weights max per design. Working map: 300 Light / 400 Regular = body
and UI text; 500 Medium = subheadings, callouts; 600 Semi Bold =
headlines, buttons; 700 Bold = titles, section headers; 800–900 =
hero/display only, short text. Pairings that work: Regular+Medium
(clean), Regular+Bold (clear), Light+SemiBold (premium), Bold+Black
(impact). Never: important text in thin weights, long paragraphs in
heavy weights, or weights so close the contrast disappears. Corollary
proven on WhyRisk (2026-10-25): a single-weight family (Anton = 400
only) FAKES extra weights when a bold class is applied and looks
wrong — multi-weight work belongs to Archivo; Anton stays
display-only.

## Spacing system (@gfx.om Spacing Cheat Sheet, item 157)

One base unit — 8px (4px when finer control is needed) — and only its
multiples, everywhere. Named scale: 4 XS · 8 S · 12 M · 16 L · 24 XL ·
32 XXL · 48 3XL. Component defaults from the sheet: button side-padding
16px, input padding 12px, card spacing 16px, list-item spacing 12px.
Typography gaps: heading → description 24px, subheading → body 16px,
body → paragraph 12px. Grids: 24px gutters, 16px margins. Principles:
related elements sit CLOSER, different sections sit FURTHER apart (the
Law of Proximity in numbers); more space around a thing marks it LESS
important, less space marks it MORE important; the same spacing values
on every screen — consistency is the point (matches Abdul Wahid's standing
consistency rule). Builds on the 8pt check from item 131; use this
scale when auditing spacing instead of eyeballing it. Unit mnemonic
(item 159's game framing): px = FIXED, rem = ROOT-relative, em =
PARENT-relative, % = relative size — prefer rem for spacing/type so
the whole scale breathes with the root size; px only where a value
must never move (borders, hairlines).

## Button depth — candidate technique (item 162)

Layered INSET box-shadows (inset highlight + inset shade, then a soft
outer shadow) give a flat button a pressed, tactile, premium feel —
the "your buttons look cheap" fix. Status: candidate, not a default.
Try it on a primary button and judge against the house taste first:
solid colours, no coloured glows, no heavy shadows (cf. the sidebar
glow removed in the WhyRisk hallmark round). If it survives at low
intensity, it belongs on primary CTAs only.

## Per-site brand rule (Abdul Wahid, 2026-11-01 — OG cards correction)
- NEVER stamp one template/font set on every site. Every asset for a site (share cards, images, pages) uses THAT site's own fonts + colours, exactly as the site itself defines them (check its layout/OG source first).
- WhyRisk: Archivo (headings) + Anton (landing headline/large numbers only) + JetBrains Mono (labels); Midnight Clinical palette, flat #0D2B3E card bg, Ink tile.
- Portfolio: Anton (display) + Archivo + JetBrains Mono; bg #0A0A0A, orange #F97316, grays #E5E5E5/#A3A3A3.
- Study Hub: Archivo Black wordmark + open-book logo, deep green #004741, cream #F3EDDA, sage #8FAE9F.
- **Site imagery = REAL photography first** (Abdul Wahid, 2026-11-02): AI-generated hero/section images were rejected for WhyRisk ("real premium images utha ke lao"); source real photos from free-license libraries (Unsplash/Pexels), high-res originals, brand-grade them in implementation (navy overlay/scrim) rather than generating.
- **No faces in general product imagery** (Abdul Wahid, 2026-11-02): hero/backgrounds/sections use faceless medical imagery only (equipment, labs, interiors, stethoscope, ECG/data visuals). People/doctor photos ONLY in people-relevant places (e.g. Doctors directory). Judge the photo per placement ("website ke hissab se dekho wahan kesi pic suit kry gi").
- **Imagery treatment: backgrounds only, never direct pictures** (Abdul Wahid, 2026-11-02): photos go in as background layers behind content — slight blur + brand overlay wherever legibility needs it. No framed/pasted photo blocks on pages.
- **Consistency is a gate, not a preference** (Abdul Wahid, 2026-11-02): same treatment across every sibling surface in the same round; verify live before calling anything final; when a surface can't be checked (phone), ship conservative + say it's unverified.
- Case-study presentation format (saved-references #258, 2026-11-04): present a project's design system as NUMBERED decision cards (01 Colour & Type, 02 Depth, 03 Motion...) — a clean structure for portfolio case studies and LinkedIn carousels. The reel's own techniques (glassmorphism, WebGL streams) stay rejected under the standing no-glass / no-WebGL-weight rules; only the format is borrowed.

## The 10 states — pre-ship checklist (saved-references #261, @strategyfox, 2026-11-04)
No UI ships until these states are designed, not just the happy path:
1. **Empty** — say why it's empty + give one next step.
2. **Loading** — skeleton in the shape of what's coming, not a bare spinner.
3. **Error** — what went wrong, whose fault it is, how to fix it.
4. **No internet** — cached content stays visible; say what still works.
5. **Slow network** — real progress + offer a lighter path.
6. **No search results** — fix the user's typo for them; suggest the next search.
7. **Permission denied** — explain why it's needed + a way back.
8. **Session expired** — save their work before signing them out.
9. **Form validation** — flag the exact field, inline, with the fix.
10. **Success** — confirm, reassure, then show what happens next.
Applies to every project (WhyRisk, Study Hub, portfolio forms, hackathon builds).

## "AI-slop tells" perception list (reel #285, @neorafay, 22 Nov 2026)
One designer's viral checklist of surface signals that currently read as "AI-generated website" to design Instagram/Twitter: tags & pills, negative kerning, excessive italics, Instrument Serif, over-the-top detailed UI, overusing dividers, colour shades & opacities, containers with borders, overly detailed diagrams, redundant text, code breadcrumbs, section numbering, eyebrows, dithering, ASCII images, squircles, all-caps subtitles, periods in titles, gradient backgrounds. STATUS: perception reference only — NOT a house rule. Several items are Abdul Wahid's DELIBERATE design system (mono eyebrows + section numbering on the WhyRisk template landing, serif-italic accents on the portfolio). Use it to know how a choice may be read, never to auto-remove an approved device. Full entry: saved-references #285.
