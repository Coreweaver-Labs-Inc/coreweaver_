# GEO Audit v2 runbook

## Purpose

GEO Audit v2 is a repeatable public-evidence audit. It does not claim to predict rankings, citation share, crawler behavior, or revenue. It gathers timestamped HTTP evidence and turns it into a structured scorecard, a concise briefing, and a review queue.

## Run locally

```bash
npm ci
npm run audit:geo
```

The runner reads `audits/gemini-com.json` and writes an immutable evidence package under `artifacts/geo-audits/gemini-com/<timestamp>/`.

| File | Role |
|---|---|
| `audit.json` | Machine-readable source of truth: configuration hash, responses, analysis, scorecard, findings, and limitations. |
| `audit.md` | Human-readable briefing derived from `audit.json`. |
| `evidence/` | Captured public response bodies. Treat these as dated observations, not permanent facts. |

## Interpret results correctly

The report shows **observed score** and **evidence coverage**. The observed score is a bounded check of configured public surfaces. Coverage reports whether the expected modules produced evidence. A change in either number is a prompt to inspect the raw response and compare two runs; it is not proof that search, AI visibility, or business performance changed.

The runner uses five evidence labels: `confirmed`, `observed_gap`, `inconclusive`, `manual_review`, and `error`. Preserve those labels in client-facing work. Replace a historical claim only when the current evidence package actually supports the update.

## Add a target

1. Copy `audits/gemini-com.json` to a new kebab-case target ID.
2. Set one canonical HTTPS origin and public paths only. Do not add credentials, internal URLs, API keys, or personal data.
3. Define entity cues that distinguish the target in a useful, non-deceptive way.
4. Keep schema expectations as hypotheses. If a type is not observed, validate whether it is appropriate before calling it an implementation defect.
5. Run `node scripts/geo-audit.mjs --config audits/<target>.json` locally.
6. Review `audit.json`, then add the target to an appropriate scheduled workflow only after the output is useful and respectful of the target’s public crawler policy.

## Optional model review

Use `audits/model-probe.template.json` after a deterministic run. Preserve the exact prompt, raw answer, model, provider, interface, locale, browsing state, execution date, source citations, and reviewer label. Do not combine model-probe outcomes with deterministic scorecard points.

This layer is intentionally compatible with Claude, Codex, Copilot, Kimi, Gemini, local models, other assistants, and human review. The audit’s source of truth remains the evidence package, not a model’s summary.

## Scheduled operation

The repository workflow `.github/workflows/geo-audit.yml` runs the Gemini configuration weekly at **03:17 UTC on Monday** and can be started manually. It uploads its evidence package as a 90-day workflow artifact. It has read-only repository permissions and does not write to the audited site, Notion, social profiles, public knowledge bases, or third-party services.

Scheduled workflows can be delayed. Use the report’s `generatedAt` timestamp rather than the intended schedule time when interpreting freshness. If an audit becomes large, runs frequently, needs a target-management interface, or needs notification routing, retain the same `audit.json` contract and move the runner into a managed application with scheduled jobs rather than changing the audit method.

## Notion update policy

Keep the original May 2026 Gemini audit as a historical snapshot. Add a dated update that identifies stale claims, points to the v2 workflow, and links the evidence package or repository commit. Never silently edit an old score, projected outcome, competitor claim, or sales forecast as if it were a new measurement.

## References

[1] GitHub Docs, “Events that trigger workflows”: https://docs.github.com/actions/using-workflows/events-that-trigger-workflows

[2] GitHub Docs, “Workflow syntax for GitHub Actions”: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

[3] GitHub Docs, “Configuring the retention period for GitHub Actions artifacts and logs”: https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization
