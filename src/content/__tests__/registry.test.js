// Verify the content registry and category descriptors satisfy task 3.1.
import { describe, it, expect } from 'vitest';
import { CATEGORIES, CATEGORY_KEYS, registry } from '@/content';
import { getCategories, getLanguages, getLanguageMeta, getLanguagesByCategory } from '@/lib/content';

describe('Content Registry (Task 3.1)', () => {
  it('defines exactly 8 categories in stable order', () => {
    expect(CATEGORIES).toHaveLength(8);
    const keys = CATEGORIES.map((c) => c.key);
    expect(keys).toEqual([
      'frontend',
      'backend',
      'mobile',
      'systems',
      'scripting',
      'data',
      'database-sql',
      'database-nosql',
    ]);
  });

  it('each category has key, label, and order', () => {
    for (const cat of CATEGORIES) {
      expect(cat).toHaveProperty('key');
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('order');
      expect(typeof cat.key).toBe('string');
      expect(typeof cat.label).toBe('string');
      expect(typeof cat.order).toBe('number');
    }
  });

  it('category labels match the spec', () => {
    const labelMap = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
    expect(labelMap).toEqual({
      frontend: 'Frontend',
      backend: 'Backend',
      mobile: 'Mobile',
      systems: 'Systems / Low-level',
      scripting: 'Scripting & Automation',
      data: 'Data & Scientific',
      'database-sql': 'Databases (SQL)',
      'database-nosql': 'NoSQL & Query Languages',
    });
  });

  it('getCategories() returns ordered array of {key, label, order}', () => {
    const cats = getCategories();
    expect(cats).toHaveLength(8);
    for (let i = 0; i < cats.length - 1; i++) {
      expect(cats[i].order).toBeLessThanOrEqual(cats[i + 1].order);
    }
    // Each entry has the required shape
    for (const c of cats) {
      expect(c).toMatchObject({
        key: expect.any(String),
        label: expect.any(String),
        order: expect.any(Number),
      });
    }
  });

  it('registers JavaScript (category: frontend) and Python (category: data)', () => {
    expect(registry).toHaveProperty('javascript');
    expect(registry).toHaveProperty('python');
    expect(registry.javascript.meta.category).toBe('frontend');
    expect(registry.python.meta.category).toBe('data');
  });

  it('each registered language has meta.js fields and topics', () => {
    for (const [key, entry] of Object.entries(registry)) {
      expect(entry.meta.key).toBe(key);
      expect(entry.meta.label).toBeTruthy();
      expect(entry.meta.tagline).toBeTruthy();
      expect(entry.meta.category).toBeTruthy();
      expect(CATEGORY_KEYS.has(entry.meta.category)).toBe(true);
      expect(Array.isArray(entry.topics)).toBe(true);
      expect(entry.topics.length).toBeGreaterThan(0);
    }
  });

  it('topic trees contain ConceptNodes with code + note', () => {
    for (const [, entry] of Object.entries(registry)) {
      const hasConcepts = (nodes) =>
        nodes.some(
          (n) =>
            n.concepts.length > 0 ||
            (n.children && n.children.length > 0 && hasConcepts(n.children))
        );
      expect(hasConcepts(entry.topics)).toBe(true);

      // Walk and verify concept shape
      const walk = (nodes) => {
        for (const node of nodes) {
          for (const concept of node.concepts) {
            expect(concept.code).toBeTruthy();
            expect(concept.note).toBeTruthy();
          }
          if (node.children) walk(node.children);
        }
      };
      walk(entry.topics);
    }
  });

  it('getLanguages() derives from the registry dynamically', () => {
    const langs = getLanguages();
    expect(langs).toEqual(Object.keys(registry));
    expect(langs).toContain('javascript');
    expect(langs).toContain('python');
  });

  it('getLanguagesByCategory() keys are all members of getCategories().map(c => c.key)', () => {
    const byCategory = getLanguagesByCategory();
    const validKeys = new Set(getCategories().map((c) => c.key));
    for (const key of Object.keys(byCategory)) {
      expect(validKeys.has(key)).toBe(true);
    }
  });

  it('getLanguageMeta returns complete metadata for each registered language', () => {
    for (const key of getLanguages()) {
      const meta = getLanguageMeta(key);
      expect(meta).not.toBeNull();
      expect(meta.key).toBe(key);
      expect(meta.label).toBeTruthy();
      expect(meta.tagline).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.category).toBeTruthy();
      expect(typeof meta.order).toBe('number');
    }
  });
});
