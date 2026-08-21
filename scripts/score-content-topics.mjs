import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const candidatesDirectory = resolve(root, process.argv[2] ?? 'content-ops/candidates');
const outputPath = resolve(root, process.argv[3] ?? 'content-ops/runs/topic-queue.json');
const config = JSON.parse(await readFile(resolve(root, 'content-ops/config.json'), 'utf8'));

const componentWeights = {
  strategicRelevance: 30,
  firstPartyQueryOpportunity: 25,
  sourceQualityAndFreshness: 20,
  readerDecisionUsefulness: 15,
  marketTimeliness: 10,
  duplicatePenalty: 10
};

function normalize(value, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0 || value > 1) {
    throw new Error(`Score components must be numbers from 0 through 1; received ${value}`);
  }
  return value;
}

function containsBlockedTerm(candidate) {
  const haystack = [candidate.readerQuestion, candidate.topic, candidate.notes].filter(Boolean).join(' ').toLowerCase();
  return config.topicPolicy.excludedTerms.find((term) => haystack.includes(term.toLowerCase())) ?? null;
}

function evaluate(candidate) {
  const reasons = [];
  const errors = [];
  const blockedTerm = containsBlockedTerm(candidate);
  const eligibleTopic = config.topicPolicy.eligibleTopics.includes(candidate.topic);

  if (!candidate.id) errors.push('missing id');
  if (!candidate.readerQuestion) errors.push('missing readerQuestion');
  if (!candidate.sourceRecord?.startsWith('https://')) errors.push('missing HTTPS sourceRecord');
  if (!eligibleTopic) errors.push(`topic is not in the configured eligibility list: ${candidate.topic}`);
  if (blockedTerm) errors.push(`contains excluded term: ${blockedTerm}`);

  const components = candidate.components ?? {};
  const firstPartyQueryOpportunity = normalize(components.firstPartyQueryOpportunity, 0.5);
  const scores = {
    strategicRelevance: normalize(components.strategicRelevance),
    firstPartyQueryOpportunity,
    sourceQualityAndFreshness: normalize(components.sourceQualityAndFreshness),
    readerDecisionUsefulness: normalize(components.readerDecisionUsefulness),
    marketTimeliness: normalize(components.marketTimeliness),
    duplicatePenalty: normalize(components.duplicatePenalty)
  };

  const total = Number((
    (scores.strategicRelevance * componentWeights.strategicRelevance) +
    (scores.firstPartyQueryOpportunity * componentWeights.firstPartyQueryOpportunity) +
    (scores.sourceQualityAndFreshness * componentWeights.sourceQualityAndFreshness) +
    (scores.readerDecisionUsefulness * componentWeights.readerDecisionUsefulness) +
    (scores.marketTimeliness * componentWeights.marketTimeliness) -
    (scores.duplicatePenalty * componentWeights.duplicatePenalty)
  ).toFixed(2));

  if (components.firstPartyQueryOpportunity === null || components.firstPartyQueryOpportunity === undefined) {
    reasons.push('Search Console opportunity was unavailable; a neutral 0.5 value was used.');
  }

  return {
    id: candidate.id,
    readerQuestion: candidate.readerQuestion,
    topic: candidate.topic,
    sourceRecord: candidate.sourceRecord,
    score: total,
    components: scores,
    eligible: errors.length === 0 && total >= config.topicPolicy.minimumScore,
    errors,
    reasons
  };
}

let candidateFiles = [];
try {
  candidateFiles = (await readdir(candidatesDirectory)).filter((file) => file.endsWith('.json')).sort();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const evaluations = [];
for (const file of candidateFiles) {
  try {
    const candidate = JSON.parse(await readFile(resolve(candidatesDirectory, file), 'utf8'));
    evaluations.push(evaluate(candidate));
  } catch (error) {
    evaluations.push({ id: file, eligible: false, errors: [error.message], reasons: [] });
  }
}

const queue = evaluations
  .filter((candidate) => candidate.eligible)
  .sort((left, right) => right.score - left.score)
  .slice(0, 3);

const report = {
  generatedAt: new Date().toISOString(),
  mode: config.enabled ? 'enabled' : 'disabled-foundation',
  releaseAllowed: false,
  candidateCount: evaluations.length,
  eligibleCount: queue.length,
  queue,
  blocked: evaluations.filter((candidate) => !candidate.eligible)
};

await mkdir(resolve(root, 'content-ops/runs'), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
