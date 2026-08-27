import { resolve } from 'node:path';
import { buildEvidenceAudit } from '../lib/audit.mjs';
import { parseOutputDir, readJson, requireSafeMode, resolveLearningPath, writeJson } from '../lib/io.mjs';

const outputDir = parseOutputDir(resolveLearningPath('runs'));
const config = await readJson(resolveLearningPath('config.json'));
requireSafeMode(config);
const audit = await buildEvidenceAudit({ outputDir });

const queue = audit.records
  .filter((record) => record.findings.length > 0)
  .map((record) => ({
    id: `hold:${record.slug}`,
    state: 'hold',
    target: `/blog/${record.slug}`,
    title: record.title,
    proposedAction: record.suggestedAction,
    reasonCodes: record.findings.map((finding) => finding.code),
    requiredEvidence: [
      'Public source URLs supporting every material factual statement.',
      'Evidence checked date and time-sensitive recheck date.',
      'Claim class, accountable content owner, and named human reviewer.',
      'A separately approved release or retirement decision.'
    ],
    approvalRequired: true,
    publicActionPermitted: false
  }));

const report = {
  contractVersion: 1,
  generatedAt: new Date().toISOString(),
  mode: 'safe-no-side-effects',
  summary: {
    hold: queue.length,
    needsDecision: 0,
    observe: 0,
    releaseReady: 0
  },
  entries: queue
};
await writeJson(resolve(outputDir, 'release-queue.json'), report);
console.log(JSON.stringify({ outputDir, ...report.summary, mode: report.mode }, null, 2));
