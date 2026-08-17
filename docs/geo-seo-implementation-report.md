# Coreweaver GEO / technical SEO implementation report

## Status

Implemented on branch `feat/portable-agent-neutral-site`, commit `a0f7a20`, and pushed to the existing pull request: https://github.com/Coreweaver-Labs-Inc/coreweaver_/pull/1

Production was not changed directly. Merge the pull request to trigger the normal deployment pipeline.

## New content silos

- `/geo/` — GEO fundamentals pillar
- `/geo/seo-to-geo/` — SEO-to-GEO translation layer
- `/geo/signal-architecture/` — six-layer signal architecture
- `/geo-compass/` — anti-slop evidence-to-citation method
- `/geo-compass/anti-slop/` — pre-publish checklist
- `/geo-compass/measurement/` — probe-query and technical measurement protocol
- `/ai-mastery/` — systems architecture pillar
- `/ai-mastery/knowledge-systems/` — retrieval, entity, and evidence systems
- `/ai-mastery/trust-infrastructure/` — provenance, integrity, and verification
- `/framework/arm/` — accountable agent primitives
- `/glossary/share-of-model/` — DefinedTerm glossary page
- `/glossary/entity-authority/` — DefinedTerm glossary page
- `/glossary/citation-network/` — DefinedTerm glossary page
- `/about/mason-nguyen/` — canonical author and entity page

## Technical SEO changes

The reusable `SeoArticle` and `GlossaryPage` components standardize titles, 70–180 character meta descriptions, canonical URLs, bylines, breadcrumbs, author/person JSON-LD, DefinedTerm metadata, image dimensions, alt text, captions, Open Graph image URLs, and Twitter image alt text. The sitemap now contains 18 generated routes. Legacy `/arm` and `/geo` redirects now point to the canonical framework and GEO pillar routes.

The repository also includes an authored SVG GEO-COMPASS diagram with accessible `<title>` and `<desc>` elements, plus a validator that checks generated pages for metadata, canonical uniqueness, H1 count, image alt text, JSON manifests, sitemap presence, and broken internal links.

## Portability and machine readability

The public contract remains standard Git, Astro, HTML, JSON-LD, JSON, Markdown, plain text, `robots.txt`, `sitemap.xml`, and static `dist/` output. No Manus-only language, package, API, or guardrail was introduced. Claude, Codex, Antigravity, Copilot, Kimi, local models, scripts, CI runners, and human contributors can use the repository with the documented npm workflow.

The public agent manifest, `llms.txt`, `llms-full.txt`, and `AGENTS.md` now expose the content silos, anti-slop policy, measurement policy, and source-of-truth rules.

## Validation

`npm run build`, `git diff --check`, and `node scripts/validate-build.mjs` pass. The validator reports 18 HTML pages and valid internal links. The build emits only the existing optional Notion fallback notice and Node’s `punycode` deprecation warning; both are non-blocking.

## Measurement plan

After deployment, establish a baseline for indexed URLs, canonical consistency, crawl errors, Core Web Vitals, structured-data validity, internal-link coverage, image-alt coverage, branded query impressions, and a fixed probe-query set. Record model, date, locale, retrieval context, mention, accuracy, attribution, and citation separately. Do not represent a single Share of Model observation as a guaranteed ranking or citation outcome.

## Sources

[1] Google Search Central, “Creating helpful, reliable, people-first content”: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

[2] Google Search Central, “Introduction to structured data markup in Google Search”: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

[3] Brin and Page, “The PageRank Citation Ranking: Bringing Order to the Web”: https://ilpubs.stanford.edu:8090/422/1/1999-66.pdf

[4] Ahrefs, “Internal Links for SEO: An Actionable Guide”: https://ahrefs.com/blog/internal-links-for-seo/

[5] User-provided AI Mastery reference: https://virtualmase.github.io/ai-mastery/
