// Project: Music Streaming (Spotify-like).
//
// Catalog, playback, playlists, and personalized recommendations.
// Stack: React / Java (Spring) / Cassandra + PostgreSQL / AWS (S3 + CloudFront).
// Key design: audio object storage, CDN streaming, recommendation service.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'music-streaming',
  title: 'Music Streaming Platform',
  icon: 'Music',
  summary:
    'Catalog, playback, playlists, and personalized recommendations.',
  difficulty: 'Advanced',
  tags: ['streaming', 'audio', 'recommendations'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: 'Globe',
          reason: 'Rich audio player UI with playlist management.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Java (Spring Boot)',
          icon: 'Server',
          reason: 'Scalable catalog and user service with streaming APIs.',
          languageKey: 'java',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'Cassandra',
          icon: 'Database',
          reason: 'Play history and listening analytics at scale.',
          languageKey: null,
        },
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Catalog metadata, playlists, and user profiles.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'AWS (S3 + CloudFront)',
          icon: 'Cloud',
          reason: 'Audio file storage and global CDN for low-latency playback.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'player', label: 'Audio Player', layer: 'client', icon: 'Music' },
      { id: 'api', label: 'Music API', layer: 'service', icon: 'Server' },
      { id: 'recommend', label: 'Recommendation Engine', layer: 'service', icon: 'Sparkles' },
      { id: 'ingest', label: 'Ingestion Worker', layer: 'worker', icon: 'Upload' },
      { id: 'cdn', label: 'CDN (CloudFront)', layer: 'data', icon: 'Cloud' },
      { id: 's3', label: 'S3 Audio Store', layer: 'data', icon: 'HardDrive' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'player', to: 'cdn', label: 'audio stream' },
      { from: 'player', to: 'api', label: 'metadata' },
      { from: 'api', to: 'pg', label: 'catalog' },
      { from: 'api', to: 'recommend', label: 'suggest' },
      { from: 'ingest', to: 's3', label: 'upload' },
      { from: 'cdn', to: 's3', label: 'origin' },
    ],
  },
};

export default project;
