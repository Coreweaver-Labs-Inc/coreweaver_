import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..', '..');

test('daily pilot release is static, fixed-target, guarded, and artifact-backed', async () => {
  const workflow = await readFile(resolve(root, '.github/workflows/daily-pilot-release.yml'), 'utf8');
  const deploy = await readFile(resolve(root, 'scripts/deploy-pilot-hostinger.mjs'), 'utf8');
  assert.match(workflow, /schedule:/);
  assert.match(workflow, /npm run content:validate-release-candidates/);
  assert.match(workflow, /npm run test:learning/);
  assert.match(workflow, /npm run ledger:validate/);
  assert.match(workflow, /npm run content:validate-pilot-release-approval/);
  assert.match(workflow, /NOTION_TOKEN: ''/);
  assert.match(workflow, /NOTION_BLOG_POSTS_DB_ID: ''/);
  assert.match(workflow, /retention-days: 30/);
  assert.match(workflow, /github\.event_name == 'schedule' && vars\.PILOT_PUBLISH_ENABLED == 'true'/);
  assert.match(workflow, /https:\/\/pilot\.coreweaver\.io\/working-session\//);
  assert.match(deploy, /const pilotHostname = 'pilot\.coreweaver\.io'/);
  assert.match(deploy, /PILOT_PUBLISH_ENABLED must equal true/);
  assert.match(deploy, /archive_path: archiveName/);
  for (const forbidden of [/git\s+push/i, /vercel/i, /coreweaverlabs\.com\/deploy/i, /websites\/coreweaver\.io\/deploy/i]) {
    assert.equal(forbidden.test(`${workflow}\n${deploy}`), false, `Unexpected target/action: ${forbidden}`);
  }
});
