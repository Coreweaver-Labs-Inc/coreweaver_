# Gemini GEO audit revival notes

## Source audit

The linked Notion page, titled “GEO Audit — Gemini.com (2026-05-18),” is a one-off narrative report created in May 2026. It assigns an overall score of 48/100 and proposes a six-month engagement. Its useful hypotheses include entity disambiguation, structured-data completeness, crawlability, authorship, citation networks, and content citeability.

## Fresh public checks on 2026-08-17

| Surface | Observation | Status against May audit |
|---|---|---|
| Homepage | The public extractor recovered substantive homepage text and descriptive image alt text, including current prediction-market content. | The claim that a crawler can see only a blank JavaScript shell is no longer supported by this check. |
| `robots.txt` | Public, generic `User-Agent: *` rule present; references four sitemap indexes; `Crawl-delay: 600` present. | The former “not accessible/unverifiable” claim is stale. Bot-specific treatment still needs structured verification. |
| `llms.txt` | `https://www.gemini.com/llms.txt` returned HTTP 500 in this check. | A failure is current evidence, but it should be repeated and logged with status, headers, and timestamp before escalation. |
| `sitemap.xml` | Public sitemap index references global, converter, and Singapore sitemap outputs, dated 2026-08-04. | The former “not accessible/unverified” claim is stale. |

## Diagnosis

The task stalled because it was a static, prose-heavy sales audit rather than a reproducible system. It mixed observed facts, inferred claims, competitor comparisons, estimated impact, and sales projections in one document; did not preserve raw HTTP evidence, query prompts, model versions, timestamps, source URLs, or scoring formulas; and had no repeatable input contract, quality gate, backlog, owner state, or rerun trigger.

The revived design should record evidence before judgment, distinguish confirmed findings from hypotheses, use a versioned scorecard, and generate a machine-readable audit alongside a human-readable report. No model, crawler, or assistant should be required to operate it.

## Key sources

- Original Notion audit: https://app.notion.com/p/365db2c4244c81019721e6ea87d12936
- Fresh homepage check: https://www.gemini.com/
- Fresh robots check: https://www.gemini.com/robots.txt
- Fresh llms check: https://www.gemini.com/llms.txt
- Fresh sitemap check: https://www.gemini.com/sitemap.xml
