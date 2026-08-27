import { buildEvidenceAudit } from '../lib/audit.mjs';
import { parseOutputDir, readJson, requireSafeMode, resolveLearningPath, writeJson } from '../lib/io.mjs';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDir = parseOutputDir(resolveLearningPath('runs'));
const config = await readJson(resolveLearningPath('config.json'));
requireSafeMode(config);
const audit = await buildEvidenceAudit({ outputDir });
const queue = audit.records.filter((record) => record.findings.length > 0).map((record) => ({
  id: `hold:${record.slug}`,
  state: 'hold',
  target: `/blog/${record.slug}`,
  proposedAction: record.suggestedAction,
  reasonCodes: record.findings.map((finding) => finding.code),
  approvalRequired: true,
  publicActionPermitted: false
}));
await writeJson(resolve(outputDir, 'release-queue.json'), {
  contractVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: 'safe-no-side-effects',
  summary: { hold: queue.length, needsDecision: 0, observe: 0, releaseReady: 0 },
  entries: queue
});
let outcomes = [];
try { outcomes = (await readdir(resolveLearningPath('outcomes'))).filter((file) => file.endsWith('.json')); } catch { outcomes = []; }
const recurringFindingCounts = {};
for (const finding of audit.records.flatMap((record) => record.findings)) recurringFindingCounts[finding.code] = (recurringFindingCounts[finding.code] ?? 0) + 1;
await writeJson(resolve(outputDir, 'retrospective.json'), {
  contractVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: 'safe-no-side-effects',
  outcomeRecordsObserved: outcomes.length,
  recurringFindingCounts,
  proposedPolicyReviews: Object.entries(recurringFindingCounts).filter(([, count]) => count >= 2).map(([issue, occurrences]) => ({ status: 'proposed-human-review-only', issue, occurrences })),
  limitation: 'No causal outcome inference is made.'
});
console.log(JSON.stringify({ mode: 'safe-no-side-effects', recordsAudited: audit.summary.recordsAudited, held: queue.length, sideEffects: config.sideEffects }, null, 2));
