# 04 · Database

**What this folder is:** how data is modelled and kept honest across projects.

## File
`database-toolkit.md` covers:
- **Engines used, and why** — PostgreSQL via Supabase (auth + RLS + migrations) as the default for full-stack work; MySQL for structured coursework-style systems; localStorage/static files deliberately chosen when data is small and single-user — a database can be overhead, not rigour.
- **Working rules** — append-only numbered migrations; seed data that is fictional, labelled, and removable by a teardown script; RLS so every query is confined to the caller; schema designed from the questions the UI asks; backups before destructive changes; verify a migration by re-reading the state it claims to produce.

## When to use it
- Starting the data model of a new project (with `../07-prompts/project-brain-prompt.md`'s DATA_MODEL step).
- Reviewing a schema — worked examples with real defects live in `../projects/` (freelance-marketplace, inventory-management-system, medisight).
