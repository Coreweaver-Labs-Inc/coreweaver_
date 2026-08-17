# GEO-COMPASS architecture

## Positioning

Coreweaver Labs treats GEO as an information architecture problem. The objective is not to manufacture citations. The objective is to publish clear, attributable, useful information that people and retrieval systems can identify, compare, and verify.

COREWEAVER is the working name for the method. It is not presented as a proven replacement for Google PageRank or as a guarantee of AI visibility. It is a practical model for transforming source material into clean, connected, machine-readable public knowledge.

## Content silos

| Silo | Pillar route | Supporting routes | Primary entity |
|---|---|---|---|
| GEO fundamentals | `/geo/` | `/geo/seo-to-geo/`, `/glossary/share-of-model/`, `/glossary/entity-authority/` | Generative Engine Optimization |
| Signal architecture | `/geo/signal-architecture/` | `/glossary/signal-decay/`, `/glossary/citation-network/`, `/framework/arm/` | Coreweaver Labs |
| AI mastery | `/ai-mastery/` | `/ai-mastery/knowledge-systems/`, `/ai-mastery/trust-infrastructure/` | Mason Nguyen |
| GEO-COMPASS method | `/geo-compass/` | `/geo-compass/anti-slop/`, `/geo-compass/measurement/` | COREWEAVER method |
| Entity and trust | `/about/mason-nguyen/` | `/agents/manifest.json`, LinkedIn, GitHub, source-backed author pages | Mason Nguyen |

## Internal-link rules

Every pillar page links to at least three supporting pages, the author/entity page, and one source-backed external reference. Every supporting page links back to its pillar, one adjacent glossary or method page, and one relevant implementation page. Anchor text names the destination concept precisely instead of using generic “read more” text.

## Structured-data rules

Each public silo page receives a visible `Article` or `DefinedTerm` representation, an author entity connected to Mason Nguyen, a canonical URL, breadcrumb data, and FAQ data only when the questions and answers are visible on the page. JSON-LD must never introduce claims that the page does not show.

## Citation rules

External citations support definitions and established technical claims. Google Search Central is used for search and structured-data guidance. The original PageRank paper is used for historical link-analysis context. Ahrefs is used for practical internal-linking guidance. The site’s own frameworks are clearly labeled as Coreweaver’s working models rather than industry consensus.

## Image rules

Every editorial image must have a descriptive filename, intrinsic dimensions, an informative `alt` attribute, and a visible caption when it communicates more than decoration. The default image is an authored SVG diagram with a `<title>` and `<desc>` so it can be inspected without a vision model. Decorative animation remains `aria-hidden`.

## Measurement

The initial scorecard is operational rather than vanity-driven: indexed URLs, crawl errors, canonical consistency, Core Web Vitals, internal-link coverage, structured-data validity, source citation coverage, image-alt coverage, branded query impressions, and measured AI answer citations. No metric is treated as proof of causation without a before/after comparison.
