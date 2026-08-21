import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();

async function runNode(script, args = []) {
  return execFileAsync('node', [script, ...args], { cwd: root });
}

test('content-operation fixture validates in disabled foundation mode', async () => {
  const { stdout } = await runNode('scripts/validate-content-ops.mjs', ['fixture-geo-made-simple']);
  const result = JSON.parse(stdout);

  assert.equal(result.valid, true);
  assert.equal(result.mode, 'disabled-foundation');
  assert.equal(result.releaseAllowed, false);
  assert.deepEqual(result.errors, []);
});

test('topic scorer ranks an evidence-backed candidate without enabling release', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'coreweaver-content-ops-'));
  const output = path.join(directory, 'queue.json');
  const candidate = {
    id: 'fixture-entity-clarity',
    readerQuestion: 'How can a company distinguish itself from a similarly named entity?',
    topic: 'entity-clarity',
    sourceRecord: 'https://app.notion.com/p/example-reviewed-record',
    notes: 'Fixture candidate for a deterministic queue test.',
    components: {
      strategicRelevance: 0.9,
      firstPartyQueryOpportunity: null,
      sourceQualityAndFreshness: 0.9,
      readerDecisionUsefulness: 0.9,
      marketTimeliness: 0.6,
      duplicatePenalty: 0.1
    }
  };

  try {
    await writeFile(path.join(directory, 'candidate.json'), `${JSON.stringify(candidate, null, 2)}\n`);
    const { stdout } = await runNode('scripts/score-content-topics.mjs', [directory, output]);
    const report = JSON.parse(stdout);
    const persisted = JSON.parse(await readFile(output, 'utf8'));

    assert.equal(report.mode, 'disabled-foundation');
    assert.equal(report.releaseAllowed, false);
    assert.equal(report.eligibleCount, 1);
    assert.equal(report.queue[0].id, candidate.id);
    assert.equal(report.queue[0].score, 76);
    assert.match(report.queue[0].reasons[0], /neutral 0\.5 value/i);
    assert.equal(persisted.queue[0].id, candidate.id);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
