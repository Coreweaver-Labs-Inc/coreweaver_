import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const defaultOutput = resolve(root, 'content-learning', 'runs', 'release-candidate-validation.json');
const allowedClasses = new Set(['first_party_fact', 'third_party_fact', 'interpretation', 'proposal']);

const args = process.argv.slice(2);
const outputFlag = args.indexOf('--output');
const output = outputFlag >= 0 && args[outputFlag + 1] ? resolve(args[outputFlag + 1]) : defaultOutput;

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const isHttpsUrl = (value) => typeof value === 'string' && /^https:\/\/.+/.test(value);
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '');

async function validateCandidate(candidate, seenQuestions) {
  const findings = [];
  const check = (condition, code, detail) => {
    if (!condition) findings.push({ severity: 'blocker', code, detail });
  };

  check(hasText(candidate.id), 'missing-id', 'Each release candidate needs a stable ID.');
  check(/^\/[a-z0-9-/]+$/.test(candidate.route ?? ''), 'invalid-route', 'Route must be a lower-case absolute path.');
  check(hasText(candidate.title), 'missing-title', 'Candidate needs a human-readable title.');
  check(hasText(candidate.primaryReaderQuestion), 'missing-reader-question', 'Candidate needs one primary reader question.');
  check(hasText(candidate.singleNextAction), 'missing-next-action', 'Candidate needs one reader-oriented next action.');
  check(hasText(candidate.contentClass), 'missing-content-class', 'Candidate needs a content class.');
  check(hasText(candidate.review?.reviewedBy), 'missing-reviewer', 'Candidate needs an accountable reviewer.');
  check(isDate(candidate.review?.evidenceCheckedOn), 'missing-evidence-check-date', 'Candidate needs an evidence-check date.');
  check(isDate(candidate.review?.recheckBy), 'missing-recheck-date', 'Candidate needs a recheck date.');
  check(candidate.release?.destinationClass === 'owned-static-site', 'invalid-destination-class', 'Candidate must use the portable owned-static-site destination class.');
  check(candidate.release?.deploymentTarget === 'unassigned', 'deployment-target-must-remain-unassigned', 'A target host belongs in a separately approved release decision, not this inventory.');
  check(candidate.release?.publicActionPermitted === false, 'public-action-must-remain-false', 'The validator cannot authorize public release.');
  check(hasText(candidate.release?.rollback), 'missing-rollback', 'Candidate needs a stated rollback method.');
  check(Array.isArray(candidate.claimMap) && candidate.claimMap.length > 0, 'missing-claim-map', 'Candidate needs at least one classified material statement.');

  const questionKey = String(candidate.primaryReaderQuestion ?? '').trim().toLowerCase();
  if (seenQuestions.has(questionKey)) findings.push({ severity: 'blocker', code: 'duplicate-reader-question', detail: 'Each candidate needs a distinct reader question.' });
  seenQuestions.add(questionKey);

  for (const claim of candidate.claimMap ?? []) {
    check(allowedClasses.has(claim.claimClass), 'invalid-claim-class', `Claim ${claim.id ?? 'unknown'} must have a supported class.`);
    check(hasText(claim.statement), 'missing-claim-statement', `Claim ${claim.id ?? 'unknown'} needs a statement.`);
    check(hasText(claim.limitation), 'missing-claim-limitation', `Claim ${claim.id ?? 'unknown'} needs an explicit limitation.`);
    if (claim.claimClass === 'first_party_fact' || claim.claimClass === 'third_party_fact' || claim.claimClass === 'interpretation') {
      check(Array.isArray(claim.sources) && claim.sources.length > 0, 'missing-claim-source', `Claim ${claim.id ?? 'unknown'} needs at least one source.`);
    }
    for (const source of claim.sources ?? []) check(isHttpsUrl(source), 'invalid-claim-source-url', `Claim ${claim.id ?? 'unknown'} has a non-HTTPS source URL.`);
  }

  if (hasText(candidate.sourceFile)) {
    try {
      const source = await readFile(resolve(root, candidate.sourceFile), 'utf8');
      check(source.includes(`https://coreweaverlabs.com${candidate.route}`), 'missing-canonical-reference', 'Source file does not contain its expected canonical route.');
    } catch {
      findings.push({ severity: 'blocker', code: 'missing-source-file', detail: 'Candidate source file is missing or unreadable.' });
    }
  } else {
    findings.push({ severity: 'blocker', code: 'missing-source-file', detail: 'Candidate needs a source file path.' });
  }

  return { id: candidate.id, route: candidate.route, contentClass: candidate.contentClass, status: findings.length ? 'hold' : 'needs-decision', publicActionPermitted: false, findings };
}

const inventory = await readJson(resolve(root, 'content-learning', 'input', 'release-candidates.json'));
const config = await readJson(resolve(root, 'content-learning', 'config.json'));
if (config.safeMode !== true || Object.values(config.sideEffects).some(Boolean)) throw new Error('Release-candidate validation requires safe mode and zero side effects.');

const seenQuestions = new Set();
const candidates = await Promise.all(inventory.candidates.map((candidate) => validateCandidate(candidate, seenQuestions)));
const report = {
  contractVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: 'safe-no-side-effects',
  releaseAllowed: false,
  sourceSnapshot: inventory.snapshotDate,
  summary: {
    candidatesAudited: candidates.length,
    hold: candidates.filter((candidate) => candidate.status === 'hold').length,
    needsDecision: candidates.filter((candidate) => candidate.status === 'needs-decision').length,
    releaseReady: 0
  },
  candidates
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
