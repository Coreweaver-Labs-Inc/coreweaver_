import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { resolve } from 'node:path';

const root = process.cwd();
const publicSurfaceFiles = [
  'src/pages/index.astro',
  'src/pages/mandate/index.astro',
  'src/pages/source-map.astro',
  'src/pages/vaas/index.astro',
  'src/layouts/Layout.astro',
  'public/llms.txt',
  'public/llms-full.txt',
  'public/schema.json',
];

const legacyAssertionPatterns = [
  /99\.97%/i,
  /BFT-attested/i,
  /Bittensor/i,
  /SHA-256 hash-chained/i,
  /CSRD-regulated/i,
  /EU AI Act compliant/i,
  /Truth Ledger/i,
  /AURE Swarm/i,
  /running in production since/i,
];

test('flagship public surfaces exclude legacy technical, performance, and compliance assertions', async () => {
  const surfaces = await Promise.all(
    publicSurfaceFiles.map(async file => ({
      file,
      contents: await readFile(resolve(root, file), 'utf8'),
    })),
  );

  for (const surface of surfaces) {
    for (const pattern of legacyAssertionPatterns) {
      assert.doesNotMatch(surface.contents, pattern, `${surface.file} must not contain ${pattern}`);
    }
  }
});

test('machine-readable positioning names the four public operating layers and claim boundary', async () => {
  const llms = await readFile(resolve(root, 'public/llms.txt'), 'utf8');
  for (const layer of ['Entity', 'Evidence', 'Distribution', 'Measurement']) {
    assert.match(llms, new RegExp(`\\*\\*${layer}\\*\\*`));
  }
  assert.match(llms, /does not claim/i);
  assert.match(llms, /independently inspectable source/i);
});

test('source map and organization schema retain the inspectable public-information contract', async () => {
  const [sourceMap, schema] = await Promise.all([
    readFile(resolve(root, 'src/pages/source-map.astro'), 'utf8'),
    readFile(resolve(root, 'public/schema.json'), 'utf8'),
  ]);

  assert.match(sourceMap, /Source, scope,\s*review/i);
  assert.match(sourceMap, /No page in this map is a certification/i);
  assert.match(schema, /coreweaver-labs-logo-2026\.png/);
  assert.doesNotMatch(schema, /favicon\.svg/i);
});

test('public shell retains baseline accessibility safeguards and a bounded mailto conversion path', async () => {
  const [layout, styles, home, mandate, sourceMap, limits] = await Promise.all([
    readFile(resolve(root, 'src/layouts/Layout.astro'), 'utf8'),
    readFile(resolve(root, 'src/styles/global.css'), 'utf8'),
    readFile(resolve(root, 'src/pages/index.astro'), 'utf8'),
    readFile(resolve(root, 'src/pages/mandate/index.astro'), 'utf8'),
    readFile(resolve(root, 'src/pages/source-map.astro'), 'utf8'),
    readFile(resolve(root, 'src/pages/vaas/index.astro'), 'utf8'),
  ]);

  assert.match(layout, /href="#main-content"/);
  assert.match(layout, /<main id="main-content">/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /prefers-reduced-motion/);

  for (const page of [home, mandate, sourceMap, limits]) {
    assert.match(page, /<h1/);
    assert.doesNotMatch(page, /<form[\s>]/i);
  }

  for (const page of [home, mandate, sourceMap]) {
    assert.match(page, /mailto:hello@coreweaverlabs\.com\?subject=Coreweaver%20/);
  }
  assert.match(limits, /https:\/\/aureaudit-76sftcco\.manus\.space\/standard/);
});
