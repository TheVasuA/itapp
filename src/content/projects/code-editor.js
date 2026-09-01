// Project: Online Code Editor/IDE.
//
// In-browser editor with sandboxed execution and real-time output.
// Stack: React (Monaco) / Go orchestrator / Redis / Kubernetes (Firecracker).
// Key design: sandboxed runner containers, job queue, WebSocket terminal stream.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'code-editor',
  title: 'Online Code Editor & IDE',
  icon: 'Code',
  summary:
    'In-browser editor with sandboxed execution and real-time output.',
  difficulty: 'Advanced',
  tags: ['editor', 'sandbox', 'realtime'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React (Monaco Editor)',
          icon: 'Globe',
          reason: 'VS Code-quality editing experience in the browser.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Go (Orchestrator)',
          icon: 'Server',
          reason: 'Manages sandbox lifecycle and job scheduling.',
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
          reason: 'Job queue and ephemeral session state.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Kubernetes (Firecracker)',
          icon: 'Cloud',
          reason: 'Lightweight microVMs for secure code execution.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'sandbox', 'data'],
    nodes: [
      { id: 'editor', label: 'Monaco Editor', layer: 'client', icon: 'Code' },
      { id: 'api', label: 'API Server', layer: 'service', icon: 'Server' },
      { id: 'orchestrator', label: 'Orchestrator', layer: 'service', icon: 'Cpu' },
      { id: 'runner', label: 'Sandbox Runner', layer: 'sandbox', icon: 'Terminal' },
      { id: 'redis', label: 'Redis Queue', layer: 'data', icon: 'Zap' },
      { id: 'storage', label: 'File Storage', layer: 'data', icon: 'HardDrive' },
    ],
    edges: [
      { from: 'editor', to: 'api', label: 'WSS' },
      { from: 'api', to: 'orchestrator', label: 'run request' },
      { from: 'orchestrator', to: 'redis', label: 'enqueue' },
      { from: 'orchestrator', to: 'runner', label: 'spawn' },
      { from: 'runner', to: 'api', label: 'stdout stream' },
      { from: 'api', to: 'storage', label: 'persist' },
    ],
  },
};

export default project;
