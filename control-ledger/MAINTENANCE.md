# Maintenance and Agent Handoff

The Control Ledger is maintained through short, reversible review cycles. Its normal job is to detect an incomplete record, stale evidence, an unowned decision, an unclear relationship, or an unmeasured outcome. It does not silently “repair” a record or move a release forward.

## Maintenance cadence

| Trigger | Safe response | Human action required |
|---|---|---|
| A record changes scope, owner, or relationship. | Run `npm run ledger:validate`, record the change as a new version, and place linked claims in `held` if evidence no longer fits. | Approve the successor record where it changes an entity, claim, decision, or public wording. |
| Evidence reaches its recheck date or a source changes. | Create a local exception-queue entry and retain the old evidence record. | Decide whether to recheck, retire, or supersede the dependent claim. |
| An outcome is proposed. | Require an observation window, method, limitation, and owner. | Approve the method before any measurement or public use. |
| A new agent or platform takes over. | Read `COREWEAVER.md`, `manifest.json`, `CONTRACTS.md`, and `AUTHORITY.md`; run the validator. | Approve any integration, credential, schema migration, or public-impact action. |

## Manual workflow

The repository includes `.github/workflows/control-ledger-check.yml`. It can be run manually from a branch and has read-only contents permission. It executes the local validator and uploads an artifact for inspection. It does not run on a clock, commit a report, open an issue, create a pull request, read a secret, send a provider prompt, invoke a CMS, deploy, or publish.

When a team later wants recurring checking, copy its guarded pattern only after a named owner approves a cadence and review destination. Keep it read-only. Any future workflow that writes an issue, ticket, notification, CMS record, branch, or deployment requires a new authority review and its own explicit approval path.

## Portable handoff prompt

Give a new agent this short instruction after it has access to the repository:

> Read `COREWEAVER.md` and `control-ledger/manifest.json` first. Treat missing evidence as unknown. Run `npm run ledger:validate` and `npm run test:ledger`. You may read, draft, validate, and create local review artifacts. Do not send data to a provider, change the CMS, commit, create a pull request, merge, deploy, publish, alter DNS, use credentials, or delete anything unless a named human supplies current, specific approval.

This prompt does not replace the source contracts; it directs the agent to them.
