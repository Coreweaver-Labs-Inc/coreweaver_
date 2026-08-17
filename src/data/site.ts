export const site = {
  name: 'Coreweaver Labs',
  url: 'https://coreweaverlabs.com',
  title: 'GEO Made Simple. | Coreweaver Labs',
  description: 'Coreweaver Labs makes brands, products, and organizations easier for people and AI systems to understand, verify, and cite.',
  slogan: 'GEO Made Simple.',
  founder: 'Mason Nguyen',
  contact: 'hello@coreweaverlabs.com',
  topics: [
    'Generative Engine Optimization',
    'GEO signal architecture',
    'AI-readable content systems',
    'structured data',
    'knowledge graphs',
    'agent interoperability',
    'accountable AI operations',
  ],
} as const;

export const services = [
  {
    name: 'GEO Signal Architecture',
    summary: 'Make your organization clearer, more consistent, and easier to cite across search and answer systems.',
    href: '/blog',
  },
  {
    name: 'ARM Framework',
    summary: 'A practical pattern for agents that operate within explicit authority, recover safely, and leave an auditable record.',
    href: '/framework/arm/',
  },
  {
    name: 'Open Interfaces',
    summary: 'Publish durable HTML, JSON-LD, text, and repository documentation that any browser, crawler, model, or harness can use.',
    href: '/agents',
  },
] as const;

export const primitives = [
  ['01', 'Mandate Chain', 'Every important action has a named objective, an owner, and a reviewable scope.'],
  ['02', 'Signal Architecture', 'Facts, sources, relationships, and confidence are made explicit instead of hidden in prompts.'],
  ['03', 'Checkpoint Recovery', 'Work can resume from durable state rather than silently restarting or losing context.'],
  ['04', 'Graceful Escalation', 'Uncertainty has a clear path to a human decision; silence is never treated as approval.'],
  ['05', 'Immutable Audit Sovereignty', 'Material changes leave an append-only, verifiable history that no worker can rewrite.'],
] as const;

export const faqs = [
  {
    question: 'What is Coreweaver Labs?',
    answer: 'Coreweaver Labs builds GEO and agent-operability infrastructure that helps organizations become easier for people and AI systems to understand, verify, and cite.',
  },
  {
    question: 'What does GEO mean here?',
    answer: 'GEO means Generative Engine Optimization: the practice of making useful, accurate, well-structured information more discoverable and citable in AI-generated answers.',
  },
  {
    question: 'Which AI tools can work with this site?',
    answer: 'Any tool that can read HTML, JSON, Markdown, plain text, Git, or standard HTTP APIs can work with the site. The repository does not require a particular model, assistant, IDE, or agent vendor.',
  },
  {
    question: 'Is a proprietary agent platform required?',
    answer: 'No. The source is a normal Git repository with an Astro build, npm lockfile, static assets, documented environment variables, and standard CI. Teams may use Claude, Codex, Copilot, Kimi, Antigravity, other tools, or no AI tool at all.',
  },
] as const;

export const network = [
  ['Arctura Network', 'arctura.network', 'Ecosystem connective tissue.'],
  ['AURE', 'au-re.org', 'Architecture remediation and CMS infrastructure.'],
  ['Swell Marketing', 'swellmarketing.xyz', 'Growth execution and distribution.'],
  ['GitHub', 'github.com/Coreweaver-Labs-Inc', 'Public source, history, and collaboration.'],
] as const;

export const sameAs = [
  'https://github.com/Coreweaver-Labs-Inc/coreweaver_',
  'https://github.com/Coreweaver-Labs-Inc',
  'https://www.linkedin.com/in/mason-nguyen',
  'https://virtualmase.github.io/ai-mastery/',
  'https://arctura.network',
  'https://au-re.org',
  'https://swellmarketing.xyz',
] as const;
