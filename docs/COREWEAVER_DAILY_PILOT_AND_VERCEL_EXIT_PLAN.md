# Coreweaver Daily Pilot Publishing and Vercel-Exit Plan

**Prepared:** 2026-08-27  
**Current public pilot:** `https://pilot.coreweaver.io`  
**Scope:** Daily validation and constrained publication for the pilot; prepared canonical artifact and approval package for the `.io` apex; planning only for the later Vercel exit.

## Current Domain Reality

The two requested moves are related but not the same migration.

| Surface | Current observed host | Required change | Risk boundary |
| --- | --- | --- | --- |
| `pilot.coreweaver.io` | Hostinger static hosting | Add a durable daily build/test/package/deploy pipeline. | May overwrite only the isolated pilot hostname after a controlled release decision. |
| `coreweaver.io` and `www.coreweaver.io` | Hostinger CDN; sampled HTTPS response was `403`. | Activate a chosen static artifact at the existing apex/root document scope and establish canonical policy. | Static deploy overwrites existing apex website contents; do not infer that it is empty from a 403 response. |
| `coreweaverlabs.com` and `www.coreweaverlabs.com` | Vercel project `prj_nw2PN41WI2gG9Jr4xHw4KnuPC8rg`, linked to `Coreweaver-Labs-Inc/coreweaver_`. | Move the current primary site to an owned target, then redirect or retire Vercel only after verification. | This is the actual Vercel exit. It is independent from activating the `.io` apex. |

The static `pilot.coreweaver.io` artifact currently preserves `coreweaverlabs.com` canonical URLs. That is intentional for a pilot. A primary-domain switch to `coreweaver.io` requires a rebuilt artifact with updated canonical, Open Graph, structured-data, sitemap, `llms.txt`, internal absolute links, and redirect policy. It must not be performed merely by pointing a hostname at the existing pilot files.

## Selected Daily Pipeline and Current Evidence

Coreweaver selected the **repository-native daily release**. The merged workflow `.github/workflows/daily-pilot-release.yml` is scheduled for 06:15 UTC daily. It checks out the default branch, validates the five release candidates, runs learning and ledger checks, builds the static site, packages a deterministic archive/checksum, and retains the package artifact for 30 days. Its deploy job is fixed to `pilot.coreweaver.io` and is guarded to `schedule` events when `PILOT_PUBLISH_ENABLED` is exactly `true`.

| Configuration or evidence | Recorded state | Meaning |
| --- | --- | --- |
| Deployment credential | Hostinger API credential exists as a repository secret. | The workflow can request short-lived Hostinger upload credentials without exposing the key in source. |
| Non-secret variables | `PILOT_HOSTINGER_USERNAME=u622004167` and `PILOT_PUBLISH_ENABLED=true` are configured. | The only automated deployment target is the named pilot account and hostname. |
| Manual workflow | Run `33117542459`, event `workflow_dispatch`, completed successfully on 2026-08-27. | Validates packaging and quality steps only; it deliberately did **not** enter the schedule-only deploy job. |
| Schedule-triggered deploy | No run observed yet. | The Hostinger redeploy and its route checks remain **unverified** until the first successful cron event is inspected. |

The boundary remains unchanged: **tests and packaging may run daily, while the fixed pilot deployment can only act on the explicit pilot hostname and the already reviewed default-branch source.** The pipeline does not generate new claims, publish Notion-backed editorial notes, contact audiences, modify DNS, or target the `.io` apex.

## Full Vercel Exit Critical Path

1. **Use `.io` as the prepared primary candidate.** The review branch `release/coreweaver-io-canonical` contains the prepared source and package. Pull request [#24](https://github.com/Coreweaver-Labs-Inc/coreweaver_/pull/24) is review-only; it does not activate production.
2. **Preserve the apex root before replacement.** The prepared `.io` archive is `coreweaver-io-8fec4b94e4df.tar.gz` with SHA-256 `dbcdc3fc4168005eb3012ca6ac23f8d236d5546457cea87dbdb98581c0f5cb9b`. Hostinger must provide a file inventory and checksum-recorded root backup before any overwrite; the public `403` result is not an empty-root signal.
3. **Gain a fresh, named release approval.** The approval must name the archive, checksum, Hostinger account, `coreweaver.io` target, and the restorable backup. It must expressly preserve `.io` DNS, mail, pilot, and the Vercel `.com` service during the action.
4. **Deploy and validate only the apex static archive.** Confirm HTTPS, route status, canonical/structured metadata, sitemap/robots/llms output, cache behavior, and mobile/desktop rendering. Record the Hostinger result and certificate state with the artifact identity.
5. **Hold rollback capacity for the agreed validation window.** Preserve the root backup, pilot, and existing Vercel production origin. Restore the backup if the required checks fail.
6. **Build a separate owned `.com` redirect service.** Establish and verify a rollbackable 301 path for `coreweaverlabs.com` and `www.coreweaverlabs.com` to the chosen `.io` equivalents. This is an independent DNS/TLS/hosting change requiring its own approval.
7. **Retire Vercel last.** Remove Vercel domain routing, pause, or delete project `prj_nw2PN41WI2gG9Jr4xHw4KnuPC8rg` only after the `.com` redirect is live elsewhere, primary routes and analytics are stable, and a separate retirement action names the exact domains and rollback behavior.

## Remaining Requirements Before Execution

The remaining execution blockers are: (1) a provider-side root inventory and downloadable, checksum-recorded backup for the existing `coreweaver.io` document root; (2) a fresh exact approval for that irreversible root overwrite; and (3) evidence from the first scheduled daily pilot deployment. The complete `.com` redirect and Vercel retirement remain later actions, each requiring an independent design, backup/rollback record, and approval. No apex static deployment, DNS edit, canonical public-host switch, Vercel domain removal, Vercel pause, or project deletion is included in this planning document.

The exact `.io` controls, preconditions, verification steps, and rollback boundary are maintained in [`COREWEAVER_IO_APEX_CUTOVER_PACKAGE.md`](./COREWEAVER_IO_APEX_CUTOVER_PACKAGE.md) and [`coreweaver-io-apex-release.yml`](../ops/release-manifests/coreweaver-io-apex-release.yml).
