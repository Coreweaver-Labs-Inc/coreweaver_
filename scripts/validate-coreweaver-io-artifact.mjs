import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const releases = resolve(root, 'release-artifacts');
const manifests = (await readdir(releases)).filter((name) => name.endsWith('.tar.gz.manifest.json')).sort();
if (!manifests.length) throw new Error('No coreweaver.io artifact manifest found. Run npm run prepare:coreweaver-io first.');
const manifestPath = resolve(releases, manifests.at(-1));
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const current = resolve(releases, 'coreweaver-io-current');
const routes = ['index.html', 'working-session/index.html', 'field-index/correction-records/index.html'];
const pages = await Promise.all(routes.map(async (route) => ({ route, content: await readFile(resolve(current, route), 'utf8') })));
for (const { route, content } of pages) {
  if (!content.includes('https://coreweaver.io')) throw new Error(`${route} has no coreweaver.io canonical reference.`);
  if (content.includes('https://coreweaverlabs.com')) throw new Error(`${route} retains a legacy coreweaverlabs.com canonical reference.`);
}
for (const [file, expected] of [['sitemap.xml', 'https://coreweaver.io/'], ['robots.txt', 'Sitemap: https://coreweaver.io/sitemap.xml'], ['llms.txt', 'https://coreweaver.io/']]) {
  const content = await readFile(resolve(current, file), 'utf8');
  if (!content.includes(expected) || content.includes('https://coreweaverlabs.com')) throw new Error(`${file} is not canonicalized for coreweaver.io.`);
}
const archive = resolve(releases, manifest.artifact);
if ((await stat(archive)).size === 0) throw new Error('Artifact archive is empty.');
process.stdout.write(`${JSON.stringify({ valid: true, canonicalOrigin: manifest.canonicalOrigin, artifact: manifest.artifact, sha256: manifest.sha256, routesChecked: routes.length }, null, 2)}\n`);
