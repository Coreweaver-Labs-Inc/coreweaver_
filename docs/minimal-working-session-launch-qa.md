# Minimal Working-Session Launch QA

**Artifact:** `src/pages/working-session.astro` and connected Coreweaver entry points  
**Review branch:** `feat/minimal-working-session-launch`  
**Validation date:** 2026-08-27  
**Authority level:** Build and validate only. This record does not approve publishing, merging, deployment, external email, DNS, or commercial terms.

## Scope

The review-branch route explains a human-led Coreweaver working session, its inputs, its bounded decision packet, and its explicit non-promises. The home page, header, footer, source map, sitemap, and `llms.txt` point visitors to this route instead of routing immediately into an unstructured mailto action. The working-session page retains an email-based request path with a prefilled scope prompt and a reminder not to share unauthorized material.

## Validation Record

| Check | Result | Evidence / limitation |
| --- | --- | --- |
| Static production build | Passed | `npm run build` generated 14 static routes, including `/working-session/`. The local build used an empty Notion response because local Notion credentials were not present; that is expected and does not validate blog content. |
| Control-ledger validation | Passed with existing baseline warning | `npm run ledger:validate` reported nine records, no errors, and the existing intentional baseline-outcome warning. |
| Ledger tests | Passed | `npm run test:ledger` passed six tests. |
| Diff hygiene | Passed | `git diff --check` returned no whitespace errors. |
| Desktop route preview | Passed | Temporary local preview rendered the working-session route with the existing portable-interface hierarchy, visible CTAs, source boundary, and ARM-context link. |
| Critical link/control check | Passed | Preview reported title `Working session — Coreweaver Labs`, canonical `https://coreweaverlabs.com/working-session`, a mail request path, the `/autonomous-resource-management#primitives` link, and the `/source-map` link. |
| Horizontal overflow at desktop | Passed | Preview reported client width and scroll width both as 1265 pixels. |
| Public deployment | Not performed | The route has not been merged, deployed, or published. The current production system remains an external-impact boundary requiring a named decision and exact target. |

## Remaining Gate

The next permissible action is a review pull request containing the route, inventory links, held control-ledger record, and this QA report. Merge and deployment require their own current approvals; deployment should not be inferred from this local validation.
