import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validatePilotReleaseApproval } from '../scripts/validate-pilot-release-approval.mjs';

const root = new URL('../..', import.meta.url);
const sourceCandidates = new URL('../input/release-candidates.json', import.meta.url);
const sourceApproval = new URL('../input/pilot-release-approval.json', import.meta.url);

async function fixture() {
  const directory = await mkdtemp(join(tmpdir(), 'coreweaver-pilot-approval-'));
  const candidates = JSON.parse(await readFile(sourceCandidates, 'utf8'));
  const approval = JSON.parse(await readFile(sourceApproval, 'utf8'));
  const candidatePath = join(directory, 'candidates.json');
  const approvalPath = join(directory, 'approval.json');
  const buildOutput = join(directory, 'dist');
  await mkdir(buildOutput, { recursive: true });
  for (const route of approval.approvedRoutes) {
    const output = route === '/' ? join(buildOutput, 'index.html') : join(buildOutput, route.slice(1), 'index.html');
    await mkdir(join(output, '..'), { recursive: true });
    await writeFile(output, '<!doctype html>');
  }
  await writeFile(candidatePath, JSON.stringify(candidates));
  await writeFile(approvalPath, JSON.stringify(approval));
  return { directory, candidates, approval, candidatePath, approvalPath, buildOutput };
}

test('pilot approval gate accepts exactly the named released-pilot candidates and static routes', async (t) => {
  const setup = await fixture();
  t.after(() => rm(setup.directory, { recursive: true, force: true }));
  await assert.doesNotReject(() => validatePilotReleaseApproval(setup));
});

test('pilot approval gate rejects a proposed candidate or an unapproved built route', async (t) => {
  const setup = await fixture();
  t.after(() => rm(setup.directory, { recursive: true, force: true }));
  setup.candidates.candidates[0].release.deploymentDecision.status = 'proposed';
  await writeFile(setup.candidatePath, JSON.stringify(setup.candidates));
  await assert.rejects(() => validatePilotReleaseApproval(setup), /not marked released-pilot/);
  setup.candidates.candidates[0].release.deploymentDecision.status = 'released-pilot';
  await writeFile(setup.candidatePath, JSON.stringify(setup.candidates));
  await mkdir(join(setup.buildOutput, 'unapproved'), { recursive: true });
  await writeFile(join(setup.buildOutput, 'unapproved', 'index.html'), '<!doctype html>');
  await assert.rejects(() => validatePilotReleaseApproval(setup), /unapproved route/);
});
