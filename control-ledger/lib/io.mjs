import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export const at = (...parts) => path.join(root, ...parts);
export async function readJson(...parts) { return JSON.parse(await readFile(at(...parts), 'utf8')); }
export async function writeRun(name, value) {
  const directory = at('runs');
  await mkdir(directory, { recursive: true });
  const output = path.join(directory, name);
  await writeFile(output, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return output;
}
