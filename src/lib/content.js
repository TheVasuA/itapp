// Content Access Layer — pure, synchronous traversal of the content registry.
//
// Single source of truth for: listing languages, resolving slug paths to
// concept nodes, building ancestor chains for breadcrumbs, enumerating every
// routable path for `generateStaticParams`, and grouping languages by category.
//
// No network or filesystem access — content is static JS, so every function is
// safe to call at build and render time. Derived structures are memoized.

import registry, { CATEGORIES, CATEGORY_KEYS } from '@/content';

/**
 * @typedef {Object} ExplanationPoint
 * @property {string} term    // short bold label for the key point
 * @property {string} detail  // the explanation for that point
 */

/**
 * @typedef {Object} Explanation
 * @property {string} [heading]              // optional sub-heading
 * @property {string} [intro]                // intro prose (1-2 sentences)
 * @property {ExplanationPoint[]} [points]   // highlighted key points (bullets)
 */

/**
 * @typedef {Object} Concept
 * @property {string} [id]
 * @property {string} code             // required, non-empty
 * @property {string} note             // required, non-empty (short summary)
 * @property {Explanation} [explanation] // optional rich, structured explanation
 * @property {string} [example]        // optional worked example
 * @property {string} [lang]           // optional language hint for highlighting
 */

/**
 * @typedef {Object} ConceptNode
 * @property {string} id
 * @property {string} title
 * @property {number} level         // 1..6 heading depth
 * @property {string} [slug]        // present => routable page
 * @property {Concept[]} concepts
 * @property {ConceptNode[]} children
 */

/**
 * @typedef {Object} LanguageMeta
 * @property {string} key
 * @property {string} label
 * @property {string} tagline
 * @property {string} description
 * @property {string} category
 * @property {number} order
 * @property {string} [color]
 * @property {string} [icon]
 */

/** @type {Map<string, ConceptNode>} memoized synthesized language roots */
const treeCache = new Map();

/**
 * Synthesize the root ConceptNode for a language. The root is the breadcrumb
 * anchor: its children are the language's top-level topic nodes.
 * @param {string} language
 * @returns {ConceptNode|null}
 */
function buildLanguageRoot(language) {
  const entry = registry[language];
  if (!entry) return null;
  return {
    id: language,
    title: entry.meta.label,
    level: 0,
    slug: undefined,
    concepts: [],
    children: entry.topics || [],
  };
}

/** @returns {string[]} registered language keys (registration order). */
export function getLanguages() {
  return Object.keys(registry);
}

/**
 * @param {string} language
 * @returns {LanguageMeta|null}
 */
export function getLanguageMeta(language) {
  const entry = registry[language];
  return entry ? entry.meta : null;
}

/**
 * Ordered category descriptors for home-page section headings.
 * @returns {Array<{ key: string, label: string, order: number }>}
 */
export function getCategories() {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

/**
 * Group every registered language by category.
 * - Only non-empty categories appear as keys.
 * - Each list is sorted by the language's `order` field.
 * - The union of all lists equals getLanguages(); lists are disjoint.
 * @returns {Object.<string, LanguageMeta[]>}
 */
export function getLanguagesByCategory() {
  /** @type {Object.<string, LanguageMeta[]>} */
  const groups = {};
  for (const key of getLanguages()) {
    const meta = getLanguageMeta(key);
    if (!meta) continue;
    if (!groups[meta.category]) groups[meta.category] = [];
    groups[meta.category].push(meta);
  }
  for (const cat of Object.keys(groups)) {
    groups[cat].sort((a, b) => a.order - b.order);
  }
  return groups;
}

/**
 * Root topic tree (synthesized root node) for a language.
 * @param {string} language
 * @returns {ConceptNode|null}
 */
export function getLanguageTree(language) {
  if (treeCache.has(language)) return treeCache.get(language);
  const root = buildLanguageRoot(language);
  if (root) treeCache.set(language, root);
  return root;
}

/**
 * Resolve a slug array to the ConceptNode whose slug chain equals slugArray.
 * Returns null for an empty slug array or any unmatched segment.
 * @param {string} language
 * @param {string[]} slugArray
 * @returns {ConceptNode|null}
 */
export function getConcept(language, slugArray) {
  const root = getLanguageTree(language);
  if (!root || !Array.isArray(slugArray) || slugArray.length === 0) return null;

  let current = root;
  for (const segment of slugArray) {
    const next = (current.children || []).find(
      (child) => child.slug === segment
    );
    if (!next) return null;
    current = next;
  }
  return current;
}

/**
 * Ordered ancestor chain root -> addressed node. First element is the language
 * root, last is the addressed node. Returns [] for an unresolvable path.
 * @param {string} language
 * @param {string[]} slugArray
 * @returns {ConceptNode[]}
 */
export function getAncestors(language, slugArray) {
  const root = getLanguageTree(language);
  if (!root || !Array.isArray(slugArray) || slugArray.length === 0) return [];

  const chain = [root];
  let current = root;
  for (const segment of slugArray) {
    const next = (current.children || []).find(
      (child) => child.slug === segment
    );
    if (!next) return [];
    chain.push(next);
    current = next;
  }
  return chain;
}

/**
 * A node is a real content page when it has a slug AND at least one concept.
 * Section/grouping nodes (slug but empty `concepts`, only children) are not
 * standalone pages — they act as headers in the sidebar and are skipped when
 * enumerating routes so no empty "Select a topic…" pages are generated.
 * @param {ConceptNode} node
 * @returns {boolean}
 */
export function isContentNode(node) {
  return Boolean(
    node && node.slug && Array.isArray(node.concepts) && node.concepts.length > 0
  );
}

/**
 * Enumerate one entry per routable page across all languages. A node is
 * routable when it has a slug AND either its own concepts OR child topics — so
 * section nodes render a real section-index page (never an empty page, never a
 * redirect). Slugged nodes that are truly empty (no concepts and no children)
 * are excluded.
 * @returns {Array<{ language: string, slug: string[] }>}
 */
export function getAllConceptPaths() {
  /** @type {Array<{ language: string, slug: string[] }>} */
  const paths = [];

  for (const language of getLanguages()) {
    const root = getLanguageTree(language);
    if (!root) continue;

    const walk = (nodes, prefix) => {
      for (const node of nodes || []) {
        const slugChain = node.slug ? [...prefix, node.slug] : prefix;
        const hasChildren = node.children && node.children.length > 0;
        // Routable if it has a slug and something to show (concepts or children).
        if (node.slug && (isContentNode(node) || hasChildren)) {
          paths.push({ language, slug: slugChain });
        }
        if (hasChildren) {
          walk(node.children, slugChain);
        }
      }
    };

    walk(root.children, []);
  }

  return paths;
}

/**
 * The slug path of the first content topic in a language (depth-first order),
 * used to default-select the first topic on a language landing page.
 * @param {string} language
 * @returns {string[]|null}
 */
export function getFirstConceptPath(language) {
  const root = getLanguageTree(language);
  if (!root) return null;

  let found = null;
  const walk = (nodes, prefix) => {
    for (const node of nodes || []) {
      if (found) return;
      const chain = node.slug ? [...prefix, node.slug] : prefix;
      if (isContentNode(node)) {
        found = chain;
        return;
      }
      if (node.children && node.children.length) walk(node.children, chain);
    }
  };
  walk(root.children, []);
  return found;
}

/**
 * Produce a lightweight, serializable navigation tree (id/title/slug/children
 * only) for a language — safe to pass from a server page into the client
 * Sidebar without shipping concept bodies to the browser.
 * @param {string} language
 * @returns {Array<{id:string,title:string,slug?:string,children:Array}>}
 */
export function getNavTree(language) {
  const root = getLanguageTree(language);
  if (!root) return [];
  const map = (node) => ({
    id: node.id,
    title: node.title,
    slug: node.slug,
    // Whether this node is a real content page (vs a section header).
    hasContent: isContentNode(node),
    children: (node.children || []).map(map),
  });
  return (root.children || []).map(map);
}

/**
 * Zero-based ordinal of a routable node within a language, counting routable
 * nodes in depth-first order (the same order the sidebar renders). Returns -1
 * if the slug does not resolve to a routable node. Used by the content gate to
 * decide whether a topic falls beyond the free limit.
 * @param {string} language
 * @param {string[]} slugArray
 * @returns {number}
 */
export function getTopicOrdinal(language, slugArray) {
  const root = getLanguageTree(language);
  if (!root || !Array.isArray(slugArray) || slugArray.length === 0) return -1;
  const target = slugArray.join('/');

  let index = 0;
  let found = -1;

  const walk = (nodes, prefix) => {
    for (const node of nodes || []) {
      const chain = node.slug ? [...prefix, node.slug] : prefix;
      // Only content pages count toward the ordinal (matches the routable set).
      if (isContentNode(node)) {
        if (found === -1 && chain.join('/') === target) found = index;
        index += 1;
      }
      if (node.children && node.children.length) walk(node.children, chain);
      if (found !== -1) return;
    }
  };
  walk(root.children, []);
  return found;
}

/**
 * The previous and next routable topics relative to the given slug, in the
 * same depth-first order the sidebar renders. Either side is null at the ends.
 * @param {string} language
 * @param {string[]} slugArray
 * @returns {{ prev: {title:string, slug:string[]}|null, next: {title:string, slug:string[]}|null }}
 */
export function getAdjacentTopics(language, slugArray) {
  const root = getLanguageTree(language);
  const empty = { prev: null, next: null };
  if (!root || !Array.isArray(slugArray) || slugArray.length === 0) return empty;
  const target = slugArray.join('/');

  /** @type {Array<{title:string, slug:string[]}>} */
  const ordered = [];
  const walk = (nodes, prefix) => {
    for (const node of nodes || []) {
      const chain = node.slug ? [...prefix, node.slug] : prefix;
      // Only content pages participate in prev/next navigation.
      if (isContentNode(node)) ordered.push({ title: node.title, slug: chain });
      if (node.children && node.children.length) walk(node.children, chain);
    }
  };
  walk(root.children, []);

  const idx = ordered.findIndex((t) => t.slug.join('/') === target);
  if (idx === -1) return empty;
  return {
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  };
}

/** @type {boolean} one-time validation flag */
let validated = false;

/**
 * Run content validation once per process (memoized). Safe to call from every
 * generateStaticParams / sitemap entry point.
 */
export function ensureValidContent() {
  if (!validated) {
    validateContent();
    validated = true;
  }
}

/**
 * Validate the entire content catalog. Throws (failing the build) with a
 * message naming the offending node id on the first violation:
 *  - a ConceptNode missing a non-empty `note`-bearing concept rules: every
 *    rendered Concept must have non-empty `code` and `note`
 *  - `level` outside [1,6]
 *  - duplicate sibling slug within the same parent
 *  - two nodes within a language sharing an `id`
 * @returns {boolean} true when the catalog is valid
 */
export function validateContent() {
  for (const language of getLanguages()) {
    const root = getLanguageTree(language);
    if (!root) continue;

    /** @type {Set<string>} ids seen within this language */
    const seenIds = new Set();

    const visit = (node, depth) => {
      // Duplicate id within a language
      if (seenIds.has(node.id)) {
        throw new Error(
          `[content:${language}] duplicate node id "${node.id}"`
        );
      }
      seenIds.add(node.id);

      // level must be within [1,6] for real heading nodes (root is level 0)
      if (depth > 0 && (node.level < 1 || node.level > 6)) {
        throw new Error(
          `[content:${language}] node "${node.id}" has level ${node.level} outside [1,6]`
        );
      }

      // Every concept must have non-empty code and note
      for (const concept of node.concepts || []) {
        if (!concept.code || !String(concept.code).trim()) {
          throw new Error(
            `[content:${language}] concept "${concept.id || node.id}" has empty code`
          );
        }
        if (!concept.note || !String(concept.note).trim()) {
          throw new Error(
            `[content:${language}] concept "${concept.id || node.id}" has empty note`
          );
        }
      }

      // Duplicate sibling slug
      const childSlugs = new Set();
      for (const child of node.children || []) {
        if (child.slug) {
          if (childSlugs.has(child.slug)) {
            throw new Error(
              `[content:${language}] duplicate sibling slug "${child.slug}" under node "${node.id}"`
            );
          }
          childSlugs.add(child.slug);
        }
      }

      for (const child of node.children || []) {
        visit(child, depth + 1);
      }
    };

    visit(root, 0);

    // Category must be one of the allowed keys
    const meta = getLanguageMeta(language);
    if (meta && !CATEGORY_KEYS.has(meta.category)) {
      throw new Error(
        `[content:${language}] invalid category "${meta.category}"`
      );
    }
  }
  return true;
}
