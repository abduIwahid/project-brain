# Project: EPMS — Enterprise Project Management System (static HTML/CSS frontend; React + Supabase planned)

Repo: github.com/abduIwahid/epms (main). Web Technologies semester project,
COMSATS Attock, Sep 2026. Built as a 4-member university group project (group leader: the repo owner).

## Audit — 2026-10-24 (GitHub-wide review)

### Facts
- IMPORTANT correction to how this project gets described: the current repo is
  NOT React + Node/Express + Supabase. It is a static frontend in pure HTML +
  CSS — the README title says "(Frontend)" and "no JavaScript, no build step".
  React, Node/Express, PHP, MySQL and Supabase appear only in the README's
  "Planned stack (from the project proposal)" section — and that list itself
  was never decided (it names Express AND PHP, MySQL AND Supabase-Postgres).
- Contents: 10 HTML pages — index (landing), login, signup, forgot-password,
  dashboard (stat cards, sprint progress, activity feed, Kanban board, overdue
  tasks), profiles (admin/PM/member), projects, settings, task-detail, 404 —
  plus one shared styles.css (48 KB), a hand-built logo.svg, .gitignore.
  A `.kiro/` AI-editor config directory is committed.
- Design system (styles.css :root): a documented 60-30-10 scheme — warm
  off-white surfaces (#F1F0EA bg, #F9F8F4, #FCFBF8), a deep-blue scale
  (--b900 #0B1E45 → --b500 #3D83EB accent), semantic red/green/amber sets,
  three blue-tinted layered shadow tokens, 14 px radius, .18 s transitions.
- Type: Archivo headings, Source Sans 3 body. Icons: Bootstrap Icons 1.11.3
  via CDN only — zero emojis anywhere.
- CSS-only interactivity: dark mode via `body:has(#dm:checked)` token swap,
  hamburger via hidden checkbox + :checked, profile tabs via :target/:has(),
  search focus ring via :focus-within. Responsive contract documented at four
  breakpoints (<600 drawer + stacked, 600–1023 icon sidebar, 1024–1439 full,
  ≥1440 content capped). Print stylesheet hides navigation.
- All data is hardcoded sample content; search, drag-and-drop, real-time
  updates and form submission are layout-only (README states this plainly).
  No live URL in the README; deployment state unknown.

### Strengths
- The most disciplined frontend in his GitHub: a real token architecture where
  one :root edit rethemes 10 pages, and the warm off-whites match his standing
  "never pure white — warm it toward cream" preference exactly.
- Accessibility is engineered, not decorative: :focus-visible 3 px outlines,
  44 px touch targets, semantic landmarks, reduced-motion support, print CSS.
- Zero entries from his anti-AI-fingerprint list in spirit: no purple-blue
  gradients, no glass panels, no emoji icons, no default Inter — Archivo is
  his own chosen family (portfolio body font).
- README is a model of honesty: limitations section up front, CSS techniques
  explained, responsive behaviour tabulated. The pages are designed to become
  the visual reference for the future React build, and they're good enough to.

### Weaknesses / risks
- It is a facade: every number, task and name is typed into HTML by hand, so
  the same stat can (and eventually will) disagree between dashboard.html,
  projects.html and task-detail.html. The longer the backend is delayed, the
  more expensive the reconciliation.
- README drift: its Pages table lists only 5 of the 10 shipped pages
  (signup, forgot-password, projects, settings, task-detail, 404 missing).
- Minor fingerprint residue in styles.css: 24 linear-gradients — mostly a
  subtle 180deg sheen on primary buttons, but the dark-mode auth screen uses
  the radial-glow + linear-gradient backdrop combo, and the sticky top bar
  uses backdrop-filter blur (a light glass touch). Tasteful, but they're the
  only generic moves in the file.
- One 48 KB stylesheet for 10 pages will not survive the React port as-is;
  there is no component boundary thinking yet (page-specific blocks are
  prefixed ad hoc, e.g. .mockup-kpi-card, .task-title).
- The undecided proposal stack (PHP vs Node, MySQL vs Postgres) is a viva
  risk: examiners ask "which one and why" and the README currently answers
  "all of them".

### Improvement plan (prioritized)
1. Decide the stack on paper before any code: Supabase (Auth + Postgres +
   Realtime) alone covers the whole proposal — drop PHP/MySQL from the
   README's planned stack or justify them; one database, one backend story.
2. Port in slices, dashboard first: extract the recurring blocks (sidebar,
   stat card, Kanban column, task row) into React components driven by one
   mock-data JSON file, so sample data lives in exactly one place even
   before the backend exists.
3. Wire Supabase Auth to the existing login/signup pages (roles admin/PM/
   member already designed into profiles.html), then tasks CRUD against the
   dashboard's existing layout.
4. Sync the README page table with the 10 real pages; remove `.kiro/` from
   the repo (gitignore it) if the team isn't sharing that config.
5. Optional polish: replace the dark-auth radial glow with the flat deep-blue
   (--b900) used elsewhere, keeping the file's otherwise gradient-disciplined
   voice.
