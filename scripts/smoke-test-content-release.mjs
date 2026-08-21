import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const checks = JSON.parse(await readFile(resolve(root, 'content-ops/deployment-checks.json'), 'utf8'));
const deploymentUrl = process.env[checks.deploymentUrlEnvironmentVariable];

const report = {
  checkedAt: new Date().toISOString(),
  mode: checks.enabled ? 'enabled' : 'disabled-foundation',
  releaseAllowed: false,
  deploymentUrlProvided: Boolean(deploymentUrl),
  routes: [],
  skipped: !checks.enabled,
  errors: []
};

if (!checks.enabled) {
  report.reason = 'Deployment smoke checks are intentionally disabled until a separately reviewed activation change.';
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

if (!deploymentUrl) {
  report.errors.push(`Missing deployment URL environment variable: ${checks.deploymentUrlEnvironmentVariable}`);
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = 1;
} else {
  const base = new URL(deploymentUrl);
  for (const route of checks.routes) {
    const target = new URL(route, base).toString();
    const result = { target, passed: false, errors: [] };

    try {
      const response = await fetch(target, { redirect: 'manual' });
      const html = await response.text();
      result.status = response.status;
      result.contentType = response.headers.get('content-type') ?? '';

      if (response.status !== checks.required.status) result.errors.push(`Expected status ${checks.required.status}, received ${response.status}`);
      if (!result.contentType.includes('text/html')) result.errors.push('Expected an HTML response.');

      const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '';
      const description = html.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
      const canonical = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1] ?? '';
      const h1Count = (html.match(/<h1(?:\s[^>]*)?>/gi) ?? []).length;

      result.title = title;
      result.description = description;
      result.canonical = canonical;
      result.h1Count = h1Count;

      if (checks.required.title && !title) result.errors.push('Missing title.');
      if (checks.required.metaDescription && !description) result.errors.push('Missing meta description.');
      if (checks.required.singleH1 && h1Count !== 1) result.errors.push(`Expected one H1, found ${h1Count}.`);
      if (checks.required.canonical) {
        if (!canonical) result.errors.push('Missing canonical URL.');
        else if (new URL(canonical).hostname !== checks.expectedCanonicalHost) result.errors.push(`Canonical host is not ${checks.expectedCanonicalHost}.`);
      }
    } catch (error) {
      result.errors.push(error.message);
    }

    result.passed = result.errors.length === 0;
    if (!result.passed) report.errors.push(...result.errors.map((error) => `${target}: ${error}`));
    report.routes.push(result);
  }

  report.valid = report.errors.length === 0;
  console.log(JSON.stringify(report, null, 2));
  if (!report.valid) process.exitCode = 1;
}
