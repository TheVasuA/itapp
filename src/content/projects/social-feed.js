// Project: Social Media Feed.
//
// Follow graph with ranked timeline, media uploads, and engagement.
// Stack: Next.js / Java (Spring) / Cassandra + Redis / AWS.
// Key design: fan-out-on-write, feed cache, object storage + CDN for media.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'social-feed',
  title: 'Social Media Feed',
  icon: 'Rss',
  summary:
    'Follow graph with ranked timeline, media uploads, and engagement.',
  difficulty: 'Advanced',
  tags: ['social', 'feed', 'timeline'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SSR for SEO-friendly profiles and infinite-scroll feed.',
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
          reason: 'Enterprise-grade service layer for feed ranking and graph.',
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
          reason: 'Wide-column store for high-throughput feed writes.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Feed cache and follower fan-out coordination.',
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
          reason: 'Object storage and CDN for user-uploaded media.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'web', label: 'Web App', layer: 'client', icon: 'Globe' },
      { id: 'api', label: 'Feed API', layer: 'service', icon: 'Server' },
      { id: 'graph', label: 'Graph Service', layer: 'service', icon: 'Users' },
      { id: 'fanout', label: 'Fan-out Worker', layer: 'worker', icon: 'Share2' },
      { id: 'media', label: 'Media Processor', layer: 'worker', icon: 'Image' },
      { id: 'redis', label: 'Redis Feed Cache', layer: 'data', icon: 'Zap' },
      { id: 'cassandra', label: 'Cassandra', layer: 'data', icon: 'Database' },
      { id: 's3', label: 'S3 + CDN', layer: 'data', icon: 'Cloud' },
    ],
    edges: [
      { from: 'web', to: 'api', label: 'HTTPS' },
      { from: 'api', to: 'redis', label: 'feed read' },
      { from: 'api', to: 'graph', label: 'followers' },
      { from: 'api', to: 'fanout', label: 'new post' },
      { from: 'fanout', to: 'redis', label: 'push to feeds' },
      { from: 'fanout', to: 'cassandra', label: 'persist' },
      { from: 'api', to: 'media', label: 'upload' },
      { from: 'media', to: 's3', label: 'store' },
    ],
  },
};

export default project;
