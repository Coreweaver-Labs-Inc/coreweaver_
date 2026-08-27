import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const learningRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function resolveLearningPath(...parts) {
  return resolve(learningRoot, ...parts);
}

export function requireSafeMode(config) {
  if (config?.safeMode !== true) throw new Error('Closed-loop learning must run with safeMode set to true.');
  const blockedActions = ['cmsWrites', 'providerCalls', 'gitWrites', 'pullRequests', 'merges', 'deployments', 'publishing', 'dnsChanges'];
  for (const action of blockedActions) {
    if (config?.sideEffects?.[action] !== false) throw new Error(`Closed-loop learning refuses to run while ${action} is enabled.`);
  }
}

export function parseOutputDir(defaultPath) {
  const index = process.argv.indexOf('--output-dir');
  return index >= 0 && process.argv[index + 1] ? resolve(process.argv[index + 1]) : defaultPath;
}
