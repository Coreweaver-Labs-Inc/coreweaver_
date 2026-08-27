# `pilot.coreweaver.io` — Public Pilot Release Record

**Released:** 2026-08-27  
**Host:** Existing Hostinger static hosting for `coreweaver.io`  
**Hostname:** `pilot.coreweaver.io`  
**Artifact:** `coreweaver-pilot-7b5b00156e34.tar.gz`  
**Integrated local commit:** `7b5b00156e34`  
**SHA-256:** `c468268f2a349243b150d8dfd559f741d64451142f8a7f03f3a5bdee8550cf03`

## Scope

The pilot uses a new, isolated `pilot` subdomain directory on the pre-existing Hostinger `coreweaver.io` static-hosting resource. It replaces only the disposable default page served at that pilot hostname. It does not modify the existing `coreweaver.io` apex or `www` site, its mail/DKIM/SPF/MX records, the public ARM `.xyz` site, Vercel project settings, nameservers, or any root-domain canonical routing.

## Public Checks

| Check | Observed result | Status |
| --- | --- | --- |
| Public DNS | The pilot hostname resolved to Hostinger IPv4 and IPv6 addresses. | Passed |
| HTTP to HTTPS | HTTP returned a `301` redirect to the HTTPS hostname. | Passed |
| HTTPS reachability | HTTPS returned `200`; the observed server response identified the Hostinger CDN. | Passed |
| Home route | `https://pilot.coreweaver.io/` returned `200` with HTML. | Passed |
| Working-session route | `https://pilot.coreweaver.io/working-session/` returned `200`, rendered the portable interface, contained one H1, and exposed the bounded `hello@coreweaverlabs.com` mail request. | Passed |
| Correction-record guide | `https://pilot.coreweaver.io/field-index/correction-records/` returned `200` with the deployed guide marker. | Passed |
| Static quality checks | Content candidate validation reported 3 `needs-decision` records and 0 automatic releases; 7 tests, content-learning checks, control-ledger validation, and the 15-route static build passed before packaging. | Passed |
| Root and mail preservation | No root, `www`, MX, SPF, DKIM, nameserver, Vercel, or `.xyz` mutation was issued as part of this pilot. | Preserved |

## Deliberate Remaining Decision

The deployed pages retain canonical URLs under `https://coreweaverlabs.com/`. That is appropriate only while `pilot.coreweaver.io` is a validation host and prevents the pilot from being represented as the primary public identity. A future Vercel exit requires a separate, explicit canonical-host and root-route decision, a rebuilt artifact with the selected canonical base, a pilot recheck, and then an approved DNS/cutover plan. Do not infer that the live pilot itself completes that migration.

The observed response included `content-security-policy: upgrade-insecure-requests`; no HSTS header was observed in the sampled response. This is a deployment observation, not a security assessment.

## Rollback

Rollback affects the pilot only: restore or remove the pilot directory/subdomain after a separately approved action. The pre-pilot artifact is retained locally, and current Vercel-backed and root-domain public origins remain available because they were not modified.
