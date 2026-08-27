import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const origin = 'https://coreweaver.io';
const legacyOrigin = 'https://coreweaverlabs.com';
const dist = resolve(root, 'dist');
const releases = resolve(root, 'release-artifacts');
const current = resolve(releases, 'coreweaver-io-current');

export const canonicalizeText = (value) => value.replaceAll(legacyOrigin, origin);

async function filePaths(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filePaths(path);
    return [path];
  }));
  return paths.flat();
}

async function rewritePublicText(directory) {
  const publicText = new Set(['.html', '.xml', '.txt', '.json']);
  for (const path of await filePaths(directory)) {
    if (!publicText.has(path.slice(path.lastIndexOf('.')))) continue;
    const source = await readFile(path, 'utf8');
    const canonical = canonicalizeText(source);
    if (canonical !== source) await writeFile(path, canonical, 'utf8');
  }
}

export async function prepareArtifact({ sourceCommit = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim() } = {}) {
  execFileSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, COREWEAVER_PUBLIC_ORIGIN: origin },
  });
  await rm(current, { recursive: true, force: true });
  await mkdir(releases, { recursive: true });
  await cp(dist, current, { recursive: true });
  await rewritePublicText(current);

  const artifactName = `coreweaver-io-${sourceCommit}.tar.gz`;
  const artifact = resolve(releases, artifactName);
  await rm(artifact, { force: true });
  execFileSync('tar', ['--sort=name', '--mtime=UTC 2026-08-27', '--owner=0', '--group=0', '--numeric-owner', '-czf', artifact, '-C', current, '.'], { cwd: root });
  const checksum = createHash('sha256').update(await readFile(artifact)).digest('hex');
  const files = (await filePaths(current)).map((path) => relative(current, path)).sort();
  const manifest = {
    artifactVersion: 1,
    sourceCommit,
    canonicalOrigin: origin,
    generatedAt: new Date().toISOString(),
    artifact: artifactName,
    sha256: checksum,
    files,
    actionBoundary: 'Prepared static artifact only. No Hostinger deployment, DNS, TLS, canonical production change, Vercel domain change, pause, or deletion is performed by this script.',
    rollback: 'Retain the current Hostinger root backup and current Vercel production deployment until the approved apex release passes the cutover verification package.'
  };
  await writeFile(resolve(releases, `${artifactName}.manifest.json`), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(resolve(releases, `${artifactName}.sha256`), `${checksum}  ${artifactName}\n`, 'utf8');
  return { artifact, checksum, manifest };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { artifact, checksum, manifest } = await prepareArtifact();
  process.stdout.write(`${JSON.stringify({ artifact, checksum, manifest }, null, 2)}\n`);
}
