// Project: Project Management/Kanban.
//
// Boards, cards, drag-and-drop, and real-time team collaboration.
// Stack: React / Node.js / PostgreSQL + Redis / AWS.
// Key design: realtime sync (WebSocket), optimistic updates, activity event log.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'kanban-pm',
  title: 'Project Management & Kanban',
  icon: 'Columns',
  summary:
    'Boards, cards, drag-and-drop, and real-time team collaboration.',
  difficulty: 'Intermediate',
  tags: ['collaboration', 'realtime', 'productivity'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: 'Globe',
          reason: 'Rich drag-and-drop UI with optimistic updates.',
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
          reason: 'Real-time WebSocket API and REST endpoints.',
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
          reason: 'Boards, cards, and activity audit log.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Real-time sync pub/sub and session cache.',
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
          reason: 'Scalable compute and managed WebSocket support.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'data'],
    nodes: [
      { id: 'web', label: 'Kanban UI', layer: 'client', icon: 'Columns' },
      { id: 'api', label: 'REST API', layer: 'service', icon: 'Server' },
      { id: 'ws', label: 'WebSocket Server', layer: 'service', icon: 'Radio' },
      { id: 'events', label: 'Event Log', layer: 'service', icon: 'Activity' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
      { id: 'redis', label: 'Redis', layer: 'data', icon: 'Zap' },
    ],
    edges: [
      { from: 'web', to: 'api', label: 'HTTPS' },
      { from: 'web', to: 'ws', label: 'WSS' },
      { from: 'ws', to: 'redis', label: 'pub/sub' },
      { from: 'api', to: 'pg', label: 'CRUD' },
      { from: 'api', to: 'events', label: 'log' },
      { from: 'events', to: 'pg', label: 'persist' },
    ],
  },
};

export default project;
