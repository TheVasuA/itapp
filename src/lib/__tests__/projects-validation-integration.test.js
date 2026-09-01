// Integration test: verify the real fixture projects pass validation.
// This runs the actual validateProjects() against the real project registry
// and content registry (no mocks).

import { describe, it, expect } from 'vitest';
import { validateProjects } from '@/lib/projects';

describe('validateProjects (integration)', () => {
  it('all fixture projects pass validation', () => {
    expect(() => validateProjects()).not.toThrow();
    expect(validateProjects()).toBe(true);
  });
});
