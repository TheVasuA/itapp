// Project: Ride-Sharing (Uber-like).
//
// Match riders and drivers in real time with geospatial tracking.
// Stack: React Native / Go + Python / PostgreSQL (PostGIS) + Redis / Kubernetes.
// Key design: geospatial index, dispatch service, Kafka for location streams.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'ride-sharing',
  title: 'Ride-Sharing Platform',
  icon: 'Car',
  summary:
    'Match riders and drivers in real time with geospatial tracking.',
  difficulty: 'Advanced',
  tags: ['geospatial', 'realtime', 'mobile'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React Native',
          icon: 'Smartphone',
          reason: 'Cross-platform mobile app for riders and drivers.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Go (Dispatch Service)',
          icon: 'Server',
          reason: 'Low-latency matching and real-time location processing.',
          languageKey: 'go',
        },
        {
          name: 'Python (ML Pricing)',
          icon: 'Brain',
          reason: 'Surge pricing and ETA prediction models.',
          languageKey: 'python',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'PostgreSQL (PostGIS)',
          icon: 'Database',
          reason: 'Geospatial queries for nearby driver matching.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Driver location cache and session state.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Kubernetes',
          icon: 'Cloud',
          reason: 'Auto-scale dispatch and matching services.',
          languageKey: null,
        },
        {
          name: 'Kafka',
          icon: 'Layers',
          reason: 'Location stream processing pipeline.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'stream', 'data'],
    nodes: [
      { id: 'mobile', label: 'Mobile App', layer: 'client', icon: 'Smartphone' },
      { id: 'gateway', label: 'API Gateway', layer: 'service', icon: 'Network' },
      { id: 'dispatch', label: 'Dispatch Service', layer: 'service', icon: 'Navigation' },
      { id: 'pricing', label: 'Pricing Engine', layer: 'service', icon: 'DollarSign' },
      { id: 'kafka', label: 'Kafka Streams', layer: 'stream', icon: 'Layers' },
      { id: 'redis', label: 'Redis Location', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostGIS', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'mobile', to: 'gateway', label: 'HTTPS/WSS' },
      { from: 'gateway', to: 'dispatch' },
      { from: 'gateway', to: 'pricing' },
      { from: 'dispatch', to: 'redis', label: 'locations' },
      { from: 'dispatch', to: 'pg', label: 'geo query' },
      { from: 'mobile', to: 'kafka', label: 'GPS stream' },
      { from: 'kafka', to: 'redis', label: 'update' },
    ],
  },
};

export default project;
