# Coreweaver entity-cloud outward roadmap

## Strategic aim

Grow outward from a stable Coreweaver center rather than adding disconnected pages. Every new public surface should make one relationship more legible: a method applied to a field, a source informing a method, a boundary limiting a claim, or a separately authorized implementation context.

The cloud’s public center is **Coreweaver Labs** and **Autonomous Resource Management (ARM)**. ARM remains the method node; application pages make that method specific to an operating field; the source map, mandate, and verification limits keep claims bounded; and manually released blog content becomes the long-tail discovery layer.

> **Outward-growth rule:** Add a new entity only when its public role, relationship type, claim boundary, evidence owner, canonical destination, and review owner can all be named.

## Entity model

Every public entity should have a small, maintainable record.

| Field | Required public meaning |
| --- | --- |
| Canonical name and route | Stable name, canonical URL, and one-sentence role. |
| Entity type | Method, application field, source/reference, boundary, implementation context, or publication. |
| Relationship type | Applies, informs, governs, limits, supports, or—only with authorization—implements. |
| Claim boundary | What the relationship does not imply, such as partnership, endorsement, certification, deployment, performance, or ownership. |
| Evidence and freshness | Source URL, date checked, and owner responsible for rechecking. |
| Link contract | The contextual path into ARM, the supporting/pillar route, and the relevant source or boundary page. |
| Asset record | Visual role, source/rights, provenance availability, alt text, and review state. |
| Release state | Draft, manual review, public, retired, or restricted. |

## Expansion rings

| Ring | Role | Existing or planned entities | Relationship rule |
| --- | --- | --- | --- |
| 0. Method center | Explain the Coreweaver operating method. | Coreweaver Labs, ARM, mandate, verification limits, source map. | Every application surface should resolve to ARM primitives and a relevant boundary page. |
| 1. Application fields | Show how the method frames a specific operating context. | Energy systems, industrial automation applications, process control, material handling, monitoring/inspection, operator handoffs. | Describe decision routes; do not claim to operate systems or deliver outcomes. |
| 2. Reference entities | Provide credible technical/governance context. | NIST industrial control systems, NIST manufacturing automation, NIST AI RMF, DOE, NLR, C2PA. | Cite as sources and context; never imply partnership, endorsement, certification, or formal integration. |
| 3. Implementation contexts | Connect a method to a separately governed build context. | Earthward Foundry, if and only if rights and governance authorization exist. | Hold behind written rights, ownership, cross-link, and review controls. |
| 4. Discovery and media | Make the cloud intelligible to people and machines. | Blog articles, sitemap, `llms.txt`, Open Graph cards, source-linked media, accessible diagrams, focused media derivatives. | Each item must point to a canonical entity and have a specific reader or distribution job. |

## Priority waves

### Wave 1 — Consolidate the center and publish-ready relationships

Complete the open foundation work before creating a third application silo. Merge or resolve the metadata and Lighthouse work in PR #8, keep the energy operations and industrial-automation records coherent across PRs #9, #10, and #13, and use the content-and-media release gate for every candidate public article.

The next public relationship to build is the **industrial automation applications application page**, separate from its Notion-backed blog cluster. It should play the same role that the published energy-systems page plays for energy: a durable application hub that explains the field, routes to ARM primitives, names the four industrial subfields, links to source and verification boundaries, and can receive future supporting articles after manual release.

| Next build | Entity relationship created | Required links | Release condition |
| --- | --- | --- | --- |
| `/industrial-automation-applications` application page | ARM **applies to** industrial automation decision routes. | ARM primitives; source map; verification limits; future process-control/material-handling/monitoring/handoff articles. | Source-backed copy, asset ledger, reviewed social metadata, and no dead draft links. |

### Wave 2 — Activate the industrial cluster

After the industrial application hub is public, manually review and release one supporting article at a time. Start with **industrial process control applications**, because its four-state decision model gives the cluster a clear language for observation, interpretation, permitted action, and review state. Release material handling next, then monitoring and inspection, then operator handoffs. Each article should create a new focused entry path and link back to the hub and the ARM primitives.

Do not release multiple articles solely to meet a cadence. A support page should become public only when its claims, sources, links, assets, and owner are ready. The goal is a denser relationship map, not a larger page count.

### Wave 3 — Add governance and evidence branches

Build two compact reference surfaces rather than scattered references. The first, **“Decision Evidence and Source Boundaries,”** can connect the Coreweaver source map, verification limits, C2PA provenance concepts, and visual-asset ledger practice. The second, **“Governed Operations and AI Risk Context,”** can explain how ARM’s mandate, signal, escalation, and record concepts sit alongside voluntary governance references such as the NIST AI RMF.[1]

These surfaces must state that external frameworks are sources of context, not certifications or adopted controls. They should link outward to original sources, inward to ARM, and sideways to relevant energy and industrial application pages.

### Wave 4 — Authorized implementation context

Only after Earthward Holdings supplies written rights and governance authorization should Coreweaver add an Earthward Foundry relationship. The link must identify Earthward Foundry as a separately maintained implementation context and must not imply a Coreweaver product, joint deployment, ownership transfer, or equipment operation. A repository move, fork, contribution, or integration repository is a distinct decision after the rights gate is closed.

## Discoverability and media contract

Every public application page should ship with a canonical title, description, Open Graph image, sitemap entry, `llms.txt` inventory entry, and source-map relationship. Use the asset ledger to distinguish conceptual illustrations from documentary evidence. A generated hero may orient a reader; it cannot substantiate an operating claim. A deterministic diagram may explain the decision route; a citation must substantiate a factual statement.

For distribution, adapt a page into only the media units that have a clear purpose: one viewpoint-led post, one framework visual, one short explanatory script, and one owned-channel note at most. The canonical page remains the stable entity; derivatives should strengthen its route rather than compete with it.

## Relationship quality gate

Before exposing a new entity or relationship, confirm the following in a single review:

| Question | Release condition |
| --- | --- |
| Is the entity real and clearly named? | The canonical name, route, type, and public role are stable. |
| Is the relationship accurate? | Use a bounded verb such as applies, informs, governs, limits, or supports. |
| Is the claim supportable? | Sources are current, interpretations are labeled, and promises are absent unless verifiable. |
| Is the external relationship authorized? | Source citation is permitted; partner, implementation, code, or brand use has explicit written permission. |
| Is the route usable? | Contextual links are live, descriptive, and reciprocal where useful. |
| Is the media honest? | Asset rights, provenance, disclosure, alt text, and claim relationship are documented. |

## Recommended next action

Build the static **Industrial Automation Applications** hub at `/industrial-automation-applications` as the next outward application node. Its job is to connect the published ARM method to industrial process control, material handling, monitoring/inspection, and operator handoffs while keeping those future supporting routes in a clear, manually governed release queue.

Do not fork, link publicly to, or move Earthward Foundry as part of this action. Keep it as a restricted future implementation node until written rights and governance authorization are in place.

## References

[1] [NIST, “AI Risk Management Framework.”](https://www.nist.gov/itl/ai-risk-management-framework)
