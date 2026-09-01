// Project: IoT Telemetry Dashboard.
//
// Ingest device metrics, process streams, and visualize live data.
// Stack: React / Go / InfluxDB + PostgreSQL / Kubernetes.
// Key design: MQTT/ingest gateway, time-series store, stream processing, alerting.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'iot-telemetry',
  title: 'IoT Telemetry Dashboard',
  icon: 'Activity',
  summary:
    'Ingest device metrics, process streams, and visualize live data.',
  difficulty: 'Advanced',
  tags: ['iot', 'timeseries', 'streaming'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: 'Globe',
          reason: 'Real-time charts and device management dashboard.',
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
          reason: 'High-throughput MQTT ingest gateway and stream processor.',
          languageKey: 'go',
        },
      ],
    },
    {
      layer: 'database',
      label: 'Database',
      techs: [
        {
          name: 'InfluxDB',
          icon: 'Database',
          reason: 'Purpose-built time-series storage for device metrics.',
          languageKey: null,
        },
        {
          name: 'PostgreSQL',
          icon: 'Database',
          reason: 'Device registry and alert configuration.',
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
          reason: 'Scale ingest and processing pods with device count.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['device', 'ingress', 'service', 'data'],
    nodes: [
      { id: 'device', label: 'IoT Device', layer: 'device', icon: 'Cpu' },
      { id: 'mqtt', label: 'MQTT Gateway', layer: 'ingress', icon: 'Radio' },
      { id: 'ingest', label: 'Ingest Service', layer: 'service', icon: 'Download' },
      { id: 'alerts', label: 'Alert Engine', layer: 'service', icon: 'AlertTriangle' },
      { id: 'dashboard', label: 'Dashboard API', layer: 'service', icon: 'BarChart' },
      { id: 'influx', label: 'InfluxDB', layer: 'data', icon: 'Database' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'device', to: 'mqtt', label: 'MQTT' },
      { from: 'mqtt', to: 'ingest', label: 'messages' },
      { from: 'ingest', to: 'influx', label: 'write' },
      { from: 'ingest', to: 'alerts', label: 'threshold' },
      { from: 'alerts', to: 'pg', label: 'config' },
      { from: 'dashboard', to: 'influx', label: 'query' },
      { from: 'dashboard', to: 'pg', label: 'devices' },
    ],
  },
};

export default project;
