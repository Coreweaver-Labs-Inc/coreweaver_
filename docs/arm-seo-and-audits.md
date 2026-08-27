# ARM SEO and production audit record

## Route metadata

The ARM page now supplies a route-specific description, canonical URL, a 1200 × 630 Open Graph image, image alt text, and corresponding Twitter card metadata. The image contains only the public page positioning already present on the route; it does not add platform, outcome, compliance, or certification claims.

## Release-triggered Lighthouse audit

The `Audit ARM production page` workflow runs when GitHub receives a successful deployment status for the repository's Production environment. It audits `https://coreweaverlabs.com/autonomous-resource-management` for performance and accessibility, then retains HTML and JSON reports as a workflow artifact for 30 days. A manual workflow dispatch is also available for an on-demand production check.

The workflow observes deployment results; it does not trigger, modify, or publish deployments. It applies no score threshold in this first release, so the audit establishes an inspectable baseline before any metric is made release-blocking.

## Validation required

Generate the social card before building the site:

```bash
node scripts/generate-arm-social-card.mjs
npm run build
npm test
```

After merge, manually dispatch the workflow once to establish the first production report. Subsequent successful Production deployments trigger it automatically.
