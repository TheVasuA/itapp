// Project: Notification System.
//
// Multi-channel delivery (push, email, SMS) with rate limiting and retries.
// Stack: React (dashboard) / Go / PostgreSQL + Redis / Kubernetes.
// Key design: message queue, channel workers, rate limiting, retry/dead-letter queue.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'notification-system',
  title: 'Notification System',
  icon: 'Bell',
  summary:
    'Multi-channel delivery (push, email, SMS) with rate limiting and retries.',
  difficulty: 'Intermediate',
  tags: ['messaging', 'queue', 'infrastructure'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React (Dashboard)',
          icon: 'Globe',
          reason: 'Admin dashboard for templates, analytics, and logs.',
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
          reason: 'High-throughput notification router and dispatcher.',
          languageKey: 'go',
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
          reason: 'Notification logs, templates, and user preferences.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Rate limiting counters and message queue.',
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
          reason: 'Scale channel workers independently per load.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['ingress', 'service', 'worker', 'data'],
    nodes: [
      { id: 'producer', label: 'Event Producer', layer: 'ingress', icon: 'Zap' },
      { id: 'router', label: 'Notification Router', layer: 'service', icon: 'GitBranch' },
      { id: 'limiter', label: 'Rate Limiter', layer: 'service', icon: 'Shield' },
      { id: 'push', label: 'Push Worker', layer: 'worker', icon: 'Smartphone' },
      { id: 'email', label: 'Email Worker', layer: 'worker', icon: 'Mail' },
      { id: 'sms', label: 'SMS Worker', layer: 'worker', icon: 'Phone' },
      { id: 'redis', label: 'Redis Queue', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'producer', to: 'router', label: 'event' },
      { from: 'router', to: 'limiter', label: 'check' },
      { from: 'limiter', to: 'redis', label: 'counters' },
      { from: 'router', to: 'push', label: 'dispatch' },
      { from: 'router', to: 'email', label: 'dispatch' },
      { from: 'router', to: 'sms', label: 'dispatch' },
      { from: 'push', to: 'pg', label: 'log' },
      { from: 'email', to: 'pg', label: 'log' },
    ],
  },
};

export default project;
