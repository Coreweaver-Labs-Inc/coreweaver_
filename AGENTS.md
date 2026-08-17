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
