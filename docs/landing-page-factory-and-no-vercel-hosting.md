# Coreweaver Landing-Page Factory and No-Vercel Hosting Workflow

## Decision goal

Make a request such as “build `/field-systems`” sufficient to create a complete, reviewable landing-page package without restating Coreweaver’s story, internal-link rule, claim boundaries, visual rules, and release procedure. After one hosting target and one domain convention are explicitly authorized, routine updates should deploy from the approved source path without interactive hosting logins or a new DNS decision on every page.

The system should make **drafting and releases high throughput** while keeping the few actions that can alter public routing, certificates, mail, claims, or relationships explicit. It should never turn high volume into permission to make unsupported public claims or alter a domain’s existing service records.

> **Factory rule:** A new landing-page task inherits the Coreweaver method, evidence, asset, metadata, and release context. It supplies only the field, reader decision, route, source set, and intended host.

## Task-to-page contract

| Task input | Factory output | Inherited context |
| --- | --- | --- |
| Route, e.g. `/field-systems` | Tested landing page or field index in a feature branch. | Coreweaver Labs as the applied layer and ARM as the method anchor. |
| Reader and decision | Page job, information architecture, CTA, and an accountable release owner. | Contextual link to [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives). |
| Field and relevant entity | Claim map, source set, freshness date, external-relationship boundary, and link map. | Bounded verbs: applies, informs, governs, limits, and supports. |
| Visual direction | Asset ledger, provenance/rights notes, alt text, social-preview specification. | Generated visuals are conceptual, not documentary proof. |
| Release target | Build artifact, validation report, deployment record, canonical/redirect check, and rollback target. | First DNS/canonical-host action remains confirmed; routine releases to an approved target can proceed automatically. |

The reusable `coreweaver-landing-page-factory` skill carries this contract, its page-task brief, and the release manifest. It complements—not replaces—the existing content/media workflow: primary sources, claim classification, asset provenance, accessibility, and editorial review remain part of each page packet.

## Automatic-release boundary

| Action | Default handling | Why |
| --- | --- | --- |
| Create a page branch, outline, draft, metadata, visual brief, internal links, validation report, and preview artifact | Automatic once the task is approved. | These are reversible preparation steps inside approved source and workflow boundaries. |
| Deploy a tested page to an **already authorized** hosting project and route convention | Automatic after validation succeeds. | The target and rollback route were previously approved; no domain control changes are made. |
| Publish a Notion-backed article | Manual editorial release. | The existing content policy requires review before public publication. |
| First deployment to a new host or domain/subdomain | Explicit confirmation. | It changes a durable public surface and may require certificate or DNS setup. |
| Add, replace, or delete DNS, nameserver, MX, or CAA records; change canonical host; remove a legacy origin | Explicit confirmation with a record diff and rollback plan. | These changes can disrupt delivery, email, or certificate issuance. |
| Use third-party brands, assert a partnership, trigger outreach, publish pricing, or expose Earthward Foundry | Explicit human authorization. | The claim, rights, and relationship boundary is not a deployment decision. |

## Current hosting and DNS baseline

The active `www.autonomousresourcemanagement.xyz` website is currently served by Vercel, and the `.xyz` zone delegates to Vercel nameservers. The Vercel-linked repository is `virtualmase/autonomousresourcemanagement`. The existing Hostinger account includes static-hosting resources for `autonomousresourcemanagement.com`, several `.com` subdomains, and `coreweaver.io`; it does not list an `.xyz` website. Therefore, the `.xyz` zone should not be assumed to be controllable through the existing Hostinger hosting account.

Hostinger’s API documents DNS-zone retrieval, validation, snapshot/restore, and update actions; it also documents website, subdomain, and static-site deployment endpoints.[1] This makes it suitable for a pre-authorized `.com` page-factory target once the owner approves the first target and subdomain rule. Cloudflare Pages can automatically build and deploy from an approved Git branch, create preview deployments for branches and pull requests, and associate custom domains after its project setup.[2] [3]

## Hosting choices

| Approach | Best fit | Routine page release | First-time gate | Tradeoffs | Setup complexity |
| --- | --- | --- | --- | --- | --- |
| **Hostinger static-site factory** | Fastest route to high-volume static `.com` landing pages using already available hosting resources and a preconfigured Hostinger API key. | Build artifact uploads to a named existing website/subdomain after validation. | Approve the first website/subdomain mapping and any DNS diff; snapshot DNS before modification. | Uses the existing hosting environment; must define cache, rollback, and deployment-archive conventions. It does not move the `.xyz` zone automatically. | Low–medium. |
| **Cloudflare Pages factory** | Git-driven static pages with branch previews and future edge delivery. | Push to the explicitly approved production branch; Cloudflare deploys automatically. | Enable the Cloudflare integration, create the project, bind the custom domain, and approve its first DNS/nameserver plan. | Strong fit for static field indexes. A Pages Git-integrated project cannot later switch to Direct Upload, so choose the source path deliberately.[2] | Medium. |
| **VPS page factory** | Only when pages need custom system tooling, a long-running build queue, private network access, or a custom server runtime. | CI deploys an artifact to the managed server after tests. | Approve server provider, access custody, firewall/TLS, backups, monitoring, and DNS. | Highest operational burden; not necessary for the current static ARM page set. | High. |

## Migration responsibility matrix

| Hosting path | DNS and domain action | TLS and certificate responsibility | Cache strategy | Rollback path | Named operational owner |
| --- | --- | --- | --- | --- | --- |
| Hostinger static site | For an approved existing Hostinger domain/subdomain, validate the zone and snapshot it before the first record diff. For a non-Hostinger zone, obtain the authoritative DNS path first. | Hostinger-managed certificate status must be confirmed before canonical traffic moves. Preserve the current certificate path until the replacement hostname validates. | Cache immutable versioned assets aggressively; use a short revalidation period for HTML, sitemap, robots, and metadata. Clear the host cache only after confirming the new artifact. | Restore the recorded DNS snapshot or re-point the approved record to the prior origin; preserve the last deployed archive. | Hostinger account owner controls domain changes; page-factory release owner controls artifact and validation; named reviewer approves the first cutover. |
| Cloudflare Pages | A Cloudflare zone requires a confirmed nameserver move for an apex domain. An approved subdomain can use the required CNAME after the custom domain is associated with the Pages project.[3] | Cloudflare certificate issuance must complete after the domain association. Check the existing CAA policy before cutover and retain the legacy origin until HTTPS is clean. | Use platform static caching for immutable assets; set explicit cache headers for HTML and content indexes; purge only the affected URLs after a bad release. | Revert the Git commit or disable the new deployment, then restore the prior origin/record. Do not detach the current domain until the prior endpoint and redirect map are retained. | Cloudflare account owner controls zone, nameserver, and certificate decisions; repository owner controls source; page-factory release owner controls branch promotion and validation. |
| VPS | Add a first DNS record only after the server address, firewall, and origin health check are approved. Keep the existing origin in place until a smoke test passes. | The server owner must automate renewal, monitor expiry, protect private keys, and document TLS termination. Do not cut canonical traffic before automated renewal is proved. | Configure a CDN or reverse-proxy cache for static assets; version assets; set HTML revalidation intentionally; monitor origin cache misses and error responses. | Re-deploy the previously retained artifact or re-point the DNS record to the documented prior origin. Keep server snapshots/backups separate from application rollback. | Server owner is accountable for access, patching, firewall, backups, monitoring, and incident response; release owner is accountable for the artifact and public validation. |

## Recommended starting topology

Start with a **single approved static-site target** and a **subdomain-first namespace**, not an immediate move of the existing `.xyz` apex. For example, an approved field-index convention can route distinct page clusters through a current `.com` host such as `field-systems.autonomousresourcemanagement.com` or an equivalent approved Coreweaver domain. This lets the factory prove its task-to-preview-to-release path without moving nameservers, changing the existing `.xyz` canonical site, or depending on Vercel.

After one or two successful releases, decide whether to make Cloudflare the long-term authoritative DNS and static-hosting platform for the `.xyz` domain. An apex migration to Cloudflare Pages requires the zone to use Cloudflare nameservers; Cloudflare then manages the Pages DNS record.[3] That is a deliberate domain-transfer-like operational change, not a routine page task. Preserve Vercel as a rollback origin until HTTPS, redirects, sitemap/robots, canonical URLs, and mobile experience have been verified on the new target.

## First reusable implementation: `/field-systems`

Use `/field-systems` as the pilot only after a named host choice. The page task should create a field index that applies ARM’s method to clearly bounded field-system decision contexts, links to the ARM primitives page, cites primary sources, and does not claim deployed control, performance, safety, certification, or partner relationships. It should ship with a claim map, asset ledger, canonical metadata, sitemap entry, mobile review, and a rollback target.

The first host binding is the final release gate. Thereafter, future route tasks inherit the same page-factory brief and release manifest, which eliminates repetitive brand briefing and manual dashboard entry while preserving a clear record of what was deployed and why.

## Owner decisions required before implementation

Choose one initial host target and one route convention:

| Decision | Option A | Option B | Option C |
| --- | --- | --- | --- |
| Initial production target | Existing Hostinger static site or a new approved `.com` subdomain. | New Cloudflare Pages project with a noncanonical subdomain pilot. | VPS with separately approved operations and access custody. |
| Existing `.xyz` site | Leave Vercel live as the rollback origin during the pilot. | Plan a confirmed Cloudflare DNS/nameserver move after pilot validation. | Migrate only after a separate server build and operational review. |
| Release automation | Automatic only to the selected existing target after passing the manifest. | Automatic branch deploy after Cloudflare project/domain setup. | CI deployment after server approval and hardening. |

No DNS change, nameserver change, source-repository transfer, Vercel shutdown, or public route migration is included in this document.

## References

[1] [Hostinger API Reference](https://developers.hostinger.com/)

[2] [Cloudflare Pages, “Git integration.”](https://developers.cloudflare.com/pages/configuration/git-integration/)

[3] [Cloudflare Pages, “Custom domains.”](https://developers.cloudflare.com/pages/configuration/custom-domains/)
