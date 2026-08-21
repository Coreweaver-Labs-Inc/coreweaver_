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


test('research collector accepts a reviewed allowlisted observation but never enables release', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'coreweaver-research-input-'));
  const output = path.join(directory, 'observations.json');
  const record = {
    id: 'fixture-google-guidance',
    capturedAt: '2026-08-21T00:00:00.000Z',
    source: {
      url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      title: 'Creating helpful, reliable, people-first content',
      publisher: 'Google Search Central',
      sourceClass: 'official_guidance',
      checkedOn: '2026-08-21',
      limitation: 'This source does not establish a site-specific ranking or commercial outcome.'
    },
    observations: [
      {
        topic: 'geo-made-simple',
        readerQuestion: 'How should a public resource explain its source boundary?',
        statement: 'Useful content should be written for people and show relevant source context.',
        evidenceClass: 'third_party_fact',
        timeSensitive: false,
        recheckBy: null
      }
    ]
  };

  try {
    await writeFile(path.join(directory, 'record.json'), `${JSON.stringify(record, null, 2)}\n`);
    const { stdout } = await runNode('scripts/collect-research-observations.mjs', [directory, output]);
    const report = JSON.parse(stdout);
    const persisted = JSON.parse(await readFile(output, 'utf8'));

    assert.equal(report.mode, 'disabled-foundation');
    assert.equal(report.releaseAllowed, false);
    assert.equal(report.acceptedCount, 1);
    assert.equal(report.blockedCount, 0);
    assert.equal(persisted.observations[0].recordId, record.id);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('draft request remains provider-neutral and non-publishable', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'coreweaver-draft-request-'));
  const output = path.join(directory, 'request.json');

  try {
    const { stdout } = await runNode('scripts/build-article-request.mjs', ['fixture-geo-made-simple', output]);
    const request = JSON.parse(stdout);
    const persisted = JSON.parse(await readFile(output, 'utf8'));

    assert.equal(request.mode, 'disabled-foundation');
    assert.equal(request.releaseAllowed, false);
    assert.equal(request.draftAllowed, true);
    assert.equal(request.provider.status, 'unconfigured');
    assert.equal(persisted.resource.id, 'fixture-geo-made-simple');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});


test('Notion release record validates with autopublishing disabled', async () => {
  const { stdout } = await runNode('scripts/validate-notion-release-record.mjs', ['fixture-notion-release']);
  const result = JSON.parse(stdout);

  assert.equal(result.valid, true);
  assert.equal(result.mode, 'disabled-foundation');
  assert.equal(result.releaseAllowed, false);
  assert.equal(result.candidate.autopublish, false);
  assert.equal(result.candidate.reviewOutcome, 'approved for release');
});
