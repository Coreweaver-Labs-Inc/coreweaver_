# Coreweaver × Swell Fork Compatibility Review

**Reviewed:** 2026-08-21  
**Source examined:** `CoreweaverLabs/swell` at `f3a5a9f`  
**Decision:** **Adopt narrowly — public evidence-state pattern and source-record structure only.**

## What the fork is

The fork is a React, tRPC, and database-backed campaign hub for a Swell Marketing consultative funnel. Its own operating contract makes the distinction clear: public pages can describe a diagnostic, scope, evidence register, review method, and private next step, but must not assert rankings, citations, third-party model behavior, lead volume, conversion, sales, revenue, or automated outreach. Its public evidence and performance modules keep their collections empty until a publication-approved source record exists.

The package manifest declares `MIT`, while the public GitHub repository currently exposes no repository-level license record. Coreweaver may therefore learn from the pattern and reimplement it natively, but should not copy source wholesale or imply an inherited repository license without resolving that top-level ambiguity.

## Compatibility decision

| Fork pattern | Coreweaver decision | Reason |
| --- | --- | --- |
| Explicit **awaiting verification** state | **Adopt** | Reinforces Coreweaver’s public claim boundary and requires no private data or outcome claim. |
| Public source record fields: source, scope, window, reviewed state | **Adopt** | Matches the existing Coreweaver source map and makes future proof publication inspectable. |
| Controlled empty state when no record is authorized | **Adopt** | Prevents placeholder case studies, invented results, and decorative metrics. |
| Observe → Prove → Decide → Learn operating sequence | **Adapt** | The underlying review loop is compatible; retain Coreweaver’s Map → Decide → Build → Review language rather than duplicating Swell campaign copy. |
| Campaign UTM routes, HubSpot booking, pricing, and offers | **Reject** | Swell-specific commercial flow and tracking taxonomy; Coreweaver remains a mailto-only working-session surface. |
| Meta Pixel, event dispatch, and performance dashboard | **Defer** | Useful only after Coreweaver defines consent, retention, measurement owner, reporting source, and publication review policy. No analytics integration in this release. |
| Revenue-control board, private collections, and onboarding state | **Reject** | Private Swell operating infrastructure; it does not belong in the public Coreweaver flagship. |
| Testimonials, case evidence, or performance results | **Reject unless separately authorized** | The fork currently holds no approved public evidence records, and no Swell result becomes Coreweaver proof by association. |

## Approved implementation slice

Add a small, static **Evidence publication status** panel to Coreweaver’s public source map. In this release it will be explicitly empty and will state that a future record must name a controlled public source, scope, reporting window where relevant, reviewer, and publication approval. It will not name clients, display metrics, promise results, initiate tracking, or introduce an intake form.

This is a native Astro implementation inspired by the fork’s operating discipline, not a code import. It preserves Coreweaver’s brass-and-teal system, map-first information architecture, existing mailto-only conversion path, and no-certification boundary.
