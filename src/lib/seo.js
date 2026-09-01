// SEO builders — metadata and JSON-LD for every generated page.
//
// `metadataBase` comes from the production domain env so relative OG/canonical
// URLs resolve to absolute. All builders guarantee non-empty title/description
// and never emit null/undefined required fields in JSON-LD.
//
// Exports:
//   - generateMetadata helpers: buildMetadata, buildConceptMetadata,
//     buildLanguageMetadata, buildProjectMetadata, buildHomeMetadata
//   - buildJsonLd: unified JSON-LD builder producing BreadcrumbList + TechArticle
//     + optional VideoObjects, or WebSite/Organization for the home page
//   - Individual JSON-LD helpers (backward compat): buildBreadcrumbJsonLd,
//     buildArticleJsonLd, buildVideoJsonLd, buildSiteJsonLd

const SITE_NAME = 'Dev Learning Platform';
const SITE_TAGLINE =
  'Free tutorials and copy-first code examples for programming and database/query languages.';
const ORG_LOGO_PATH = '/og/default.png';
const DEFAULT_LOCALE = 'en_US';

/** Social/authority profiles for Organization.sameAs (helps entity SEO). */
const ORG_SAME_AS = (process.env.NEXT_PUBLIC_ORG_SAMEAS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

/**
 * Canonical site URL resolved from environment.
 * Priority: NEXT_PUBLIC_SITE_URL > SITE_URL > VERCEL_URL > localhost fallback.
 */
export const siteUrl = (() => {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000';
  return url.replace(/\/$/, '');
})();

/**
 * metadataBase for the Next.js root layout. Resolves relative canonical and
 * OG image URLs to the production domain (Req 11.5).
 */
export const metadataBase = new URL(siteUrl);

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/') {
  const base = siteUrl.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * Ensure a string is non-empty; return a safe fallback otherwise.
 * Used to guarantee Req 11.1 (non-empty title and description).
 */
function ensureNonEmpty(value, fallback) {
  return value && value.trim() ? value.trim() : fallback;
}

/**
 * Clamp a description to an SEO-friendly length (~155–160 chars) at a word
 * boundary, appending an ellipsis when truncated. Strips code fences/newlines
 * so a concept's `note` reads cleanly as a meta description.
 */
function shapeDescription(text, fallback) {
  const raw = ensureNonEmpty(
    (text || '').replace(/\s+/g, ' ').replace(/`/g, '').trim(),
    fallback
  );
  if (raw.length <= 160) return raw;
  const clipped = raw.slice(0, 157);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : 157).trim()}…`;
}

/** Common stop words to drop when deriving keywords from titles. */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'in', 'on', 'to', 'for', 'with',
  'vs', 'is', 'are', 'be', 'by', 'as', 'at', 'from', 'into', 'your', 'you',
]);

/**
 * Derive a deduplicated keyword list from a set of phrases. Adds each full
 * phrase plus its meaningful individual words. Returns up to `max` keywords.
 */
function deriveKeywords(phrases, max = 12) {
  const seen = new Set();
  const out = [];
  const add = (kw) => {
    const k = kw.toLowerCase().trim();
    if (!k || seen.has(k) || k.length < 2) return;
    seen.add(k);
    out.push(kw.trim());
  };
  for (const phrase of phrases.filter(Boolean)) {
    add(phrase);
    for (const word of phrase.split(/[\s,/|]+/)) {
      const cleaned = word.replace(/[^\w+#.-]/g, '');
      if (cleaned && !STOP_WORDS.has(cleaned.toLowerCase())) add(cleaned);
    }
  }
  return out.slice(0, max);
}

/**
 * hreflang alternates. The site is English-only, so we point both `en` and
 * `x-default` at the canonical URL, which is the correct signal for a
 * single-language site targeting a global English-speaking audience.
 */
function hreflangFor(path) {
  const canonical = path || '/';
  return { en: canonical, 'x-default': canonical };
}

// ---------------------------------------------------------------------------
// generateMetadata helpers (Req 11.1–11.5)
// ---------------------------------------------------------------------------

/**
 * Core metadata builder. Guarantees non-empty title, non-empty description,
 * alternates.canonical, Open Graph + Twitter card fields on every call.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Page title (without site suffix; template adds it)
 * @param {string} opts.description - Non-empty page description
 * @param {string} opts.path        - Site-relative canonical path (e.g. "/javascript/closures")
 * @param {string} [opts.ogType]    - Open Graph type (default "article")
 * @param {string[]} [opts.images]  - OG image paths (relative or absolute)
 * @returns {object} Next.js Metadata object
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  ogType = 'article',
  images,
  keywords,
  publishedTime,
  modifiedTime,
}) {
  const safeTitle = ensureNonEmpty(title, SITE_NAME);
  const safeDescription = shapeDescription(
    description,
    `Learn programming and database/query languages on ${SITE_NAME}.`
  );
  const canonical = path || '/';
  const ogImages = (images && images.length > 0 ? images : [ORG_LOGO_PATH]).map(
    (src) => ({ url: src, width: 1200, height: 630, alt: safeTitle })
  );
  const keywordList =
    Array.isArray(keywords) && keywords.length ? keywords : undefined;

  return {
    title: safeTitle,
    description: safeDescription,
    ...(keywordList ? { keywords: keywordList } : {}),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'technology',
    alternates: {
      canonical,
      languages: hreflangFor(canonical),
    },
    // Explicitly allow full indexing + rich snippets everywhere.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: absoluteUrl(canonical),
      siteName: SITE_NAME,
      type: ogType,
      locale: DEFAULT_LOCALE,
      images: ogImages,
      ...(ogType === 'article' && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime || publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: safeTitle,
      description: safeDescription,
      images: ogImages.map((i) => i.url),
    },
  };
}

/**
 * Concept page metadata using the title pattern "{Concept} in {Language} | {Site}"
 * (Req 11.4). The root layout title.template appends " | {Site}", so we return
 * "{Concept} in {Language}" as the page title.
 *
 * @param {Object} opts
 * @param {string} opts.concept  - Concept/topic title
 * @param {string} opts.language - Human-readable language label
 * @param {string} opts.description
 * @param {string} opts.path     - Canonical site-relative path
 * @returns {object} Next.js Metadata
 */
export function buildConceptMetadata({
  concept,
  language,
  description,
  path,
  keywords,
  publishedTime,
  modifiedTime,
}) {
  const safeConcept = ensureNonEmpty(concept, 'Topic');
  const safeLang = ensureNonEmpty(language, 'Programming');
  const derived = deriveKeywords([
    `${safeConcept} in ${safeLang}`,
    `${safeLang} ${safeConcept}`,
    `${safeLang} tutorial`,
    `${safeConcept} example`,
    `learn ${safeLang}`,
    safeConcept,
    safeLang,
    ...(keywords || []),
  ]);
  return buildMetadata({
    title: `${safeConcept} in ${safeLang}`,
    description: shapeDescription(
      description,
      `Learn ${safeConcept} in ${safeLang} with clear explanations and copy-first code examples. Part of the free ${safeLang} tutorial on ${SITE_NAME}.`
    ),
    path,
    ogType: 'article',
    keywords: derived,
    publishedTime,
    modifiedTime,
  });
}

/**
 * Language landing page metadata.
 *
 * @param {Object} opts
 * @param {string} opts.language - Language label
 * @param {string} opts.description
 * @param {string} opts.path
 * @returns {object} Next.js Metadata
 */
export function buildLanguageMetadata({ language, description, path, topics }) {
  const safeLang = ensureNonEmpty(language, 'Programming');
  const keywords = deriveKeywords([
    `${safeLang} tutorial`,
    `learn ${safeLang}`,
    `${safeLang} examples`,
    `${safeLang} programming`,
    `${safeLang} for beginners`,
    safeLang,
    ...(topics || []),
  ]);
  return buildMetadata({
    title: `${safeLang} Tutorial`,
    description: shapeDescription(
      description,
      `Learn ${safeLang} from fundamentals to advanced topics with structured, copy-first code examples. Free ${safeLang} tutorial on ${SITE_NAME}.`
    ),
    path,
    ogType: 'website',
    keywords,
  });
}

/**
 * Project page metadata.
 *
 * @param {Object} opts
 * @param {string} opts.title
 * @param {string} opts.description
 * @param {string} opts.path
 * @returns {object} Next.js Metadata
 */
export function buildProjectMetadata({ title, description, path, tags }) {
  const safeTitle = ensureNonEmpty(title, 'Project');
  const keywords = deriveKeywords([
    `${safeTitle} architecture`,
    `${safeTitle} tech stack`,
    'system design',
    'project tutorial',
    safeTitle,
    ...(tags || []),
  ]);
  return buildMetadata({
    title: safeTitle,
    description: shapeDescription(
      description,
      `Explore the ${safeTitle} project: recommended tech stack and a system-design diagram on ${SITE_NAME}.`
    ),
    path,
    ogType: 'article',
    keywords,
  });
}

/**
 * Home page metadata.
 * @returns {object} Next.js Metadata
 */
export function buildHomeMetadata() {
  return buildMetadata({
    title: `${SITE_NAME} — Learn Programming & Databases Free`,
    description:
      'Free, structured tutorials for 22 programming languages and 17 database/query languages, with copy-first code examples, real-world projects, and system-design diagrams.',
    path: '/',
    ogType: 'website',
    keywords: [
      'programming tutorials',
      'learn to code',
      'coding examples',
      'database tutorial',
      'SQL tutorial',
      'JavaScript tutorial',
      'Python tutorial',
      'system design',
      'free programming course',
    ],
  });
}

// ---------------------------------------------------------------------------
// Unified buildJsonLd (Req 12.1, 12.2, 12.3, 12.4, 12.5)
// ---------------------------------------------------------------------------

/**
 * Unified JSON-LD builder for concept pages.
 *
 * Produces an array of JSON-LD objects:
 *   1. BreadcrumbList — itemListElement.length === ancestors.length (Req 12.1)
 *   2. TechArticle    — on every concept page (Req 12.2)
 *   3. VideoObject[]  — one per video when videos is non-empty (Req 12.3/12.4)
 *
 * All required fields are guaranteed non-null/non-undefined (Req 12.5).
 *
 * @param {Object} concept       - The resolved ConceptNode
 * @param {Array<{name:string, path:string}>} ancestors - Breadcrumb crumbs (root->node)
 * @param {string} language      - Language key (used for URL building)
 * @param {Array} [videos=[]]    - VideoRef[] (0..3)
 * @returns {object[]} Array of JSON-LD objects ready for <script type="application/ld+json">
 */
export function buildJsonLd(concept, ancestors, language, videos = [], opts = {}) {
  const results = [];
  const { languageLabel } = opts;

  // 1. BreadcrumbList (Req 12.1) — length equals ancestor count
  results.push(buildBreadcrumbJsonLd(ancestors));

  // 2. TechArticle (Req 12.2) — enriched for education/global reach
  const headline = ensureNonEmpty(
    concept && concept.title ? concept.title : '',
    'Concept'
  );
  const description = shapeDescription(
    concept && concept.concepts && concept.concepts[0] && concept.concepts[0].note
      ? concept.concepts[0].note
      : '',
    `Learn ${headline} with structured code examples.`
  );
  const conceptPath =
    concept && concept.slug
      ? `/${language}/${Array.isArray(concept.slug) ? concept.slug.join('/') : concept.slug}`
      : `/${language}`;

  results.push(
    buildArticleJsonLd({
      headline: languageLabel ? `${headline} in ${languageLabel}` : headline,
      description,
      path: conceptPath,
      programmingLanguage: languageLabel,
      about: [headline, languageLabel].filter(Boolean),
    })
  );

  // 3. VideoObjects (Req 12.3, 12.4) — one per video, omitted when empty
  if (Array.isArray(videos) && videos.length > 0) {
    for (const v of videos) {
      if (!v) continue;
      results.push(buildVideoJsonLd(v));
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Individual JSON-LD helpers (backward compatibility, also used directly)
// ---------------------------------------------------------------------------

/**
 * Build a BreadcrumbList JSON-LD object.
 * itemListElement.length equals crumbs.length (Req 12.1).
 * No null/undefined required fields (Req 12.5).
 *
 * @param {Array<{ name: string, path: string }>} crumbs
 * @returns {object}
 */
export function buildBreadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (crumbs || []).map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: ensureNonEmpty(crumb.name, `Item ${i + 1}`),
      item: absoluteUrl(crumb.path || '/'),
    })),
  };
}

/**
 * Build a TechArticle JSON-LD object (Req 12.2).
 * All required schema.org fields are guaranteed non-null (Req 12.5).
 *
 * @param {Object} opts
 * @param {string} opts.headline
 * @param {string} opts.description
 * @param {string} opts.path
 * @returns {object}
 */
export function buildArticleJsonLd({
  headline,
  description,
  path,
  programmingLanguage,
  about,
  keywords,
  datePublished,
  dateModified,
}) {
  const url = absoluteUrl(path || '/');
  const org = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(ORG_LOGO_PATH),
    },
  };
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: ensureNonEmpty(headline, 'Article'),
    description: shapeDescription(description, 'Learn with code-first examples.'),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en',
    isAccessibleForFree: true,
    datePublished: datePublished || '2024-01-01',
    dateModified: dateModified || new Date().toISOString().slice(0, 10),
    publisher: org,
    author: org,
  };
  if (programmingLanguage) {
    article.proficiencyLevel = 'Beginner';
    article.dependencies = programmingLanguage;
    article.about = { '@type': 'Thing', name: programmingLanguage };
  }
  if (Array.isArray(about) && about.length) {
    article.about = about
      .filter(Boolean)
      .map((name) => ({ '@type': 'Thing', name }));
  }
  if (Array.isArray(keywords) && keywords.length) {
    article.keywords = keywords.join(', ');
  }
  return article;
}

/**
 * Course + LearningResource JSON-LD for a language landing page. Education
 * schema helps the page surface in "learn X" and course-oriented searches
 * globally. All required fields are guaranteed non-null.
 *
 * @param {Object} opts
 * @param {string} opts.language - Language label (e.g. "Python")
 * @param {string} opts.description
 * @param {string} opts.path     - Canonical site-relative path (e.g. "/python")
 * @param {string[]} [opts.topics] - Top-level topic titles for hasCourseInstance/about
 * @returns {object[]}
 */
export function buildCourseJsonLd({ language, description, path, topics = [] }) {
  const safeLang = ensureNonEmpty(language, 'Programming');
  const url = absoluteUrl(path || '/');
  const org = {
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: absoluteUrl(ORG_LOGO_PATH) },
  };
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${safeLang} Tutorial`,
    description: shapeDescription(
      description,
      `A free, structured ${safeLang} tutorial with copy-first code examples.`
    ),
    url,
    inLanguage: 'en',
    isAccessibleForFree: true,
    provider: org,
    // Google requires a course instance or offers to be eligible for rich results.
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT10H',
      name: `${safeLang} self-paced tutorial`,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Free',
    },
  };
  if (Array.isArray(topics) && topics.length) {
    course.about = topics
      .filter(Boolean)
      .slice(0, 20)
      .map((t) => ({ '@type': 'Thing', name: t }));
    course.teaches = topics.filter(Boolean).slice(0, 20);
  }
  return [course];
}

/**
 * FAQPage JSON-LD from an array of { question, answer } pairs. Emits nothing
 * when the list is empty. Enables FAQ rich results.
 *
 * @param {Array<{question:string, answer:string}>} qas
 * @returns {object|null}
 */
export function buildFaqJsonLd(qas = []) {
  const items = (qas || []).filter((q) => q && q.question && q.answer);
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: ensureNonEmpty(q.question, 'Question'),
      acceptedAnswer: {
        '@type': 'Answer',
        text: ensureNonEmpty(q.answer, 'Answer'),
      },
    })),
  };
}

/**
 * Build a VideoObject JSON-LD entry (Req 12.3).
 * Required fields (name, description, thumbnailUrl, uploadDate, embedUrl)
 * are always present and non-null (Req 12.5).
 *
 * @param {Object} v - VideoRef
 * @returns {object}
 */
export function buildVideoJsonLd(v) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: ensureNonEmpty(v.title, 'Related Video'),
    description: ensureNonEmpty(v.description || v.title, 'Tutorial video'),
    thumbnailUrl:
      v.thumbnail || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    uploadDate: v.publishedAt || '1970-01-01',
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
  };
}

/**
 * WebSite + Organization JSON-LD for the home page.
 * All required fields are non-null (Req 12.5).
 *
 * @returns {object[]}
 */
export function buildSiteJsonLd() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_TAGLINE,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(ORG_LOGO_PATH),
    },
  };
  if (ORG_SAME_AS.length) org.sameAs = ORG_SAME_AS;

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: 'DevLearn',
      url: siteUrl,
      description: SITE_TAGLINE,
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: SITE_NAME, url: siteUrl },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    org,
  ];
}

/**
 * CollectionPage + ItemList JSON-LD for a hub/index page (home, projects).
 * @param {Object} opts
 * @param {string} opts.name
 * @param {string} opts.description
 * @param {string} opts.path
 * @param {Array<{name:string, path:string}>} opts.items
 * @returns {object}
 */
export function buildCollectionJsonLd({ name, description, path, items = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: ensureNonEmpty(name, SITE_NAME),
    description: shapeDescription(description, SITE_TAGLINE),
    url: absoluteUrl(path || '/'),
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: siteUrl },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (items || []).map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: ensureNonEmpty(it.name, `Item ${i + 1}`),
        url: absoluteUrl(it.path || '/'),
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Convenience: generateMetadata for routes (wraps the helpers above)
// ---------------------------------------------------------------------------

/**
 * Generate metadata for a concept route page.
 * Combines getConcept + getLanguageMeta resolution with the title pattern.
 * This is a convenience used directly by route files.
 *
 * @param {Object} opts
 * @param {string} opts.concept  - Concept title
 * @param {string} opts.language - Language label
 * @param {string} opts.description
 * @param {string} opts.path     - Canonical path
 * @returns {object} Next.js Metadata
 */
export function generateConceptPageMetadata({ concept, language, description, path }) {
  return buildConceptMetadata({ concept, language, description, path });
}

export { SITE_NAME };
