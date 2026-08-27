import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..', '..');
const defaultOutput = resolve(root, 'content-learning', 'runs', 'release-candidate-validation.json');
const allowedClasses = new Set(['first_party_fact', 'third_party_fact', 'interpretation', 'proposal']);

const args = process.argv.slice(2);
const outputFlag = args.indexOf('--output');
const output = outputFlag >= 0 && args[outputFlag + 1] ? resolve(args[outputFlag + 1]) : defaultOutput;
const inputFlag = args.indexOf('--input');
const input = inputFlag >= 0 && args[inputFlag + 1] ? resolve(args[inputFlag + 1]) : resolve(root, 'content-learning', 'input', 'release-candidates.json');

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const hasText = (value) => typeof value === 'string' && value.trim().length > 0;
const isHttpsUrl = (value) => typeof value === 'string' && /^https:\/\/.+/.test(value);
const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value ?? '');
const routeCandidates = (route) => {
  const normalized = route === '/' ? '' : route.replace(/\/$/, '');
  if (!normalized) return [resolve(root, 'src/pages/index.astro')];
  return [resolve(root, `src/pages${normalized}.astro`), resolve(root, `src/pages${normalized}/index.astro`)];
};

async function routeExists(route) {
  for (const path of routeCandidates(route)) {
    try {
      await access(path);
      return true;
    } catch {
      // Try the next Astro route convention.
    }
  }
  return false;
}

function internalLinks(source) {
  return [...source.matchAll(/<a\b[^>]*\bhref=["'](\/[^"'#?]*)/g)].map((match) => match[1]).filter((href) => !href.startsWith('/field-index/data/'));
}

async function validateCandidate(candidate, seenQuestions, seenTitles, seenContributions) {
  const findings = [];
  const check = (condition, code, detail) => {
    if (!condition) findings.push({ severity: 'blocker', code, detail });
  };

  check(hasText(candidate.id), 'missing-id', 'Each release candidate needs a stable ID.');
  check(/^\/[a-z0-9-/]+$/.test(candidate.route ?? ''), 'invalid-route', 'Route must be a lower-case absolute path.');
  check(hasText(candidate.title), 'missing-title', 'Candidate needs a human-readable title.');
  check(hasText(candidate.primaryReaderQuestion), 'missing-reader-question', 'Candidate needs one primary reader question.');
  check(hasText(candidate.distinctContribution), 'missing-distinct-contribution', 'Candidate needs a distinct contribution beyond its reader question.');
  check(hasText(candidate.singleNextAction), 'missing-next-action', 'Candidate needs one reader-oriented next action.');
  check(hasText(candidate.contentClass), 'missing-content-class', 'Candidate needs a content class.');
  check(hasText(candidate.review?.reviewedBy), 'missing-reviewer', 'Candidate needs an accountable reviewer.');
  check(isDate(candidate.review?.evidenceCheckedOn), 'missing-evidence-check-date', 'Candidate needs an evidence-check date.');
  check(isDate(candidate.review?.recheckBy), 'missing-recheck-date', 'Candidate needs a recheck date.');
  check(hasText(candidate.maintenance?.owner), 'missing-maintenance-owner', 'Candidate needs an accountable maintenance owner.');
  check(hasText(candidate.maintenance?.recheckTrigger), 'missing-maintenance-trigger', 'Candidate needs a maintenance recheck trigger.');
  check(hasText(candidate.maintenance?.nextAction), 'missing-maintenance-next-action', 'Candidate needs a maintenance next action.');
  check(candidate.release?.destinationClass === 'owned-static-site', 'invalid-destination-class', 'Candidate must use the portable owned-static-site destination class.');
  check(['proposed', 'released-pilot'].includes(candidate.release?.deploymentDecision?.status), 'missing-deployment-decision', 'Candidate needs an approval-bound proposed or recorded pilot deployment decision.');
  check(hasText(candidate.release?.deploymentDecision?.provider), 'missing-deployment-provider', 'Candidate needs a named prospective provider.');
  check(/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(candidate.release?.deploymentDecision?.prospectiveHostname ?? ''), 'invalid-prospective-hostname', 'Candidate needs a valid proposed hostname.');
  check(hasText(candidate.release?.deploymentDecision?.resourceEvidence), 'missing-resource-evidence', 'Candidate needs current resource evidence for the proposed target.');
  check(hasText(candidate.release?.deploymentDecision?.actionBoundary), 'missing-deployment-action-boundary', 'Candidate needs an explicit action boundary for the proposed target.');
  check(candidate.release?.publicActionPermitted === false, 'public-action-must-remain-false', 'The validator cannot authorize public release.');
  check(hasText(candidate.release?.rollback), 'missing-rollback', 'Candidate needs a stated rollback method.');
  check(Array.isArray(candidate.claimMap) && candidate.claimMap.length > 0, 'missing-claim-map', 'Candidate needs at least one classified material statement.');

  const questionKey = String(candidate.primaryReaderQuestion ?? '').trim().toLowerCase();
  const titleKey = String(candidate.title ?? '').trim().toLowerCase();
  const contributionKey = String(candidate.distinctContribution ?? '').trim().toLowerCase();
  if (seenQuestions.has(questionKey)) findings.push({ severity: 'blocker', code: 'duplicate-reader-question', detail: 'Each candidate needs a distinct reader question.' });
  if (seenTitles.has(titleKey)) findings.push({ severity: 'blocker', code: 'duplicate-title', detail: 'Each candidate needs a distinct title.' });
  if (seenContributions.has(contributionKey)) findings.push({ severity: 'blocker', code: 'duplicate-distinct-contribution', detail: 'Each candidate needs a distinct contribution.' });
  seenQuestions.add(questionKey);
  seenTitles.add(titleKey);
  seenContributions.add(contributionKey);

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
      const usesSharedLayout = /<Layout\b/.test(source);
      const layoutMetadata = usesSharedLayout && /\btitle=/.test(source) && /\bdescription=/.test(source) && /\bcanonical=/.test(source);
      check(source.includes(`https://coreweaverlabs.com${candidate.route}`), 'missing-canonical-reference', 'Source file does not contain its expected canonical route.');
      check(usesSharedLayout || /<html\s+lang=["']en["']/.test(source), 'missing-document-language', 'Source file needs an English document language declaration or the shared Layout.');
      check(usesSharedLayout || /<meta\s+name=["']viewport["']/.test(source), 'missing-viewport-meta', 'Source file needs a viewport meta tag or the shared Layout.');
      check(layoutMetadata || /<meta\s+name=["']description["']/.test(source), 'missing-description-meta', 'Source file needs a meta description.');
      check(layoutMetadata || (/<meta\s+property=["']og:title["']/.test(source) && /<meta\s+property=["']og:description["']/.test(source)), 'missing-open-graph-meta', 'Source file needs Open Graph title and description metadata.');
      check(layoutMetadata || /<title>[^<]+<\/title>/.test(source), 'missing-title-element', 'Source file needs a non-empty title element.');
      check((usesSharedLayout || /<main(?:\s|>)/.test(source)) && /<h1(?:\s|>)/.test(source), 'missing-main-or-h1', 'Source file needs semantic main content and an H1, directly or through the shared Layout.');
      check((source.match(/<h1(?:\s|>)/g) ?? []).length === 1, 'multiple-h1-elements', 'Source file must have exactly one H1.');
      check(!/<img\b(?![^>]*\balt=)[^>]*>/i.test(source), 'image-without-alt', 'Every image needs an alt attribute, including an empty alt for decorative images.');
      for (const href of internalLinks(source)) check(await routeExists(href), 'broken-internal-link', `Internal link ${href} does not resolve to an Astro route.`);
    } catch {
      findings.push({ severity: 'blocker', code: 'missing-source-file', detail: 'Candidate source file is missing or unreadable.' });
    }
  } else {
    findings.push({ severity: 'blocker', code: 'missing-source-file', detail: 'Candidate needs a source file path.' });
  }

  return { id: candidate.id, route: candidate.route, contentClass: candidate.contentClass, status: findings.length ? 'hold' : 'needs-decision', publicActionPermitted: false, findings };
}

const inventory = await readJson(input);
const config = await readJson(resolve(root, 'content-learning', 'config.json'));
if (config.safeMode !== true || Object.values(config.sideEffects).some(Boolean)) throw new Error('Release-candidate validation requires safe mode and zero side effects.');

const seenQuestions = new Set();
const seenTitles = new Set();
const seenContributions = new Set();
const candidates = await Promise.all(inventory.candidates.map((candidate) => validateCandidate(candidate, seenQuestions, seenTitles, seenContributions)));
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
