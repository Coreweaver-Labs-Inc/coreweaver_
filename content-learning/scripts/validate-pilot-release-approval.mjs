import { readdir, readFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const expectedHostname = 'pilot.coreweaver.io';

const sortUnique = (values) => [...new Set(values)].sort();
const sameSet = (left, right) => JSON.stringify(sortUnique(left)) === JSON.stringify(sortUnique(right));

async function listRoutesFromBuild(buildOutput) {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      if (entry.isFile() && entry.name === 'index.html') files.push(path);
    }
  }
  await walk(buildOutput);
  return sortUnique(files.map((path) => {
    const file = relative(buildOutput, path).split(sep).join('/');
    return file === 'index.html' ? '/' : `/${file.replace(/\/index\.html$/, '')}`;
  }));
}

export async function validatePilotReleaseApproval({
  candidatePath = resolve(root, 'content-learning/input/release-candidates.json'),
  approvalPath = resolve(root, 'content-learning/input/pilot-release-approval.json'),
  buildOutput = resolve(root, 'dist')
} = {}) {
  const [candidateInput, approval] = await Promise.all([
    readFile(candidatePath, 'utf8').then(JSON.parse),
    readFile(approvalPath, 'utf8').then(JSON.parse)
  ]);
  const errors = [];
  if (approval.contractVersion !== 1) errors.push('Pilot approval contractVersion must equal 1.');
  if (approval.status !== 'approved-pilot-redeploy') errors.push('Pilot approval status must be approved-pilot-redeploy.');
  if (approval.destination?.hostname !== expectedHostname) errors.push(`Pilot approval hostname must equal ${expectedHostname}.`);
  if (!Array.isArray(approval.approvedCandidateIds) || approval.approvedCandidateIds.length === 0) errors.push('Pilot approval must list approved candidate IDs.');
  if (!Array.isArray(approval.approvedRoutes) || approval.approvedRoutes.length === 0) errors.push('Pilot approval must list approved static routes.');

  const candidates = candidateInput.candidates ?? [];
  const candidateIds = candidates.map(({ id }) => id);
  if (!sameSet(approval.approvedCandidateIds ?? [], candidateIds)) errors.push('Every current release candidate must be explicitly included in the pilot approval record; extra or missing IDs are not allowed.');
  for (const candidate of candidates) {
    const release = candidate.release ?? {};
    const decision = release.deploymentDecision ?? {};
    if (decision.status !== 'released-pilot') errors.push(`${candidate.id} is not marked released-pilot.`);
    if (decision.prospectiveHostname !== expectedHostname) errors.push(`${candidate.id} is not bound to ${expectedHostname}.`);
    if (release.publicActionPermitted !== false) errors.push(`${candidate.id} must retain publicActionPermitted: false; this record only authorizes a constrained pilot redeployment.`);
  }

  const builtRoutes = await listRoutesFromBuild(buildOutput);
  if (!sameSet(approval.approvedRoutes ?? [], builtRoutes)) {
    const unapproved = builtRoutes.filter((route) => !(approval.approvedRoutes ?? []).includes(route));
    const missing = (approval.approvedRoutes ?? []).filter((route) => !builtRoutes.includes(route));
    if (unapproved.length) errors.push(`Built artifact contains unapproved route(s): ${unapproved.join(', ')}.`);
    if (missing.length) errors.push(`Pilot approval route(s) are absent from the build: ${missing.join(', ')}.`);
  }
  if (errors.length) throw new Error(`Pilot release approval gate failed:\n- ${errors.join('\n- ')}`);
  return {
    valid: true,
    decisionId: approval.decisionId,
    hostname: expectedHostname,
    approvedCandidateCount: approval.approvedCandidateIds.length,
    approvedRouteCount: approval.approvedRoutes.length
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    process.stdout.write(`${JSON.stringify(await validatePilotReleaseApproval(), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
