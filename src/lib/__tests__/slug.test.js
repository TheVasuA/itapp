import { describe, it, expect } from 'vitest';
import {
  slugify,
  slugArrayToPath,
  pathToSlugArray,
  buildRoutePath,
  routeKey,
  isValidSlug,
  isValidSlugArray,
} from '@/lib/slug';

describe('slugify', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('replaces underscores with dashes', () => {
    expect(slugify('async_await')).toBe('async-await');
  });

  it('strips non-url-safe characters', () => {
    expect(slugify('C++ Templates')).toBe('c-templates');
  });

  it('collapses repeated dashes', () => {
    expect(slugify('a---b')).toBe('a-b');
  });

  it('trims leading/trailing dashes after normalization', () => {
    expect(slugify('--hello--')).toBe('hello');
  });

  it('handles empty/whitespace input', () => {
    expect(slugify('')).toBe('');
    expect(slugify('   ')).toBe('');
  });
});

describe('slugArrayToPath', () => {
  it('joins segments with forward slash', () => {
    expect(slugArrayToPath(['basics', 'variables'])).toBe('basics/variables');
  });

  it('returns empty string for empty array', () => {
    expect(slugArrayToPath([])).toBe('');
  });

  it('handles null/undefined input', () => {
    expect(slugArrayToPath(null)).toBe('');
    expect(slugArrayToPath(undefined)).toBe('');
  });

  it('filters out falsy segments', () => {
    expect(slugArrayToPath(['a', '', 'b'])).toBe('a/b');
  });

  it('handles single segment', () => {
    expect(slugArrayToPath(['basics'])).toBe('basics');
  });
});

describe('pathToSlugArray', () => {
  it('splits a path string into segments', () => {
    expect(pathToSlugArray('basics/variables')).toEqual(['basics', 'variables']);
  });

  it('returns empty array for empty/null/undefined input', () => {
    expect(pathToSlugArray('')).toEqual([]);
    expect(pathToSlugArray(null)).toEqual([]);
    expect(pathToSlugArray(undefined)).toEqual([]);
  });

  it('strips leading/trailing slashes', () => {
    expect(pathToSlugArray('/basics/variables/')).toEqual(['basics', 'variables']);
  });

  it('trims whitespace from segments', () => {
    expect(pathToSlugArray(' basics / variables ')).toEqual(['basics', 'variables']);
  });

  it('handles single segment', () => {
    expect(pathToSlugArray('basics')).toEqual(['basics']);
  });
});

describe('buildRoutePath', () => {
  it('builds a full route path from language and slug array', () => {
    expect(buildRoutePath('javascript', ['basics', 'variables'])).toBe(
      '/javascript/basics/variables'
    );
  });

  it('returns just the language path when slug array is empty', () => {
    expect(buildRoutePath('python', [])).toBe('/python');
  });

  it('returns just the language path when slug array is undefined', () => {
    expect(buildRoutePath('python')).toBe('/python');
  });

  it('handles a single slug segment', () => {
    expect(buildRoutePath('javascript', ['basics'])).toBe('/javascript/basics');
  });

  it('handles deeply nested slugs', () => {
    expect(buildRoutePath('python', ['advanced', 'concurrency', 'asyncio'])).toBe(
      '/python/advanced/concurrency/asyncio'
    );
  });
});

describe('routeKey', () => {
  it('produces a key without leading slash', () => {
    expect(routeKey('javascript', ['basics', 'variables'])).toBe(
      'javascript/basics/variables'
    );
  });

  it('handles empty slug array', () => {
    expect(routeKey('python', [])).toBe('python/');
  });
});

describe('isValidSlug', () => {
  it('returns true for valid slugs', () => {
    expect(isValidSlug('basics')).toBe(true);
    expect(isValidSlug('async-await')).toBe(true);
    expect(isValidSlug('es6')).toBe(true);
    expect(isValidSlug('x')).toBe(true);
  });

  it('returns false for empty/null/undefined', () => {
    expect(isValidSlug('')).toBe(false);
    expect(isValidSlug(null)).toBe(false);
    expect(isValidSlug(undefined)).toBe(false);
  });

  it('returns false for slugs starting or ending with dash', () => {
    expect(isValidSlug('-hello')).toBe(false);
    expect(isValidSlug('hello-')).toBe(false);
  });

  it('returns false for uppercase', () => {
    expect(isValidSlug('Hello')).toBe(false);
  });

  it('returns false for spaces or special characters', () => {
    expect(isValidSlug('hello world')).toBe(false);
    expect(isValidSlug('hello_world')).toBe(false);
    expect(isValidSlug('c++')).toBe(false);
  });
});

describe('isValidSlugArray', () => {
  it('returns true for valid arrays', () => {
    expect(isValidSlugArray(['basics', 'variables'])).toBe(true);
    expect(isValidSlugArray([])).toBe(true);
  });

  it('returns false for non-array input', () => {
    expect(isValidSlugArray(null)).toBe(false);
    expect(isValidSlugArray('basics')).toBe(false);
  });

  it('returns false if any segment is invalid', () => {
    expect(isValidSlugArray(['basics', 'Hello'])).toBe(false);
    expect(isValidSlugArray(['basics', ''])).toBe(false);
  });
});
