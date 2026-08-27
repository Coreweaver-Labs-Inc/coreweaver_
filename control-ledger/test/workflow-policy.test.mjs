import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the Control Ledger workflow is a read-only validation path', async () => {
  const workflow = await readFile(new URL('../../.github/workflows/control-ledger-check.yml', import.meta.url), 'utf8');
  assert.match(workflow, /contents: read/);
  assert.match(workflow, /workflow_dispatch:/);
  for (const forbidden of ['schedule:', 'permissions: write', 'git push', 'gh pr create', 'deployment', 'curl ', 'secrets.', 'notion', 'openrouter']) assert.equal(workflow.includes(forbidden), false, `Workflow must not include ${forbidden}`);
});
