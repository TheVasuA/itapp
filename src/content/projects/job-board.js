// Project: Job Board.
//
// Post listings, search, and apply with email notifications.
// Stack: Next.js / Node.js / PostgreSQL + Elasticsearch / Vercel + AWS.
// Key design: search index, application workflow, email notification service.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'job-board',
  title: 'Job Board',
  icon: 'Briefcase',
  summary:
    'Post listings, search, and apply with email notifications.',
  difficulty: 'Beginner',
  tags: ['web', 'search', 'email'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SEO-optimized job listing pages with fast navigation.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Node.js',
          icon: 'Server',
          reason: 'REST API for listings, applications, and search.',
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
          reason: 'Jobs, companies, and application data.',
          languageKey: null,
        },
        {
          name: 'Elasticsearch',
          icon: 'Search',
          reason: 'Full-text job search with filters and facets.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Vercel + AWS',
          icon: 'Cloud',
          reason: 'Edge frontend with managed backend services.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'web', label: 'Job Board UI', layer: 'client', icon: 'Briefcase' },
      { id: 'api', label: 'Listings API', layer: 'service', icon: 'Server' },
      { id: 'search', label: 'Search Service', layer: 'service', icon: 'Search' },
      { id: 'mailer', label: 'Email Worker', layer: 'worker', icon: 'Mail' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
      { id: 'es', label: 'Elasticsearch', layer: 'data', icon: 'Search' },
    ],
    edges: [
      { from: 'web', to: 'api', label: 'HTTPS' },
      { from: 'web', to: 'search', label: 'query' },
      { from: 'api', to: 'pg', label: 'CRUD' },
      { from: 'api', to: 'mailer', label: 'notify' },
      { from: 'search', to: 'es', label: 'search' },
      { from: 'api', to: 'es', label: 'index' },
    ],
  },
};

export default project;
