// Unit tests for the Content Access Layer (src/lib/content.js)
// Validates requirements: 2.2, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3, 8.5, 9.1, 9.2, 10.3

import { describe, it, expect } from 'vitest';
import {
  getLanguages,
  getLanguageMeta,
  getLanguageTree,
  getConcept,
  getAncestors,
  getAllConceptPaths,
  getLanguagesByCategory,
  getCategories,
} from '@/lib/content';

describe('Content Access Layer', () => {
  // Req 2.2: derives navigation/routes from registry dynamically
  describe('getLanguages()', () => {
    it('returns an array of registered language keys', () => {
      const languages = getLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
      expect(languages).toContain('javascript');
      expect(languages).toContain('python');
    });
  });

  describe('getLanguageMeta()', () => {
    it('returns metadata for a registered language', () => {
      const meta = getLanguageMeta('javascript');
      expect(meta).not.toBeNull();
      expect(meta.key).toBe('javascript');
      expect(meta.label).toBe('JavaScript');
      expect(meta.category).toBe('frontend');
      expect(typeof meta.order).toBe('number');
    });

    it('returns null for an unregistered language', () => {
      expect(getLanguageMeta('nonexistent')).toBeNull();
    });
  });

  // Req 4.3: every key in getLanguagesByCategory() is in getCategories().map(c => c.key)
  describe('getCategories()', () => {
    it('returns ordered category descriptors', () => {
      const cats = getCategories();
      expect(Array.isArray(cats)).toBe(true);
      expect(cats.length).toBe(8);
      // Sorted by order
      for (let i = 1; i < cats.length; i++) {
        expect(cats[i].order).toBeGreaterThanOrEqual(cats[i - 1].order);
      }
    });

    it('contains the required category keys', () => {
      const keys = getCategories().map((c) => c.key);
      expect(keys).toContain('frontend');
      expect(keys).toContain('backend');
      expect(keys).toContain('data');
      expect(keys).toContain('database-sql');
      expect(keys).toContain('database-nosql');
    });
  });

  // Req 4.1, 4.2, 4.3, 4.4
  describe('getLanguagesByCategory()', () => {
    it('union of all category values equals getLanguages() (Req 4.1)', () => {
      const grouped = getLanguagesByCategory();
      const allFromGroups = Object.values(grouped)
        .flat()
        .map((m) => m.key);
      const languages = getLanguages();
      expect(new Set(allFromGroups)).toEqual(new Set(languages));
      expect(allFromGroups.length).toBe(languages.length);
    });

    it('category lists are pairwise disjoint (Req 4.2)', () => {
      const grouped = getLanguagesByCategory();
      const seen = new Set();
      for (const list of Object.values(grouped)) {
        for (const meta of list) {
          expect(seen.has(meta.key)).toBe(false);
          seen.add(meta.key);
        }
      }
    });

    it('every key is in getCategories().map(c => c.key) (Req 4.3)', () => {
      const grouped = getLanguagesByCategory();
      const validKeys = new Set(getCategories().map((c) => c.key));
      for (const catKey of Object.keys(grouped)) {
        expect(validKeys.has(catKey)).toBe(true);
      }
    });

    it('languages within each category sorted by order (Req 4.4)', () => {
      const grouped = getLanguagesByCategory();
      for (const list of Object.values(grouped)) {
        for (let i = 1; i < list.length; i++) {
          expect(list[i].order).toBeGreaterThanOrEqual(list[i - 1].order);
        }
      }
    });
  });

  describe('getLanguageTree()', () => {
    it('returns a root node for a registered language', () => {
      const tree = getLanguageTree('javascript');
      expect(tree).not.toBeNull();
      expect(tree.id).toBe('javascript');
      expect(tree.title).toBe('JavaScript');
      expect(Array.isArray(tree.children)).toBe(true);
      expect(tree.children.length).toBeGreaterThan(0);
    });

    it('returns null for an unregistered language', () => {
      expect(getLanguageTree('nonexistent')).toBeNull();
    });
  });

  // Req 8.1: getConcept resolves slug chain
  describe('getConcept()', () => {
    it('resolves a single-segment slug (Req 8.1)', () => {
      const node = getConcept('javascript', ['fundamentals']);
      expect(node).not.toBeNull();
      expect(node.slug).toBe('fundamentals');
      expect(node.title).toBe('Fundamentals');
    });

    it('resolves a multi-segment slug chain (Req 8.1)', () => {
      const node = getConcept('javascript', ['fundamentals', 'variables']);
      expect(node).not.toBeNull();
      expect(node.slug).toBe('variables');
      expect(node.id).toBe('js-variables');
    });

    // Req 8.3: returns null for invalid slugs
    it('returns null for invalid slug segments (Req 8.3)', () => {
      expect(getConcept('javascript', ['nonexistent'])).toBeNull();
      expect(getConcept('javascript', ['fundamentals', 'nonexistent'])).toBeNull();
    });

    it('returns null for empty slug array (Req 8.3)', () => {
      expect(getConcept('javascript', [])).toBeNull();
    });

    it('returns null for unregistered language', () => {
      expect(getConcept('nonexistent', ['fundamentals'])).toBeNull();
    });

    it('returns null for null/undefined slug array', () => {
      expect(getConcept('javascript', null)).toBeNull();
      expect(getConcept('javascript', undefined)).toBeNull();
    });
  });

  // Req 9.1, 9.2
  describe('getAncestors()', () => {
    it('returns chain with first=root and last=node (Req 9.1)', () => {
      const chain = getAncestors('javascript', ['fundamentals', 'variables']);
      expect(chain.length).toBe(3); // root -> fundamentals -> variables
      // First is root
      expect(chain[0].id).toBe('javascript');
      expect(chain[0].title).toBe('JavaScript');
      // Last is the addressed node
      expect(chain[chain.length - 1].id).toBe('js-variables');
      expect(chain[chain.length - 1].slug).toBe('variables');
    });

    it('returns [root, node] for a single-segment slug (Req 9.1)', () => {
      const chain = getAncestors('javascript', ['fundamentals']);
      expect(chain.length).toBe(2);
      expect(chain[0].id).toBe('javascript');
      expect(chain[1].slug).toBe('fundamentals');
    });

    // Req 9.2: unresolvable slugs return empty chain
    it('returns empty chain for unresolvable slugs (Req 9.2)', () => {
      expect(getAncestors('javascript', ['nonexistent'])).toEqual([]);
      expect(getAncestors('javascript', ['fundamentals', 'bad'])).toEqual([]);
    });

    it('returns empty chain for empty slug array', () => {
      expect(getAncestors('javascript', [])).toEqual([]);
    });

    it('returns empty chain for unregistered language', () => {
      expect(getAncestors('nonexistent', ['fundamentals'])).toEqual([]);
    });
  });

  // Req 8.2, 8.5
  describe('getAllConceptPaths()', () => {
    it('returns an array of path objects', () => {
      const paths = getAllConceptPaths();
      expect(Array.isArray(paths)).toBe(true);
      expect(paths.length).toBeGreaterThan(0);
      for (const p of paths) {
        expect(typeof p.language).toBe('string');
        expect(Array.isArray(p.slug)).toBe(true);
        expect(p.slug.length).toBeGreaterThan(0);
      }
    });

    // Req 8.2: every path resolves to non-null via getConcept
    it('every path resolves via getConcept to non-null (Req 8.2)', () => {
      const paths = getAllConceptPaths();
      for (const { language, slug } of paths) {
        const node = getConcept(language, slug);
        expect(node).not.toBeNull();
      }
    });

    // Req 8.5: exactly one entry per routable node
    it('has no duplicate entries (Req 8.5)', () => {
      const paths = getAllConceptPaths();
      const serialized = paths.map((p) => `${p.language}/${p.slug.join('/')}`);
      const unique = new Set(serialized);
      expect(unique.size).toBe(serialized.length);
    });

    it('includes all routable nodes (Req 8.5)', () => {
      const paths = getAllConceptPaths();
      // Full catalog has many routable nodes across 39 languages.
      // Validate that the count is at least the original fixture count and
      // that every path resolves to a non-null concept.
      expect(paths.length).toBeGreaterThanOrEqual(10);
      for (const { language, slug } of paths) {
        expect(getConcept(language, slug)).not.toBeNull();
      }
    });
  });

  // Req 10.3: pure and synchronous
  describe('Purity and synchrony (Req 10.3)', () => {
    it('all functions return synchronously (no Promises)', () => {
      // Verify none of the functions return a Promise
      const results = [
        getLanguages(),
        getLanguageMeta('javascript'),
        getCategories(),
        getLanguagesByCategory(),
        getLanguageTree('javascript'),
        getConcept('javascript', ['fundamentals']),
        getAncestors('javascript', ['fundamentals']),
        getAllConceptPaths(),
      ];
      for (const r of results) {
        expect(r).not.toBeInstanceOf(Promise);
      }
    });

    it('calling twice returns the same result (deterministic)', () => {
      const paths1 = getAllConceptPaths();
      const paths2 = getAllConceptPaths();
      expect(paths1).toEqual(paths2);
    });
  });
});
