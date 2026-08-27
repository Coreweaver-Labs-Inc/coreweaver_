import { readJson, writeRun } from '../lib/io.mjs';

const records = await readJson('records', 'starter-records.json');
const queue = records.flatMap((record) => {
  const reasons = [];
  if (record.status === 'held') reasons.push('Record is held and has no release authority.');
  if (record.status === 'unknown') reasons.push('Record is intentionally unknown; no outcome may be inferred.');
  if (record.status === 'framed') reasons.push('Record is framed; it requires a named next decision before public use.');
  if (record.kind === 'claim' && record.release_status !== 'approved_for_specific_use') reasons.push('Claim is not approved for public use.');
  if (record.kind === 'outcome' && record.observation_window === 'Not yet started.') reasons.push('No approved observation window or method exists.');
  return reasons.length ? [{ record_id: record.id, status: 'hold', reasons, required_human_action: 'Review the stated evidence boundary and record a separate, named decision if any public-impact action is desired.' }] : [];
});
const report = { generated_at: new Date().toISOString(), record_count: records.length, exception_count: queue.length, release_ready_count: 0, queue, external_side_effects: false };
const output = await writeRun('exception-queue.json', report);
console.log(JSON.stringify({ ...report, output }, null, 2));
