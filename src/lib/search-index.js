// Search index — a flat, build-time index over every routable concept node.
// Pure and synchronous; safe to import on the client for instant filtering.

import {
  getAllConceptPaths,
  getConcept,
  getLanguageMeta,
} from '@/lib/content';

/**
 * @typedef {Object} SearchEntry
 * @property {string} language
 * @property {string} languageLabel
 * @property {string[]} slug
 * @property {string} path
 * @property {string} title
 * @property {string} snippet
 * @property {string} haystack   // lowercased searchable text
 */

let cached = null;

/** @returns {SearchEntry[]} */
export function getSearchIndex() {
  if (cached) return cached;

  const entries = [];
  for (const { language, slug } of getAllConceptPaths()) {
    const node = getConcept(language, slug);
    if (!node) continue;
    const meta = getLanguageMeta(language);
    const snippet = node.concepts?.[0]?.note || '';
    const haystack = [
      meta?.label || language,
      node.title,
      snippet,
      ...(node.concepts || []).map((c) => c.note),
    ]
      .join(' ')
      .toLowerCase();

    entries.push({
      language,
      languageLabel: meta?.label || language,
      slug,
      path: `/${language}/${slug.join('/')}`,
      title: node.title,
      snippet,
      haystack,
    });
  }

  cached = entries;
  return entries;
}

/**
 * Filter the index by a free-text query (all whitespace-separated terms must
 * match somewhere in the entry's haystack).
 * @param {string} query
 * @returns {SearchEntry[]}
 */
export function searchConcepts(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return getSearchIndex()
    .filter((entry) => terms.every((t) => entry.haystack.includes(t)))
    .slice(0, 50);
}
