# Notion Release-Record Contract

The Notion Blog Posts data source is the **evidence and editorial record** for Coreweaver resources. It is not a direct deployment switch. The existing `Status = published` value remains legacy editorial state and must never independently release a page.

## Minimum Record for a Release Candidate

| Notion field | Required value before a release candidate can be prepared | Why it exists |
|---|---|---|
| `Post Title` and `Slug` | Stable reader-facing title and unique URL slug. | Establishes the resource identity. |
| `Content Type` | One of the approved public formats, such as `geo-guide`, `entity-explainer`, `signal-note`, or `offer`. | Keeps the public architecture intentional. |
| `Claim Class` | `first-party fact`, `third-party fact`, `interpretation`, or `proposal`. | Prevents an opinion or a proposal from being presented as a fact. |
| `Source URLs` | Direct source URLs for each material external claim. | Makes verification possible. |
| `Evidence Checked On` | Date the evidence was reviewed. | Adds a freshness boundary. |
| `Reviewed By` and `Review Outcome` | Named reviewer and `approved for release`. | Distinguishes review from a draft state. |
| `Canonical Path` | A single production path beginning and ending with `/`. | Keeps canonical, sitemap, and internal-link behavior consistent. |
| `Autopublish` | `false` until a later explicit activation. | Preserves the current disabled production boundary. |
| `Release Mode` | `manual` until a later activation; `fixture-only` is never publishable. | Makes the intended path auditable. |
| `Release ID` | Stable identifier generated at candidate creation. | Connects Notion, Git, Vercel, and rollback evidence. |
| `Recheck By` | Required for time-sensitive facts and market claims. | Prevents stale trend claims from persisting unchecked. |

## Fields Completed Only After a Release

`Git PR URL`, `Vercel Deployment URL`, and `Rollback SHA` are output fields. They remain blank until an approved Git pull request and Vercel deployment exist. No agent may fill them with invented values.

## Current State

The release-record adapter validates exported JSON representations of this contract in a dry run. It does not read Notion credentials, update Notion records, create a Git pull request, deploy Vercel, or publish content. A later integration must retrieve only records with a qualifying `Review Outcome`, preserve source URLs and limitations, and write a Git-tracked release manifest before any production action.
