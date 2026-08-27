# Coreweaver autonomy ladder

## Objective

Coreweaver should become autonomous in **preparation, verification, and learning** before it becomes autonomous in public action. The operating objective is not to remove people from important decisions. It is to remove repeated administration, preserve evidence, surface the next best decision, and create reviewable work packets before a person needs to intervene.

> **Working definition:** Coreweaver is autonomous when a worker can independently perform a bounded job, record its evidence and result, stop at a known limit, and escalate a specific human decision without hiding its reasoning or causing external consequences.

## Current maturity

| Capability | Present condition | Autonomy level | Required next evidence |
| --- | --- | --- | --- |
| Content work record | Coreweaver Ops stores work items, source records, claims, assets, approvals, opportunity notes, and operating runs. | Recorded | Demonstrate repeated use across a single content cluster. |
| Evidence refresh | A protected weekly source-refresh job is enabled for Mondays at 09:00 UTC. | Configured | Obtain a successful production-run log; current execution history is empty. |
| Content planning | Content briefs, entity mapping, ARM linking, claim maps, and media rules are documented. | Prepared | Generate a standardized review packet from the workspace state. |
| Approval control | Scope, evidence, media, release, and commercial gates are explicit and manual. | Governed | Confirm that workers cannot advance a public action through a missing or blocked gate. |
| Short-form media | The evidence-led short-video skill and Industrial Automation Applications pilot are prepared. | Designed | Complete evidence/media review and manually release one approved pilot. |
| External relationships | Earthward Foundry work remains authorization-gated. | Restricted | Written rights and governance authorization before any public relationship or code action. |

## The autonomy ladder

| Level | Worker behavior | Human role | Allowed Coreweaver use | Explicitly excluded |
| --- | --- | --- | --- | --- |
| 0. Record | Stores work and evidence. | Creates and reviews records. | Work items, sources, claims, assets, approvals. | Any inference of readiness or external action. |
| 1. Detect | Finds deterministic conditions such as stale sources, incomplete asset fields, or pending gates. | Receives a clear exception list. | Source refresh, link/field completeness checks, due-date flags. | Rewriting content or changing a public surface. |
| 2. Prepare | Creates a bounded review pack from approved inputs. | Selects the next work item and approves the packet. | Candidate briefs, source summaries, claim-map skeletons, metadata drafts, short-video scripts, release checklists. | Publishing, outbound messages, offers, or partner assertions. |
| 3. Propose | Ranks next work based on declared rules and evidence. | Accepts, rejects, or revises a recommendation. | Content-backlog ranking, source-recheck priorities, media derivative suggestions, inbound-context briefs. | Changes to strategy, pricing, contracts, or commitments. |
| 4. Execute internally | Carries out reversible, non-consequential internal operations. | Audits runs and resolves exceptions. | Mark due records, create internal review packs, maintain run logs, assemble Notion-ready fields. | Notion publication, social scheduling, email, CRM updates, or public site changes. |
| 5. Delegated external action | Performs an approved external action under narrowly scoped permissions. | Pre-approves each action class and audits every action. | Potentially a platform draft upload or a pre-approved scheduling queue. | Unattended publishing, direct outreach, negotiations, payments, legal/security claims, partner/code actions. |

Coreweaver is currently between **Levels 0 and 1**, with selected Level 2 assets designed but not yet run through a repeated operating cycle. The next target is Level 2: reliably preparing a review packet from a real work item without creating or modifying a public artifact.

## Autonomous worker cells

Each worker has a single job, a small permission set, a record of its run, and a stop condition. Do not build a general “agent swarm.” It would obscure accountability and generate work that cannot be reviewed efficiently.

| Worker | Input | Autonomous output | Stop condition | Escalates to |
| --- | --- | --- | --- | --- |
| Evidence sentinel | Source recheck dates and work-item ownership. | Marks due records, creates an operating-run log, and identifies affected work items. | Missing owner, missing source URL, or a failed source check. | Evidence steward. |
| Readiness verifier | Work-item fields, claim records, asset records, and approval state. | A deterministic status card that lists incomplete gates, stale evidence, missing links, and unresolved rights. | Any blocked claim, missing required gate, or restricted asset. | Method editor or release owner. |
| Review-pack assembler | A selected work item with cleared preparation prerequisites. | A bounded packet: content brief, claim map, source list, internal-link contract, asset list, metadata draft, and outstanding decisions. | Evidence not current or public-action gate not approved. | Portfolio steward. |
| Derivative planner | Approved parent page and content job. | One proposed social or short-video brief with script, storyboard, asset requirements, and CTA. | Parent is unreviewed, asset rights unclear, or a promise appears in the script. | Media producer. |
| Learning recorder | Human-released URL, real inbound context, and observed response. | Links the observation to a parent route and prepares a question for the weekly backlog review. | No real source observation or unverified identity/context. | Relationship representative. |

## Permission model and stop conditions

Workers use **deny by default** permissions. They may write only to the Coreweaver Ops database and may create internal, reviewable artifacts. They may read approved project documents and source records. They cannot access social accounts, Notion publication commands, public-site deployment controls, email sending, payment tools, customer systems, or Earthward-related repositories unless a separate, written authorization explicitly widens the boundary.

The following conditions force a stop rather than a best guess: an unsupported fact; a promise/outcome claim; an unknown or stale source; a missing asset-rights record; a blocked approval; a missing canonical destination; a relationship/brand reference without authorization; a request to publish or contact a person; or a conflict between worker output and the work item’s claim boundary.

## Next autonomous preparation build

Build the **Readiness Verifier and Review-Pack Assembler** inside Coreweaver Ops. It is the highest-leverage next component because it turns the existing data model into a recurring, inspectable decision loop without adding a new external connector.

### Input and output contract

| Input | Deterministic check | Internal output |
| --- | --- | --- |
| Work item | Required title, reader question, claim boundary, owner, canonical route, and ARM-link contract are present. | Completeness status and missing fields. |
| Sources | URL, source type, check date, recheck date, and freshness state are present and current. | Freshness exceptions and a source-review queue. |
| Claims | Each material statement has a classification; promise records are blocked unless specifically authorized. | Claim-risk list and required reviewer. |
| Assets | Role, source/creator, rights state, provenance state, and alt text are present. | Asset readiness status and rights exceptions. |
| Approvals | Scope, evidence, media, release, and commercial decisions are visible. | Gate matrix and next named reviewer. |
| Internal links | Parent/pillar route and ARM primitives destination are recorded. | Link-review list; never modifies a public route. |

The assembler runs only when the verifier identifies no blocking condition. It produces a review pack and a run log. It must not change content state to `release_ready`, create a Notion post, publish a site, send a message, or schedule media. A human must change any stage that has an external consequence.

## Verification criteria

Before calling the next build autonomous, prove the following with the Industrial Automation Applications work item:

| Test | Passing condition |
| --- | --- |
| Idempotency | A repeated run does not create duplicate review packs or duplicate operating-run side effects. |
| Ownership | A worker cannot read or alter another owner’s work item. |
| Boundary test | A work item with a blocked claim, stale source, or pending release gate is stopped and names the reason. |
| Positive test | A complete, current, manual-release work item produces one review pack with named human decisions. |
| Non-action test | The run produces no public-site request, Notion publication, social post, email, CRM record, or commercial commitment. |
| Audit test | The workspace records the inputs checked, time, outcome, and exception path. |

## Options for the next step

| Option | What becomes autonomous | Tradeoffs | Setup complexity |
| --- | --- | --- |
| A. Readiness verifier and review-pack assembler | Deterministic validation and internal packet assembly for the Industrial Automation Applications work item. | Lowest external risk; does not yet conduct fresh research or generate narrative drafts. | Low to medium; extends the existing Coreweaver Ops workspace. |
| B. Weekly supervised content director | A weekly AI-assisted run proposes one next work item, source-recheck priorities, and a draft brief for human selection. | Brings more judgment and topical synthesis; produces recommendations that still need close editorial review. | Low to medium; uses the current task flow at a low cadence. |
| C. Combined supervised operating loop | A verifier prepares an internal packet, then a weekly AI-assisted director ranks and develops the cleared item. | Closest to a self-improving content loop; needs clear metrics, twice-weekly review, and stable data before it is trusted. | Medium; combine A and B only after A passes the verification criteria. |

Start with **Option A**, validate it for two work items, then add Option B. Option C is the target operating loop, not the first implementation. No option authorizes automated external publishing, outreach, pricing, or relationship representation.
