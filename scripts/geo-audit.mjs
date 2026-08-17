import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const configPath = valueFor('--config');
if (!configPath) throw new Error('Usage: node scripts/geo-audit.mjs --config audits/<target>.json [--out artifacts/geo-audits/<target>/<timestamp>]');

const config = JSON.parse(await readFile(configPath, 'utf8'));
validateConfig(config);
const timestamp = new Date().toISOString();
const runId = timestamp.replace(/[:.]/g, '-');
const defaultOutput = join('artifacts', 'geo-audits', config.target.id, runId);
const outputDirectory = resolve(valueFor('--out') ?? defaultOutput);
const evidenceDirectory = join(outputDirectory, 'evidence');
await mkdir(evidenceDirectory, { recursive: true });

const origin = new URL(config.target.origin);
const endpoint = (path) => new URL(path, origin).href;
const auditUrls = {
  homepage: config.target.homepage,
  robots: endpoint(config.paths.robots),
  sitemap: endpoint(config.paths.sitemap),
  llms: endpoint(config.paths.llms),
  llmsFull: config.paths.llmsFull ? endpoint(config.paths.llmsFull) : null,
  agents: config.paths.agents ? endpoint(config.paths.agents) : null,
};

const evidence = {};
for (const [label, url] of Object.entries(auditUrls)) {
  if (!url) continue;
  evidence[label] = await fetchEvidence(label, url, config.runner, evidenceDirectory);
}

const homepage = analyzeHtml(evidence.homepage.body ?? '', config);
const robots = analyzeRobots(evidence.robots.body ?? '');
const sitemap = analyzeSitemap(evidence.sitemap.body ?? '');
const scorecard = scoreAudit({ evidence, homepage, robots, sitemap, config });
const findings = createFindings({ evidence, homepage, robots, sitemap, config });
const audit = {
  auditVersion: config.version,
  runId,
  generatedAt: timestamp,
  target: {
    id: config.target.id,
    displayName: config.target.displayName,
    origin: config.target.origin,
    homepage: config.target.homepage,
    entity: config.target.entity,
  },
  provenance: {
    runner: 'scripts/geo-audit.mjs',
    deterministic: true,
    modelRequired: false,
    configSha256: sha256(JSON.stringify(config)),
    limitation: 'This audit observes public HTTP responses at one point in time. It does not prove indexing, rankings, crawler behavior, model citations, legal compliance, or commercial impact.',
  },
  scorecard,
  findings,
  evidence: Object.fromEntries(Object.entries(evidence).map(([label, item]) => [label, withoutBody(item)])),
  analysis: { homepage, robots, sitemap },
  manualReview: {
    required: [
      'Validate material claims against first-party and regulatory sources before publication.',
      'Run any model probe queries separately and retain prompt, model, locale, browsing state, raw answer, citations, and reviewer label.',
      'Compare the output to a prior run before declaring improvement or regression.',
    ],
  },
};

await writeFile(join(outputDirectory, 'audit.json'), `${JSON.stringify(audit, null, 2)}\n`);
await writeFile(join(outputDirectory, 'audit.md'), renderMarkdown(audit));
console.log(JSON.stringify({ outputDirectory, runId, scorecard: audit.scorecard, findingCount: findings.length }, null, 2));

function validateConfig(input) {
  const required = [input?.version, input?.target?.id, input?.target?.origin, input?.target?.homepage, input?.paths?.robots, input?.paths?.sitemap, input?.paths?.llms, input?.runner?.timeoutMs, input?.runner?.maxBodyBytes, input?.runner?.userAgent];
  if (required.some((value) => value === undefined || value === null || value === '')) throw new Error('Configuration is missing one or more required GEO Audit v2 fields.');
  if (input.version !== '2.0') throw new Error(`Unsupported audit version: ${input.version}`);
  const targetOrigin = new URL(input.target.origin).origin;
  if (new URL(input.target.homepage).origin !== targetOrigin) throw new Error('Homepage must use the configured target origin.');
  for (const path of Object.values(input.paths)) if (path && !path.startsWith('/')) throw new Error(`Configured public path must begin with '/': ${path}`);
}

async function fetchEvidence(label, url, runner, destination) {
  const fetchedAt = new Date().toISOString();
  const base = { label, requestedUrl: url, fetchedAt, status: null, finalUrl: null, headers: {}, bodyBytes: 0, bodySha256: null, bodyFile: null, error: null, body: '' };
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': runner.userAgent, 'accept': 'text/html,application/xhtml+xml,application/xml,text/plain,application/json;q=0.9,*/*;q=0.1' },
      signal: AbortSignal.timeout(runner.timeoutMs),
    });
    const data = new Uint8Array(await response.arrayBuffer());
    const clipped = data.slice(0, runner.maxBodyBytes);
    const body = new TextDecoder().decode(clipped);
    const fileName = `${label}.${contentExtension(response.headers.get('content-type'))}`;
    await writeFile(join(destination, fileName), body);
    return {
      ...base,
      status: response.status,
      ok: response.ok,
      finalUrl: response.url,
      headers: pickHeaders(response.headers),
      bodyBytes: data.byteLength,
      truncated: data.byteLength > runner.maxBodyBytes,
      bodySha256: sha256(body),
      bodyFile: `evidence/${fileName}`,
      body,
    };
  } catch (error) {
    return { ...base, ok: false, error: `${error.name}: ${error.message}` };
  }
}

function pickHeaders(headers) {
  const selected = ['content-type', 'cache-control', 'etag', 'last-modified', 'x-robots-tag', 'content-language'];
  return Object.fromEntries(selected.map((name) => [name, headers.get(name)]).filter(([, value]) => value));
}

function contentExtension(contentType = '') {
  if (contentType.includes('json')) return 'json';
  if (contentType.includes('xml')) return 'xml';
  if (contentType.includes('html')) return 'html';
  return 'txt';
}

function analyzeHtml(html, input) {
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => match[1].trim());
  const jsonLd = scripts.map((source, index) => {
    try { return { index, valid: true, value: JSON.parse(source) }; }
    catch (error) { return { index, valid: false, error: error.message }; }
  });
  const schemaTypes = [...new Set(jsonLd.filter((entry) => entry.valid).flatMap((entry) => collectSchemaTypes(entry.value)))].sort();
  const visibleText = textFromHtml(html);
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i) ?? firstMatch(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const canonical = firstMatch(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i);
  const h1 = firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const robots = firstMatch(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const ogDescription = firstMatch(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const twitterDescription = firstMatch(html, /<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']*)["'][^>]*>/i);
  const hreflangCount = (html.match(/\bhreflang=["']/gi) ?? []).length;
  const images = [...html.matchAll(/<img\b([^>]*)>/gi)].map((match) => ({ alt: firstMatch(match[1], /\balt=["']([^"']*)["']/i) }));
  const entitySurfaces = { title, description, h1: h1 ? textFromHtml(h1) : null, jsonLd: JSON.stringify(jsonLd.filter((entry) => entry.valid).map((entry) => entry.value)), visibleText };
  const cueCoverage = Object.fromEntries((input.expectations?.entityCues ?? input.target.entity.qualifiers).map((cue) => [cue, Object.fromEntries(Object.entries(entitySurfaces).map(([surface, value]) => [surface, countOccurrences(value ?? '', cue)]))]));
  return {
    htmlBytes: Buffer.byteLength(html),
    visibleTextLength: visibleText.length,
    title: title ? textFromHtml(title) : null,
    description,
    canonical,
    h1: h1 ? textFromHtml(h1) : null,
    robots,
    ogDescription,
    twitterDescription,
    hreflangCount,
    jsonLd: { blocks: jsonLd.length, validBlocks: jsonLd.filter((entry) => entry.valid).length, invalidBlocks: jsonLd.filter((entry) => !entry.valid), schemaTypes },
    images: { total: images.length, missingAlt: images.filter((image) => !image.alt || image.alt.trim().length < 3).length },
    cueCoverage,
  };
}

function analyzeRobots(text) {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/#.*/, '').trim()).filter(Boolean);
  const sitemapUrls = lines.filter((line) => /^sitemap\s*:/i.test(line)).map((line) => line.split(':').slice(1).join(':').trim());
  const groups = [];
  let group = { agents: [], directives: [] };
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    const value = rest.join(':').trim();
    if (!key || !value) continue;
    if (key.toLowerCase() === 'user-agent') {
      if (group.directives.length) { groups.push(group); group = { agents: [], directives: [] }; }
      group.agents.push(value.toLowerCase());
    } else if (group.agents.length) group.directives.push({ key: key.toLowerCase(), value });
  }
  if (group.agents.length) groups.push(group);
  const namedBots = ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'ClaudeBot', 'PerplexityBot'];
  const botPolicies = Object.fromEntries(namedBots.map((bot) => {
    const explicit = groups.find((entry) => entry.agents.includes(bot.toLowerCase()));
    const generic = groups.find((entry) => entry.agents.includes('*'));
    const selected = explicit ?? generic;
    return [bot, {
      source: explicit ? 'explicit' : generic ? 'generic' : 'unknown',
      allow: selected?.directives.filter((item) => item.key === 'allow').map((item) => item.value) ?? [],
      disallow: selected?.directives.filter((item) => item.key === 'disallow').map((item) => item.value) ?? [],
    }];
  }));
  return { lines: lines.length, sitemapUrls, groups: groups.map((entry) => ({ agents: entry.agents, directives: entry.directives })), botPolicies };
}

function analyzeSitemap(xml) {
  return { locCount: (xml.match(/<loc>/gi) ?? []).length, urls: [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((match) => match[1].trim()).slice(0, 100) };
}

function scoreAudit({ evidence: e, homepage, robots, sitemap, config: input }) {
  const modules = [];
  const add = (name, max, observed, covered, note) => modules.push({ name, maxPoints: max, observedPoints: observed, covered, note });
  const homeOk = e.homepage?.ok && homepage.visibleTextLength > 200;
  add('Public HTML surface', 10, homeOk ? 10 : 0, Boolean(e.homepage?.status), homeOk ? 'Homepage returned substantive extractable text.' : 'Homepage response was unavailable or did not yield substantive extractable text.');
  const metadataParts = [homepage.title, homepage.description, homepage.canonical, homepage.h1].filter(Boolean).length;
  add('Metadata and canonicalization', 20, Math.round((metadataParts / 4) * 20), Boolean(e.homepage?.status), `${metadataParts}/4 core metadata fields were observed.`);
  const expected = input.expectations?.homepageSchemaTypes ?? [];
  const expectedFound = expected.filter((type) => homepage.jsonLd.schemaTypes.includes(type)).length;
  const structuredCovered = Boolean(e.homepage?.status);
  add('Structured data', 20, expected.length ? Math.round((expectedFound / expected.length) * 20) : 0, structuredCovered, expected.length ? `${expectedFound}/${expected.length} configured expected schema types were found.` : 'No schema expectation is configured.');
  const robotsScore = e.robots?.ok ? 10 : 0;
  const explicitBlocks = Object.values(robots.botPolicies).filter((policy) => policy.source === 'explicit' && policy.disallow.length > 0).length;
  add('Crawler policy', 15, robotsScore + (e.robots?.ok && explicitBlocks === 0 ? 5 : 0), Boolean(e.robots?.status), e.robots?.ok ? `${robots.sitemapUrls.length} sitemap directive(s) found; ${explicitBlocks} named bot policy/policies explicitly disallow paths.` : 'robots.txt was not fetched successfully.');
  add('Sitemap availability', 10, e.sitemap?.ok && sitemap.locCount > 0 ? 10 : 0, Boolean(e.sitemap?.status), e.sitemap?.ok ? `${sitemap.locCount} location entries found in the sitemap response.` : 'Sitemap was not fetched successfully.');
  const guidance = [e.llms, e.llmsFull, e.agents].filter(Boolean);
  const guidanceSuccesses = guidance.filter((item) => item.ok).length;
  add('Machine guidance surfaces', 10, Math.round((guidanceSuccesses / Math.max(guidance.length, 1)) * 10), guidance.length > 0, `${guidanceSuccesses}/${guidance.length} configured guidance surfaces returned success status.`);
  const cueRows = Object.values(homepage.cueCoverage).flatMap((coverage) => Object.values(coverage));
  const cueHits = cueRows.filter((count) => count > 0).length;
  add('Configured entity-cue consistency', 15, cueRows.length ? Math.round((cueHits / cueRows.length) * 15) : 0, Boolean(e.homepage?.status), `${cueHits}/${cueRows.length} configured cue/surface pairs were observed. This is consistency coverage, not an authority score.`);
  const observedPoints = modules.reduce((sum, module) => sum + module.observedPoints, 0);
  const maxPoints = modules.reduce((sum, module) => sum + module.maxPoints, 0);
  const coveredModules = modules.filter((module) => module.covered).length;
  return { observedPoints, maxPoints, normalizedScore: maxPoints ? Number(((observedPoints / maxPoints) * 100).toFixed(1)) : null, evidenceCoveragePct: Number(((coveredModules / modules.length) * 100).toFixed(1)), modules };
}

function createFindings({ evidence: e, homepage, robots, sitemap, config: input }) {
  const findings = [];
  const add = (id, severity, status, summary, evidenceLabels, recommendation) => findings.push({ id, severity, status, summary, evidence: evidenceLabels, recommendation });
  if (!e.llms?.ok) add('machine-guidance-llms', 'medium', 'confirmed', `Configured llms.txt endpoint returned ${e.llms?.status ?? 'a transport error'} during this run.`, ['llms'], 'Verify the endpoint from a second network context, then either repair the response or document why the surface is intentionally unavailable.');
  if (!e.robots?.ok) add('robots-unavailable', 'high', 'confirmed', 'robots.txt was not successfully fetched.', ['robots'], 'Restore a public robots.txt response before expanding automated collection.');
  if (e.robots?.ok && robots.sitemapUrls.length === 0) add('robots-without-sitemap', 'low', 'confirmed', 'robots.txt did not expose a sitemap directive.', ['robots'], 'Publish at least one sitemap directive if a sitemap is available.');
  if (!e.sitemap?.ok || sitemap.locCount === 0) add('sitemap-unavailable', 'medium', 'confirmed', 'Configured sitemap did not return parseable location entries.', ['sitemap'], 'Verify the canonical sitemap URL and XML response.');
  if (!homepage.canonical) add('canonical-missing', 'medium', 'confirmed', 'No canonical link was extracted from the homepage response.', ['homepage'], 'Add a single absolute canonical URL that matches the intended public page.');
  if (!homepage.description) add('meta-description-missing', 'low', 'confirmed', 'No standard meta description was extracted from the homepage response.', ['homepage'], 'Add a concise description that accurately names the entity and the visible offering.');
  if (homepage.ogDescription && homepage.twitterDescription && homepage.ogDescription !== homepage.twitterDescription) add('social-description-conflict', 'low', 'confirmed', 'Open Graph and Twitter descriptions differ in the current homepage response.', ['homepage'], 'Align material brand and entity wording across standard, Open Graph, and Twitter metadata.');
  if (homepage.jsonLd.invalidBlocks.length > 0) add('jsonld-parse-errors', 'medium', 'confirmed', `${homepage.jsonLd.invalidBlocks.length} JSON-LD block(s) could not be parsed.`, ['homepage'], 'Validate the JSON-LD source and preserve only complete, visible-content-aligned markup.');
  const expected = input.expectations?.homepageSchemaTypes ?? [];
  const missingTypes = expected.filter((type) => !homepage.jsonLd.schemaTypes.includes(type));
  if (missingTypes.length) add('expected-schema-types-not-observed', 'medium', 'observed_gap', `Configured expected schema types were not observed: ${missingTypes.join(', ')}.`, ['homepage'], 'Confirm whether these types are still appropriate for the target, then add accurate visible-content-aligned markup or revise the expectation.');
  if (homepage.images.total > 0 && homepage.images.missingAlt > 0) add('image-alt-coverage', 'low', 'confirmed', `${homepage.images.missingAlt}/${homepage.images.total} extracted images lack useful alt text.`, ['homepage'], 'Add informative alt text to meaningful images and empty alt text only to decorative images.');
  const entityHits = Object.values(homepage.cueCoverage).flatMap((coverage) => Object.values(coverage)).filter((count) => count > 0).length;
  if (entityHits === 0) add('entity-cues-not-observed', 'medium', 'observed_gap', 'None of the configured entity qualifiers were observed in inspected homepage surfaces.', ['homepage'], 'Review the configured entity qualifier and add accurate disambiguating language to visible content and entity markup where appropriate.');
  if (e.homepage?.ok && homepage.visibleTextLength > 200) add('old-js-shell-claim-requires-retest', 'info', 'superseded_hypothesis', 'The current public response yielded substantive extractable homepage text, so the historical blank-JavaScript-shell claim should not be reused without a controlled renderer comparison.', ['homepage'], 'Replace the historical absolute claim with evidence from repeated rendering tests across relevant crawler contexts.');
  return findings;
}

function renderMarkdown(audit) {
  const lines = [
    `# GEO Audit v${audit.auditVersion}: ${audit.target.displayName}`,
    '',
    `> **Run:** ${audit.generatedAt}  `,
    `> **Target:** ${audit.target.homepage}  `,
    `> **Method:** deterministic public HTTP evidence collection; no language model required.`,
    '',
    '## Scorecard',
    '',
    '| Module | Observed points | Evidence coverage | Note |',
    '|---|---:|---|---|',
    ...audit.scorecard.modules.map((module) => `| ${module.name} | ${module.observedPoints}/${module.maxPoints} | ${module.covered ? 'Observed' : 'Unavailable'} | ${module.note} |`),
    '',
    `**Observed score:** ${audit.scorecard.observedPoints}/${audit.scorecard.maxPoints} (${audit.scorecard.normalizedScore}/100). **Evidence coverage:** ${audit.scorecard.evidenceCoveragePct}%.`,
    '',
    '> This score measures only configured public checks. It is not a ranking, citation, legal-compliance, crawler-access, or commercial-impact guarantee.',
    '',
    '## Findings',
    '',
    ...(audit.findings.length ? audit.findings.map((finding) => `### ${finding.severity.toUpperCase()} — ${finding.summary}\n\n**Status:** ${finding.status}. **Evidence:** ${finding.evidence.join(', ')}.\n\n**Recommended next step:** ${finding.recommendation}\n`) : ['No findings were generated from the configured checks.']),
    '## Evidence package',
    '',
    '| Surface | Status | Final URL | Evidence file |',
    '|---|---:|---|---|',
    ...Object.entries(audit.evidence).map(([label, item]) => `| ${label} | ${item.status ?? 'error'} | ${item.finalUrl ?? item.requestedUrl} | ${item.bodyFile ?? 'none'} |`),
    '',
    '## Required manual review',
    '',
    ...audit.manualReview.required.map((item) => `- ${item}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function collectSchemaTypes(value) {
  if (Array.isArray(value)) return value.flatMap(collectSchemaTypes);
  if (!value || typeof value !== 'object') return [];
  const type = value['@type'];
  const own = Array.isArray(type) ? type : type ? [type] : [];
  return [...own, ...Object.values(value).flatMap(collectSchemaTypes)];
}

function textFromHtml(value) {
  return decodeEntities(value.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, ' ').replace(/\s+/g, ' ').trim());
}

function decodeEntities(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function firstMatch(value, pattern) {
  const match = value.match(pattern);
  return match?.[1]?.trim() || null;
}

function countOccurrences(value, needle) {
  return (value.match(new RegExp(escapeRegExp(needle), 'gi')) ?? []).length;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function withoutBody(item) {
  const { body, ...summary } = item;
  return summary;
}
