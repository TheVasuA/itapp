// Project: Photo Sharing (Instagram-like).
//
// Upload photos, browse feeds, and interact with likes and comments.
// Stack: React Native / Python (FastAPI) / PostgreSQL + Cassandra / AWS.
// Key design: image processing queue, object storage + CDN, feed cache.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'photo-sharing',
  title: 'Photo Sharing Platform',
  icon: 'Camera',
  summary:
    'Upload photos, browse feeds, and interact with likes and comments.',
  difficulty: 'Intermediate',
  tags: ['social', 'media', 'mobile'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React Native',
          icon: 'Smartphone',
          reason: 'Native-feel mobile app for photo capture and browsing.',
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
          reason: 'High-performance async API for feeds and interactions.',
          languageKey: 'python',
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
          reason: 'User profiles, follows, and photo metadata.',
          languageKey: null,
        },
        {
          name: 'Cassandra',
          icon: 'Database',
          reason: 'Feed timelines and engagement counters.',
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
          reason: 'Image storage with CDN for fast global delivery.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'app', label: 'Mobile App', layer: 'client', icon: 'Smartphone' },
      { id: 'api', label: 'Photo API', layer: 'service', icon: 'Server' },
      { id: 'feed', label: 'Feed Service', layer: 'service', icon: 'Rss' },
      { id: 'imgproc', label: 'Image Processor', layer: 'worker', icon: 'Image' },
      { id: 'cdn', label: 'CDN', layer: 'data', icon: 'Cloud' },
      { id: 's3', label: 'S3 Storage', layer: 'data', icon: 'HardDrive' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'app', to: 'api', label: 'HTTPS' },
      { from: 'api', to: 'feed', label: 'timeline' },
      { from: 'api', to: 'imgproc', label: 'upload' },
      { from: 'imgproc', to: 's3', label: 'resize + store' },
      { from: 'feed', to: 'pg', label: 'query' },
      { from: 'app', to: 'cdn', label: 'images' },
      { from: 'cdn', to: 's3', label: 'origin' },
    ],
  },
};

export default project;
