import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildEvidenceAudit } from '../lib/audit.mjs';
import { parseOutputDir, readJson, requireSafeMode, resolveLearningPath, writeJson } from '../lib/io.mjs';

const outputDir = parseOutputDir(resolveLearningPath('runs'));
const config = await readJson(resolveLearningPath('config.json'));
requireSafeMode(config);
const audit = await buildEvidenceAudit({ outputDir });
const outcomesDir = resolveLearningPath('outcomes');
let outcomeFiles = [];
try {
  outcomeFiles = (await readdir(outcomesDir)).filter((file) => file.endsWith('.json'));
} catch {
  outcomeFiles = [];
}

const recurringFindingCounts = {};
for (const finding of audit.records.flatMap((record) => record.findings)) {
  recurringFindingCounts[finding.code] = (recurringFindingCounts[finding.code] ?? 0) + 1;
}
const proposedPolicyReviews = Object.entries(recurringFindingCounts)
  .filter(([, count]) => count >= 2)
  .map(([code, count]) => ({
    status: 'proposed-human-review-only',
    issue: code,
    occurrences: count,
    suggestedReview: 'Confirm whether the existing release gate, CMS required fields, or renderer enforcement should be tightened. Do not change policy automatically.'
  }));

const report = {
  contractVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: 'safe-no-side-effects',
  outcomeRecordsObserved: outcomeFiles.length,
  recurringFindingCounts,
  proposedPolicyReviews,
  limitation: 'Counts describe audit findings in the supplied records. They do not establish causal content, audience, search, or business outcomes.'
};
await writeJson(resolve(outputDir, 'retrospective.json'), report);
console.log(JSON.stringify({ outputDir, recurringFindingCounts, proposedPolicyReviews: proposedPolicyReviews.length }, null, 2));
