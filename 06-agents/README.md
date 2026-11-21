# 06 · Agents

**What this folder is:** how to build agent systems that survive real judging and real users — distilled from a complete hackathon build and from the team that beat it.

## File
`agent-playbook.md` covers:
- **The architecture: "the model reads, code decides."** The model only extracts structured facts; planning, arithmetic and validation are deterministic code. Fact base with supersession, a constraint validator, transactional updates (a bad update rolls back, never corrupts), a deterministic pre-scan, and a fully honest trace of every model call.
- **Token discipline** — rules label the obvious before the model reads; the smallest adequate model; one call per message where possible.
- **What the winning team did better** — authority checks on who may change a fact, rules-first labelling, one "reading" call per message, the smallest local model.
- **The winner's checklist** (from a filed playbook by a 20+ time hackathon winner) — team, research past winners and judges, map the scoring criteria before coding, be unique in the first minute, use hardware when the format allows.
- **Prompting rules** — the owner's settled guide for working with AI builders.

## When to use it
- Before building ANY agent system, hackathon or product.
- The full worked record (architecture, defects, judging analysis) is in `../projects/mtm-hackathon-26.md`.
