// Slug helpers — convert between a URL path array (Next.js catch-all `[...slug]`)
// and the slug chain stored on ConceptNodes.
//
// A concept's address is the ordered list of `slug` segments from the first
// routable ancestor down to the node itself. These helpers normalize that
// representation so routing and the Content Access Layer agree on shape.
//
// All functions are pure and synchronous.

/**
 * Normalize a single slug segment: lowercase, spaces/underscores to dashes,
 * strip anything that isn't url-safe, collapse repeated dashes.
 * @param {string} input
 * @returns {string}
 */
export function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Turn a slug array into a single path string, e.g. ['a','b'] -> 'a/b'.
 * Empty or nullish input yields an empty string.
 * @param {string[]} slugArray
 * @returns {string}
 */
export function slugArrayToPath(slugArray) {
  return (slugArray || []).filter(Boolean).join('/');
}

/**
 * Turn a path string into a slug array, e.g. 'a/b' -> ['a','b']. Empty/blank
 * input yields an empty array. Leading/trailing slashes are stripped.
 * @param {string} path
 * @returns {string[]}
 */
export function pathToSlugArray(path) {
  if (!path) return [];
  return String(path)
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Build a full route path from a language key and slug array.
 * e.g. buildRoutePath('javascript', ['basics', 'variables']) -> '/javascript/basics/variables'
 *      buildRoutePath('python', []) -> '/python'
 *      buildRoutePath('python') -> '/python'
 * @param {string} language
 * @param {string[]} [slugArray]
 * @returns {string}
 */
export function buildRoutePath(language, slugArray) {
  const base = `/${language}`;
  if (!slugArray || slugArray.length === 0) return base;
  return `${base}/${slugArrayToPath(slugArray)}`;
}

/**
 * Build a stable, unique route key for a concept page (without leading slash).
 * Useful as a cache key or Map key for content lookups.
 * @param {string} language
 * @param {string[]} slugArray
 * @returns {string}
 */
export function routeKey(language, slugArray) {
  return `${language}/${slugArrayToPath(slugArray)}`;
}

/**
 * Validate that a single slug segment is well-formed: non-empty, lowercase,
 * contains only [a-z0-9-], does not start or end with a dash.
 * @param {string} slug
 * @returns {boolean}
 */
export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  return /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(slug);
}

/**
 * Validate that every segment in a slug array is well-formed.
 * An empty array is considered valid (represents the language root).
 * @param {string[]} slugArray
 * @returns {boolean}
 */
export function isValidSlugArray(slugArray) {
  if (!Array.isArray(slugArray)) return false;
  return slugArray.every(isValidSlug);
}
