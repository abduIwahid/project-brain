# UI-Layouts docs pages pasted by Wadi on 2026-11-03 — catalogue notes
These arrived as docs/MDX pages (metadata + preview placeholders), NOT as
component code. Nothing runnable was in them; what follows is everything of
substance they contained. All are publicly documented at ui-layouts.com.

## Creative Buttons
19 named variants: button-background-shine, button-background-spotlight,
button-hover-active, button-hover-2 … button-hover-14, creative-button-1,
creative-button-2, button-rotating-gradient.

## Motion Number (NumberFlow)
Animated number transitions (digit rolling), formatting + localisation.
Install: `npm install @number-flow/react`. Docs: number-flow.barvian.me.
Examples named: motion-number-upvotes, motion-number-input,
motion-number-slider, number-flow-trading.

## Animated Range Slider
shadcn slider + NumberFlow value display. Variants: motion-number-slider,
dual-range-slider, position-range-slider, static-range-slider.
Install: `npx uilayouts@latest add slider` or
`npx shadcn@latest add 'https://www.ui-layouts.com/r/slider.json'`.
Props: label (node or value fn), labelPosition top/bottom/static,
value/min/max/step as usual.

## Password Input
Variants: showhide-pass (eye toggle), pass-strengthindicator,
pass-strength-dotted-indicator, pass-strength-hover-indicator,
pass-strength-inline-indicator, confirm-pass-check.

## File Upload
shadcn-based uploader, drag-and-drop, previews, progress. Manual install:
`npm install sonner react-dropzone`; CLI: `npx uilayouts@latest add file-upload`.
Key props: value File[]|null, onValueChange, dropzoneOptions
(maxFiles/maxSize/accept), orientation, reSelect.

## Grid Showcase
Three named demos only: boxgrid, conditionGrid, normalGrid.

## Mesh Gradients (also pasted 2026-11-03)
Two routes: (1) `@shadergradient/react` — ShaderGradientCanvas + ShaderGradient
sphere with ~25 tuning props (colours #73bfc4/#ff810a/#8da0ce in the demo);
generator at tools.ui-layouts.com/mesh-gradients. (2) Three more variants
("Berries", "Yellow", "Lemon") of the SAME Perlin-noise icosahedron blob
already held as webgl-blob.tsx — parameter/colour/post-processing variations
(@react-three/postprocessing Noise/Bloom), not new techniques; not re-saved.

## Buy Me Millions Coffee (docs page pasted 2026-11-03)
A playful "Buy Me a Coffee" sponsorship/tip button clone. Docs only — no
component code in the page. Usage: <BuyMeCoffee classname iconClassName
textSvgClassName />. Props: classname, iconClassName, textSvgClassName.

## Hover Cards (docs page pasted 2026-11-03)
Docs only — named previews: stripecard (Stripe-style payment card),
creative-hover-card, stripecard2, hovercard1–4. No component code in the page.
