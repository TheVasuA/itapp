// Tests for project validation (Requirements 20.3, 20.4)
//
// Verifies that validateProjects():
// - Throws naming the project slug/edge when a DesignEdge references a non-existent node
// - Throws naming the languageKey when a TechRef.languageKey is not registered
// - Throws when a node's layer is not declared in design.layers
// - Passes for valid fixture data

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We mock the content/projects registry to inject invalid data for negative tests
vi.mock('@/content/projects', () => ({
  projects: [],
}));

vi.mock('@/lib/content', () => ({
  getLanguages: () => ['javascript', 'python'],
}));

describe('validateProjects', () => {
  let projectsModule;

  beforeEach(async () => {
    vi.resetModules();
    // Re-import to get fresh module state
    projectsModule = await import('@/lib/projects');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('passes validation for well-formed projects', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'test-project',
      title: 'Test',
      icon: 'Code',
      summary: 'A test project',
      difficulty: 'Beginner',
      tags: ['test'],
      stack: [
        {
          layer: 'frontend',
          label: 'Frontend',
          techs: [
            { name: 'React', icon: 'Globe', reason: 'UI', languageKey: 'javascript' },
            { name: 'Redis', icon: 'Zap', reason: 'Cache', languageKey: null },
          ],
        },
      ],
      design: {
        layers: ['client', 'service'],
        nodes: [
          { id: 'web', label: 'Web', layer: 'client', icon: 'Globe' },
          { id: 'api', label: 'API', layer: 'service', icon: 'Server' },
        ],
        edges: [{ from: 'web', to: 'api', label: 'HTTPS' }],
      },
    });

    expect(() => projectsModule.validateProjects()).not.toThrow();
  });

  it('throws naming project slug and edge when edge.from references non-existent node (Req 20.3)', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'bad-edge-project',
      title: 'Bad Edge',
      icon: 'Code',
      summary: 'Test',
      difficulty: 'Beginner',
      tags: [],
      stack: [],
      design: {
        layers: ['client'],
        nodes: [{ id: 'web', label: 'Web', layer: 'client', icon: 'Globe' }],
        edges: [{ from: 'nonexistent', to: 'web' }],
      },
    });

    expect(() => projectsModule.validateProjects()).toThrow(
      /bad-edge-project.*nonexistent.*from/
    );
  });

  it('throws naming project slug and edge when edge.to references non-existent node (Req 20.3)', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'bad-to-project',
      title: 'Bad To',
      icon: 'Code',
      summary: 'Test',
      difficulty: 'Beginner',
      tags: [],
      stack: [],
      design: {
        layers: ['service'],
        nodes: [{ id: 'api', label: 'API', layer: 'service', icon: 'Server' }],
        edges: [{ from: 'api', to: 'ghost-node' }],
      },
    });

    expect(() => projectsModule.validateProjects()).toThrow(
      /bad-to-project.*ghost-node.*to/
    );
  });

  it('throws naming languageKey when TechRef.languageKey is not a registered language (Req 20.4)', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'bad-lang-project',
      title: 'Bad Lang',
      icon: 'Code',
      summary: 'Test',
      difficulty: 'Beginner',
      tags: [],
      stack: [
        {
          layer: 'backend',
          label: 'Backend',
          techs: [
            { name: 'Rails', icon: 'Server', reason: 'API', languageKey: 'ruby' },
          ],
        },
      ],
      design: {
        layers: ['service'],
        nodes: [{ id: 'api', label: 'API', layer: 'service', icon: 'Server' }],
        edges: [],
      },
    });

    // 'ruby' is not in the mocked getLanguages() ['javascript', 'python']
    expect(() => projectsModule.validateProjects()).toThrow(/ruby/);
  });

  it('does not throw for TechRef with null languageKey', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'null-lang-project',
      title: 'Null Lang',
      icon: 'Code',
      summary: 'Test',
      difficulty: 'Beginner',
      tags: [],
      stack: [
        {
          layer: 'database',
          label: 'Database',
          techs: [
            { name: 'PostgreSQL', icon: 'Database', reason: 'Storage', languageKey: null },
          ],
        },
      ],
      design: {
        layers: ['data'],
        nodes: [{ id: 'db', label: 'DB', layer: 'data', icon: 'Database' }],
        edges: [],
      },
    });

    expect(() => projectsModule.validateProjects()).not.toThrow();
  });

  it('throws when a node layer is not declared in design.layers', async () => {
    const { projects } = await import('@/content/projects');
    projects.length = 0;
    projects.push({
      slug: 'bad-layer-project',
      title: 'Bad Layer',
      icon: 'Code',
      summary: 'Test',
      difficulty: 'Beginner',
      tags: [],
      stack: [],
      design: {
        layers: ['client'],
        nodes: [{ id: 'api', label: 'API', layer: 'service', icon: 'Server' }],
        edges: [],
      },
    });

    expect(() => projectsModule.validateProjects()).toThrow(
      /bad-layer-project.*api.*undeclared layer.*service/
    );
  });
});
