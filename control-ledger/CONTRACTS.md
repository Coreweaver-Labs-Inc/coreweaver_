# Control Ledger Contracts

Every JSON record is a deliberately small statement with a stable `id`, `kind`, `version`, `status`, `title`, `owner`, and `updated_at` date. An ID never changes to improve wording. A materially changed record receives a new version and links to the prior record through `relationships`.

| Kind | Answers | Must reference | Cannot assert by itself |
|---|---|---|---|
| `entity` | Who or what has a stable role? | Relationship boundary and owner or `unknown`. | Legal identity, ownership, endorsement, affiliation, or customer status. |
| `intent` | What bounded result is sought? | Owner, scope, non-goals, lifecycle stage. | Completion, feasibility, funding, or outcome. |
| `evidence` | What specific statement does a source support? | Source locator, check date, scope, and limit. | More than the cited source supports. |
| `claim` | What statement may a reader encounter? | Claim class, evidence IDs, owner, reviewer, and status. | A fact when class is interpretation, proposal, or promise. |
| `artifact` | What inspectable output exists? | Source location, lifecycle link, and owner. | Production deployment, adoption, or effectiveness. |
| `decision` | Who chose what, why, and under which boundary? | Decision owner, options, evidence IDs, and date. | That the decision was optimal or permanent. |
| `outcome` | What was observed after a decision? | Method, observation window, limit, and owner. | Causation, generalization, safety, compliance, or societal benefit. |
| `maintenance` | How does a record stay current and recoverable? | Owner, recheck trigger, next action, and linked record. | That the linked work remains correct without recheck. |

## Claim classes

| Class | Definition | Example form |
|---|---|---|
| `fact` | A source-bound statement about something observable or documented. | “The repository contains the referenced file at this commit.” |
| `interpretation` | A bounded reading of evidence. | “This source appears relevant to the stated interface question.” |
| `proposal` | A suggested future action or design. | “Adopt the six-part evidence frame for a pilot review.” |
| `promise` | A statement of intended action or service. | “We will recheck this record by the stated date.” |

`promise` records require an accountable owner and must never masquerade as an achieved result. A record with missing evidence, owner, reviewer, or recheck date is `held` or `unknown`; it never becomes release-ready by default.

## Relationship semantics

Use only the listed relation verbs. Each relationship is directional and must name a record ID.

| Verb | Meaning |
|---|---|
| `supports` | The source record supports a bounded claim or decision. |
| `limits` | The source record states a limitation on another record. |
| `belongs_to` | The record is part of a broader entity, intent, or artifact. |
| `implements` | The artifact realizes an intent or decision at a specified scope. |
| `governs` | The decision or policy bounds another record’s allowed action. |
| `supersedes` | The record replaces a prior version without erasing it. |
| `maintains` | The maintenance record keeps another record current. |
| `observes` | The outcome records an observation related to a change or decision. |
| `requires_approval_from` | The record requires named human approval before a listed action. |

## Unknowns and retirement

Use `unknown` for a fact not yet established. Use `held` when a claim or action must not proceed. Use `retired` for a record no longer current and `superseded` when an explicit successor exists. Do not delete a material record just to remove an inconvenient history.
