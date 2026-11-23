# DevOps toolchain map (from a saved reel, @codecraftpr0, filed 23 Nov 2026 — full entry: `../08-references/saved-references-part-5.md` #290)

The 12 tools as one pipeline, in the order code actually flows:

1. **Git** — version control; every code change tracked.
2. **GitHub** — Git repos hosted online; pull requests = code review.
3. **Jenkins / GitHub Actions** — CI: every push auto-builds and tests.
4. **Docker** — app + dependencies packed into a container.
5. **Kubernetes** — container orchestration; self-heals on crash.
6. **Helm** — Kubernetes package manager; YAML bundled as charts.
7. **Terraform** — infrastructure as code: servers/network/DB from one command.
8. **Ansible** — configuration over SSH, agentless.
9. **Argo CD** — GitOps: cluster deploys exactly what Git says.
10. **Prometheus** — metrics collection + alerting.
11. **Grafana** — metrics as dashboards.
12. **ELK Stack** — all logs in one searchable place.

## Where the owner stands (23 Nov 2026)
- In hand: Git, GitHub, Docker (internship + WhyRisk), Vercel deploys.
- Learning path (MLOps direction + upcoming internship applications): GitHub Actions first (free, lives where the code already is), then Prometheus/Grafana basics, then Terraform, then Kubernetes/Helm/Argo CD if a project demands them.
