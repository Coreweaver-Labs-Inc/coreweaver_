# Earthward Foundry cross-link and CoreweaverLabs strategy

## Rights and operating boundary

The public `virtualmase/earthward-foundry` repository has a proprietary license that requires prior written permission from Earthward Holdings before its code, prompts, schemas, documentation, or configuration can be copied, modified, merged, published, distributed, sublicensed, or sold. Public visibility does not itself grant those rights. Therefore, the strategy below is a conditional operating plan—not authorization to fork, mirror, contribute, copy, or reuse any Earthward Foundry material.

Coreweaver’s public role should remain distinct. Coreweaver publishes the industrial automation decision-route framework and links readers to the ARM method. Earthward Foundry, if the owner approves a relationship, can be described as a separately governed implementation context for traceability and human handoffs in physical-work systems. Neither site should imply that the other party operates equipment, owns a deployed joint product, supplies certification, or transfers operating responsibility.

## Cross-link integration sequence

| Stage | Coreweaver action | Earthward Foundry action | Preconditions |
| --- | --- | --- | --- |
| 0. Current | No Earthward link in public industrial content. Keep the content cluster focused on ARM and Coreweaver boundaries. | No required change. | No written rights authorization. |
| 1. Authorization | Add a narrowly worded external implementation-context note to the industrial automation pillar. | Add a reciprocal documentation link to the Coreweaver pillar or ARM primitives. | Written permission for public reference and defined review owner. |
| 2. Documented collaboration | Link to a designated Earthward documentation page, never to an unstated product claim. | Link to the Coreweaver method page using the same boundary language. | Agreed copy, URL, security contact, and change-review path. |
| 3. Repository stewardship | Mention the implementation repository only after its ownership and license relationship are clear. | Publish a repository ownership and contribution guide. | Explicit contribution/fork/transfer terms and licensed repository state. |

## Draft public cross-link copy

The following text is **not for publication until Stage 1 is authorized**.

### Coreweaver industrial-automation pillar note

> **Implementation context.** Earthward Foundry is separately maintained as a traceability and human-handoff implementation context for physical-work systems. It is not a Coreweaver product, a certification, or evidence that Coreweaver operates industrial equipment. Where an authorized collaboration is relevant, its documentation can be reviewed separately.

The link target should be an owner-approved Earthward documentation page, not a repository home page, a live service, or an unqualified product claim. The note should sit after the ARM primitives section and before the final Coreweaver working-session invitation.

### Earthward Foundry documentation note

> **Method context.** For a public framework for examining authority, evidence, escalation, and retained records around an operational decision, see Coreweaver Labs’ [Autonomous Resource Management primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives). This reference describes a method boundary; it does not transfer responsibility for Earthward Foundry operations.

The cross-link should point to the `#primitives` anchor, not simply the ARM root, because it brings the reader to the relevant decision-control explanation.

## CoreweaverLabs repository strategy

### Current recommendation: do not create a fork

Do not create `CoreweaverLabs/earthward-foundry` now. The active `virtualmase/earthward-foundry` line is 13 commits ahead of its upstream and carries a proprietary license. A CoreweaverLabs fork or mirror would duplicate a codebase without an identified permission or a documented operating owner.

### Authorization gate

Before changing repository placement, obtain a written authorization and governance record that answers the following questions in full sentences: What license or permission covers the intended action? Who owns existing and derivative work? May CoreweaverLabs fork, mirror, contribute, or host issues? Which organization owns merge authority and security reports? Can a public repository carry the approved license? Which party approves public cross-link text and future changes?

### Decision path after authorization

| Operating owner after authorization | Recommended repository path | Rationale |
| --- | --- | --- |
| Earthward Holdings owns the physical-work product and implementation | Contribute through the active fork or a designated Earthward repository. | Keeps product ownership, merge authority, and release accountability with the operating owner. |
| CoreweaverLabs becomes an explicit implementation steward under an approved license | Create or transfer to `CoreweaverLabs/earthward-foundry` with the written license and governance files at the root. | Makes the organization’s stewardship visible only after it has the legal and operational basis to do so. |
| The relationship remains a bounded collaboration | Keep the active fork in place and create a new, non-fork CoreweaverLabs repository for original integration specifications only. | Separates Coreweaver method/interface work from proprietary Earthward material. |

## Clean integration repository specification

If the third path is chosen after authorization, use a name such as `CoreweaverLabs/earthward-method-integration` rather than `earthward-foundry`. It should contain only original Coreweaver-owned material: interface requirements, public method mappings, issue templates, a collaboration record, link-review rules, and testable integration contracts. It must not contain copied Earthward code, agent prompts, schemas, documentation, configuration, or histories unless the written license expressly permits each category.

## Change-control checklist

Any later cross-link or repository action should be reviewed by the named rights owner and the named technical owner. The review should verify the exact target URL, public claims, license state, ownership statement, security contact, issue visibility, and rollback route. A request for a fork, repository transfer, or contribution should be a separate, explicitly confirmed action after the rights record exists.

## Sources

- [Earthward Foundry upstream repository](https://github.com/earthwardholdings/earthward-foundry)
- [Active virtualmase Earthward Foundry fork](https://github.com/virtualmase/earthward-foundry)
- [Active fork license](https://github.com/virtualmase/earthward-foundry/blob/main/LICENSE)
- [Autonomous Resource Management primitives](https://coreweaverlabs.com/autonomous-resource-management#primitives)
