# Operating Model

The learning loop improves the **quality of its checks**, not the assertiveness of its content. It accumulates recurring issue patterns from the repository’s own review and outcome records, then proposes explicit policy or checklist changes for a human to accept in version control.

The normal operator view is an exception queue. A passing record does not require a manual decision. A blocked, due-for-recheck, or release-ready record produces a one-screen explanation with its missing evidence and a single permitted next step.

| Layer | Deterministic job | Never permitted |
|---|---|---|
| Intake | Read versioned evidence, claim, proposal, and outcome records. | Pull arbitrary web data, private data, or provider output. |
| Audit | Identify missing sources, reviewers, limitations, recheck dates, and prohibited outcome wording. | Generate a factual claim or mark it true. |
| Queue | Prioritize holds, rechecks, and decisions. | Publish, delete, redirect, merge, or deploy. |
| Retrospective | Count recurring categories of known issue and suggest a policy review. | Change a threshold or policy rule automatically. |
| Approval | Wait for an explicit, scoped human decision. | Infer consent from a passing validation. |
