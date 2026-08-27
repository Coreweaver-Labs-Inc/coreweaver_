import { access } from 'node:fs/promises';
import { at, readJson, writeRun } from '../lib/io.mjs';

const REQUIRED_BY_KIND = {
  entity: ['entity_type', 'relationship_boundary'],
  intent: ['scope', 'non_goals', 'lifecycle_stage'],
  evidence: ['source_type', 'source_locator', 'checked_at', 'supports_statement', 'limit'],
  claim: ['claim_class', 'claim_text', 'evidence_ids', 'reviewer', 'release_status'],
  artifact: ['artifact_type', 'source_location', 'integrity_boundary'],
  decision: ['decision_owner', 'options', 'selected_option', 'rationale', 'approval_scope'],
  outcome: ['observation_window', 'method', 'observation', 'limit'],
  maintenance: ['maintained_record_id', 'recheck_trigger', 'next_action'],
};
const ALLOWED_KINDS = new Set(Object.keys(REQUIRED_BY_KIND));
const ID_PATTERN = /^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RELATIONSHIP_VERBS = new Set(['supports', 'limits', 'belongs_to', 'implements', 'governs', 'supersedes', 'maintains', 'observes', 'requires_approval_from']);
const manifest = await readJson('manifest.json');
const records = await readJson('records', 'starter-records.json');
const errors = [];
const warnings = [];

for (const path of [manifest.agent_entrypoint, manifest.authority_contract, manifest.contract_registry, manifest.migration_guide, ...Object.values(manifest.schema_registry)]) {
  try { await access(at(path)); } catch { errors.push(`Manifest path does not resolve: ${path}`); }
}
for (const [key, value] of Object.entries(manifest.safe_defaults)) if (value !== false) errors.push(`Safe default must remain false: ${key}`);
if (!Array.isArray(records) || records.length === 0) errors.push('Starter record collection is empty.');

const ids = new Set();
for (const record of records) {
  for (const key of ['id', 'kind', 'version', 'status', 'title', 'owner', 'created_at', 'updated_at', 'relationships']) if (!(key in record)) errors.push(`${record.id ?? 'unknown'} missing base field ${key}`);
  if (!ID_PATTERN.test(record.id ?? '')) errors.push(`${record.id ?? 'unknown'} has an invalid stable ID.`);
  if (ids.has(record.id)) errors.push(`Duplicate record ID: ${record.id}`); else ids.add(record.id);
  if (!ALLOWED_KINDS.has(record.kind)) errors.push(`${record.id} has an unknown kind: ${record.kind}`);
  for (const key of REQUIRED_BY_KIND[record.kind] ?? []) if (!(key in record)) errors.push(`${record.id} missing ${key}.`);
  if (record.kind === 'claim' && record.release_status !== 'held') errors.push(`${record.id} must remain held in the starter ledger.`);
  for (const relation of record.relationships ?? []) {
    if (!RELATIONSHIP_VERBS.has(relation.verb)) errors.push(`${record.id} uses unknown relationship verb: ${relation.verb}`);
    if (!ID_PATTERN.test(relation.target_id ?? '')) errors.push(`${record.id} has invalid relationship target.`);
  }
  if (record.status === 'unknown' || record.status === 'held') warnings.push(`${record.id} is intentionally not release-ready.`);
}
for (const record of records) for (const relation of record.relationships ?? []) if (!ids.has(relation.target_id)) errors.push(`${record.id} references missing target ${relation.target_id}.`);
const report = { valid: errors.length === 0, generated_at: new Date().toISOString(), manifest_id: manifest.id, record_count: records.length, errors, warnings, external_side_effects: false };
const output = await writeRun('validation.json', report);
console.log(JSON.stringify({ ...report, output }, null, 2));
if (errors.length) process.exitCode = 1;
