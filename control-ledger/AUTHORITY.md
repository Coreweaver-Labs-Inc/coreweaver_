# Authority Contract

The Control Ledger is a planning, evidence, and maintenance system. It does not grant an agent authority to act on the public internet, production environments, money, legal identity, customer data, or third-party tools.

## Authority levels

| Level | Allowed work | Disallowed work |
|---|---|---|
| `observe` | Read public sources and authorized local repository files; identify gaps. | Treat a source as true without recording its limit. |
| `draft` | Create local or review-branch proposals, records, documents, tests, and static views. | Present a draft as a published fact or completed capability. |
| `validate` | Run deterministic checks, build locally, and create local reports. | Modify CMS, provider, deployment, identity, or DNS settings. |
| `propose` | Build an exception queue and state the exact approval needed. | Take the proposed action. |
| `apply` | Perform only the specific approved change after a named human supplies current authorization. | Expand the scope, reuse approval for a different system, or perform a second external action without renewed approval. |

## Absolute blocks

These actions are always blocked unless a named human explicitly authorizes the specific action in the current task immediately before execution: provider prompts with non-public data; CMS writes; publishing; email or other outbound messages; PR creation; merge; deployment; DNS changes; credentials handling; payment; contracts; account changes; deletion; and changes to legal/entity assertions.

## Required approval record

An `apply` action needs a linked `decision` record naming: the target, exact action, proposed diff or payload, owner, evidence IDs, risk, rollback method, and expiration. A verbal or historical preference is not a durable approval for an unrelated public-impact action.

## Safe failure behavior

When a contract is incomplete, conflict exists, evidence is stale, a secret would be exposed, or authority is unclear: stop, create a `held` proposal, explain the missing condition, and do not attempt to bypass the boundary.
