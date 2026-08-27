# Migration Guide

The Control Ledger is designed to survive a host, model, framework, or agent change. A complete migration copies this repository directory, preserves UTF-8 JSON and Markdown, and runs the local validator from a current Node.js runtime. No service account, API key, database, connector, or agent memory is needed to interpret the kernel.

## Required migration payload

| Include | Do not include |
|---|---|
| `COREWEAVER.md`, `control-ledger/`, `content-learning/`, public source files, package scripts, tests, and version history. | `.env` files, credentials, session cookies, generated run outputs, private customer data, or access tokens. |

## Migration check

1. Clone or copy the repository.
2. Read `COREWEAVER.md` and `control-ledger/manifest.json`.
3. Run `npm run ledger:validate` and `npm run test:ledger`.
4. Confirm every schema path resolves, every record ID is stable, and `safe_defaults` remain `false` for public-impact actions.
5. Configure any future provider or backend as a separate, explicit integration. Do not silently reinterpret a record as authorization to activate it.

## Compatibility promise

The canonical data format is JSON Schema draft 2020-12 compatible JSON plus Markdown. The static operator view is optional and derived; it must never be the only copy of a record. Schema versions use semantic versioning. A breaking field change requires a migration note, a successor schema file, and a validation path for the prior version.
