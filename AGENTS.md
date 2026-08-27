# Coreweaver Labs Collaboration Standard

## Implementation language

Write all code, configuration, comments, tests, commit messages, file names, and implementation-facing documentation in **English**. Use another language only for explicitly approved public-facing localized content, and add an English review note wherever that localized content affects implementation.

## Deployment boundary

This repository is the GitHub-managed source for the Coreweaver Labs Astro/Vercel application. Preserve the existing `npm run build` → `dist` deployment contract and do not change routing, redirects, or production configuration without direct route verification.

The separate `coreweaver.io` Live Journal is managed through Hostinger manual uploads. Do not infer that a change in this repository changes that property, or vice versa.

## Review controls

Keep public copy source-backed, claim-safe, accessible, and manually reviewable. Never commit secrets, private records, payment data, or personal contact information. For every change, record what changed, why it was permitted, how it was validated, and what remains intentionally blocked.

## Coreweaver operating kernel

This repository includes a portable Control Ledger for people and future agents. Before changing category language, entity records, evidence, claims, artifacts, decisions, outcomes, maintenance records, or control-ledger workflows, read [`COREWEAVER.md`](./COREWEAVER.md), then [`control-ledger/manifest.json`](./control-ledger/manifest.json), [`control-ledger/CONTRACTS.md`](./control-ledger/CONTRACTS.md), and [`control-ledger/AUTHORITY.md`](./control-ledger/AUTHORITY.md).

Treat a missing source, relationship, approval, owner, outcome, or fact as **unknown**. By default, you may read authorized sources, create local or review-branch drafts, run deterministic validators, and write local review artifacts. You may not send repository material to an external provider; change CMS content; create a pull request; merge; deploy; publish; change DNS; send an outbound message; purchase; sign; delete; or alter an entity, legal, product, or outcome claim without named human approval for the exact action in the current task.

Before a handoff or migration, run `npm run ledger:validate` and `npm run test:ledger`. The generated `control-ledger/runs/` files are local review output and must not be committed. Read [`control-ledger/MAINTENANCE.md`](./control-ledger/MAINTENANCE.md) before changing a record, schema, workflow, or agent instruction.
