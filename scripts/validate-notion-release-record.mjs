import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const fixtureName = process.argv[2] ?? 'fixture-notion-release';
const recordPath = resolve(root, 'content-ops/fixtures', fixtureName, 'release-record.json');
const outputPath = resolve(root, 'content-ops/runs', `${fixtureName}.notion-release-validation.json`);
const config = JSON.parse(await readFile(resolve(root, 'content-ops/config.json'), 'utf8'));
const record = JSON.parse(await readFile(recordPath, 'utf8'));
const errors = [];
const warnings = [];

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

const allowedContentTypes = new Set(['entity-explainer', 'geo-guide', 'signal-note', 'offer', 'working-note']);
const allowedClaimClasses = new Set(['first-party fact', 'third-party fact', 'interpretation', 'proposal']);
const allowedOutcomes = new Set(['needs evidence', 'ready for editorial', 'blocked', 'approved for release', 'released', 'retired']);
const allowedModes = new Set(['manual', 'automatic', 'fixture-only']);

if (config.enabled !== false || config.release.autoMerge !== false || config.release.autoPublish !== false) {
  errors.push('The repository content-operation foundation must remain disabled.');
}
if (!isHttpsUrl(record.notionRecord)) errors.push('Notion record URL must use HTTPS.');
if (!record.postTitle || !record.slug) errors.push('Post Title and Slug are required.');
if (!allowedContentTypes.has(record.contentType)) errors.push(`Unsupported Content Type: ${record.contentType}`);
if (!allowedClaimClasses.has(record.claimClass)) errors.push(`Unsupported Claim Class: ${record.claimClass}`);
if (!Array.isArray(record.sourceUrls) || record.sourceUrls.length === 0 || record.sourceUrls.some((url) => !isHttpsUrl(url))) {
  errors.push('At least one direct HTTPS Source URL is required.');
}
if (!isIsoDate(record.evidenceCheckedOn)) errors.push('Evidence Checked On must be an ISO date.');
if (!record.reviewedBy || !allowedOutcomes.has(record.reviewOutcome)) errors.push('Reviewed By and a valid Review Outcome are required.');
if (!/^\/[^\s]*\/$/.test(record.canonicalPath ?? '')) errors.push('Canonical Path must start and end with / and contain no spaces.');
if (!allowedModes.has(record.releaseMode)) errors.push(`Unsupported Release Mode: ${record.releaseMode}`);
if (!record.releaseId) errors.push('Release ID is required.');
if (record.recheckBy !== null && !isIsoDate(record.recheckBy)) errors.push('Recheck By must be an ISO date or null.');

if (record.reviewOutcome === 'approved for release' && record.status !== 'approved') {
  errors.push('An approved release candidate must retain Status = approved until it is actually released.');
}
if (record.reviewOutcome === 'released' && !record.gitPrUrl) warnings.push('A released record should include its Git PR URL.');
if (record.releaseMode === 'fixture-only' && record.autopublish !== false) errors.push('Fixture-only records can never have Autopublish enabled.');
if (record.releaseMode === 'automatic' && record.autopublish !== true) errors.push('Automatic mode requires Autopublish = true.');
if (record.autopublish === true) errors.push('Autopublish must remain false until a separate activation authorization.');
if (record.vercelDeploymentUrl && !isHttpsUrl(record.vercelDeploymentUrl)) errors.push('Vercel Deployment URL must use HTTPS when present.');
if (record.gitPrUrl && !isHttpsUrl(record.gitPrUrl)) errors.push('Git PR URL must use HTTPS when present.');

const result = {
  fixture: fixtureName,
  valid: errors.length === 0,
  checkedAt: new Date().toISOString(),
  mode: config.enabled ? 'unexpected-enabled' : 'disabled-foundation',
  releaseAllowed: false,
  errors,
  warnings,
  candidate: {
    title: record.postTitle,
    canonicalPath: record.canonicalPath,
    releaseId: record.releaseId,
    reviewOutcome: record.reviewOutcome,
    autopublish: record.autopublish
  }
};

await mkdir(resolve(root, 'content-ops/runs'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exitCode = 1;
