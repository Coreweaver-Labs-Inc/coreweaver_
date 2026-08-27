import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const directory = path.dirname(fileURLToPath(import.meta.url));
for (const command of ['validate.mjs', 'build-exception-queue.mjs', 'build-operator-view.mjs']) {
  const result = spawnSync(process.execPath, [path.join(directory, command)], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
