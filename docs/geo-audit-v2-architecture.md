# GEO Audit v2 architecture

## Why the original stalled

The May Gemini report is an intelligent hypothesis set, but not an operational audit. It combines raw observations, inferred gaps, competitive claims, estimated impact, sales forecasts, and a score in one static narrative. There is no saved response evidence, no timestamped input manifest, no scoring formula, no baseline-versus-current comparison, no explicit uncertainty state, no issue owner, and no repeatable trigger. The result cannot be reliably updated by another model, operator, or CI runner.

## Design principles

The v2 audit is **evidence first, judgment second**. Deterministic checks collect HTTP status, final URL, response headers, body fingerprints, metadata, structured-data types, robots directives, sitemap references, canonical URLs, image-alt coverage, and machine-readable files. Judgmental analysis such as query-answer attribution, entity confusion, or editorial quality is isolated in an optional review layer with prompts, models, dates, and raw outputs preserved.

No check may claim a ranking, citation increase, crawler behavior, competitor capability, or commercial impact without a source field and a confidence label. The tool records `confirmed`, `inconclusive`, `manual_review`, `not_tested`, or `error` rather than converting missing evidence into a failing score.

## Input contract

Each target has one versioned JSON configuration file. Required fields are a stable target identifier, canonical origin, homepage, expected entity name, public paths to inspect, and an audit date. Optional fields define known entity qualifiers, expected schema types, protected facts, and probe-query sets. Secrets, logins, model credentials, and personal information are prohibited from the configuration.

## Deterministic audit modules

| Module | Evidence collected | Automated judgment |
|---|---|---|
| Fetch surface | status, final URL, headers, body length, content hash | accessible, redirect, or error |
| Metadata | title, meta description, canonical, robots, Open Graph/Twitter values, hreflang count | missing, duplicate, conflicting, or present |
| Structured data | JSON-LD blocks, parse errors, schema types, visible-page match warning | parsable/type presence only |
| Crawler policy | robots status, robots text, sitemap directives, named-bot directives | explicit allow/disallow only |
| Machine guidance | `llms.txt`, `llms-full.txt`, `AGENTS.md`, manifest status and body fingerprints | present, unavailable, or error |
| Sitemap | sitemap status, referenced sitemap URLs, URL count when XML is readable | available or missing |
| Content extraction | HTML availability, first H1, text length, image count, missing-alt count | extractable surface coverage |
| Entity consistency | configured qualifier occurrences in title, description, H1, JSON-LD, visible content | consistency count, not authority |

## Output contract

One run writes an immutable timestamped folder containing `audit.json`, `audit.md`, and `evidence/`. `audit.json` is the machine contract. It includes tool version, configuration hash, check results, evidence paths, findings, unknowns, and a coverage-aware score. `audit.md` is a human briefing generated only from those structured results. No file is overwritten by default.

The score reports two values: **observed points** and **evidence coverage**. Observed points measure only tests with adequate evidence. Coverage states how much of the intended scorecard was actually observed. This prevents a misleading single score from hiding missing data.

## Optional analysis layer

A separate review file can preserve probes sent to any language model, along with model identifier, interface, date, locale, browsing state, query, raw answer, citation URLs, and a human-reviewed label. This data is not produced by the deterministic runner and is never conflated with crawler or ranking data.

## Recurring operation

A repository workflow runs the deterministic audit weekly and on manual demand. It uploads the timestamped output as a build artifact and does not write to target sites, third-party profiles, or public knowledge bases. The workflow is intentionally model-neutral; any later LLM review can be performed by Claude, Codex, Copilot, Kimi, Gemini, a local model, or a human with the same `audit.json` evidence package.

Scheduled execution may be delayed by the hosting provider, so outputs are timestamped and the run log is part of the audit evidence. The workflow is a monitoring and evidence-collection system, not a guarantee of citation performance.

## Safe update path for Notion

The historical Notion page should be preserved as a dated snapshot. Add an update block that marks which claims have been freshly checked, which are stale, and links to the v2 evidence package. Do not overwrite the historical narrative or silently rewrite its claims.

## Two deployment paths

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---|---|
| Repository-native weekly evidence run | Deterministic checks, reviewable artifacts, no continuous server; model analysis remains optional/manual. | Included in repository CI usage subject to the hosting plan. | Low. |
| Managed audit dashboard with scheduled runs and review queue | Adds target management, trend charts, reviewer assignment, and optional model analysis; requires a database, deployment, and access control. | Depends on hosting and model usage. | Medium to high. |

The implementation starts with the repository-native path because it is portable, verifiable, and can be run locally or in standard CI. It does not prevent a later dashboard from reading the same JSON output contract.
