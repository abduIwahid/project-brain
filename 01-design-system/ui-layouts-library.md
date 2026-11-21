# UI Layouts — Abdul Wahid's component library (standing resource)

**What it is:** [ui-layouts.com](https://www.ui-layouts.com) — an open-source React/Next component library (copy-paste components, installed via `npx uilayouts@latest add <name>` or manual code), plus its cursor-only sister site [cursify.ui-layouts.com](https://cursify.ui-layouts.com) (37 cursor effects). Components are Tailwind + `motion`-based in the demos; several originate from community creators (e.g. Olivier Larose's stacking cards).

**Standing instruction (Abdul Wahid, 2026-11-02 ~22:41 PKT):** "Save everything I sent from this library in your brain, and use this library and its code for future projects. Whatever can be used for the portfolio right now, use it." → This library is a FIRST-CHECK source when a future project needs a component or effect. Adapt its code into the project's own system (house style: dependency-light, hand-rolled equivalents preferred over adding `motion`/`lenis` unless the effect genuinely needs them); never paste demo styling (colours, gradients, placeholder data) into a real project.

**Filters that ALWAYS apply (Abdul Wahid's standing rules beat the library):**
- Public/product copy is English only, proposed and approved by Abdul Wahid first.
- No fabricated claims — a library pattern that implies false affiliation (brand-logo "trusted by" bands) is forbidden.
- De-slop rules: no decorative gradients, no backdrop-filter glass, no overshoot gimmicks, nothing that reads as a vibe-coded tell (his refs #204 list).
- Performance discipline: heavy runtimes (WebGL/Three.js) need an exceptional reason; his audience is largely on modest phones.
- Sticky/scroll-driven project flows: rejected twice, then stacking cards explicitly approved for /projects only (2026-11-02). Do not generalise that approval to other surfaces.

## Component ledger (reviewed with Abdul Wahid, 2 Nov 2026; full detail in ~/workspace/user/saved-references.md #206–#217)

APPLIED to abdulwahid.me:
- **Blend cursor** (reference: @frontendcharm via Cursify review, #206) — dot + difference-blend expanding circle, spring physics. Shipped 4e065cd5; v2 quality fix 8d9d4931. On 2026-11-03 Abdul Wahid declined swapping it for Cursify's Smooth Cursor Follower (#219) and said he will look for another cursor himself — the blend cursor stays until he picks one and orders the change.
- **Scroll Text Marquee** (#207) — scroll-velocity text band; his approved phrase; built dependency-free under the hero.
- **Stacking Cards** (#208) — for /projects, CSS-sticky, his palette (demo's rainbow colours rejected).
- **Footer giant wordmark** (#212) — rising staggered Anton letters ("ABDUL WAHID", faded ink) at the footer base. (Newsletter form from the same demo REJECTED — no list, no fake forms.)
- **Expanding "Visit" pill button** (#211) — circle → pill on hover/focus; live-site actions (stack panels + case-study heroes); solid ink, not the demo gradient.
- **Tech-stack band** (#210, honest form of #215) — constant-speed band of HIS tools on /about (the brand-logo version is forbidden).
- **Lenis smooth scroll** (#209) — shipped 2026-11-02 (df940701, lenis 1.3.27, lerp 0.1, window mode only, touch smoothing off, never initialised under reduced motion) and LIVE-VERIFIED: /projects sticky stack, case-study sidebar, route-change reset + back-button restore, and skip-link anchor all re-checked in a real browser after deploy — all passed.

REJECTED (do not resurrect without Abdul Wahid explicitly reopening):
- Liquid Glass anything (#214) — backdrop-filter identity; both his aesthetics are flat.
- Brand-logo marquee (#215) — fabricated affiliation.
- Image Ripple / WebGL (#216) — weight + distorts evidence screenshots.
- Mega-drawer header (#213) — six links don't need it; gradient tiles + backdrop-blur are de-slop items. (Its mobile bottom-sheet alone was "acceptable polish, low priority" — held, not queued; Abdul Wahid can order it with one word.)
- Spotlight cursor — darkens the whole page; hostile on a light reading site.
- Particle/emoji cursor trails (Fairydust, Snowflake, Rainbow, Character, Neon, Glitch…) — vibe-coded tells.
- Magnetic cursor — his buttons are already magnetic.
- Neural Glow cursor — duplicates his pointer glow.

## Cursify quick map (for future projects)
- Safe/professional: Follow Cursor (lagging dot), Smooth Cursor Follower, Scaling Cursor, Blob Cursor.
- Most literal physics: Springy Cursor (7-dot spring chain — use dots, never the emoji default).
- Click Cursor / Ripple Cursor: click feedback only; use sparingly.
- Spotlight, Trail, Fluid, Canvas, Textflag, TextIcon, Multi, 3D, Arrow, Gradient cursors: demo-ware; judge per project, default no for reading-heavy products.

## Code held — canvas batch filed by Abdul Wahid, 3 Nov 2026 (~/workspace/user/ui-layouts-code/)
- **VerticalBarsNoise** (#222) — signal/spectrogram canvas texture. Verdict: candidate for the home HERO only, toned to tokens, with pause-offscreen + reduced-motion + no-glow-stacking conditions. Not site-wide.
- **DotParticleCanvas** (#223) — click-burst dots. Verdict: NOT for the portfolio (particle-tell family, duplicates existing click feedback, constant rAF cost). Future playful surfaces only.
- **SmoothFollower** (#219, code now also held as smooth-follower.tsx) — this is the exact Cursify Smooth Cursor Follower Abdul Wahid already reviewed and DECLINED on 2026-11-03 ("chor do, na badlo"); re-sent in the 3 Nov batch, decision stands unless he explicitly reopens it.
- **CharacterCursor** (#225) — letter-shedding cursor trail. Verdict: NOT for the portfolio (named in the already-rejected trail family; fights the blend cursor; touch-spawn violates the touch rule). Filed only.
- **BlobCursor** (#226) — react-spring goo/metaball cursor. Verdict: NOT for the portfolio (cursor settled; new dependency against the dependency-light rule; playful register; CSS file not supplied). Filed only.
- **TextIconCursor** (#227) — contextual cursor label pill ("View case study" pattern). Verdict: legitimate pattern, real candidate — but his Visit pill already covers the affordance incl. touch; only as a future rebuild on his existing cursor, piloted on /projects. Not queued.
- **GenieEffect** (#228) — macOS magnification dock + genie window warp (canvas scanlines over html-to-image snapshots). Verdict: NOT for the portfolio (no dock surface, heavy deps, backdrop glass); filed as the batch's best HACKATHON wildcard — surface it in MTM prep if a desktop-metaphor demo fits.
- **Liquid Glass sidebar menu** (#229) — duplicate re-send of #214 (rejected 2026-11-02); install command NOT run; decision stands.
- **SpotlightCard** (#230) — dark bento + cursor spotlight. Verdict: NOT for the portfolio (family already rejected; pointer glow covers the idea); engine component not supplied anyway.
- **Swapy draggable grid** (#231) — drag-rearrange dashboard cards (swapy lib). Verdict: NOT for the portfolio (fixed editorial order is the design; touch-drag fights scroll; demo cards carry fabricated stats). Technique noted for future dashboards only.
- **DragItems reorder list** (#232) — grip-handle drag reorder (motion/react). Verdict: NOT for the portfolio (public lists are curated order); owner/admin surfaces only, if one ever exists.

## Bulk intake, 3 Nov 2026 (Abdul Wahid pasted ~25 items; all saved to ~/workspace/user/ui-layouts-code/, saved-references #233–#246)
One-line outcomes: TimelineAnimation storefront page — nothing to take. Scroll-reveal demos — covered by his Reveal. ImageMouseTrail — trail family, no. HorizontalScroll + Larose stacking original + sticky demos — family decided; his CSS stack on /projects is the shipped form. Globe/Sparkles heroes — dark SaaS, no. Testimonial Marquee — FORMAT kept as candidate for REAL testimonials later; demo quotes fabricated, never ship. Velocity marquee — duplicate of his X-marquee. Typewriter/IntroSequence — loader settled (AW mark); reference if 404 Option B is ever picked. Modals (media/linear/framer) — no modal surfaces by design. Galleries — no gallery surface. Drawers — mobile nav settled as slide-down panel. Form primitives (phone/datetime/multi-select + docs: password, file-upload, motion-number, slider, buttons, grids) — APP drawer for WhyRisk/Study Hub admin futures, not the portfolio. WebGL ripple (=#216) / noise blob / mesh gradients — rejected family, full code now held, decision stands.

## Bulk intake continued, 3 Nov 2026 (saved-references #247–#256)
One-line outcomes: Buy Me a Coffee widget (#247) — NO (his CTA is "Hire me"; no donation framing). Hover Cards catalogue (#248) — card language settled; paste hovercard1–4 code only if curiosity returns. Embla carousel variants ×12 (#249/#250) — engine never included in pastes; no carousel surface exists. Framer/motion carousels ×6 + drag filmstrip (#251) — condensed in framer-carousels.md; no surface. ImageTabs (#252) — candidate if a case study ever needs a tabbed walkthrough; FAQ accordions — the single-column one has an unwired-button bug as pasted (handleClick defined, never attached; noted in code-display.md). MagnifiedDoc macOS dock (#253) — glass family; kept as hackathon reference only. Code-display set (#254) — contains the TimelineAnimation engine source verbatim in code-display.md; its sample hero carries fabricated social proof ("Join 80,000+ designers / 1,234+") — banned pattern, never ship. BlurVignette video/card (#255/#256) — framed-picture treatment; imagery rule says backgrounds only. NO.

## Animation vocabulary checklist (18 Nov 2026, saved-references #277, @sohail_systems; cross-ref #271)
16 named types worth recognising on sight: Hover, Stagger, 3D Flip, Magnetic, Accordion, Morphing, Gradient, Text Reveal, Image Reveal, Parallax, Marquee, Menu Transition, Toggle, Success Message, Horizontal Scroll Transition, Lenis (smooth-scroll library). Abdul Wahid already ships ~half on the portfolio (hover, reveals, marquee, menu transition, preloader, cursor). New candidates if a surface ever wants them: Magnetic buttons, Stagger refinements, Morphing, Success Message animation (peak-end rule). Cautions: Lenis = trial-only (portfolio stays dependency-light after the lag fix; phone verdict pending); Horizontal Scroll Transition = the scroll-driven class he has twice rejected — vocabulary only, do not propose.

## Scroll-effects vocabulary (21 Nov 2026, saved-references #279, @crownzdesigns; cross-ref #271/#277)
10 named scroll effects, each demoed on a real site in the reel (the reel does not label which demo is which effect — no mapping claimed): Layered Parallax, Pinned Heading, 3D Card Zoom, Line-by-line Reveal, Sideways Text, Card Arc Carousel, Fixed 3D Model, Stacking Cards, Focus-frame Slider, Scroll-triggered Demo. Already his: Stacking Cards (his chosen /projects pattern) and Line-by-line Reveal (≈ his text reveals). Scroll-driven class — vocabulary only, do not propose (twice rejected): Layered Parallax, Pinned Heading, Sideways Text, Fixed 3D Model, Scroll-triggered Demo. New candidates if a showcase surface ever wants them: 3D Card Zoom, Card Arc Carousel.

## Motion principles checklist (21 Nov 2026, saved-references #280, @bendoescareer; cross-ref the 20 UX laws in AGENTS.md + #277/#279)
The motion half of Abdul Wahid's UX checklist — 19 principles, of which Doherty (<400ms response), Fitts, Hick, Von Restorff and Peak-end are already in his standing 20 laws. The additions worth applying to motion work: Timing (UI animations under 300ms), Slow in / slow out (easing, never linear/robotic), Staggering (one after another, not in unison), Anticipation (small wind-up before the move), Follow-through (details settle a beat after the main element), Arcs (curved paths, not straight lines), Squash and stretch + Exaggeration (feedback pushed past real life — e.g. error shake), Rubber banding (overscroll springs back), Origin awareness (elements grow from the click/tap point), Interruptible motion (user can cancel mid-animation), Secondary action (small flourish backing the main action), Solid drawing (flat things get depth/volume), Frequency of use (high-frequency surfaces get LESS animation — backs his dependency-light portfolio call). Most portable to his current sites: Origin awareness + Interruptible motion (cursor/hover system), Staggering (reveals), Success-state Exaggeration (peak-end).
