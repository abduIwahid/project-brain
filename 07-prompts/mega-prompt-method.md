# The mega-prompt method (filed from reel #276, @textura.us)

**The method:** write the finished website out as ONE detailed build prompt — every section, component, colour, spacing and behaviour specified as if describing a site that already exists — then hand that single spec to the builder (human or AI) and have it implemented faithfully. The prompt IS the design document.

Five worked examples were published on getlayers.ai (Auralis, Brewns, Codescan, Dantora, Evolve) — each a complete site described as a giant prompt. Only the opening lines are public; the full texts sit behind the site. The method, not their content, is what transfers.

**Proven in production:** the Plan Banao site redesign (v3) was built exactly this way — the finished site written as one detailed spec first, then implemented against it — and it replaced an accreted stylesheet with a coherent design system in one pass.

**Rules that keep it honest:**
- Never copy another designer's site 1:1 — extract the design language/tokens and rebuild fresh with your own content.
- The spec must carry the tokens (see `../01-design-system/`), not vibes: exact colours, type scale, spacing, states, empty states, responsive behaviour.
- Pair it with the Project Brain prompt (`project-brain-prompt.md`) for the full project scaffold, and the audit playbook (`../09-process/website-audit-playbook.md`) before calling the result done.
