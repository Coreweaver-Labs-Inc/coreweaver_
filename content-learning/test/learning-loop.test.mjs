import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..', '..');
const run = (script, outputDir) => spawnSync(process.execPath, [resolve(root, 'content-learning', 'scripts', script), '--output-dir', outputDir], { cwd: root, encoding: 'utf8' });

test('learning loop produces exception-only holds and never marks the audited legacy records release-ready', async () => {
  const outputDir = await mkdtemp(resolve(tmpdir(), 'coreweaver-learning-loop-'));
  try {
    const result = run('run-learning-loop.mjs', outputDir);
    assert.equal(result.status, 0, result.stderr);
    const [audit, queue, retrospective] = await Promise.all([
      readFile(resolve(outputDir, 'evidence-audit.json'), 'utf8').then(JSON.parse),
      readFile(resolve(outputDir, 'release-queue.json'), 'utf8').then(JSON.parse),
      readFile(resolve(outputDir, 'retrospective.json'), 'utf8').then(JSON.parse)
    ]);
    assert.equal(audit.summary.recordsAudited, 4);
    assert.equal(audit.summary.releaseReadyRecords, 0);
    assert.equal(queue.summary.hold, 4);
    assert.equal(queue.summary.releaseReady, 0);
    assert.equal(queue.entries.every((entry) => entry.publicActionPermitted === false && entry.approvalRequired === true), true);
    assert.equal(retrospective.outcomeRecordsObserved, 0);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});

test('learning configuration and implementation forbid all outbound mutation paths', async () => {
  const config = JSON.parse(await readFile(resolve(root, 'content-learning/config.json'), 'utf8'));
  assert.equal(config.safeMode, true);
  assert.deepEqual(config.sideEffects, {
    cmsWrites: false,
    providerCalls: false,
    gitWrites: false,
    pullRequests: false,
    merges: false,
    deployments: false,
    publishing: false,
    dnsChanges: false
  });
  const scripts = await Promise.all(['audit-evidence.mjs', 'build-release-queue.mjs', 'build-retrospective.mjs', 'run-learning-loop.mjs'].map((file) => readFile(resolve(root, 'content-learning/scripts', file), 'utf8')));
  const implementation = scripts.join('\n');
  for (const forbiddenPattern of [/\bfetch\s*\(/, /@notionhq/, /\bgh\s+/, /\bvercel\s+/, /child_process/]) {
    assert.equal(forbiddenPattern.test(implementation), false, `Forbidden outbound integration path found: ${forbiddenPattern}`);
  }
});

test('the implementation does not create article copy, source claims, or CMS payloads', async () => {
  const scripts = await Promise.all(['audit-evidence.mjs', 'build-release-queue.mjs', 'build-retrospective.mjs', 'run-learning-loop.mjs'].map((file) => readFile(resolve(root, 'content-learning/scripts', file), 'utf8')));
  const implementation = scripts.join('\n');
  for (const forbiddenPattern of [/article\.md/i, /draft\s+copy/i, /claim\s+statement/i, /notion.*update/i, /publish/i]) {
    assert.equal(forbiddenPattern.test(implementation), false, `Potential content-generation or publication path found: ${forbiddenPattern}`);
  }
});
