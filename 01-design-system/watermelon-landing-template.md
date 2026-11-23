# Watermelon UI landing template — saved reference (2026-11-22)

The owner supplied a complete dark landing-page template ("Watermelon UI") piece by piece and ordered it kept for future projects. The verbatim template code is kept privately with the owner's local files (16 files + a manifest with the full inventory, missing sub-dependencies, and theme tokens); this note is the published distillation.

Design language worth reusing: #101010 canvas, white/10 hairline cards with 8px corner accents, `// LABEL` mono eyebrows in a lime primary, dot-grids + technical crosshairs, motion stagger reveals, counting numbers, testimonial marquee, browser-mockup carousel.

Rule: reference only — never paste it into a live project unchanged; adapt to the project's own tokens and copy (house no-exact-clones rule). Build with it only when the owner says so.

## WhyRisk application — 22 Nov 2026 (design + animation only)

The owner first said save for future projects only, then corrected: the 16 files were ALSO meant for WhyRisk wherever they fit. Adapted pieces shipped the same evening: bento grid for "What it does", corner accents, `// CAPABILITIES` mono eyebrow — all re-skinned violet/light. Deliberately NOT used: testimonial marquee (no real testimonials — honesty rule), counting numbers (WhyRisk's own CountUp is better), hero/nav/footer wholesale, demo widgets whose source files never arrived.

After a full-template preview (standalone page, template's own dark + lime), the owner's verdict: **design YES, template colors NO** — the colours stay the previously selected palette (PrimeDental violet, already live); the template supplies design only. Added spec: "follow animation, smoothness the same way" — the template's motion feel (easing, staggers, reveals, marquee) must be followed too, not just static layout.

Scope order: "not just the landing page — the full website accordingly" — the template system (design + animation/smoothness, adopted palette colours) applies to EVERY page and section. ROUND 1 SHIPPED LIVE 22 Nov evening: /welcome rebuilt wholesale in the landing components folder (template order + motion numbers: stagger 0.1–0.12, y 16–20, ease [0.16,1,0.3,1], rotating word 2.8s blur-swap, marquee 42s CSS, count-ups), rails/crosshairs/dot-grids/corner accents, `// LABEL` mono eyebrows, facts marquee (model-card FACTS, not testimonials), self-hosted page captures; site-wide square edges (ui button/input/select/card → rounded-none); auth pages swept + accents; the guest risk-check squared. ROUND 2 PENDING: dashboard views/sidebars + public pages (model-card/contact/legal) detailing. The owner's phone feel-check of Round 1 is the pending final verdict.

Full application record: `../projects/medisight.md` (the "Watermelon template components ADOPTED" and "Template-system redesign" sections).
