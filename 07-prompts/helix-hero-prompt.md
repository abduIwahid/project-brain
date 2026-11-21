# Helix Hero — full build prompt

> A complete third-party build prompt, shared by the repo owner on 21 Nov 2026 and kept verbatim. Workflow: (1) design the hero frame in Figma — the still frame only, (2) copy the Figma link (anyone-viewable) or export a PNG, (3) open your AI builder, attach the design + 6–16 project images, (4) paste the prompt, (5) fixes are at the end of the prompt.
>
> House note: this is a scroll-driven pinned WebGL flow. On the owner's own portfolio that class was twice rejected in favour of stacking cards — treat this prompt as a standalone experiment pattern, not a portfolio default.

---

Helix Hero - full build prompt

Step 1 — Design your hero frame in Figma. Only the still frame, not the animation.
Step 2 — Copy the Figma link (viewable by anyone) or export it as a PNG.
Step 3 — Open Claude, attach the design + 6–16 project images.
Step 4 — Paste the prompt below and send.
Step 5 — Something off? The fixes are at the end of this doc.

———————————————————————————

THE PROMPT —

Build a single-page scroll animation site from the design I've attached. One file: index.html, plus an assets/ folder. No framework, no build step.

## Inputs
- Design — [ATTACH HERO FRAME: screenshot or Figma link]. This is the first thing the visitor sees. Match it exactly: background colour, text colour, fonts, sizes, positions. Use my copy word for word and add nothing of your own.
- Projects — [ATTACH 6–16 IMAGES]. These become the cards. assets/projects/1.jpg … n.jpg
- Portrait — [ATTACH IF MY DESIGN HAS ONE] at assets/photo.jpg

## Stack
three.js 0.160 as an ES module via importmap from jsdelivr. GSAP 3.12.5 + ScrollTrigger from cdnjs. Google Font for the display face (Anton, or whatever my design uses). Body font: Helvetica Neue / Arial stack.

# 1. Page structure
```
section.helix            → height 700vh (the scroll track)
  div.stage              → height var(--stage-h, 100vh), overflow hidden, gets pinned
    div.view             → 100vh layer, z-index 2, pointer-events none (nav + canvas get it back)
      nav.nav
      div.frame          → the hero headline block
        div.line-top     → top headline word + portrait
        div.line-bottom  → bottom headline word + counter
      canvas.gl          → transparent WebGL layer, inset 0, z-index 2
      div.foot           → bio bottom-left, "scroll down" bottom-right
    div.work             → the real DOM project grid, z-index 1, below the 100vh view
```
The stage is TALLER than the screen: the top 100vh holds the hero and the canvas, and the project grid continues below it so row 2 scrolls into view after the pin releases.

## Hero layout — design units, not guesses
--u: min(calc(100vw / 1440), calc(100vh / 825));   /* 1 design px of my frame */
.frame is calc(1440 * var(--u)) × calc(825 * var(--u)), centred with translate(-50%, -50%). Every hero element is positioned in calc(<figma px> * var(--u)) — headline left/top, font-size, letter-spacing, portrait box, counter. The hero is a faithful scale of my design at any window size, never a reflow of it.
Headline: display font, font-size calc(216 * var(--u)), line-height 1.4, letter-spacing calc(-2.16 * var(--u)), white-space nowrap. Split both words into <span class="ch"> per character (aria-label on the parent, aria-hidden on the spans).
Nav: absolute, top 15px, left/right 20px, 15px uppercase, weight 500, letter-spacing -0.01em; links centred with left 50% + translateX(-50%), gap 15px, separated by "/". Hover → opacity .55 over .25s.
Foot: absolute, bottom 21px, left/right 20px, space-between, align-items flex-end. Bio italic, clamp(16px, calc(24 * var(--u)), 24px), max-width 403px. Scroll cue 15px uppercase.

# 2. Intro (on load, before any scroll)
The first frame must be clean — NO cards on screen at all. GSAP timeline, defaults ease "power3.out":
- at 0.10 — every .ch of both headline words: yPercent 40 → 0, opacity 0 → 1, filter blur(12px) → 0, duration 1.1, stagger 0.05
- at 0.35 — portrait: clip-path inset(100% 0 0 0) → inset(0), duration 1.1, ease "expo.out"
- at 0.50 — nav, foot, counter: opacity 0 → 1, y 8 → 0, duration 0.9, stagger 0.08

# 3. The scroll engine
const PIN_VH = (w) => (w < 768 ? 2.5 : 6);
const pinLen = () => innerHeight * PIN_VH(innerWidth);
Pin: ScrollTrigger.create({ trigger: section, start: "top top", end: () => "+=" + pinLen(), pin: stage, pinSpacing: false, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: st => progress.value = st.progress })
One normalised p (0 → 1) drives the entire 3D scene from a single rAF loop — do NOT scrub the 3D with separate tweens.
Section height is computed, not hardcoded:
section.style.height = innerHeight * PIN_VH + stageH, where stageH = max(innerHeight, gridTop + work.offsetHeight + innerWidth * 50/1440)
Line parting is a separate scrubbed timeline (scrub 0.6) running from "top top" for partLen() — about 45% of the pin plus half a screen:
- .line-top   → x: innerWidth,  ease "none"
- .line-bottom → x: -innerWidth, ease "none"
- .scroll-cue → opacity 0, duration 0.15
- .bio        → opacity 0, y 24, duration 0.3
The portrait sits inside .line-top and the counter inside .line-bottom, so each rides out with its line. Nothing is hidden with display, only moved and faded.

# 4. The helix (p ≈ 0 → 0.67)
Transparent WebGLRenderer({ alpha: true, antialias: true }), setClearAlpha(0), setPixelRatio(min(dpr, 2)).
const camDist = (w) => (w < 768 ? 28 : w < 1200 ? 24 : 22);
const camFov  = (w) => (w < 768 ? 58 : w < 1200 ? 54 : 52);
Camera at (0, 0, camDist) looking at the origin.

## Curve
const R = 12, TURNS = 2;
const PITCH   = 28 / (2 * Math.PI * TURNS);        // rise per radian
const BUMP_AT = 2 * Math.PI;
const SEG = Math.sqrt(R*R + PITCH*PITCH);          // arc length per radian
const LEN = 2 * Math.PI * TURNS * SEG;             // total arc of two turns
const helixY = (a) => { const t = (a - BUMP_AT) / 2; return -16 + a * PITCH - 2.5 * Math.exp(-t*t); };
const dY     = (a) => { const t = (a - BUMP_AT) / 2; return (-2 * t * 2.5 * Math.exp(-t*t)) / 2; };
Position at angle a is (12·cos a, helixY(a), 12·sin a). The gaussian term is a soft dip halfway up so the stack doesn't read as a mechanical spring.

## Ribbon cards
Each project is a CURVED card, not a flat plane: PlaneGeometry(1, 1, 116, 1), rebuilt every frame along the arc.
const ASPECT = 568 / 812, CARD_W = 5.8, CARD_H = ASPECT * CARD_W, SPACING = 6.2;
For each of the 117 columns k: t = k/116, a = (start + t*CARD_W) / SEG where start = pos + 2.9 - w/2.
Tangent T = normalize(-12·sin a, PITCH - dY(a), 12·cos a).
Normal  N = normalize(T.y·sin a, T.z·cos a - T.x·sin a, -T.y·cos a), then N.y += 0.6 and renormalise — this tilt is what makes the cards lean toward the camera instead of standing edge-on.
Write the two rows of vertices at ±h/2 along N. Write UV once: uv = (1 - t, r). frustumCulled = false, side DoubleSide.

## Travel
const RIBBON_END = 400 / 600;                       // helix finishes at p ≈ 0.67
const EXTRA = (PROJECTS.length - 9) * SPACING;      // keeps the lead card put when there are more than 9
const r = Math.min(1, p / RIBBON_END);
const lead = r * (LEN + 55.4 + EXTRA) - 55.4 - EXTRA + 25;
// card i sits at pos = lead + SPACING * i
A card is visible only while r < 1 && 0 < pos < LEN. The first card climbs in from below the frame and the last leaves off the top — all of them ride the same moving ribbon.

## Shaders
Vertex: pass vUv, and vFacing = dot(normalize(vec3(position.x, 0.0, position.z)), normalize(cameraPosition - position)).
Fragment:
  if (uOpacity <= 0.001) discard;
  vec2 uv = vFacing >= 0.0 ? vUv : vec2(1.0 - vUv.x, vUv.y);   // never mirrored on the back
  vec4 tex = texture2D(uMap, uv);
  gl_FragColor = vec4(tex.rgb, tex.a * uOpacity);
  #include <colorspace_fragment>                                // matches the DOM images exactly

## Textures
Cover-crop every image onto a 1024 × 716 canvas (1024 * 568/812), CanvasTexture, SRGBColorSpace, LinearFilter, generateMipmaps false, anisotropy 4. Fill the canvas with the page background first so a slow image never flashes black.

## Hover
Raycast only the visible ribbons. The hovered card eases its scale to 1.12, the rest to 1, with a frame-rate-independent ease: k = 1 - Math.pow(0.001, dt). Cursor → pointer while hovering.

# 5. The grid (p ≈ 0.45 → 1)
const GRID_FROM = ((0.5 * LEN + 55.4 + 10) / (LEN + 55.4)) * RIBBON_END;
const g = clamp(0, 1, (p - GRID_FROM) / (1 - GRID_FROM));   // the grid's own 0 → 1

## The real DOM grid
Full-width CSS grid, 3 columns desktop / 2 on phone. Each .cell is aspect-ratio 480/400 with 1px solid rgba(0,0,0,.11) borders driven by a --line custom property (calc(0.11 * var(--line))) so they can fade in. Inside: .cell-in at left 7.2917%, top 9.5%, width 85.4167%, holding a 410/287 image and a caption row — project name left, n/6 right, uppercase, max(11px, 0.9722vw), weight 500. Images and captions use opacity: var(--dom).
Grid top: innerHeight * 374/825 on desktop, innerHeight * 0.3 on phone.

## Flying cards
Six flat PlaneGeometry(CW, CH, 20, 12) cards, sized and placed by MEASURING the DOM: read each .cell-img rect, convert to world units with
  const ppu = innerHeight / (2 * Math.tan(camFov * Math.PI/360) * camDist);
  x = (cx - innerWidth/2) / ppu;   y = (innerHeight/2 - cy) / ppu;
Never hardcode the landing positions — recompute on resize, so the 3D card and the DOM image overlap pixel for pixel.
Entry: left-column cards start at -halfW - 2·CW, right-column at +halfW + 2·CW, middle column from +halfH + 2·CH (top row) or slot.y - 2·halfH (lower rows), where halfH = tan(fov·π/360) · camDist and halfW = aspect · halfH.
Timing: card i has its own n = clamp(0, 1, (g - 0.08*i) / 0.4), eased e = 1 - (1-n)³, lerping from entry to slot.
Ripple: while flying, displace the card's vertices in z:
  z = amt · s · sin(s·π·0.9 - 2·waveT) · CW · 0.12
where s runs down the card for middle-column cards and diagonally for the outer columns (combine "across" and "down", halved). waveT += 1.08·dt. The wave amount rises at 1.8/s while flying and decays at 0.72/s once landed, so each card settles flat instead of snapping.
Rounded edges: the grid-card fragment shader does an SDF rounded-box on uSize/uRadius and discards outside, plus #include <colorspace_fragment>.

## Handover
const lines = clamp(0, 1, (g - 0.5) / 0.35);   // grid lines draw in as cards land
const dom   = clamp(0, 1, (g - 0.9) / 0.1);    // DOM images + captions take over
Set --line and --dom on the grid; fade the 3D cards with uOpacity = 1 - dom and hide them once dom >= 1 (also drop the canvas's pointer-events then, so the real grid is clickable). The counter fades out over the first quarter of g (1 - 4*g).

# 6. Performance, responsive, a11y
- One gsap.ticker loop. An IntersectionObserver with rootMargin "100% 0px" gates it — nothing renders while the section is off screen.
- devicePixelRatio capped at 2.
- On resize: resize renderer + camera, re-layout the grid, ScrollTrigger.refresh(), rebuild the grid cards from the new DOM rects.
- Phone (< 768px): --u: calc(100vw / 800), nav links hidden, frame top 38%, 2-column grid, shorter pin (2.5 screens).
- prefers-reduced-motion: reduce → skip the intro and the scroll timelines entirely; the hero stays as the static first frame.
- Headline letters are aria-hidden; the parent carries aria-label with the real text.

# 7. Rules
- The first frame matches my design exactly. Nothing extra on screen, ever.
- No extra sections, no footer, no added micro-copy, no decorative lines, no logos I didn't give you.
- No loading spinner, no scroll-progress bar, no cursor follower.
- Vanilla JS in one file. Don't reach for a library for something 20 lines of maths does.

When it's done, serve it locally and show me screenshots at four points: the clean hero, the lines parting, the helix mid-scroll, and the landed grid.
