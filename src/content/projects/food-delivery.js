// Project: Food Delivery.
//
// Restaurant browsing, ordering, and real-time courier tracking.
// Stack: React Native / Java (Spring) / PostgreSQL + Redis / AWS.
// Key design: order state machine, geospatial courier tracking, notification service.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'food-delivery',
  title: 'Food Delivery Platform',
  icon: 'UtensilsCrossed',
  summary:
    'Restaurant browsing, ordering, and real-time courier tracking.',
  difficulty: 'Intermediate',
  tags: ['mobile', 'geospatial', 'orders'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React Native',
          icon: 'Smartphone',
          reason: 'Cross-platform mobile app for customers and couriers.',
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
          reason: 'Robust order management and restaurant API.',
          languageKey: 'java',
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
          reason: 'Orders, restaurants, menus, and user data.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'Courier location cache and order status pub/sub.',
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
          reason: 'Auto-scaling compute and managed services.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'app', label: 'Mobile App', layer: 'client', icon: 'Smartphone' },
      { id: 'gateway', label: 'API Gateway', layer: 'service', icon: 'Network' },
      { id: 'orders', label: 'Order Service', layer: 'service', icon: 'ClipboardList' },
      { id: 'tracking', label: 'Tracking Service', layer: 'service', icon: 'MapPin' },
      { id: 'notify', label: 'Notification Worker', layer: 'worker', icon: 'Bell' },
      { id: 'redis', label: 'Redis', layer: 'data', icon: 'Zap' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'app', to: 'gateway', label: 'HTTPS' },
      { from: 'gateway', to: 'orders' },
      { from: 'gateway', to: 'tracking' },
      { from: 'orders', to: 'pg', label: 'state machine' },
      { from: 'orders', to: 'notify', label: 'status change' },
      { from: 'tracking', to: 'redis', label: 'GPS updates' },
      { from: 'notify', to: 'app', label: 'push' },
    ],
  },
};

export default project;
