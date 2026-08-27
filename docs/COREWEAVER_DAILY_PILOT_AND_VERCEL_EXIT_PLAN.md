# Coreweaver Daily Pilot Publishing and Vercel-Exit Plan

**Prepared:** 2026-08-27  
**Current public pilot:** `https://pilot.coreweaver.io`  
**Scope:** Daily validation and constrained publication for the pilot; planning only for any apex or Vercel cutover.

## Current Domain Reality

The two requested moves are related but not the same migration.

| Surface | Current observed host | Required change | Risk boundary |
| --- | --- | --- | --- |
| `pilot.coreweaver.io` | Hostinger static hosting | Add a durable daily build/test/package/deploy pipeline. | May overwrite only the isolated pilot hostname after a controlled release decision. |
| `coreweaver.io` and `www.coreweaver.io` | Hostinger CDN; sampled HTTPS response was `403`. | Activate a chosen static artifact at the existing apex/root document scope and establish canonical policy. | Static deploy overwrites existing apex website contents; do not infer that it is empty from a 403 response. |
| `coreweaverlabs.com` and `www.coreweaverlabs.com` | Vercel project `prj_nw2PN41WI2gG9Jr4xHw4KnuPC8rg`, linked to `Coreweaver-Labs-Inc/coreweaver_`. | Move the current primary site to an owned target, then redirect or retire Vercel only after verification. | This is the actual Vercel exit. It is independent from activating the `.io` apex. |

The static `pilot.coreweaver.io` artifact currently preserves `coreweaverlabs.com` canonical URLs. That is intentional for a pilot. A primary-domain switch to `coreweaver.io` requires a rebuilt artifact with updated canonical, Open Graph, structured-data, sitemap, `llms.txt`, internal absolute links, and redirect policy. It must not be performed merely by pointing a hostname at the existing pilot files.

## Daily Pipeline Options

| Approach | How it runs | Tradeoffs | Cost | Setup complexity |
| --- | --- | --- | --- |
| **Repository-native daily release** | A scheduled repository workflow builds, runs the release-candidate checks, creates an immutable archive, deploys only candidates marked `approved-pilot`, records the checksum, and health-checks `pilot.coreweaver.io`. | Low operational friction and durable records. Scheduled workflows run from the repository default branch, so the quality/release pipeline needs an intentionally merged source path. It also requires a Hostinger API credential stored as a repository secret. | No additional hosting service; uses the existing GitHub and Hostinger services. | Moderate, one-time repository-secret and default-branch setup. |
| **Daily managed-run release** | A daily managed task checks out the named pilot branch, runs the same deterministic build/tests, and deploys only if the release manifest is approved. | Can operate against a non-default release branch but has higher orchestration cost and depends on a durable credential handoff. It should not generate or publish unreviewed editorial copy. | Recurring managed-task usage. | Lower repository configuration, higher ongoing operational cost. |

Both paths should enforce the same rule: **tests run daily; publication occurs only when a deterministic release manifest names `pilot.coreweaver.io`, the content set, the immutable artifact, and the rollback artifact.** The system may package and queue new material daily, but it should not create new claims or publish Notion-backed editorial notes without the specified editorial source and release state.

## Full Vercel Exit Critical Path

1. **Choose the primary public identity.** Confirm whether `coreweaver.io` becomes the primary public domain, while `coreweaverlabs.com` redirects, or whether `.com` remains primary on a non-Vercel host. This changes every canonical and redirect decision.
2. **Choose the production source.** Resolve the current Coreweaver review units into one release branch/artifact. The pilot combines the working-session page, correction-record guide, and quality pipeline locally, but that combined source is not the current default production branch.
3. **Prepare the apex-safe artifact.** Build the selected source with the chosen primary canonical base and route-preservation map. Keep an immutable archive plus SHA-256 before any apex deployment.
4. **Read and preserve the apex website state.** Record `coreweaver.io` root content and DNS records, plus `www`, MX, SPF, DKIM, CAA, and nameservers. A Hostinger static deployment must be scoped to the intended root only after this backup/review step.
5. **Deploy to a noncanonical host and validate.** `pilot.coreweaver.io` is already this proof point. Re-run route, HTTPS, header, mobile, metadata, source-map, and inbound-request checks with the final canonical build.
6. **Activate the selected apex and `www`.** Apply only the approved website deployment and route/canonical configuration. If `.io` is selected, its existing Hostinger DNS does not require a Vercel migration; if `.com` is selected, new DNS/TLS verification at its registrar/control plane is required.
7. **Set redirects and monitor.** Preserve meaningful paths, test canonical headers and sitemaps, watch anonymous status/error responses and inquiries, and retain Vercel unchanged through the defined rollback window.
8. **Retire Vercel last.** Remove the domain association and pause/delete the Vercel project only after the primary public domain is stable, the rollback archive exists, redirect behavior is verified, and a separately approved retirement action names the exact project and domains.

## Required Decisions Before Execution

The next execution path must identify: (1) the daily runner choice above; (2) the target source branch/default-branch policy; (3) the safe method for a Hostinger API credential in that runner; and (4) whether `coreweaver.io` is the intended new primary domain. No daily schedule, repository secret, apex static deploy, DNS edit, canonical rewrite, Vercel domain removal, Vercel pause, or project deletion is included in this planning document.
