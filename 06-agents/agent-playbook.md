# Agent playbook — building agent systems that survive judging

Distilled from a real hackathon build (Plan Banao, MTM Hackathon '26) and the winning team's repo, plus a filed winner's playbook (reel #283, @imrayng). Full project record: `../projects/mtm-hackathon-26.md`.

## Architecture that scored: "The model reads. Code decides."
- The model does ONE job: read messy input and extract structured facts (JSON, each fact carrying its source). **All planning, arithmetic and validation happen in deterministic code.**
- A **fact base** with supersession: newer/authoritative facts replace older ones by date and arrival order; fuzzy matching for the same item named two ways.
- A **validator** that checks the finished plan against every hard constraint (budget, capacity, coverage, schedule) and reports pass/fail per check.
- **Transactional updates:** new input is merged into a snapshot copy; if any previously-passing check now fails, roll back and record the rejection with its reason. A bad update can never corrupt a good plan.
- A **deterministic pre-scan** catches obviously-wrong input (numbers below a hard requirement, digits in any script — normalise Arabic/Urdu digits and English number words) before the model is even called.
- **Trace everything:** every model call numbered, with model name, one area tag, input, output and API-reported token counts; a session total at the end. Honest traces are a scoring item, not a debug aid.
- **Token discipline:** rules label the obvious in code BEFORE the model reads; the smallest adequate model for every call; one call per message where possible.

## What the winning team did better (filed for the next event)
1. **Authority checks** — the fact store knows WHO may change a fact (a finance note outranks a society request).
2. **Rules-first labelling** before the model reads, saving tokens and errors.
3. **One model call per message, always tagged "reading"** — a prediction story a judge can repeat in one sentence.
4. The **smallest local model** that passes (qwen2.5:1.5b via Ollama) instead of the biggest cloud model.

## The winner's checklist (reel #283)
1. Build an A-player team; match tasks to skill sets.
2. **Research before you build** — study the last 3 years' first-place winners and who the judges are; judges score from a checklist and are human.
3. **Check the criteria** — map every scoring line to a feature before writing code; one missed line can cost everything.
4. **Be unique in the first minute** — judges see hundreds of products; the demo's first 60 seconds decide.
5. **Use hardware when the format allows** — a physical prototype judges can touch, shown with its iterations.

## Prompting rules (the owner's settled guide)
Give context first (stack, time limit, rules) · ask for a plan before any code · build one feature at a time, not the whole app in one prompt · show an example instead of a long explanation · on error, paste the full error and ask for the fix to be verified.
