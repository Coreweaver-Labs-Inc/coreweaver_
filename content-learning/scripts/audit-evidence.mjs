import { buildEvidenceAudit } from '../lib/audit.mjs';
import { parseOutputDir, resolveLearningPath } from '../lib/io.mjs';

const outputDir = parseOutputDir(resolveLearningPath('runs'));
const report = await buildEvidenceAudit({ outputDir });
console.log(JSON.stringify({ outputDir, ...report.summary, mode: report.mode }, null, 2));
