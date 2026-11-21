# 07 · Prompts

**What this folder is:** the reusable prompts — each one is a tool with a job. This README says what each prompt does, when to use it, exactly how to use it, and what you need before you start.

---

## 1. `project-brain-prompt.md` — scaffold a project's brain before writing code

**What it does:** turns a raw project idea into a complete `/brain` folder for the project: PRD, ARCHITECTURE, DATA_MODEL, API_SPEC, DESIGN (tokens), TOOLS, BUILD_PLAN, TESTING, DEPLOYMENT, ENV, WORKFLOW, DECISIONS, SECURITY, PRODUCTION_READINESS, RISKS, GLOSSARY, ETHICS_PRIVACY — plus, for judged/hackathon work, TEAM, SUBMISSION, JUDGE_QA, DEMO_DATA and RETRO files. No project code gets written before this brain exists.

**When to use it:** at the very start of ANY new project — a website, an app, an ML product, a hackathon entry. Also when rescuing a project that was started without a plan.

**How to use it, step by step:**
1. Open a fresh chat with your AI builder (Claude, ChatGPT, or an agent like JARVIS).
2. Paste the whole prompt file as your first message, with your project idea where the prompt asks for it.
3. Answer the clarifying questions it asks (users, stack, constraints, deadline). Unknowns are recorded as "TBD (needs human decision)" — never guessed.
4. Let it generate the brain folder. Save the files in a `brain/` folder at the root of the project repo.
5. Work from the brain: after every implementation step, update the brain's session log, changelog and current-state file (the prompt defines the format). Conventional commits.

**You need before starting:** the idea in a few sentences; any hard constraints (deadline, stack you must use, judging criteria if any).

**Tips:** the DESIGN file's tokens are the single source of truth for the UI — pair with `../01-design-system/`. Before calling the project done, run `../09-process/website-audit-playbook.md`.

---

## 2. `helix-hero-prompt.md` — a scroll-animation hero site from a Figma frame

**What it does:** builds a single-page, single-file (`index.html` + `assets/`) scroll-animation site: a three.js helix of curved ribbon project cards driven by one normalised scroll progress (GSAP ScrollTrigger pin), whose cards then fly into a real DOM project grid with a pixel-exact handover. The hero is a faithful scale of your Figma frame via design units (`--u`), not a reflow.

**When to use it:** for a showcase/landing hero experiment where the animation IS the point. You need a designed hero frame first — this prompt does not design for you.

**How to use it, step by step (the prompt's own 5 steps):**
1. Design the hero frame in Figma — the still frame only, not the animation. Frame size 1440×825.
2. Copy the Figma link (viewable by anyone) or export the frame as a PNG.
3. Open your AI builder and attach: the design (link or PNG) + 6–16 project images (these become the cards) + a portrait if your design has one.
4. Paste the prompt and send.
5. If something is off, the prompt's own rules section is the fix list — point the builder at the exact rule that was broken.

**Inputs:** hero frame (Figma link/PNG) · 6–16 project images · optional portrait · your exact copy (the prompt uses your words verbatim and adds nothing).

**Output:** `index.html` + `assets/` — no framework, no build step. The prompt asks for screenshots at four points when done: clean hero, lines parting, helix mid-scroll, landed grid.

**Cautions:** this is a scroll-driven pinned WebGL flow — heavy by design. On the repo owner's own portfolio this class was twice rejected in favour of stacking cards; use Helix for a standalone experiment or a campaign page, not as a default portfolio pattern. The prompt already contains its performance/a11y rules (DPR cap, reduced-motion fallback, one rAF loop) — don't strip them.

---

## 3. `mega-prompt-method.md` — describe the finished site, then build to the description

**What it is:** a method, not a copy-paste prompt. Write the finished website out as ONE detailed build spec — every section, component, colour, spacing, state and behaviour, as if describing a site that already exists — then hand that single spec to the builder and have it implemented faithfully. The prompt IS the design document.

**When to use it:** a new site or a redesign where coherence matters more than speed of first draft. Proven on a real redesign (a hackathon product site rebuilt in one pass from one spec, replacing an accreted stylesheet with a coherent system).

**How to use it:**
1. Study 2–3 reference sites you like — extract their design TOKENS (colours, type scale, spacing), never their content or layout 1:1.
2. Write the spec section by section: header, hero, each content section, footer, plus states (loading, empty, error), responsive behaviour, and dark mode if any. Use the token vocabulary from `../01-design-system/`.
3. Hand the whole spec to your AI builder in one message, with your real content (copy, images, links).
4. Review against the spec, section by section — deviations are bugs, not opinions.
5. Finish with the audit: `../09-process/website-audit-playbook.md`.

**Tips:** vague spec = vague site; exact numbers (px, hex, ratios) are what make this work. Pair with `project-brain-prompt.md` when the project also needs architecture/data planning.
