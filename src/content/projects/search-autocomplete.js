// Project: Search Engine/Autocomplete.
//
// Indexed search with prefix suggestions and ranked results.
// Stack: Next.js / Python (FastAPI) / Elasticsearch + Redis / AWS.
// Key design: inverted index, trie/prefix cache for autocomplete, ingestion pipeline.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'search-autocomplete',
  title: 'Search Engine & Autocomplete',
  icon: 'Search',
  summary:
    'Indexed search with prefix suggestions and ranked results.',
  difficulty: 'Intermediate',
  tags: ['search', 'autocomplete', 'indexing'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'Fast search UI with SSR for initial results page.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Python (FastAPI)',
          icon: 'Server',
          reason: 'Async search API and ingestion pipeline.',
          languageKey: 'python',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'Elasticsearch',
          icon: 'Database',
          reason: 'Inverted index for full-text search and ranking.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Trie-based prefix cache for instant autocomplete.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'AWS',
          icon: 'Cloud',
          reason: 'Managed Elasticsearch and auto-scaling workers.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'ui', label: 'Search UI', layer: 'client', icon: 'Search' },
      { id: 'api', label: 'Search API', layer: 'service', icon: 'Server' },
      { id: 'suggest', label: 'Autocomplete Service', layer: 'service', icon: 'Type' },
      { id: 'indexer', label: 'Indexer Worker', layer: 'worker', icon: 'RefreshCw' },
      { id: 'es', label: 'Elasticsearch', layer: 'data', icon: 'Database' },
      { id: 'redis', label: 'Redis (Trie)', layer: 'data', icon: 'Zap' },
    ],
    edges: [
      { from: 'ui', to: 'api', label: 'query' },
      { from: 'ui', to: 'suggest', label: 'prefix' },
      { from: 'api', to: 'es', label: 'search' },
      { from: 'suggest', to: 'redis', label: 'lookup' },
      { from: 'indexer', to: 'es', label: 'ingest' },
      { from: 'indexer', to: 'redis', label: 'update trie' },
    ],
  },
};

export default project;
