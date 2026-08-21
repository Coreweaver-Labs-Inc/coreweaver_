# Content Operations Foundation

This directory is the portable control plane for Coreweaver’s **GEO Made Simple** research-to-publication system. It is deliberately inert in this pull request: it cannot call a keyword provider, write to Notion, create an article, merge a pull request, deploy Vercel, publish Webflow, or distribute social content.

## What Is Included

| File or directory | Purpose |
|---|---|
| `config.json` | Machine-readable source policy, topic policy, release cap, excluded legacy terms, and kill-switch name. |
| `content-ops.schema.json` | Strict schema for the configuration. |
| `candidates/` | Private, source-backed research candidate inputs. A candidate is not an article. |
| `fixtures/fixture-geo-made-simple/` | Non-publishable source/claim/article fixture used to test validation. |
| `runs/` | Locally generated queue and validation reports. These records are ignored by Git except `.gitkeep`. |
| `scripts/score-content-topics.mjs` | Deterministically ranks candidate inputs and writes a private queue. |
| `scripts/validate-content-ops.mjs` | Blocks missing evidence, unsafe claims, legacy narrative, incomplete metadata, and any fixture attempting release. |
| `.github/workflows/content-ops.yml` | Manual validation workflow only. Its schedule is commented out and it has read-only repository permissions. |

## Current Safe Mode

The following values must remain unchanged until a separate activation approval:

```json
{
  "enabled": false,
  "autoMerge": false,
  "autoPublish": false,
  "destination": "vercel-only",
  "webflowLivePublishing": false,
  "socialPublishing": false
}
```

`AUTOPUBLISH_ENABLED=false` is the required global kill switch in any future activation workflow. This foundation does not read the environment variable yet because it does not have any publishing capability.

## Candidate Input Contract

Create a JSON file in `content-ops/candidates/` only after a research source packet exists. The candidate must be an eligible GEO Made Simple topic and must not contain retired positioning.

```json
{
  "id": "example-entity-clarity",
  "readerQuestion": "How can a company distinguish itself from a similarly named entity?",
  "topic": "entity-clarity",
  "sourceRecord": "https://app.notion.com/p/your-reviewed-record",
  "notes": "Why this question is timely and useful.",
  "components": {
    "strategicRelevance": 0.9,
    "firstPartyQueryOpportunity": null,
    "sourceQualityAndFreshness": 0.9,
    "readerDecisionUsefulness": 0.9,
    "marketTimeliness": 0.6,
    "duplicatePenalty": 0.1
  }
}
```

All components range from `0` to `1`. When Search Console data is unavailable, use `null` for `firstPartyQueryOpportunity`; the scorer records that it applied the neutral default of `0.5` rather than inventing demand.

## Local Commands

```bash
npm run validate:content-ops
node scripts/score-content-topics.mjs
npm run build
```

The first command validates only the non-publishable fixture. The second writes `content-ops/runs/topic-queue.json` from candidate files. Neither command releases content.

## Activation Prerequisites

Do not enable the schedule or automated publishing until all conditions below are documented in a separate activation pull request.

1. The public ethos foundation has been merged and `/mandate/` and `/vaas/` have approved route dispositions.
2. The Notion Blog Posts schema contains the evidence and release fields described in the internal operating memory.
3. `coreweaverlabs.com` Search Console verification is complete if first-party query data will be used.
4. Any keyword provider and LLM provider have owner-approved credentials stored as repository secrets, not in Notion or Git.
5. The article builder creates portable Markdown/JSON release artifacts, a visible source section, a claim ledger, and a validation record.
6. Required branch protection checks and auto-merge rules are verified.
7. Vercel preview and post-deployment smoke tests are implemented.
8. The owner explicitly authorizes `enabled`, `autoMerge`, and `autoPublish` to change from `false`.

Until then, the system is research and validation infrastructure—not a public publishing system.
