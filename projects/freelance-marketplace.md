# Project: Freelance Marketplace Management System — a database-course (DBS) SQL project: full marketplace schema, labs and docs

## Facts
- Repo: `abduIwahid/Freelance-MarketPlace-Management-System`, `main`.
  Root holds only a 2-line README and one folder
  `Freelance MarketPlace Management System/` containing everything.
- Inside: `SQL Source Files/` (8 files), `Documentation/` (DBS Project
  Documentation as .docx 1.7 MB + .pdf 1.6 MB), `StarUML Model/`
  (ERD.mdj + EERD.mdj).
- Schema file `TBALE SCRIPT.sql` (13.8 KB — filename is a typo of
  "TABLE") builds 12 tables (users, skills, client/freelancer
  profiles, projects, proposals, contracts, milestones, payments,
  messages, reviews) with FK-safe drop order, ENUM roles and seed
  data (~20 users, IDs 101+).
- Other SQL: QUERIES.sql (3.4 KB, organised by lab sections — "LAB 02",
  "LAB 03"...), VIEWS, TRIGGERS, STORED PROCEDURE, FUNCTIONS, INDEX
  and COUNT files. MySQL dialect.
- Seed data stores sample passwords in plain text (`a dummy value`) — fine
  for dummy coursework data, but the schema design itself has no
  hashing concept.
- No LICENSE, no screenshots, no run instructions.

## Strengths
- Genuinely complete for a DB course project: normalised multi-table
  schema + views, triggers, stored procedures, functions, indexes —
  not just CREATE TABLEs.
- Full documentation PDF and editable ERD/EERD models are included,
  which most student repos skip.
- Seed data makes the schema runnable and demo-able in minutes.

## Weaknesses / risks
- Invisible value: the README is 2 lines; a visitor sees a folder
  name, not "12-table marketplace schema with triggers and views".
  The ERD — the single best visual — is locked inside StarUML files
  and a 1.6 MB PDF nobody opens.
- Comment/code mismatch exists (e.g. a query commented "budget above
  10000" filters `> 1500`) — small, but an examiner/reviewer notices.
- Filename typo "TBALE SCRIPT" and everything nested one folder deep
  with spaces in paths make linking/cloning awkward.
- Plain-text password column design would be a red flag if presented
  as production work rather than coursework.

## Improvement plan (prioritized)
1. **Export the ERD as a PNG and put it in the README** — schema
   diagram + table list + feature list turns this into a scannable
   portfolio piece in one edit.
2. Expand the README: how to run (MySQL: source TBALE script, then
   queries), what each SQL file demonstrates.
3. Fix the small things: rename "TBALE SCRIPT.sql" → "TABLE_SCRIPT.sql"
   (or schema.sql), correct the budget comment, flatten the folder or
   at least document the layout.
4. Note honestly in the README that seed passwords are dummy data and
   a production version would hash them.
5. Add an MIT LICENSE. Then stop — as coursework this is complete;
   no app/UI build is worth bolting onto it.

## Audit — 2026-10-24 (GitHub-wide review)
Verdict: his strongest database coursework, currently unreadable to a
casual visitor. One ERD image + a real README converts it from a file
dump into evidence of solid DB design skills.
