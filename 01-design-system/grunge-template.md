# Grunge template (ThemeWagon) — design reference, captured 23 Nov 2026

A design the owner liked and asked to keep for future use. Captured with Context.dev (web-styleguide + web-scrape). This note is the published distillation; the raw captures (styleguide JSON + rendered HTML) are kept privately — a commercial template's rendered output is not redistributed here.

- **Source:** https://preview.themewagon.com/grunge/ — "Grunge", a portfolio template built with Astro by Jess Gaspar, distributed by ThemeWagon. Meta: "Portfolio template with a grunge aesthetic."

## The look in one line
Raw black-on-white brutalist portfolio: a grunge display font at enormous sizes, zero shadows, zero gradients, huge vertical spacing — the type IS the design.

## Pages / structure (home)
Nav (Home / Works / About / Contact) → hero: small intro paragraph + "Available for work" pill + GIANT name (the template's demo persona) → Featured Works (4 projects, category + title + client) → Services (numbered list: Web Design, Product Design, Branding, …) → FAQ (5 questions) → footer (socials, nav, © line). Sub-pages: /works, /works/<slug>, /about, /contact.

## Design tokens (from the extracted styleguide)
- **Colours:** background #FFFFFF, text #000000, accent #000000 — pure monochrome. Secondary button: transparent bg, #F8F8F8 border/text (for dark sections).
- **Display font:** "Road Rage" (custom woff2) — H1 216px/216 lh, letter-spacing −5.4px; H2 142px; H3 93px; even body "p" renders 40px in Road Rage on the hero scale. UI/body small text: ui-sans-serif/system stack. H4 61px sans.
- **Spacing scale:** xs 16 / sm 24 / md 106 / lg 128 / xl 184 px — sections breathe enormously (Tailwind classes in the HTML: gap-28 → lg:gap-40 → xl:gap-48).
- **Shadows:** none at any size. Depth = scale + contrast only.
- **Buttons:** primary = black fill, white text, 2px border, 4px radius, min 120×56, padding 8/16; secondary = transparent, 2px light border, 0 radius, Road Rage font.
- **Layout/tech:** Tailwind utility classes, flex rows that stack on mobile (flex-col → md:flex-row), fixed top nav, bg-fixed cover imagery at 40% opacity under overlays in places.

## Reuse notes
- The transferable ideas: (1) type-led hero — one huge word/name instead of an image hero; (2) monochrome + one display font as the entire identity; (3) numbered services list; (4) oversized section gaps as luxury signalling.
- The owner's standing rules still apply when adapting: fluid clamp() versions of these sizes (216px fixed would break the responsiveness rule), real photography only, English copy.
- Candidate for: a future portfolio refresh or a bold landing. The current default frontend reference is Aurora (`aurora-template.md`); Grunge is the saved alternative.
