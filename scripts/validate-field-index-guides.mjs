import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];
const read = (path) => readFile(resolve(root, path), 'utf8');
const assertIncludes = (content, expected, label) => {
  if (!content.includes(expected)) errors.push(`${label} is missing: ${expected}`);
};
const assertExcludes = (content, pattern, label) => {
  if (pattern.test(content)) errors.push(`${label} contains prohibited pattern: ${pattern}`);
};

const [hub, guide, worksheet, index, sitemap, vercel] = await Promise.all([
  read('src/pages/field-index/guides.astro'),
  read('src/pages/field-index/evaluate-agent-systems.astro'),
  read('src/pages/field-index/evidence-review-worksheet.astro'),
  read('src/pages/field-index.astro'),
  read('public/sitemap.xml'),
  read('vercel.json')
]);

assertIncludes(hub, "const canonical = 'https://coreweaverlabs.com/field-index/guides'", 'Guides canonical');
assertIncludes(guide, "const canonical = 'https://coreweaverlabs.com/field-index/evaluate-agent-systems'", 'Guide canonical');
assertIncludes(worksheet, "const canonical = 'https://coreweaverlabs.com/field-index/evidence-review-worksheet'", 'Worksheet canonical');
assertIncludes(guide, 'Framework boundary', 'Guide claim boundary');
assertIncludes(guide, 'https://www.nist.gov/itl/ai-risk-management-framework', 'Guide NIST source');
assertIncludes(guide, 'https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/', 'Guide OWASP source');
assertIncludes(guide, 'https://aaif.io/projects', 'Guide AAIF source');
assertIncludes(guide, 'They do not validate a particular product, organization, deployment, or procurement decision', 'Guide source limitation');
assertIncludes(worksheet, 'onsubmit="return false"', 'Worksheet local-only submission guard');
assertExcludes(worksheet, /\baction\s*=/i, 'Worksheet');
assertExcludes(worksheet, /\bfetch\s*\(/i, 'Worksheet');
assertExcludes(worksheet, /localStorage|sessionStorage|indexedDB/i, 'Worksheet');
assertIncludes(index, 'href="/field-index/guides"', 'Field Index guide navigation');

for (const url of [
  'https://coreweaverlabs.com/field-index/guides',
  'https://coreweaverlabs.com/field-index/evaluate-agent-systems',
  'https://coreweaverlabs.com/field-index/evidence-review-worksheet'
]) assertIncludes(sitemap, `<loc>${url}</loc>`, 'Sitemap');

for (const path of ['/field-index/guides/', '/field-index/evaluate-agent-systems/', '/field-index/evidence-review-worksheet/']) assertIncludes(vercel, `"source": "${path}"`, 'Vercel canonical redirect');

for (const content of [hub, guide, worksheet]) {
  assertExcludes(content, /guarantee (?:rankings|citations|traffic|leads|revenue)/i, 'Field Index guide content');
  assertExcludes(content, /dramatically reduces hallucination/i, 'Field Index guide content');
}

if (!guide.includes('Checked 2026-08-27')) warnings.push('Confirm external source check dates before a later publication date.');

const result = { valid: errors.length === 0, errors, warnings, checkedAt: new Date().toISOString(), releaseAllowed: false };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
