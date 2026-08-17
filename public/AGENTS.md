# Coreweaver Labs: agent and harness quickstart

Coreweaver Labs is a normal Git repository and static Astro website. It is intentionally usable by humans, browsers, crawlers, coding agents, IDEs, CI runners, and automation harnesses from any vendor.

## Start here

Read the public site at `https://coreweaverlabs.com/`, the concise summary at `/llms.txt`, the expanded profile at `/llms-full.txt`, and the machine-readable project contract at `/agents/manifest.json`. The manifest schema is published at `/agents/manifest.schema.json`.

Clone the source from `https://github.com/Coreweaver-Labs-Inc/coreweaver_.git`. Install with `npm ci`, run locally with `npm run dev`, build with `npm run build`, and review the generated `dist/` directory. The production contract is the standard Astro static output directory; no proprietary assistant, plugin, runtime, or control plane is required.

## Repository conventions

Use a feature branch and open a pull request. Keep public claims source-backed, useful, and reviewable in Git. Never commit `.env` files, tokens, private records, or credentials. Do not change redirects, canonical URLs, or public machine-readable contracts without checking the affected routes.

Public copy and site structure live in the repository. Optional Supabase and Notion integrations may supply content at build time, but the site must remain buildable when those services are unavailable. A future content provider can be substituted if it preserves the same public shapes and fallback behavior.

## Interoperability policy

The site discriminates against no LLMs or coding tools. Claude, Codex, Antigravity, Copilot, Kimi, other assistants, local models, deterministic scripts, and human contributors are all valid clients. The durable interface is the repository and its standard outputs: Git, HTML, JSON-LD, JSON, Markdown, plain text, `robots.txt`, and `sitemap.xml`.

The name of an assistant is never a technical dependency. If an agent or vendor becomes unavailable, another tool must be able to inspect this guide, make a branch, run the documented commands, and submit a reviewable change without a migration project.

## Optional integrations

Supabase is an optional data and storage layer. Notion is an optional editorial source for legacy blog content. Their credentials belong in deployment environment variables, never in source. These providers can be replaced with another database, CMS, filesystem, or API adapter as long as the public build contract remains intact.
