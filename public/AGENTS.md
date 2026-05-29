# AGENTS.md — Coreweaver Labs

API and integration quickstart for coding agents (Codex, Copilot, Manus, Claude).

## MCP Integration

MCP manifest location: https://coreweaverlabs.com/ai-config/mcp-manifest.json

## Blog Content API (Notion)

All blog content is sourced from Notion via the @notionhq/client SDK.
Database IDs are stored as environment variables — request access from operator.

## Supabase Data Layer

Project URL: https://lauhqmibfaglnvyhfyfz.supabase.co
Tables: blog_images, blog_posts, weekly_work, assets, entity_registry, vaas_keywords, submission_queue

Image CDN base: https://lauhqmibfaglnvyhfyfz.supabase.co/storage/v1/object/public/blog-images/

## GitHub Repository

https://github.com/Coreweaver-Labs-Inc/coreweaver_
Branch: main
Deploy: push to main triggers Vercel auto-deploy

## Agent Rules

- Never commit .env files
- Always create feature branches — never push to main directly
- Content creation goes through Notion, not hardcoded in Astro pages
- Images go through Supabase Storage → Notion Blog Images DB → Blog Posts DB
- Follow ARM Framework mandate chain — every action references an authorized directive
