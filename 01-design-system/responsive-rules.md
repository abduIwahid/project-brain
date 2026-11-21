# Responsive rules — fluid by default (hard rule)

Every UI surface must be **fluid by default**, not patched per screenshot. Large icons, headings, text and components scale DOWN as space tightens (fluid `clamp()` sizing + breakpoints), so congestion and high browser zoom shrink them instead of crowding/overflowing. Zoom is just a narrower CSS viewport — correct responsive rules handle it automatically.

## The four core techniques (reference card, from a filed post by @darkcss77)

1. **Media queries** — `@media (width>=600px) { columns: 2 }`
2. **Grid auto-fit** — `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
3. **Flex wrap** — `flex-wrap: wrap; flex: 1 1 200px;`
4. **clamp()** — `font-size: clamp(1.4rem, 5vw, 3.4rem);`

## Ship gate

No change ships until it passes the **width/zoom matrix**: widths 320 / 360 / 390 / 414 / 768 / 1024 / 1280 / 1440 / 1920 plus browser zoom steps — no horizontal overflow, no clipped text, no overlap at any step. Verify mobile, tablet, laptop and PC separately.

**Floors that protect usability:** tap targets stay ≥44px tall; body text stays ≥15px.

**Grid discipline:** `minmax(0, 1fr)` / `min-width: 0` on grid children so content can never blow out a column; place each element left/center/right where it reads best — deliberately, not by default.

**Text:** never let a word break across lines (`hyphens: none`); balanced wrapping (`text-wrap: balance`) for subtitles and headings.
