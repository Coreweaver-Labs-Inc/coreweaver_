# Portable Content Operating Model

## Purpose

This operating model makes Coreweaver content **portable, inspectable, and quality-constrained**. It converts a page from a vague publishing task into a release candidate with a reader question, a single next action, claim classes, source limits, review date, maintenance date, static source location, and a future rollback statement.

It is deliberately not a bulk-content generator, an AI-writing loop, a CMS client, a social scheduler, or a deployment tool. A self-improving operation should improve the quality of its questions, source coverage, and exception handling—not increase the confidence or volume of unsupported claims.

## Operational Flow

| Stage | Portable input / output | Deterministic control | Human or separately approved action |
| --- | --- | --- | --- |
| Portfolio | `content-learning/input/release-candidates.json` | Every item needs a distinct reader question, one next action, one content class, and a source-file location. | Decide whether a new reader question is worth creating. |
| Claim check | Candidate claim map | Facts and interpretations need HTTPS sources; every material statement needs a limitation. | Judge source credibility, scope, and wording. |
| Quality check | `validate-release-candidates.mjs` report | Review date, recheck date, reviewer, canonical route, deployment target state, and rollback note are checked. | Resolve any `hold` or `needs-decision` item. |
| Build | Static site source | Build and route checks confirm the candidate can be generated without a CMS or provider integration. | Approve a specific release target and change set. |
| Release | Provider-neutral static artifact | The content inventory never names or contacts a provider. | A named owner authorizes the exact host, route, deployment, and rollback. |
| Learn | Versioned outcome record and exception queue | Observations stay separate from causal performance claims. | Review outcomes, change a rule, or retire a stale claim. |

## Quality Standard

A release candidate is useful only when it has a distinct reader question, an original framework or analysis, an inspectable source boundary, a clear non-goal, working internal links, canonical metadata, a single next action, and a maintenance date. Existing content that lacks these properties is not a model for more volume; it is an exception queue.

The validator categorizes an item as `hold` when a required quality condition fails. A candidate that satisfies deterministic conditions is only `needs-decision`. The report intentionally never produces a `release-ready` authorization, because static validation cannot choose a host, assess account access, or determine whether the current public effect is appropriate.

## Portable Hosting Boundary

The static artifact can be served by any ordinary HTTPS host that accepts a built site and supports immutable releases and rollback. Vercel is not encoded in this content operation. Migration away from Vercel therefore consists of selecting an owned target, establishing an immutable deploy path, recording the host-specific rollback method, and moving one noncanonical pilot route before changing any root-domain or nameserver configuration.

The candidate inventory keeps `deploymentTarget` as `unassigned`. That is intentional: a page remains portable until a named owner explicitly selects a target, exact hostname, certificate method, deployment credentials, and rollback origin. This protects portability without silently converting a local candidate into a public launch.

## Current Candidate Set

The initial portfolio comprises the existing Field Index evaluation guide, evidence-review worksheet, and guides hub. Their role is to demonstrate the quality process. The correction-record guide and working-session route are separate review-branch artifacts until their pull requests and public-release destinations are intentionally resolved.
