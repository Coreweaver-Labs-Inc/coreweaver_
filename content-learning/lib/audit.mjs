import { resolve } from 'node:path';
import { readJson, requireSafeMode, resolveLearningPath, writeJson } from './io.mjs';

const REQUIRED_OBSERVATIONS = [
  ['sourceUrlsObserved', (value) => Number.isInteger(value) && value >= 1, 'missing-source-urls', 'No public source URL was recorded for this published item.'],
  ['humanReviewerObserved', (value) => value === true, 'missing-human-review', 'No accountable human reviewer was recorded.'],
  ['evidenceCheckedOnObserved', (value) => typeof value === 'string' && value.length > 0, 'missing-evidence-check-date', 'No evidence-check date was recorded.'],
  ['recheckByObserved', (value) => typeof value === 'string' && value.length > 0, 'missing-recheck-date', 'No recheck date was recorded for a public claim.'],
  ['claimClassObserved', (value) => typeof value === 'string' && value.length > 0, 'missing-claim-class', 'No claim class was recorded.']
];

function auditRecord(record) {
  const findings = [];
  for (const [property, passes, code, detail] of REQUIRED_OBSERVATIONS) {
    if (!passes(record[property])) findings.push({ severity: 'blocker', code, detail, property });
  }
  return {
    slug: record.slug,
    title: record.title,
    statusObserved: record.statusObserved,
    suggestedAction: record.suggestedAction,
    suggestedQueueState: findings.length > 0 ? 'hold' : record.suggestedQueueState,
    releaseAllowed: false,
    findings
  };
}

export async function buildEvidenceAudit({ outputDir = resolveLearningPath('runs') } = {}) {
  const [config, inventory] = await Promise.all([
    readJson(resolveLearningPath('config.json')),
    readJson(resolveLearningPath('input', 'current-blog-inventory.json'))
  ]);
  requireSafeMode(config);

  const records = inventory.records.map(auditRecord);
  const blockerCount = records.reduce((count, record) => count + record.findings.length, 0);
  const report = {
    contractVersion: 1,
    generatedAt: new Date().toISOString(),
    mode: 'safe-no-side-effects',
    inputSnapshot: {
      auditedAt: inventory.auditedAt,
      sourceType: inventory.source.type,
      limitation: inventory.source.limitation
    },
    summary: {
      recordsAudited: records.length,
      recordsOnHold: records.filter((record) => record.suggestedQueueState === 'hold').length,
      blockerCount,
      releaseReadyRecords: 0
    },
    records
  };
  await writeJson(resolve(outputDir, 'evidence-audit.json'), report);
  return report;
}
