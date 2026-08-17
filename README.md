# Coreweaver Labs

**Growth Infrastructure for the Agentic Era.**

Coreweaver Labs builds the infrastructure layer between "agents work" and "agents can be trusted at enterprise scale." We specialize in GEO (Generative Engine Optimization) signal architecture, the ARM Framework for accountable AI deployment, and autonomous operational systems.

## 🏛️ The Mandate: ARM Framework

The **Autonomous Resource Management (ARM) Framework** defines five primitives for accountable agentic systems:

1.  **Mandate Chain:** Every agent action traces to a named human-approved directive.
2.  **Signal Architecture:** Explicit data source hierarchy and confidence thresholds.
3.  **Checkpoint Recovery:** Durable state serialization and resume-not-restart resilience.
4.  **Graceful Escalation:** Defined triggers for human intervention.
5.  **Immutable Audit Sovereignty:** Append-only Truth Ledger for every action.

## 🛠️ The Stack

-   **AURE Swarm:** 16 specialized agents operating via BFT consensus.
-   **GBrain:** Open-source agentic memory layer on Postgres + pgvector.
-   **VaaS:** Verification-as-a-Service for EU AI Act compliance.
-   **GEO Signal:** Citation-optimized content architecture for the LLM era.

## 👥 Contributors & Ecosystem

Coreweaver Labs is an independent entity that contributes to the **[Arctura-Collective](https://github.com/Arctura-Collective)**, a sovereign network of specialized builders:

-   **Mason Nguyen:** Founder & Chief Architect.
-   **Arctura-Collective:** The central hub for collaborative infrastructure.
-   **Operon (ARCTURA):** Contributors to the decentralized compute and security layer.
-   **AURE:** Partners in architecture remediation and CMS infrastructure.
-   **Swell Marketing:** Growth execution and distribution infrastructure.

## 🚀 Getting Started

This is an Astro-based static project with a provider-neutral public interface. The slogan is **GEO Made Simple.** Any browser, crawler, coding agent, IDE, CI runner, or human contributor can inspect and revise it using standard Git, HTML, JSON-LD, JSON, Markdown, plain text, and npm.

Machine-readable surfaces are published at [`/agents/manifest.json`](https://coreweaverlabs.com/agents/manifest.json), [`/llms.txt`](https://coreweaverlabs.com/llms.txt), [`/llms-full.txt`](https://coreweaverlabs.com/llms-full.txt), [`/AGENTS.md`](https://coreweaverlabs.com/AGENTS.md), and [`/sitemap.xml`](https://coreweaverlabs.com/sitemap.xml). No proprietary assistant, agent runtime, or hosted control plane is required.

```sh
npm install
npm run dev
```

### 🧞 Commands

| Command         | Action                                      |
| :-------------- | :------------------------------------------ |
| `npm run dev`   | Starts local dev server at `localhost:4321` |
| `npm run build` | Build your production site to `./dist/`     |
| `npm ci`        | Install the locked dependency set            |

## CI and deployment

Every push and pull request can be validated with the standard GitHub Actions workflow in `.github/workflows/ci.yml`. The workflow installs with `npm ci`, runs `npm run build`, parses the public JSON manifest, and checks that the machine-readable surfaces are emitted. The existing Vercel configuration remains a deployment target, while the static `dist/` output can also be served by GitHub Pages, Cloudflare Pages, Netlify, object storage, or another standard static host.

## 📄 License

© 2026 Coreweaver Labs Inc. MIT License. Built on Bittensor and sovereign infrastructure.
