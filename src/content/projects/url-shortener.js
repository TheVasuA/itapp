// Project: URL Shortener.
//
// Short links with fast redirects and click analytics, cache-first by design.
// Stack: Next.js / Go / Redis + PostgreSQL / Vercel + Cloudflare.
// Key design: base62 key generation, cache-first redirect, click-analytics queue.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'url-shortener',
  title: 'URL Shortener',
  icon: 'Link',
  summary:
    'Short links with fast redirects and click analytics, cache-first by design.',
  difficulty: 'Beginner',
  tags: ['web', 'cache', 'analytics'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js',
          icon: 'Globe',
          reason: 'Minimal UI to create and manage short links.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Go',
          icon: 'Server',
          reason: 'Low-latency redirect service with base62 key generation.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'database',
      label: 'Data',
      techs: [
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Cache-first lookups for hot short links.',
          languageKey: null,
        },
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Durable store for links and analytics.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Vercel',
          icon: 'Cloud',
          reason: 'Edge deployment for the link creation UI.',
          languageKey: null,
        },
        {
          name: 'Cloudflare',
          icon: 'Shield',
          reason: 'Edge caching and DDoS protection for redirect endpoints.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'edge', 'service', 'data'],
    nodes: [
      { id: 'browser', label: 'Browser', layer: 'client', icon: 'Globe' },
      { id: 'cf', label: 'Cloudflare Edge', layer: 'edge', icon: 'Shield' },
      { id: 'api', label: 'Redirect API (Go)', layer: 'service', icon: 'Server' },
      { id: 'keygen', label: 'Key Generator', layer: 'service', icon: 'Key' },
      { id: 'analytics', label: 'Analytics Worker', layer: 'service', icon: 'Activity' },
      { id: 'redis', label: 'Redis', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'browser', to: 'cf', label: 'GET /{code}' },
      { from: 'cf', to: 'api', label: 'cache miss' },
      { from: 'api', to: 'redis', label: 'lookup' },
      { from: 'api', to: 'pg', label: 'cache miss' },
      { from: 'api', to: 'keygen', label: 'create' },
      { from: 'keygen', to: 'pg', label: 'store' },
      { from: 'api', to: 'analytics', label: 'click event' },
      { from: 'analytics', to: 'pg', label: 'persist' },
    ],
  },
};

export default project;
