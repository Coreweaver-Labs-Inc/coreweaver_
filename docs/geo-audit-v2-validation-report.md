# GEO Audit v2 validation report

## Implementation status

The historical Notion report has been preserved and appended with a dated renewal block. The Coreweaver repository now contains a deterministic, model-neutral GEO Audit v2 runner, a Gemini Exchange configuration, JSON configuration schema, model-probe template, scheduled GitHub Actions workflow, runbook, and offline contract validator.

The implementation is on branch `feat/portable-agent-neutral-site` at commit `07a1d89`. The open pull request is https://github.com/Coreweaver-Labs-Inc/coreweaver_/pull/1.

## Fresh baseline

The first v2 run on 2026-08-17 collected public homepage, robots, sitemap, `llms.txt`, `llms-full.txt`, and `AGENTS.md` responses. It observed **51/100** across the configured public checks with **100% evidence coverage**. This is a bounded deterministic score, not an assessment of rankings, citations, legal compliance, crawler access, or commercial impact.

| Observation | Evidence-based status | Required follow-up |
|---|---|---|
| Homepage delivered substantive extractable text. | Confirmed for this HTTP fetch. | Do not reuse the old “blank JavaScript shell” claim without renderer-specific retesting. |
| `robots.txt` was public and exposed four sitemap directives. | Confirmed for this HTTP fetch. | Monitor bot-policy changes and preserve raw responses. |
| `sitemap.xml` returned three location entries. | Confirmed for this HTTP fetch. | Follow the index URLs only when expanding the audit scope. |
| `llms.txt` and `llms-full.txt` returned HTTP 500; `AGENTS.md` returned 404. | Confirmed for this HTTP fetch. | Repeat from a second context before treating this as an operational escalation. |
| Configured `Organization` and `FinancialService` JSON-LD types were not observed. | Observed gap, not a final diagnosis. | Confirm intended schema types and visible-content alignment before recommending implementation. |
| Open Graph and Twitter descriptions differed. | Confirmed for this HTTP fetch. | Review the live metadata source and entity wording. |

## Validation completed

| Check | Result |
|---|---|
| `npm run build` | Passed; 18 static pages generated. Existing optional Notion fallback and Node `punycode` notice remain non-blocking. |
| `npm run validate:geo-audit` | Passed; config, safety controls, and workflow contract validated offline. |
| `npm run audit:geo` | Passed; timestamped audit JSON, Markdown, and raw response evidence generated. |
| `git diff --check` | Passed before commit. |
| Notion renewal | Appended and fetched again to confirm presence. |

## Automation boundary

The GitHub workflow runs at 03:17 UTC every Monday and on manual demand. It has read-only repository permissions, a five-minute timeout, and 90-day evidence artifacts. It cannot write to Gemini, Notion, social networks, knowledge bases, or other third-party services. Scheduled execution can be delayed, so `generatedAt` remains the authoritative freshness field.

## Remaining work

The next improvement should be a controlled model-review pass using the included template. It must retain prompts, raw responses, provider, model, interface, locale, browsing state, date, citations, and reviewer labels. That review can be performed with any LLM or a human reviewer and must stay separate from the deterministic scorecard.

When more targets are added, maintain the same JSON input contract and artifact format. If a management interface or more frequent monitoring becomes necessary, a dashboard can read the current output without changing the evidence model.
