# Same-Day Field Index Content Briefs

## Cluster purpose

The Field Index is the pillar: it helps a technical, procurement, or operational reader inspect documented agentic-AI infrastructure records. The supporting pages turn that research context into a practical decision tool. They do not recommend a vendor, certify a system, state product performance, or promise commercial outcomes.

| Asset | Audience and moment | Primary question | Unique contribution | Evidence boundary | Single next action |
|---|---|---|---|---|---|
| `/field-index/evaluate-agent-systems` | A technical or operational lead evaluating an agent system before a pilot, procurement, or integration. | “What evidence should I ask for before I allow an agent to act on data, tools, or workflow?” | A constrained six-part evidence frame tied to a source-led field reference, with distinction between documentation and proof. | The page is a Coreweaver Field Index framework; NIST, OWASP, and AAIF sources are context, not proof that a particular system is safe or suitable. | Use the worksheet. |
| `/field-index/evidence-review-worksheet` | A reader preparing a system-evaluation meeting or internal review. | “How can I capture the missing evidence and unresolved risks in one usable record?” | A printable, non-submitted review worksheet that separates evidence, owner, limitation, and next decision. | It is a template, not a security audit, procurement rule, compliance assessment, or decision automation. | Complete the worksheet and request missing evidence. |
| `/field-index/guides` | A reader arriving from search or a shared link. | “What can I use from this Field Index?” | A compact resource navigation page that preserves the Index’s anti-directory, anti-certification boundary. | Lists only developed Field Index resources. | Choose the guide matching the reader’s immediate decision. |

## Evidence and claim map

| Page statement | Class | Source or basis | Limit |
|---|---|---|---|
| NIST’s AI RMF is a voluntary framework intended to support trustworthiness considerations in AI products, services, and systems. | Third-party fact | NIST AI RMF overview, checked 2026-08-27. | It is not an assertion of compliance or a recommendation for a particular deployment. |
| OWASP’s Agentic Security Initiative publishes a threat-model-based reference of emerging agentic threats and mitigations. | Third-party fact | OWASP “Agentic AI — Threats and Mitigations,” checked 2026-08-27. | It does not establish the safety of any product or implementation. |
| AAIF publishes open-source agentic projects such as MCP, A2A, AGENTS.md, goose, and agentgateway. | Third-party fact | AAIF projects page, checked 2026-08-27. | Project listing does not imply endorsement, maturity, suitability, affiliation, or security. |
| The six-part evidence frame is a Coreweaver Field Index proposal. | Framework | This content brief. | It is not an audit, certification, legal standard, or guarantee. |

## Silo linking rule

Each supporting page links to the Field Index in its first third, links contextually to the methodology or editorial policy, and provides a single reader-oriented next action. The Field Index hub links to the guides resource page; no link uses a keyword-only anchor or points to unpublished content.

## Asset and distribution plan

No new visual asset is required. The guide uses an accessible HTML evidence table; the worksheet is a semantic, printable HTML form with no submission action or data storage. No automatic social, email, or CMS derivative is created. Any later derivative must link to this guide and add a distinct reader benefit.

## Owner and review requirement

Coreweaver Labs must assign an accountable content owner and human reviewer before publication. Recheck external sources within six months or earlier if the linked material changes. The pages must not be published by an automated workflow.

## Validation record

The content contract validator passed on 2026-08-27. An isolated Astro build generated the guides hub, evaluation guide, and printable worksheet successfully; canonical routes, `records.json`, and `sitemap.xml` returned `200` in the local exact-build smoke test. axe-core found no violation groups on the three new routes. A three-route Lighthouse lab audit averaged 93 performance, 100 accessibility, 100 best practices, and 92 SEO before the malformed nonstandard `llms-txt` robots directive was removed. The follow-up Lighthouse run found no SEO-category issue after that correction. The branch preview generated from commit `4d38b6d46d5c820603ff183359dde560f2feb069` is ready at `https://coreweaver-labs-3kxrgxn45-coreweaver-labs.vercel.app`; it is non-production and may require authorized Vercel preview access.

## Sources

[1]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"

[2]: https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/ "OWASP: Agentic AI — Threats and Mitigations"

[3]: https://aaif.io/projects "Agentic AI Foundation projects"
