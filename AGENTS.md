# Coreweaver Labs Collaboration Standard

## Implementation language

Write all code, configuration, comments, tests, commit messages, file names, and implementation-facing documentation in **English**. Use another language only for explicitly approved public-facing localized content, and add an English review note wherever that localized content affects implementation.

## Interoperability policy

This repository is intentionally assistant-neutral. Claude, Codex, Antigravity, Copilot, Kimi, other models, deterministic scripts, IDEs, CI runners, and human contributors are equally valid clients. Do not add a proprietary assistant, agent runtime, MCP-only workflow, or vendor-specific language as a build requirement. Prefer standard Git, HTML, JSON-LD, JSON, Markdown, plain text, HTTP, and npm interfaces.

The public machine-readable contract is published at `/agents/manifest.json`, with its schema at `/agents/manifest.schema.json`, and the public summaries at `/llms.txt` and `/llms-full.txt`.

## Deployment boundary

This repository is the GitHub-managed source for the Coreweaver Labs Astro/Vercel application. Preserve the existing `npm run build` → `dist` deployment contract and do not change routing, redirects, or production configuration without direct route verification.

The separate `coreweaver.io` Live Journal is managed through Hostinger manual uploads. Do not infer that a change in this repository changes that property, or vice versa.

## Review controls

Keep public copy source-backed, claim-safe, accessible, and manually reviewable. Never commit secrets, private records, payment data, or personal contact information. For every change, record what changed, why it was permitted, how it was validated, and what remains intentionally blocked.

## GEO Audit v2

Run `npm run audit:geo` to collect a timestamped public evidence package for the configured Gemini Exchange target. Run `npm run validate:geo-audit` to validate the configuration and scheduled-workflow safety contract without contacting the target. The runner writes `audit.json`, `audit.md`, and captured public responses under `artifacts/geo-audits/`; generated evidence is intentionally ignored by Git.

Keep deterministic HTTP evidence separate from model-probe reviews. Any Claude, Codex, Copilot, Kimi, Gemini, local-model, or human review must preserve the raw prompt, raw answer, provider, model, interface, locale, browsing state, execution date, citations, and reviewer label. Do not report a model observation as a ranking or citation guarantee. See `docs/geo-audit-v2-architecture.md` and `docs/geo-audit-v2-runbook.md`.
