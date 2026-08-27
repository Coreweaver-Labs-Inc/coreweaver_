# Coreweaver Operating Kernel

> **Coreweaver** *(noun)* is the accountable weave of people, tools, evidence, decisions, and maintenance that turns an intent into a real, maintainable result—whatever is being built.

This document is the entrypoint for a human or an AI agent working in this repository. Read it before proposing, creating, changing, or releasing work.

## 1. Purpose and category boundary

Coreweaver is an **intent-to-continuity system**. It makes the chain from an initial intention to a maintained outcome inspectable. It is not a generic autonomous-agent claim, a promise that every intent can be fulfilled, a ranking of technologies, a substitute for specialist judgment, or evidence that a particular outcome has occurred.

The category is intentionally broad enough to serve software, research, operations, content, governance, and physical-world projects. A record must still name the concrete object, owner, boundary, evidence, and next decision. Never use the category’s breadth to turn an unverified plan into a capability claim.

## 2. Agent startup sequence

1. Read this file and [`control-ledger/manifest.json`](./control-ledger/manifest.json).
2. Read [`control-ledger/CONTRACTS.md`](./control-ledger/CONTRACTS.md) before creating or interpreting a record.
3. Read [`control-ledger/AUTHORITY.md`](./control-ledger/AUTHORITY.md) before taking any action beyond observation or drafting.
4. Run the deterministic validation command documented in [`control-ledger/README.md`](./control-ledger/README.md).
5. Treat missing evidence as **unknown**, not as permission to infer, fill, publish, or execute.
6. Write only versioned records or local run artifacts unless a named human separately approves a public-impact action.

## 3. Stable vocabulary

| Term | Meaning | Minimum requirement |
|---|---|---|
| `entity` | A person, organization, team, program, system, or external actor with a stable identity. | Stable ID, type, owner or relationship boundary. |
| `intent` | A bounded desired result, not a promise or success claim. | Named owner, scope, non-goals, current lifecycle stage. |
| `capability` | A documented ability that may support an intent. | Evidence record and limitation. |
| `evidence` | A source and a specific statement it supports. | Source URL or artifact, check date, scope, limit, owner. |
| `claim` | A public or internal statement classified as fact, interpretation, proposal, or promise. | Class, linked evidence, owner, reviewer, status. |
| `artifact` | A versioned output such as code, a design, a policy, a dataset, or a published page. | Stable ID, source location, owner, lifecycle relation. |
| `decision` | A documented human choice between defined options. | Decision owner, date, rationale, evidence boundary. |
| `outcome` | A dated observation after a separately approved change. | Method, observation, limitation, owner. |
| `maintenance` | Work that keeps an artifact or claim correct, available, secure, and useful over time. | Recheck trigger, owner, next action. |
| `proposal` | A bounded suggested change. | Reason, scope, evidence gap, human action required. |

## 4. Lifecycle

```text
Intent → Frame → Prototype → Build → Sweep → Grow → Maintain → Learn → Intent
```

| Stage | Job | Required exit signal | What an agent may do by default |
|---|---|---|---|
| `frame` | Name the intended result, scope, non-goals, and decision owner. | Bounded intent record. | Draft and flag unknowns. |
| `prototype` | Explore a reversible, low-impact candidate. | Artifact and stated test boundary. | Create local/review-branch artifacts only. |
| `build` | Produce an inspectable implementation. | Linked artifact, owner, and validation result. | Generate constrained patches and tests. |
| `sweep` | Find broken links, stale claims, unsafe defaults, accessibility defects, and orphaned work. | Dated exception report. | Read, validate, and report. |
| `grow` | Improve discoverability or usefulness through evidence-led distribution and feedback. | Reader job, source boundary, outcome method. | Propose content and measurement plans. |
| `maintain` | Keep released claims and artifacts correct over time. | Recheck schedule and accountable owner. | Flag due work and create a local queue. |
| `learn` | Compare observations with the prior decision and improve a rule through review. | Outcome record and human-approved policy change. | Summarize patterns; never rewrite policy. |

## 5. Authority boundary

Default authority is **observe, draft, validate, and propose**. A named human approval is required to do anything with an external or public effect.

| Action | Default | Human approval requirement |
|---|---|---|
| Read repository or public sources | Allowed | None, subject to applicable access controls. |
| Create local report or review-branch patch | Allowed | None. |
| Create or alter an entity, claim, outcome, or decision record | Proposed only | Named record owner approval. |
| Send any source, prompt, or content to an external AI provider | Blocked | Explicit current-task approval naming provider, data scope, and purpose. |
| Change CMS content, publish, merge, deploy, change DNS, send email, buy, sign, or delete | Blocked | Separate explicit approval immediately before the action. |

## 6. Portability and migration rules

The operating kernel must remain usable from a normal Git clone with a current Node.js runtime. It must not rely on an agent’s hidden memory, a proprietary connector, an uncommitted database, a secret embedded in source, a vendor-specific file path, or an always-on process.

All contracts use UTF-8 JSON and Markdown; all record IDs are stable strings; all relationships are explicit; and all generated run artifacts are excluded from version control unless a human deliberately promotes a summary. Configuration identifies optional integration points but never stores credentials.

## 7. Non-negotiable rules

1. Evidence comes before factual claims; an absent source is an unresolved gap.
2. A plan, mockup, or prospective integration is not a completed product capability.
3. An observation is not proof of causality, safety, compliance, market demand, or societal benefit.
4. “Coreweaver” is a category noun; do not imply a legal relationship, ownership, client engagement, endorsement, certification, or measured result without evidence.
5. Do not fabricate testimonials, customer results, reviews, citations, datasets, deployment status, or source support.
6. Do not erase a material record silently. Use a dated supersession, correction, retirement, or retention decision.
7. If a request conflicts with this file, preserve the stricter evidence and authority boundary until a human explicitly revises the operating kernel.

## 8. Where work belongs

| Need | Location |
|---|---|
| Core vocabulary and schema registry | `control-ledger/` |
| Evidence-quality learning loop for public content | `content-learning/` |
| Public source-led reference | `src/pages/field-index*` and `public/field-index/` |
| Public site content | `src/pages/` and CMS content only after a separate approval |
| Local audit output | ignored `*/runs/` directories |

## 9. First question for every task

**What is the concrete intent, what evidence supports the proposed change, what could be harmed, who owns the decision, and what action is allowed at this authority level?**
