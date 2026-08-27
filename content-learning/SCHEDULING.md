# Scheduling and Review Model

The included workflow runs once daily at `14:17 UTC` after this branch is merged. It can also be run manually. It checks versioned repository inputs, produces an exception queue, writes a workflow summary, and stores the reports as a private workflow artifact for 30 days.

The job is purposely **read-only**. Its declared repository permission is `contents: read`. It does not have credentials, dependencies, commands, or workflow permissions for Notion, content management systems, model providers, pull requests, merges, deployments, publishing, email, social distribution, domains, or DNS.

## Operator workflow

| Signal | What the daily run does | What the operator does |
|---|---|---|
| No exceptions | Emits a short “0 decisions” job summary. | Nothing. |
| Hold | Names the incomplete record and its missing evidence/review fields. | Supply evidence, narrow the claim, or decide to retire the item. |
| Recheck due | Names a time-sensitive claim requiring revalidation. | Confirm, update with sourced evidence, narrow, correct, or retire. |
| Needs decision | Indicates a separately prepared, fully validated proposal. | Approve or reject that one scoped action. Passing a check never authorises publication. |

## Activation rule

The workflow is not live while it is only on this review branch. Before merging it, verify that the repository’s branch protection requires review and that the team accepts a daily **read-only** workflow artifact. No credentials need to be added for the base loop.

If a future team chooses to add a destination for the exception digest, add it in a separate change with an explicit data-minimisation design, an owner, retention period, and a test showing it cannot transmit source content or credentials. Do not add a model provider to this scheduled workflow. A model-assisted research or drafting task must be separately scoped, human-approved, and use a specifically approved provider and payload.
