import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const inputDirectory = resolve(root, process.argv[2] ?? 'content-ops/research-inputs');
const outputPath = resolve(root, process.argv[3] ?? 'content-ops/runs/research-observations.json');
const config = JSON.parse(await readFile(resolve(root, 'content-ops/config.json'), 'utf8'));
const allowlist = JSON.parse(await readFile(resolve(root, 'content-ops/source-allowlist.json'), 'utf8'));

function parseHost(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function isAllowedHost(url) {
  const host = parseHost(url);
  return Boolean(host && allowlist.allowedHosts.includes(host));
}

function validateObservation(record) {
  const errors = [];
  if (!record.id) errors.push('missing id');
  if (!record.capturedAt) errors.push('missing capturedAt');
  if (!record.source?.url?.startsWith('https://')) errors.push('source URL must use HTTPS');
  if (!isAllowedHost(record.source?.url ?? '')) errors.push('source host is not on the approved allowlist');
  if (!record.source?.title || !record.source?.publisher || !record.source?.limitation || !record.source?.checkedOn) {
    errors.push('source record is incomplete');
  }
  if (!Array.isArray(record.observations) || record.observations.length === 0) errors.push('at least one observation is required');

  for (const observation of record.observations ?? []) {
    if (!config.topicPolicy.eligibleTopics.includes(observation.topic)) errors.push(`ineligible topic: ${observation.topic}`);
    if (!observation.readerQuestion || !observation.statement || !observation.evidenceClass) errors.push('observation is incomplete');
    if (observation.timeSensitive && !observation.recheckBy) errors.push('time-sensitive observation needs a recheckBy date');
  }

  return errors;
}

let files = [];
try {
  files = (await readdir(inputDirectory)).filter((file) => file.endsWith('.json')).sort();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const accepted = [];
const blocked = [];
for (const file of files) {
  try {
    const record = JSON.parse(await readFile(resolve(inputDirectory, file), 'utf8'));
    const errors = validateObservation(record);
    if (errors.length > 0) blocked.push({ file, id: record.id ?? null, errors });
    else accepted.push(record);
  } catch (error) {
    blocked.push({ file, id: null, errors: [error.message] });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  mode: config.enabled ? 'enabled' : 'disabled-foundation',
  releaseAllowed: false,
  inputCount: files.length,
  acceptedCount: accepted.length,
  blockedCount: blocked.length,
  observations: accepted.flatMap((record) => record.observations.map((observation) => ({
    ...observation,
    recordId: record.id,
    capturedAt: record.capturedAt,
    source: record.source
  }))),
  blocked
};

await mkdir(resolve(root, 'content-ops/runs'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
