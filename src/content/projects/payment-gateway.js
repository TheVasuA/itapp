// Project: Payment Gateway/Wallet.
//
// Balances, transfers, and ledger with strong consistency guarantees.
// Stack: React / Java (Spring) / PostgreSQL / AWS.
// Key design: double-entry ledger, idempotency keys, async settlement queue, audit log.

/** @type {import('@/lib/projects').Project} */
const project = {
  slug: 'payment-gateway',
  title: 'Payment Gateway & Wallet',
  icon: 'Wallet',
  summary:
    'Balances, transfers, and ledger with strong consistency guarantees.',
  difficulty: 'Advanced',
  tags: ['fintech', 'payments', 'ledger'],
  stack: [
    {
      layer: 'frontend',
      label: 'Frontend',
      techs: [
        {
          name: 'React',
          icon: 'Globe',
          reason: 'Dashboard for wallet management and transaction history.',
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
          reason: 'Transaction processing with strong ACID guarantees.',
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
          reason: 'Double-entry ledger with serializable transactions.',
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
          reason: 'Highly available deployment with SQS for async settlement.',
          languageKey: null,
        },
      ],
    },
  ],
  design: {
    layers: ['client', 'service', 'worker', 'data'],
    nodes: [
      { id: 'dashboard', label: 'Wallet Dashboard', layer: 'client', icon: 'Wallet' },
      { id: 'api', label: 'Payment API', layer: 'service', icon: 'Server' },
      { id: 'ledger', label: 'Ledger Service', layer: 'service', icon: 'BookOpen' },
      { id: 'idempotency', label: 'Idempotency Guard', layer: 'service', icon: 'Shield' },
      { id: 'settlement', label: 'Settlement Worker', layer: 'worker', icon: 'RefreshCw' },
      { id: 'audit', label: 'Audit Log', layer: 'worker', icon: 'FileText' },
      { id: 'pg', label: 'PostgreSQL', layer: 'data', icon: 'Database' },
    ],
    edges: [
      { from: 'dashboard', to: 'api', label: 'HTTPS' },
      { from: 'api', to: 'idempotency', label: 'check key' },
      { from: 'api', to: 'ledger', label: 'debit/credit' },
      { from: 'ledger', to: 'pg', label: 'transaction' },
      { from: 'ledger', to: 'settlement', label: 'async' },
      { from: 'ledger', to: 'audit', label: 'log' },
      { from: 'audit', to: 'pg', label: 'persist' },
    ],
  },
};

export default project;
