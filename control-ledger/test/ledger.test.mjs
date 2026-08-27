import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const scriptPath = (file) => fileURLToPath(new URL(`../scripts/${file}`, import.meta.url));
const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url));
const run = (file) => execFileSync(process.execPath, [scriptPath(file)], { cwd: repositoryRoot, encoding: 'utf8' });

test('the control ledger validates with stable references and safe defaults', async () => {
  const output = run('validate.mjs');
  assert.match(output, /"valid": true/);
  const report = JSON.parse(await readFile(new URL('../runs/validation.json', import.meta.url), 'utf8'));
  assert.equal(report.external_side_effects, false);
  assert.equal(report.errors.length, 0);
});

test('the exception queue never releases a record automatically', async () => {
  run('build-exception-queue.mjs');
  const report = JSON.parse(await readFile(new URL('../runs/exception-queue.json', import.meta.url), 'utf8'));
  assert.equal(report.external_side_effects, false);
  assert.equal(report.release_ready_count, 0);
  assert.ok(report.queue.every((entry) => entry.status === 'hold'));
});

test('agent entrypoint and authority contract prohibit unapproved public actions', async () => {
  const kernel = await readFile(new URL('../../COREWEAVER.md', import.meta.url), 'utf8');
  const authority = await readFile(new URL('../AUTHORITY.md', import.meta.url), 'utf8');
  for (const phrase of ['secret embedded in source', 'public-impact', 'Treat missing evidence as **unknown**']) assert.ok(kernel.includes(phrase));
  for (const phrase of ['CMS writes', 'deployment', 'DNS changes', 'specific action in the current task']) assert.ok(authority.includes(phrase));
});

test('the migration handoff is platform-neutral and carries no credential dependency', async () => {
  const migration = await readFile(new URL('../MIGRATION.md', import.meta.url), 'utf8');
  for (const phrase of ['Clone or copy the repository', 'No service account, API key, database, connector, or agent memory', 'JSON Schema draft 2020-12']) assert.ok(migration.includes(phrase));
});
