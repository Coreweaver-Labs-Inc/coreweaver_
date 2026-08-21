import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const fixtureName = process.argv[2] ?? 'fixture-geo-made-simple';
const configPath = resolve(root, 'content-ops/config.json');
const fixtureRoot = resolve(root, 'content-ops/fixtures', fixtureName);
const runRoot = resolve(root, 'content-ops/runs');
const errors = [];
const warnings = [];

async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return null;
  }
}

async function requireFile(path, label) {
  try {
    await access(path);
    return true;
  } catch {
    errors.push(`Missing required artifact: ${label}`);
    return false;
  }
}

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function hasBlockedTerm(text, values) {
  const normalized = text.toLowerCase();
  return values.find((value) => normalized.includes(value.toLowerCase()));
}

const config = await readJson(configPath, 'content-ops/config.json');
const artifacts = {
  topic: resolve(fixtureRoot, 'topic.json'),
  sources: resolve(fixtureRoot, 'sources.json'),
  claims: resolve(fixtureRoot, 'claim-ledger.json'),
  article: resolve(fixtureRoot, 'article.md'),
  metadata: resolve(fixtureRoot, 'metadata.json'),
  release: resolve(fixtureRoot, 'release.json')
};

for (const [label, path] of Object.entries(artifacts)) {
  await requireFile(path, `${fixtureName}/${label}`);
}

const [topic, sourcePacket, claimLedger, article, metadata, release] = await Promise.all([
  readJson(artifacts.topic, 'topic.json'),
  readJson(artifacts.sources, 'sources.json'),
  readJson(artifacts.claims, 'claim-ledger.json'),
  readFile(artifacts.article, 'utf8').catch((error) => {
    errors.push(`article.md: ${error.message}`);
    return '';
  }),
  readJson(artifacts.metadata, 'metadata.json'),
  readJson(artifacts.release, 'release.json')
]);

if (config) {
  if (config.enabled !== false) errors.push('Content operations must remain disabled until separate activation authorization.');
  if (config.release.autoMerge !== false || config.release.autoPublish !== false) errors.push('Automatic merge and publishing must remain disabled in this foundation PR.');
  if (config.release.destination !== 'vercel-only') errors.push('Release destination must remain vercel-only.');
  if (config.runtime.webflowLivePublishing || config.runtime.socialPublishing) errors.push('Webflow live and social publishing must remain disabled.');
}

if (topic && config) {
  if (!config.topicPolicy.eligibleTopics.includes(topic.topic)) errors.push(`Topic is not eligible: ${topic.topic}`);
  if (topic.status !== 'eligible') errors.push(`Topic status must be eligible, received ${topic.status}`);
  if (typeof topic.scores?.total !== 'number' || topic.scores.total < config.topicPolicy.minimumScore) errors.push('Topic score is below the configured minimum.');
  if (!topic.readerQuestion || !topic.sourceRecord || !isHttpsUrl(topic.sourceRecord)) errors.push('Topic must include a reader question and HTTPS source record.');
}

const sourcesById = new Map();
if (sourcePacket?.sources) {
  if (!Array.isArray(sourcePacket.sources) || sourcePacket.sources.length < 2) errors.push('At least two source records are required in the fixture.');
  for (const source of sourcePacket.sources ?? []) {
    if (!source.id || sourcesById.has(source.id)) errors.push(`Source IDs must be unique and non-empty: ${source.id ?? 'missing'}`);
    if (!isHttpsUrl(source.url)) errors.push(`Source must use HTTPS: ${source.id ?? 'missing id'}`);
    if (!source.title || !source.publisher || !source.supports || !source.limitation || !source.checkedOn) errors.push(`Source record is incomplete: ${source.id ?? 'missing id'}`);
    sourcesById.set(source.id, source);
  }
}

if (claimLedger?.claims && config) {
  const validClasses = new Set(Object.keys(config.sourcePolicy.minimumSources));
  for (const claim of claimLedger.claims ?? []) {
    if (!claim.id || !claim.statement || !claim.limitation) errors.push(`Claim is incomplete: ${claim.id ?? 'missing id'}`);
    if (!validClasses.has(claim.claimClass)) errors.push(`Claim class is invalid: ${claim.claimClass}`);
    const requiredSources = config.sourcePolicy.minimumSources[claim.claimClass] ?? 0;
    if (!Array.isArray(claim.sourceIds) || claim.sourceIds.length < requiredSources) errors.push(`Claim ${claim.id} lacks the required source count for ${claim.claimClass}.`);
    for (const sourceId of claim.sourceIds ?? []) {
      if (!sourcesById.has(sourceId)) errors.push(`Claim ${claim.id} references an unknown source: ${sourceId}`);
    }
    if (claim.timeSensitive && !claim.recheckBy) errors.push(`Time-sensitive claim ${claim.id} must have a recheck date.`);
  }
}

if (metadata && config) {
  if (!metadata.title || metadata.title.length < 20 || metadata.title.length > 70) errors.push('Metadata title must be between 20 and 70 characters.');
  if (!metadata.description || metadata.description.length < 50 || metadata.description.length > 170) errors.push('Metadata description must be between 50 and 170 characters.');
  if (!/^\/[^\s]*\/$/.test(metadata.canonicalPath ?? '')) errors.push('Canonical path must start and end with a slash and contain no spaces.');
  if (!Array.isArray(metadata.internalLinks) || metadata.internalLinks.length === 0) errors.push('Metadata must include at least one internal link.');
}

if (release) {
  if (release.autopublish !== false || release.releaseMode !== 'fixture-only') errors.push('Fixture release must be explicitly non-publishable.');
  if (!release.releaseId || !isHttpsUrl(release.notionRecord)) errors.push('Release record must include a release ID and HTTPS Notion record.');
}

if (config) {
  const combinedText = `${article}\n${JSON.stringify(metadata ?? {})}\n${JSON.stringify(claimLedger ?? {})}`;
  const blocked = hasBlockedTerm(combinedText, config.topicPolicy.excludedTerms);
  if (blocked) errors.push(`Blocked retired-positioning term found: ${blocked}`);
  const prohibited = hasBlockedTerm(combinedText, config.topicPolicy.prohibitedOutcomeClaims);
  if (prohibited) errors.push(`Prohibited outcome claim found: ${prohibited}`);
  if (/\b(?:we|coreweaver|this (?:resource|article|system))\s+(?:can\s+)?guarantee(?:s|d)?\b/i.test(combinedText)) errors.push('Unqualified outcome guarantee is not allowed.');
}

if (!article.startsWith('# ')) errors.push('Article must begin with one H1.');
if (!article.includes('## Sources')) errors.push('Article must include a visible Sources section.');
if (!article.includes('## Limitation')) errors.push('Article must include a visible Limitation section.');

const result = {
  fixture: fixtureName,
  valid: errors.length === 0,
  checkedAt: new Date().toISOString(),
  errors,
  warnings,
  mode: config?.enabled === false ? 'disabled-foundation' : 'unexpected-enabled',
  releaseAllowed: false
};

await mkdir(runRoot, { recursive: true });
await writeFile(resolve(runRoot, `${fixtureName}.validation.json`), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));

if (errors.length > 0) process.exitCode = 1;
