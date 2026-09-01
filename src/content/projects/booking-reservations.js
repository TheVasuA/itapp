// Project: Online Booking/Reservations.
//
// Search availability and reserve slots with payment integration.
// Stack: Next.js / C# (.NET) / PostgreSQL / Azure.
// Key design: inventory locking, idempotent booking, payment integration, search cache.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'booking-reservations',
  title: 'Online Booking & Reservations',
  icon: 'CalendarCheck',
  summary:
    'Search availability and reserve slots with payment integration.',
  difficulty: 'Intermediate',
  tags: ['booking', 'payments', 'availability'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SSR for SEO-friendly listing pages with calendar UI.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'C# (.NET)',
          icon: 'Server',
          reason: 'Strongly-typed booking API with transaction support.',
          languageKey: 'csharp',
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
          reason: 'ACID transactions for slot inventory and bookings.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Azure',
          icon: 'Cloud',
          reason: 'Managed hosting with Service Bus for async workflows.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'web', label: 'Web App', layer: 'client', icon: 'Globe' },
      { id: 'api', label: 'Booking API', layer: 'service', icon: 'Server' },
      { id: 'search', label: 'Search Service', layer: 'service', icon: 'Search' },
      { id: 'payment', label: 'Payment Worker', layer: 'worker', icon: 'CreditCard' },
      { id: 'notify', label: 'Email Service', layer: 'worker', icon: 'Mail' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
      { id: 'cache', label: 'Redis Cache', layer: 'data', icon: 'Zap' },
    ],
    edges: [
      { from: 'web', to: 'api', label: 'HTTPS' },
      { from: 'web', to: 'search', label: 'availability' },
      { from: 'search', to: 'cache', label: 'read' },
      { from: 'api', to: 'pg', label: 'lock + book' },
      { from: 'api', to: 'payment', label: 'charge' },
      { from: 'payment', to: 'notify', label: 'confirmation' },
      { from: 'notify', to: 'web', label: 'email' },
    ],
  },
};

export default project;
