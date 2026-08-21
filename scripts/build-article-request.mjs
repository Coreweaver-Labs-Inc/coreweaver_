import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const fixtureName = process.argv[2] ?? 'fixture-geo-made-simple';
const outputPath = resolve(root, process.argv[3] ?? `content-ops/runs/${fixtureName}.draft-request.json`);
const fixtureRoot = resolve(root, 'content-ops/fixtures', fixtureName);
const config = JSON.parse(await readFile(resolve(root, 'content-ops/config.json'), 'utf8'));
const [topic, sources, claimLedger, metadata] = await Promise.all([
  JSON.parse(await readFile(resolve(fixtureRoot, 'topic.json'), 'utf8')),
  JSON.parse(await readFile(resolve(fixtureRoot, 'sources.json'), 'utf8')),
  JSON.parse(await readFile(resolve(fixtureRoot, 'claim-ledger.json'), 'utf8')),
  JSON.parse(await readFile(resolve(fixtureRoot, 'metadata.json'), 'utf8'))
]);

const sourceIds = new Set(sources.sources.map((source) => source.id));
const errors = [];
if (config.enabled) errors.push('This preparation runner must remain disabled until a separate activation authorization.');
if (topic.status !== 'eligible') errors.push('Topic must be eligible before a draft request can be prepared.');
if (topic.scores?.total < config.topicPolicy.minimumScore) errors.push('Topic score is below the configured minimum.');

for (const claim of claimLedger.claims ?? []) {
  if (!claim.statement || !claim.limitation) errors.push(`Claim is incomplete: ${claim.id ?? 'unknown'}`);
  for (const sourceId of claim.sourceIds ?? []) {
    if (!sourceIds.has(sourceId)) errors.push(`Claim ${claim.id} has an unknown source: ${sourceId}`);
  }
}

const request = {
  generatedAt: new Date().toISOString(),
  mode: config.enabled ? 'unexpected-enabled' : 'disabled-foundation',
  releaseAllowed: false,
  draftAllowed: errors.length === 0,
  errors,
  provider: {
    id: null,
    model: null,
    status: 'unconfigured',
    instruction: 'A future approved provider must write only from the source IDs below and preserve the limitation for every material claim.'
  },
  resource: {
    id: topic.id,
    readerQuestion: topic.readerQuestion,
    topic: topic.topic,
    title: metadata.title,
    description: metadata.description,
    canonicalPath: metadata.canonicalPath,
    contentType: metadata.contentType,
    internalLinks: metadata.internalLinks,
    requiredSections: ['Reader question', 'Bounded answer', 'Source boundary', 'Limitation', 'Sources']
  },
  claims: claimLedger.claims,
  sources: sources.sources,
  outputContract: {
    format: 'markdown-and-json',
    mustIncludeSourceSection: true,
    mustIncludeLimitationSection: true,
    mustNotClaimOutcomes: ['rankings', 'AI citations', 'traffic', 'leads', 'revenue', 'compliance certification'],
    mustNotUseRetiredPositioning: true
  }
};

await mkdir(resolve(root, 'content-ops/runs'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(request, null, 2)}\n`);
console.log(JSON.stringify(request, null, 2));
if (errors.length > 0) process.exitCode = 1;
