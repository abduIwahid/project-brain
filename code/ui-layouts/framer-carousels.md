# Framer (motion/react) carousels, pasted 2026-11-03 — condensed filing
All six share ONE pattern: a useMotionValue x, a useEffect that runs
animate(x, -index * containerWidth, { type: 'spring', stiffness: 300,
damping: 30 }) on index change, prev/next round white buttons (disabled at
the ends, opacity-40), and a dot row where the active dot stretches to w-8.
All use the same 12-item Unsplash data array (titles: MAXX PHAM, BOXIEN BAY,
AUSIZE MAM, RECLKTIKA, SONYPOO, DONM FLY, Snowy Mountain Highway, FOGGY FOLS,
DIM DARKO, BEALIVE, DOMEDOM ROME, IKEIMON POVE); the multi-slide and
thumbnail variants extend it to 18 items with six real-captioned mountain
photos. Full originals in the chat transcript of 2026-11-03 11:49-11:50.

- FramerCarousel: the base pattern above, nothing extra.
- FramerDraggableCarousel: adds drag='x' (dragElastic 0.2, no momentum);
  onDragEnd picks the next index by velocity (>500 px/s) or by offset
  (>30% of container width), clamped; the spring effect is skipped while
  dragging.
- FramerAutoplayCarousel: adds a setInterval autoplay (default 3000 ms,
  index cycles modulo length), paused while hovered.
- FramerMultiSlideCarousel: responsive slidesToShow via window-width
  breakpoints (0:1, 768:2, 1024:3), slide width calc((100% - gaps)/n),
  index clamped to items.length - slidesToShow, title caption over a
  bottom gradient on each slide.
- FramerCarouselThumbnails: the full-featured one — optional autoplay,
  loop, keyboard arrows, fullscreen toggle, wheel-zoom on the active slide
  (scale 1-3 via useSpring), reduced-motion-aware spring, and an expanding
  thumbnail strip (active thumb 120px, collapsed 35px, strip auto-scrolls
  to centre the active thumb). ~430 lines in the original.
- FramerMoveableThumbnails: same base + a thumbnail strip whose active
  item expands by aspect ratio (16/9 vs 1/3) while the strip itself slides
  on a spring (useSpring + useMotionTemplate percentage x).
- Drag-strip Carousel (separate small file in the same pastes): a free
  drag='x' filmstrip, dragConstraints from measured scrollWidth, whileDrag
  scale 0.95, first 8 items only, no buttons/dots.
