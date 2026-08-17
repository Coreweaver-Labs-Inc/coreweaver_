import { readFile } from 'node:fs/promises';

const config = JSON.parse(await readFile('audits/gemini-com.json', 'utf8'));
JSON.parse(await readFile('audits/geo-audit.schema.json', 'utf8'));
const runner = await readFile('scripts/geo-audit.mjs', 'utf8');
const workflow = await readFile('.github/workflows/geo-audit.yml', 'utf8');

const required = [
  config.version === '2.0',
  /^[a-z0-9-]+$/.test(config.target.id),
  new URL(config.target.origin).protocol === 'https:',
  new URL(config.target.homepage).origin === new URL(config.target.origin).origin,
  Object.values(config.paths).filter(Boolean).every((path) => path.startsWith('/')),
  config.target.entity.qualifiers.length > 0,
  config.runner.timeoutMs >= 1000 && config.runner.timeoutMs <= 60000,
  config.runner.maxBodyBytes >= 1024 && config.runner.maxBodyBytes <= 5000000,
  runner.includes("deterministic: true"),
  runner.includes("modelRequired: false"),
  runner.includes("It does not prove indexing, rankings, crawler behavior, model citations, legal compliance, or commercial impact."),
  workflow.includes('workflow_dispatch:'),
  workflow.includes('schedule:'),
  workflow.includes('contents: read'),
  workflow.includes('retention-days: 90'),
  !workflow.includes('contents: write'),
];

if (required.some((value) => !value)) throw new Error('GEO Audit v2 contract or scheduled-workflow safety check failed.');
console.log('GEO Audit v2 contract valid');
