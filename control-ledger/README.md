# Coreweaver Control Ledger

The Control Ledger is a Git-native, self-describing operating kernel for Coreweaver. It records the relationships between entities, intents, evidence, claims, artifacts, decisions, outcomes, and maintenance. Its job is to make work legible across agents, people, tools, and future hosting environments.

It is not a database service, an autonomous agent, a customer-record system, a publishing engine, or a source of truth for facts that have no linked evidence. It runs from a normal repository clone and writes review artifacts only.

Start with the repository-level [`COREWEAVER.md`](../COREWEAVER.md), then read `manifest.json`, `CONTRACTS.md`, and `AUTHORITY.md` in that order.

## Commands

| Command | Purpose | External side effect |
|---|---|---|
| `npm run ledger:validate` | Validate schema, IDs, relationships, evidence links, lifecycle status, and no-public-action configuration. | None. |
| `npm run ledger:queue` | Build a local exception-only queue from incomplete, stale, or blocked records. | None. |
| `npm run ledger:map` | Build local static data for the operator view. | None. |
| `npm run ledger:run` | Run validation, queue, and map generation in order. | None. |
| `npm run test:ledger` | Run contract and authority-boundary tests. | None. |

Run artifacts go to `control-ledger/runs/` and are ignored by Git. No command initializes a provider, sends a prompt, changes a CMS, opens a pull request, merges, deploys, or publishes.
