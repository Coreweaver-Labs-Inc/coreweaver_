# Industrial automation applications silo and Earthward Foundry handoff

## Decision summary

Coreweaver Labs should build the **industrial automation applications** silo as a decision-infrastructure topic cluster. Its job is to help industrial-operations readers distinguish an automated task from a delegated decision. The commercial path should lead consistently to the [Autonomous Resource Management primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives), not directly to an Earthward Foundry implementation.

Earthward Foundry should be presented, if and only if its owner approves the relationship in writing, as a separate physical-work implementation context. Coreweaver explains the public operating questions; Earthward Foundry may embody a traceability and human-handoff implementation for a different operating domain. The two should not be represented as one deployed product, and the content must not claim that either system runs industrial equipment, delivers a performance outcome, or confers compliance, certification, or safety approval.

> **Rights boundary:** The active `virtualmase/earthward-foundry` fork carries a proprietary license that expressly prohibits copying, modification, merging, publication, distribution, and sublicensing without prior written permission from Earthward Holdings. No CoreweaverLabs fork, mirror, code contribution, or reuse should occur until that permission is documented.

## Content silo map

| Role | Proposed route | Search task | Editorial contribution | Required internal link |
| --- | --- | --- | --- | --- |
| Pillar | `/blog/industrial-automation-applications` | Understand industrial automation applications | Explain applications as decision routes, not a vendor technology catalog. | [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) |
| Support 1 | `/blog/industrial-process-control-applications` | Understand process-control scope | Use SCADA, DCS, and PLC contexts to separate observation, authority, action, and review. | [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) |
| Support 2 | `/blog/material-handling-automation-decision-routes` | Examine material movement applications | Explain movement, storage, routing, interruption, and escalation as a bounded decision route. | [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) |
| Support 3 | `/blog/industrial-automation-monitoring-inspection` | Examine monitoring and inspection | Connect an observation to an explicit evidence, review, and retained-record path. | [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) |
| Support 4 | `/blog/industrial-automation-operator-handoffs` | Clarify intervention and escalation | Define when an automated route returns to a named operator and what state travels with it. | [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) |

## Pillar specification

**Working H1:** Industrial Automation Applications: Make the Decision Route Inspectable

**Working title tag:** Industrial Automation Applications — Coreweaver Labs

**Meta description:** A Coreweaver Labs guide to examining authority, signals, exceptions, and records across industrial automation applications.

The pillar should introduce industrial automation applications through the scope of industrial control systems: manufacturing, product handling, production, distribution, and control configurations such as SCADA, DCS, and PLC-based systems.[1] It should then identify the Coreweaver question: before a task becomes more delegated, can the relevant constraint, authorized owner, allowed evidence, intervention route, and retained record be named?

The narrative should proceed through four application fields: process control, material movement, monitoring and inspection, and operator handoffs. The five ARM controls—mandate chain, signal architecture, checkpoint recovery, graceful escalation, and audit sovereignty—should form the explanatory middle of the page and use a contextual link to the live [ARM primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives) route.

Every supporting page should link to the pillar in its first third, to ARM primitives in its explanatory middle, and to either the Coreweaver [source map](https://coreweaverlabs.com/source-map), [working principles](https://coreweaverlabs.com/mandate), or [verification limits](https://coreweaverlabs.com/vaas) in its closing. This creates a consistent reader route without repetitive keyword blocks.

## Earthward Foundry bridge boundary

The initial cluster should **not** place a public call to action toward Earthward Foundry. The intended reader flow is:

```text
Industrial automation application context
  → Coreweaver evidence and decision route
  → ARM primitives
  → Coreweaver working-session inquiry
  → separate, authorized Earthward Foundry implementation discussion
```

After written authorization is in place, the pillar can add one narrowly worded, externally linked implementation note. The note should state that Earthward Foundry is a separate implementation context for traceability and human handoffs in physical-work systems; it must not imply joint deployment, product availability, certification, or a transfer of operating responsibility. A reciprocal link from an Earthward Foundry documentation page to the Coreweaver pillar should use the same boundary language.

## Repository relationship options

| Option | What it would do | Current feasibility | Advantages | Blocking condition |
| --- | --- | --- | --- | --- |
| Contribute to upstream | Send discrete changes from the active fork to `earthwardholdings/earthward-foundry`. | **Blocked.** | Preserves the upstream as the public source of record. | Requires written authorization from Earthward Holdings and an agreed contribution path. |
| Create a CoreweaverLabs fork | Fork or mirror the active implementation under `CoreweaverLabs/earthward-foundry`. | **Blocked.** | Could centralize Coreweaver-managed stewardship and show the relationship in the organization inventory. | The active fork’s license prohibits copying, distribution, and modification without written permission. |
| Keep the active fork and establish a staged handoff | Treat `virtualmase/earthward-foundry` as the implementation line while Coreweaver owns the public content layer. | **Recommended now.** | Avoids an unauthorized duplicate while preserving the 13-commit implementation divergence. | Requires no code move; requires a documented ownership and review conversation before any cross-linking. |
| Create a new Coreweaver integration repository | Create a new, non-fork repository containing only original integration specifications and no proprietary Earthward code. | **Possible after scope review.** | Separates Coreweaver’s editorial, interface, and method contributions from Earthward code. | Must remain free of copied prompts, schemas, documents, and code; should follow written authorization if it names or depends on Earthward assets. |

## Recommended staged handoff

The recommended path is **staged collaboration, not a fork or contribution now**. Keep `virtualmase/earthward-foundry` as the active implementation line because it is 13 commits ahead of upstream and currently contains the hardening, test, CI, governance, and import-resilience work. Keep Coreweaver Labs responsible for the public content silo, the ARM method, and the explanation of application-level decision routes.

Before changing repository ownership, create a short written authorization and governance record with Earthward Holdings. It should identify the intended license or permission, the owner of code and derivative works, permitted contribution rights, review and merge authority, issue visibility, security-reporting path, and whether a future CoreweaverLabs repository would be a fork, a transfer, or an original integration repository. This is an operational and licensing prerequisite, not a public-content task.

Once authorization exists, choose the repository location based on the operating owner. If Earthward Holdings owns the product and physical-work implementation, move toward contribution to, or transfer into, an Earthward-controlled organization. If Coreweaver becomes the named implementation steward under an explicit license, an organization fork can be considered. If the relationship remains a bounded collaboration, retain the active fork and use a clean Coreweaver integration repository only for original, authorization-consistent interfaces and public method material.

## Release controls

The five content records should be created as Notion-backed drafts with `Status = draft`, `Release Mode = manual`, `Autopublish = false`, and a source-backed review record. Before manual publication, add distinct Open Graph and hero image values and verify every ARM link uses the live `#primitives` anchor. After the pillar is published, add one reciprocal contextual link from `/autonomous-resource-management` to the published pillar.

No repository move, fork, contribution, license change, cross-link, production content publication, or deployment is authorized by this plan.

## References

[1] [NIST, “industrial control system (ICS) — Glossary.”](https://csrc.nist.gov/glossary/term/industrial_control_system)

[2] [NIST, “Intelligent Systems Division.”](https://www.nist.gov/el/intelligent-systems-division-73500)

[3] [earthwardholdings/earthward-foundry](https://github.com/earthwardholdings/earthward-foundry)

[4] [virtualmase/earthward-foundry](https://github.com/virtualmase/earthward-foundry)

[5] [virtualmase/earthward-foundry LICENSE](https://github.com/virtualmase/earthward-foundry/blob/main/LICENSE)
