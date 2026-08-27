# Coreweaver.io Apex Cutover Package

**Status:** Prepared; no cutover is authorized by this document.  
**Prepared:** 2026-08-27  
**Target:** `https://coreweaver.io` as the intended canonical public origin.  
**Purpose:** Move the Coreweaver static release from a pilot-only Hostinger subdomain to the existing Hostinger-backed `.io` apex without changing the existing Vercel-backed `.com` site in the same operation.

## Observed Control Plane

The existing `coreweaver.io` static-hosting resource is enabled on Hostinger under account identifier `u622004167`, with root directory `/home/u622004167/domains/coreweaver.io/public_html`. The current DNS snapshot shows the apex aliasing to `coreweaver.io.cdn.hstgr.net.` and `www` pointing to `www.coreweaver.io.cdn.hstgr.net.`. This indicates that the `.io` apex can be prepared as an owned static-host release without an assumed DNS record mutation. It does **not** establish that the current root is empty or that deployment can safely overwrite it.

An authenticated Hostinger control-panel review on 2026-08-27 also showed `coreweaver.io` as a managed **Website**. The public API documentation names file-list and file-content endpoints, but the scoped API attempts did not yield a dependable root listing: the content request correctly rejected a missing path and the subsequent list-request transport closed before returning data. This is a safe stop, not a content finding. A hPanel File Manager or provider-side backup/export must now produce the actual root file inventory and restorable archive before an overwrite is considered.

The current Vercel-linked public system is `coreweaverlabs.com` and `www.coreweaverlabs.com`, not `coreweaver.io`. The `.io` canonical switch is therefore the first migration stage. It is not a complete Vercel exit; the `.com` redirect/retirement work follows only after `.io` validation.

| Component | Current observed state | Cutover decision |
| --- | --- | --- |
| `.io` static host | Existing enabled Hostinger static host. | Use as the only first-apex deployment target. |
| `.io` DNS | Hostinger CDN records for apex and `www`; mail and verification records also exist. | No mutation expected for the archive deployment; take a fresh snapshot and stop if it differs. |
| `.io` root response | Public apex was observed returning `403`. | Preserve current root contents before replacement; a `403` is not evidence of an empty root. |
| Pilot | `pilot.coreweaver.io` is publicly serving the Hostinger pilot release. | Preserve unchanged as an independent validation and rollback reference. |
| `.com` primary | Vercel-backed Coreweaver production. | Preserve unchanged through the `.io` release and validation window. |
| Mail and verification | Hostinger DNS includes MX, SPF, DKIM, DMARC, autoconfig/autodiscover, and a Google verification TXT record. | Preserve without modification. |

## Prepared Immutable Artifact

The local canonical artifact was generated at source commit `8fec4b94e4df`. It contains 15 static routes and rewrites runtime-facing canonical, Open Graph, structured-data, sitemap, `robots.txt`, and `llms.txt` references to `https://coreweaver.io`. Email addresses such as `hello@coreweaverlabs.com` remain contact addresses, not canonical URLs.

| Field | Prepared value |
| --- | --- |
| Archive | `coreweaver-io-8fec4b94e4df.tar.gz` |
| SHA-256 | `dbcdc3fc4168005eb3012ca6ac23f8d236d5546457cea87dbdb98581c0f5cb9b` |
| Canonical base | `https://coreweaver.io` |
| Validation completed | Canonical-artifact test, artifact verification, release-candidate audit, learning tests, control-ledger validation, and static build. |
| Execution boundary | Artifact creation only; no Hostinger deployment, DNS change, TLS request, Vercel modification, or canonical public-host switch occurred. |

The implementation is reproducible through `npm run prepare:coreweaver-io`, followed by `npm run validate:coreweaver-io`. The generated files under `release-artifacts/` are intentionally release outputs rather than Git-tracked source.

## Exact Future Cutover Sequence

1. **Preflight and backup.** Re-read the Hostinger DNS zone and static-host identity. Create a provider-side backup of the current `.io` document root, download it to a controlled record, compute its SHA-256 hash, and record the timestamp. Stop if no restorable backup exists.
2. **Regenerate the candidate.** Check out the named source commit or an explicitly approved replacement, run the full quality suite, produce the canonical artifact, and compare its archive name and checksum with the approved release manifest.
3. **Approve one deployment.** Obtain a literal approval naming `coreweaver.io`, the archive, the checksum, Hostinger account `u622004167`, the root document directory, and the backup used for rollback.
4. **Deploy to the existing static root.** Use the proven Hostinger upload-and-deploy method against `coreweaver.io` only. Do not include a DNS change, mail record change, `www` change, pilot change, Vercel modification, or unrelated website release in that request.
5. **Validate the public result.** Confirm anonymous HTTPS responses for `/`, `/working-session/`, `/field-index/correction-records/`, and `/sitemap.xml`; validate canonical and structured data; inspect the desktop/mobile presentation; record certificate, HTTP, cache, and content results.
6. **Hold rollback capacity.** Preserve the old root backup, the public pilot, and the Vercel `.com` origin for the agreed validation period. Restore the exact backup if any required validation fails.

## Vercel Exit After the `.io` Cutover

The full exit is a second, independently approved migration. It requires an owned-host redirect solution for both `coreweaverlabs.com` and `www.coreweaverlabs.com`, public checks of redirect behavior and canonical consolidation, and a retention decision for the Vercel project during the rollback window. Vercel custom domains should not be removed until the redirect path is live elsewhere and its monitoring/rollback procedure is recorded.

> **Required approval before execution:** “Deploy `coreweaver-io-8fec4b94e4df.tar.gz` (SHA-256 `dbcdc3fc4168005eb3012ca6ac23f8d236d5546457cea87dbdb98581c0f5cb9b`) to the existing Hostinger `coreweaver.io` root after completing and recording the root backup. Do not modify DNS, mail, pilot, Vercel, or any `.com` route in the same action.”

## Sources of Record

The executable boundaries live in [`coreweaver-io-apex-release.yml`](../ops/release-manifests/coreweaver-io-apex-release.yml). Hostinger’s public API reference identifies the hosting file and static-archive deployment API families used by the pilot implementation.[1]

## References

[1] [Hostinger API reference](https://developers.hostinger.com/)
