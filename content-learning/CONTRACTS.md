# Content Learning Record Contracts

## Evidence record

An evidence record is a source description, not an authority badge. It must identify a current HTTPS source, what the source directly supports, its limitation, the person responsible for entering it, and when it was checked.

```json
{
  "id": "source-example",
  "url": "https://example.org/source",
  "title": "Source title",
  "publisher": "Publisher",
  "sourceType": "primary-public",
  "checkedOn": "2026-08-27",
  "supports": ["A bounded statement this source directly supports."],
  "limitation": "What the source cannot establish.",
  "enteredBy": "Named accountable person"
}
```

## Claim ledger

Every material statement is a fact, interpretation, proposal, or promise. Promises are intentionally not eligible for release through this loop.

```json
{
  "id": "claim-example",
  "statement": "A bounded public statement.",
  "claimClass": "third_party_fact",
  "sourceIds": ["source-example", "source-second"],
  "limitation": "What the statement does not establish.",
  "timeSensitive": true,
  "recheckBy": "2026-11-27",
  "accountableOwner": "Named owner",
  "reviewedBy": "Named human reviewer"
}
```

## Proposal record

A proposal does not contain draft public copy. It identifies one narrow action and the evidence needed to approve that action.

```json
{
  "id": "proposal-example",
  "target": "/blog/example",
  "action": "hold",
  "reason": "Missing public source links and reviewer.",
  "requiredEvidence": ["A public primary source", "Named reviewer"],
  "approvalRequired": true,
  "status": "proposed"
}
```

## Outcome record

Outcomes are append-only observations. They may record what occurred and how it was measured, but may not claim that a content change caused an outcome.

```json
{
  "id": "outcome-example",
  "releaseId": "manual-release-id",
  "observedAt": "2026-09-27",
  "collectionMethod": "Owner-reviewed aggregate analytics export",
  "observation": "Readers used the linked template page.",
  "limitation": "No causal attribution or representative-user claim is made.",
  "enteredBy": "Named accountable person"
}
```

## Queue states

| State | Meaning | Permitted system action |
|---|---|---|
| `hold` | A source, boundary, reviewer, or recheck requirement fails. | Write a report only. |
| `needs-decision` | A fully evidenced, validated action has a decision awaiting. | Write a report only. |
| `observe` | A released item is due for review or has an outcome record. | Write a report only. |
| `release-ready` | A record satisfies deterministic requirements. | Never publish; wait for an explicit separate approval. |
