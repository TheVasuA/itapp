// Project: Multiplayer Game Backend.
//
// Matchmaking, real-time game state sync, and leaderboards.
// Stack: Unity/Web client / C++ + Go / Redis + PostgreSQL / Kubernetes.
// Key design: authoritative game servers, matchmaking queue, low-latency state sync, leaderboard cache.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'multiplayer-game',
  title: 'Multiplayer Game Backend',
  icon: 'Gamepad2',
  summary:
    'Matchmaking, real-time game state sync, and leaderboards.',
  difficulty: 'Advanced',
  tags: ['gaming', 'realtime', 'networking'],
  stack: [
    {
      layer: 'frontend',
      label: 'Client',
      techs: [
        {
          name: 'Unity / Web Client',
          icon: 'Gamepad2',
          reason: 'Cross-platform game client with real-time rendering.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'C++ (Game Server)',
          icon: 'Server',
          reason: 'Low-latency authoritative game simulation.',
          languageKey: 'cpp',
        },
        {
          name: 'Go (Platform Services)',
          icon: 'Server',
          reason: 'Matchmaking, lobbies, and player services.',
          languageKey: 'go',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Leaderboard sorted sets and matchmaking queue.',
          languageKey: null,
        },
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Player profiles, stats, and match history.',
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
          reason: 'Auto-scale game server pods by region and demand.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'edge', 'service', 'data'],
    nodes: [
      { id: 'game', label: 'Game Client', layer: 'client', icon: 'Gamepad2' },
      { id: 'lb', label: 'Load Balancer', layer: 'edge', icon: 'Network' },
      { id: 'matchmaker', label: 'Matchmaker', layer: 'service', icon: 'Users' },
      { id: 'gameserver', label: 'Game Server (C++)', layer: 'service', icon: 'Cpu' },
      { id: 'platform', label: 'Platform API (Go)', layer: 'service', icon: 'Server' },
      { id: 'redis', label: 'Redis', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'game', to: 'lb', label: 'UDP/WSS' },
      { from: 'lb', to: 'gameserver', label: 'state sync' },
      { from: 'game', to: 'platform', label: 'HTTPS' },
      { from: 'platform', to: 'matchmaker', label: 'queue' },
      { from: 'matchmaker', to: 'redis', label: 'leaderboard' },
      { from: 'platform', to: 'pg', label: 'profiles' },
      { from: 'gameserver', to: 'redis', label: 'session' },
    ],
  },
};

export default project;
