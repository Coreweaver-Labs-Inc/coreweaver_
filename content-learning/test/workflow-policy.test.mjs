import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..', '..');

test('scheduled content-learning workflow is read-only and artifact-only', async () => {
  const workflow = await readFile(resolve(root, '.github/workflows/content-learning-loop.yml'), 'utf8');
  assert.match(workflow, /permissions:\n\s+contents: read/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /npm run learning:run/);
  assert.match(workflow, /npm run test:learning/);
  assert.match(workflow, /actions\/upload-artifact@v4/);
  for (const forbiddenPattern of [/pull-requests:/, /issues:/, /\bgh\b/, /\bvercel\b/i, /\bnotion\b/i, /openrouter/i, /curl\s+.*POST/i, /git\s+push/i]) {
    assert.equal(forbiddenPattern.test(workflow), false, `Forbidden scheduled action found: ${forbiddenPattern}`);
  }
});
