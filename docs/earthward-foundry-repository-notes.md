# Earthward Foundry repository notes

## Observed repository relationship

The upstream repository, `earthwardholdings/earthward-foundry`, presents an agent-fleet scaffold organized around eight manufacturing and stewardship houses. Its public operating rules require named human sign-off for irreversible or safety-, quality-, or spend-relevant actions, explicit reporting of uncertainty or failure, real standards rather than invented certifications, and named escalation paths.

The current fork, `virtualmase/earthward-foundry`, is a public fork that is **13 commits ahead** of the upstream main branch. Its visible additions include service hardening, tests, CI, Docker, governance material, structured logging, workspace-import contracts, and migration material. It should therefore be treated as the active implementation line, not as a disposable mirror of upstream.

The `CoreweaverLabs` organization currently contains six public repositories, including multiple forks and `autonomousresourcemanagement`. It does not currently show an Earthward Foundry fork.

## Licensing constraint

The active fork’s `LICENSE` states that the repository is proprietary and confidential, and that no part may be used, copied, modified, merged, published, distributed, sublicensed, or sold without prior written permission from Earthward Holdings. It also states that public visibility is not a license grant. This means a CoreweaverLabs fork, mirror, contribution, or reuse of the code is blocked unless Earthward Holdings provides written authorization that specifically covers the intended relationship.

## Initial implication

The industrial automation applications silo should remain a Coreweaver Labs editorial and decision-infrastructure surface. It may refer to an Earthward Foundry implementation only through a clearly labeled boundary: Coreweaver explains application-level decision routes; Earthward Foundry contains an agent-fleet and traceability implementation for physical-work contexts. The silo should not claim that the implementation is deployed, certified, or operates industrial equipment.

## Sources

- [earthwardholdings/earthward-foundry](https://github.com/earthwardholdings/earthward-foundry)
- [virtualmase/earthward-foundry](https://github.com/virtualmase/earthward-foundry)
- [virtualmase/earthward-foundry LICENSE](https://github.com/virtualmase/earthward-foundry/blob/main/LICENSE)
- [CoreweaverLabs repositories](https://github.com/CoreweaverLabs?tab=repositories)
