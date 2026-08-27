import { readJson, writeRun } from '../lib/io.mjs';

const manifest = await readJson('manifest.json');
const records = await readJson('records', 'starter-records.json');
const view = {
  generated_at: new Date().toISOString(),
  title: manifest.name, version: manifest.version, purpose: 'Local derived operator view; source records remain canonical.',
  safe_defaults: manifest.safe_defaults,
  counts_by_kind: Object.fromEntries([...new Set(records.map((record) => record.kind))].sort().map((kind) => [kind, records.filter((record) => record.kind === kind).length])),
  records: records.map(({ id, kind, status, title, owner, relationships }) => ({ id, kind, status, title, owner, relationships }))
};
const output = await writeRun('operator-view.json', view);
console.log(JSON.stringify({ output, record_count: records.length, external_side_effects: false }, null, 2));
