import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const jsonFiles = ['dist/agents/manifest.json', 'dist/agents/manifest.schema.json'];
for (const file of jsonFiles) JSON.parse(readFileSync(file, 'utf8'));

const requiredFiles = [
  'dist/agents/manifest.json',
  'dist/agents/manifest.schema.json',
  'dist/llms.txt',
  'dist/llms-full.txt',
  'dist/AGENTS.md',
  'dist/robots.txt',
  'dist/sitemap.xml',
];
for (const file of requiredFiles) {
  if (!existsSync(file) || statSync(file).size === 0) throw new Error(`${file} is missing or empty`);
}

const manifest = JSON.parse(readFileSync('dist/agents/manifest.json', 'utf8'));
if (manifest.interoperability.vendorLockIn !== false) throw new Error('manifest must remain vendor-neutral');
if (manifest.stack.build !== 'npm run build') throw new Error('build contract changed unexpectedly');

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

const pages = htmlFiles('dist');
if (pages.length < 10) throw new Error(`expected at least 10 generated HTML pages, found ${pages.length}`);
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const relative = file.replace(/^dist\//, '');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]?.trim();
  const canonicals = html.match(/<link[^>]+rel=["']canonical["'][^>]+>/gi) ?? [];
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (!title || title.length < 20) throw new Error(`${relative}: missing or short title`);
  if (!description || description.length < 70 || description.length > 180) throw new Error(`${relative}: meta description must be 70–180 characters`);
  if (canonicals.length !== 1) throw new Error(`${relative}: expected exactly one canonical link`);
  if (h1Count !== 1 && !relative.startsWith('mandate/') && !relative.startsWith('vaas/')) throw new Error(`${relative}: expected exactly one H1, found ${h1Count}`);
  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    const alt = attrs.match(/\balt=["']([^"']*)["']/i)?.[1];
    if (!alt || alt.length < 8) throw new Error(`${relative}: image is missing useful alt text`);
  }
}
const generatedRoutes = new Set(['/', ...pages.map((file) => {
  const route = '/' + file.replace(/^dist\//, '').replace(/index\.html$/, '').replace(/\.html$/, '');
  return route === '/' ? '/' : route.replace(/\/$/, '');
})]);
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const relative = file.replace(/^dist\//, '');
  for (const match of html.matchAll(/href=["'](\/[^"]*)["']/gi)) {
    const href = match[1].split('#')[0].split('?')[0];
    if (!href || href.startsWith('//') || href.startsWith('/_')) continue;
    const route = href.endsWith('/') && href !== '/' ? href.slice(0, -1) : href;
    const assetPath = join('dist', href.replace(/^\//, ''));
    if (!generatedRoutes.has(route) && !existsSync(assetPath) && !existsSync(join('dist', href.replace(/^\//, ''), 'index.html'))) {
      throw new Error(`${relative}: broken internal link ${href}`);
    }
  }
}
console.log(`technical SEO surfaces valid: ${pages.length} HTML pages; internal links valid`);
