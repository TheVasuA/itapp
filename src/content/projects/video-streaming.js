// Project: Video Streaming (YouTube-like).
//
// Upload, transcode, and stream video with adaptive bitrate playback.
// Stack: Next.js / Node.js / PostgreSQL + Cassandra / AWS (S3 + CloudFront).
// Key design: transcoding worker queue, object storage, CDN, adaptive bitrate.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'video-streaming',
  title: 'Video Streaming Platform',
  icon: 'Play',
  summary:
    'Upload, transcode, and stream video with adaptive bitrate playback.',
  difficulty: 'Advanced',
  tags: ['streaming', 'media', 'cdn'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SSR for video pages with SEO and fast initial load.',
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
          reason: 'Upload API and video metadata management.',
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
          reason: 'Video metadata, channels, and user data.',
          languageKey: null,
        },
        {
          name: 'Cassandra',
          icon: 'Database',
          reason: 'View counts and engagement analytics at scale.',
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
          reason: 'Object storage for video segments and global CDN delivery.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'player', label: 'Video Player', layer: 'client', icon: 'Play' },
      { id: 'api', label: 'Video API', layer: 'service', icon: 'Server' },
      { id: 'upload', label: 'Upload Service', layer: 'service', icon: 'Upload' },
      { id: 'transcode', label: 'Transcoder Queue', layer: 'worker', icon: 'Film' },
      { id: 'cdn', label: 'CDN (CloudFront)', layer: 'data', icon: 'Cloud' },
      { id: 's3', label: 'S3 Storage', layer: 'data', icon: 'HardDrive' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'player', to: 'cdn', label: 'HLS stream' },
      { from: 'player', to: 'api', label: 'metadata' },
      { from: 'api', to: 'pg', label: 'query' },
      { from: 'upload', to: 'transcode', label: 'job' },
      { from: 'transcode', to: 's3', label: 'segments' },
      { from: 'cdn', to: 's3', label: 'origin' },
    ],
  },
};

export default project;
