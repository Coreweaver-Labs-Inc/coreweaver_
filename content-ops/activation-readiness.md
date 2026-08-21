# Content Operations Activation Readiness

**Status:** Preparation only. The content-operation configuration, automatic merge, automatic publication, Webflow live publishing, social publishing, and workflow schedule remain disabled.

## Verified State

| Control | Current result | Activation consequence |
|---|---|---|
| Foundation workflow | Present in PR #2 as manual-only and read-only. | Safe to extend with additional dry-run checks. |
| Production delivery | Vercel serves the canonical Coreweaver Labs site. | Vercel is the only future release destination. |
| Webflow | Retained as editorial CMS; staging domain is indexable on the current plan. | Do not publish to Webflow live through this pipeline. |
| Notion build adapter | Existing Astro adapter uses `NOTION_TOKEN` and `NOTION_BLOG_POSTS_DB_ID`, then treats Notion `published` as a build-time public state. The evidence/release fields now exist in the Blog Posts data source. | Do not reuse `published` as automatic-release authorization. Migrate and review records before the new release manifest relies on the new fields. |
| Repository secrets | The available GitHub token cannot list secret names; no secret value was read. | Credential configuration cannot be assumed. An owner must add/verify secrets in a later activation review. |
| Main branch protection | GitHub reports that `main` is not protected. | Auto-merge must remain off until branch protection and required checks are established. |
| Search Console | No `coreweaverlabs.com` property has been verified in the connected Search Console account. | First-party query/impression data remains unavailable. Do not infer it from another property. |
| Keyword provider | No approved keyword-data credential is configured. | Use only offline fixtures and public-primary-source adapters in this PR. |
| LLM provider | No provider/model is authorized for this release pipeline. | Build a provider-neutral request contract only; do not call an LLM. |

## Required Before Any Automatic Release

1. Merge the reviewed foundation and activation-preparation work.
2. Configure an owner-approved research provider and required GitHub secrets without committing credentials.
3. Verify the `coreweaverlabs.com` Search Console Domain property before ingesting first-party query data.
4. Migrate and review at least one existing Blog Posts record using the approved evidence/release fields before an automated release can rely on them.
5. Protect `main` with required validation and deployment checks before enabling automatic merge.
6. Provide an approved source allowlist and a time-bounded market-source policy.
7. Select an LLM provider/model for drafting and an independent review/consistency mechanism.
8. Configure post-deployment canonical/metadata/source smoke tests against the Vercel preview and production URL.
9. Explicitly approve configuration changes that set `enabled`, `autoMerge`, or `autoPublish` to `true`.

## Non-Goals of This PR

- It does not add a secret, call an external paid API, create a Notion record, publish a Webflow item, generate an article, or change website content.
- It does not schedule a workflow, enable auto-merge, merge a pull request, or deploy production.
- It does not change the legacy `/mandate/` or `/vaas/` route disposition.
