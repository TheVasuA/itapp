// Project: Blogging/CMS Platform.
//
// Author, publish, and render content with rich-text editing and SEO.
// Stack: Next.js / Node.js / PostgreSQL / Vercel.
// Key design: SSG/ISR rendering, media CDN, full-text search index.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'blogging-cms',
  title: 'Blogging & CMS Platform',
  icon: 'FileText',
  summary:
    'Author, publish, and render content with rich-text editing and SEO.',
  difficulty: 'Beginner',
  tags: ['web', 'content', 'seo'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'ISR for fast blog pages with excellent SEO.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Node.js (Express)',
          icon: 'Server',
          reason: 'Simple content API with auth and media uploads.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Rich content storage with full-text search.',
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
          reason: 'Edge deployment with ISR for the CMS frontend.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'data'],
    nodes: [
      { id: 'reader', label: 'Reader (SSG)', layer: 'client', icon: 'Globe' },
      { id: 'editor', label: 'Author Dashboard', layer: 'client', icon: 'Edit' },
      { id: 'api', label: 'Content API', layer: 'service', icon: 'Server' },
      { id: 'search', label: 'Search Index', layer: 'service', icon: 'Search' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
      { id: 'cdn', label: 'Media CDN', layer: 'data', icon: 'Cloud' },
    ],
    edges: [
      { from: 'editor', to: 'api', label: 'CRUD' },
      { from: 'api', to: 'pg', label: 'store' },
      { from: 'api', to: 'search', label: 'index' },
      { from: 'api', to: 'cdn', label: 'upload media' },
      { from: 'reader', to: 'cdn', label: 'images' },
      { from: 'reader', to: 'search', label: 'query' },
    ],
  },
};

export default project;
