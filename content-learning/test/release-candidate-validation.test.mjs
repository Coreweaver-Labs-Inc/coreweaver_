import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..', '..');

test('release-candidate validation requires distinct reader questions, source/claim boundaries, and a separately approved target', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'coreweaver-release-candidates-'));
  const output = resolve(directory, 'report.json');
  try {
    const result = spawnSync(process.execPath, [resolve(root, 'content-learning/scripts/validate-release-candidates.mjs'), '--output', output], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(await readFile(output, 'utf8'));
    assert.equal(report.mode, 'safe-no-side-effects');
    assert.equal(report.releaseAllowed, false);
    assert.equal(report.summary.candidatesAudited, 3);
    assert.equal(report.summary.hold, 0);
    assert.equal(report.summary.needsDecision, 3);
    assert.equal(report.summary.releaseReady, 0);
    assert.equal(report.candidates.every((candidate) => candidate.publicActionPermitted === false), true);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('release-candidate validation holds a candidate with a duplicated reader question or an incomplete maintenance record', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'coreweaver-release-candidate-hold-'));
  const input = resolve(directory, 'candidates.json');
  const output = resolve(directory, 'report.json');
  try {
    const inventory = JSON.parse(await readFile(resolve(root, 'content-learning/input/release-candidates.json'), 'utf8'));
    inventory.candidates[1].primaryReaderQuestion = inventory.candidates[0].primaryReaderQuestion;
    delete inventory.candidates[1].maintenance.owner;
    await writeFile(input, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
    const result = spawnSync(process.execPath, [resolve(root, 'content-learning/scripts/validate-release-candidates.mjs'), '--input', input, '--output', output], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(await readFile(output, 'utf8'));
    const held = report.candidates.find((candidate) => candidate.id === 'field-index-evidence-review-worksheet');
    assert.equal(held.status, 'hold');
    assert.deepEqual(held.findings.map((finding) => finding.code).sort(), ['duplicate-reader-question', 'missing-maintenance-owner']);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('release-candidate validation contains no outbound client, CMS, provider, deployment, or publishing call', async () => {
  const source = await readFile(resolve(root, 'content-learning/scripts/validate-release-candidates.mjs'), 'utf8');
  for (const forbiddenPattern of [/\bfetch\s*\(/, /@notionhq/, /\bgh\s+/, /\bvercel\s+/, /child_process/, /\.post\(/, /\.put\(/]) {
    assert.equal(forbiddenPattern.test(source), false, `Forbidden outbound path found: ${forbiddenPattern}`);
  }
});
