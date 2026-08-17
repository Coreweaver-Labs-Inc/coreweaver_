import { existsSync, readFileSync, statSync } from 'node:fs';

const jsonFiles = ['dist/agents/manifest.json', 'dist/agents/manifest.schema.json'];
for (const file of jsonFiles) JSON.parse(readFileSync(file, 'utf8'));

const requiredFiles = [
  'dist/agents/manifest.json',
  'dist/agents/manifest.schema.json',
  'dist/llms.txt',
  'dist/AGENTS.md',
  'dist/robots.txt',
];
for (const file of requiredFiles) {
  if (!existsSync(file) || statSync(file).size === 0) throw new Error(`${file} is missing or empty`);
}

const manifest = JSON.parse(readFileSync('dist/agents/manifest.json', 'utf8'));
if (manifest.interoperability.vendorLockIn !== false) throw new Error('manifest must remain vendor-neutral');
if (manifest.stack.build !== 'npm run build') throw new Error('build contract changed unexpectedly');
console.log('static surfaces valid');
