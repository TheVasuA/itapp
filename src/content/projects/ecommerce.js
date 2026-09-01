// Project: E-commerce Platform.
//
// A storefront with product catalog, cart, checkout, and order management.
// Stack: Next.js (React) / Node.js (NestJS) / PostgreSQL / Vercel + AWS.
// Key design: API gateway, Redis cart cache, payment service, CDN for product media.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'ecommerce',
  title: 'E-commerce Platform',
  icon: 'ShoppingCart',
  summary:
    'A storefront with product catalog, cart, checkout, and order management.',
  difficulty: 'Intermediate',
  tags: ['web', 'payments', 'catalog'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'Next.js (React)',
          icon: 'Globe',
          reason: 'SSR/SSG storefront with great SEO and fast navigation.',
          languageKey: 'javascript',
        },
      ],
    },
    {
      layer: 'backend',
      label: 'Backend',
      techs: [
        {
          name: 'Node.js (NestJS)',
          icon: 'Server',
          reason: 'Structured API for catalog, cart, and orders.',
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
          reason: 'Relational store for products, orders, and inventory.',
          languageKey: null,
        },
        {
          name: 'Redis',
          icon: 'Zap',
          reason: 'In-memory cache for cart sessions and hot product data.',
          languageKey: null,
        },
      ],
    },
    {
      layer: 'infra',
      label: 'Infrastructure',
      techs: [
        {
          name: 'Vercel',
          icon: 'Cloud',
          reason: 'Edge deployment for the Next.js storefront.',
          languageKey: null,
        },
        {
          name: 'AWS (S3 + CloudFront)',
          icon: 'Cloud',
          reason: 'CDN for product images and static assets.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'edge', 'service', 'data'],
    nodes: [
      { id: 'web', label: 'Web Storefront', layer: 'client', icon: 'Globe' },
      { id: 'cdn', label: 'CDN (CloudFront)', layer: 'edge', icon: 'Cloud' },
      { id: 'gateway', label: 'API Gateway', layer: 'edge', icon: 'Network' },
      { id: 'catalog', label: 'Catalog Service', layer: 'service', icon: 'Package' },
      { id: 'orders', label: 'Order Service', layer: 'service', icon: 'Boxes' },
      { id: 'payments', label: 'Payment Service', layer: 'service', icon: 'CreditCard' },
      { id: 'cache', label: 'Redis Cart Cache', layer: 'data', icon: 'Zap' },
      { id: 'db', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'web', to: 'cdn', label: 'static assets' },
      { from: 'web', to: 'gateway', label: 'HTTPS' },
      { from: 'gateway', to: 'catalog' },
      { from: 'gateway', to: 'orders' },
      { from: 'gateway', to: 'payments' },
      { from: 'catalog', to: 'db', label: 'products' },
      { from: 'orders', to: 'cache', label: 'cart' },
      { from: 'orders', to: 'db', label: 'orders' },
      { from: 'payments', to: 'db', label: 'transactions' },
    ],
  },
};

export default project;
