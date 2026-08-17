# Coreweaver Labs Collaboration Standard

## Implementation language

Write all code, configuration, comments, tests, commit messages, file names, and implementation-facing documentation in **English**. Use another language only for explicitly approved public-facing localized content, and add an English review note wherever that localized content affects implementation.

## Deployment boundary

This repository is the GitHub-managed source for the Coreweaver Labs Astro/Vercel application. Preserve the existing `npm run build` → `dist` deployment contract and do not change routing, redirects, or production configuration without direct route verification.

The separate `coreweaver.io` Live Journal is managed through Hostinger manual uploads. Do not infer that a change in this repository changes that property, or vice versa.

## Review controls

Keep public copy source-backed, claim-safe, accessible, and manually reviewable. Never commit secrets, private records, payment data, or personal contact information. For every change, record what changed, why it was permitted, how it was validated, and what remains intentionally blocked.
