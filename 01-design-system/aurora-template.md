# Aurora template (ThemeWagon) — design reference, captured 23 Nov 2026

**Status: the HIGHEST-PRIORITY frontend reference** (owner's standing rule, 2026-11-23: "Aurora from now on, highest priority for the frontend"). When a new project's frontend starts, this is the default system to reach for unless the owner picks otherwise. Companion component source: UI Layouts (ui-layouts.com — see `ui-layouts-library.md` in this folder).

- **Source:** https://aurora.themewagon.com/pages/landing/homepage — "Aurora", a SaaS/web-app landing theme distributed by ThemeWagon, built on React + MUI (the page ships the full MUI component set — Accordion, Alert, Autocomplete, Avatar, Badge, Breadcrumbs, Button, Card…).
- **Captures:** this note is the published distillation. The raw captures (full styleguide JSON, rendered HTML) and a complete all-pages Aurora library are kept privately alongside the owner's local brain — a commercial template's rendered output is not redistributed here; everything needed to *rebuild* the look in your own code is in the tokens and notes below.

## The look in one line
Clean corporate SaaS: white background, one friendly blue accent, soft borders and a whisper of shadow, rounded 8px corners, Plus Jakarta Sans everywhere — the opposite pole from Grunge's raw monochrome (`grunge-template.md`).

## Page structure (landing/homepage)
Nav (logo "aurora", Home / About Us / Contact / Pages, Log In) → hero: "Ultimate web app to enhance **productivity.**" (rotating word: productivity / efficiency / collaboration / innovation) + workflow sub-copy + CTAs "Start today" / "Contact us" → "Who are we" (team intro) → Clients ("Trusted by the most innovative teams") → Showcase (selected works cards: Skyline Innovations, Quantum Leap Initiative, EcoVision Project, each with blurb + View more) → Features ("Packed with essential abilities": real-time collaboration, drag-and-drop interface, guided tutorials, notifications…) → further sections below the fold.

## Design tokens (from the extracted styleguide)
- **Colours:** background #FFFFFF, text #1B2124 (soft black), accent #3385F0 (blue); card border #E5E7EB; link colour #4D595E.
- **Font:** Plus Jakarta Sans for everything — H1 42px/700, H2 32px/700, H3 24px/700, body 14px/22.4 lh.
- **Spacing scale:** xs 8 / sm 16 / md 40 / lg 72 / xl 128 px.
- **Shadows:** one soft layered sm shadow (rgba black 0.02–0.04); md/lg/xl none.
- **Buttons:** primary blue fill (#3385F0), 8px radius, 8/16 padding, 14px; cards white, 1px #E5E7EB border, 8px radius, 16px padding.

## Reuse notes
- Transferable ideas: (1) rotating-word hero headline; (2) trust strip right under the hero; (3) showcase cards with one-line blurbs; (4) a complete, boring-in-a-good-way component system (MUI) — good reference for dashboard/admin surfaces.
- The owner's standing rules apply when adapting: fluid clamp sizing, real photography, English copy, live-verify before "done".

## Login page (authentication/default/jwt/login) — layout note, browser-observed 23 Nov 2026
The scrape could not render this JS route (only the app shell came back, twice), so this note is from a live browser observation instead.

- **Split-screen, no card:** two white halves split by a thin light-grey vertical line. LEFT = branding panel: aurora logo top-left, a large flat pastel illustration in the centre (three blocky characters carrying a log), and at the bottom a pill-shaped auth-method switcher (Jwt / Auth 0 / Firebase tabs).
- **RIGHT = the form** as an open ~477px column (no border, no shadow): "Log in" heading + right-aligned "Don't have an account? Sign up" → two black social buttons side by side ("Sign in with google", "Sign in with Microsoft") → divider "or use email" → pale-blue demo-credentials info box (demo email/password — demo chrome, not a pattern to copy) → filled pale blue-grey inputs with floating labels (Email, Password with show/hide eye) → "Remember this device" checkbox + "Forgot Password?" link on one row → full-width blue "Log in" button → far below, centred "Trouble signing in?" link.
- **Feel:** flat, minimal, airy; inputs/buttons ~8–10px radius; links and primary button in the same bright blue; rounded geometric sans throughout.
- The "CUSTOMIZE" edge tab and "Purchase Now" pill are ThemeWagon demo chrome, not part of the design.
