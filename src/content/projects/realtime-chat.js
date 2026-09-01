// Project: Real-time Chat App.
//
// 1:1 and group messaging with presence indicators and message history.
// Stack: React / Go (WebSocket gateway) / PostgreSQL + Redis / Kubernetes.
// Key design: WebSocket fan-out, Redis pub/sub, message queue for delivery/offline.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'realtime-chat',
  title: 'Real-time Chat App',
  icon: 'MessageCircle',
  summary:
    '1:1 and group messaging with presence indicators and message history.',
  difficulty: 'Intermediate',
  tags: ['realtime', 'websocket', 'messaging'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: 'Globe',
          reason: 'Component-based UI for chat threads and presence.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Go (WebSocket Gateway)',
          icon: 'Server',
          reason: 'High-concurrency WebSocket handling with goroutines.',
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
          reason: 'Persistent message history and user data.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Pub/sub for cross-instance fan-out and presence tracking.',
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
          reason: 'Horizontally scale WebSocket gateway pods.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'edge', 'service', 'data'],
    nodes: [
      { id: 'app', label: 'Chat Client', layer: 'client', icon: 'MessageCircle' },
      { id: 'lb', label: 'Load Balancer', layer: 'edge', icon: 'Network' },
      { id: 'ws', label: 'WebSocket Gateway', layer: 'service', icon: 'Radio' },
      { id: 'presence', label: 'Presence Service', layer: 'service', icon: 'Users' },
      { id: 'queue', label: 'Message Queue', layer: 'service', icon: 'Layers' },
      { id: 'redis', label: 'Redis Pub/Sub', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'app', to: 'lb', label: 'WSS' },
      { from: 'lb', to: 'ws' },
      { from: 'ws', to: 'redis', label: 'pub/sub' },
      { from: 'ws', to: 'presence' },
      { from: 'presence', to: 'redis', label: 'heartbeat' },
      { from: 'ws', to: 'queue', label: 'offline msgs' },
      { from: 'queue', to: 'pg', label: 'persist' },
    ],
  },
};

export default project;
