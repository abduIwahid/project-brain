# Database toolkit

## Engines used
- **PostgreSQL via Supabase** — the healthcare app (WhyRisk): auth, row-level security, migrations, seed packs, a serverless Postgres with a real SQL surface.
- **MySQL** — university database projects (marketplace, inventory, student systems): schema design, normalisation, seed data with honest dummy values.
- **localStorage / files** — deliberately chosen for demos and class tools (Study Hub's static `files.json`, Plan Banao's saved sessions): when the data is small and single-user, a database is overhead, not rigour.

## Working rules
- **Migrations are numbered and append-only**; a same-named stub that disables an old migration is a smell — resolve it, don't stack it.
- **Seed data is fictional and labelled.** Demo personas, fixed UUID namespaces, and a teardown script that deletes exactly the seeded markers. Never ship invented people as if they were real users.
- **RLS confines every query to the caller** — load records through the caller's session so the database itself enforces who sees what.
- **Design the schema from the questions the UI asks** (the freelance-marketplace and inventory project files in `../projects/` show worked examples: entities, keys, and the plain-text-password trap to avoid in seed data — hash, even in coursework demos, or label dummies loudly).
- **Backups before destructive changes**, and verify a migration by re-reading the state it claims to produce.
