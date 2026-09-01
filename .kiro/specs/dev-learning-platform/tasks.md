# Implementation Plan: Dev Learning Platform

## Overview

This plan builds the Dev Learning Platform incrementally in plain JavaScript (no TypeScript) on Next.js App Router. It starts with the project scaffold and design-token theming, then the Redux store, the pure Content Access Layer (the data backbone), the concept rendering pipeline, the home directory, SEO + static generation, build-time video fetching, the Projects feature, theming, responsive navigation, and finally content authoring for the full catalog.

Each task builds on the previous ones and ends by wiring new code into existing routes/layout so nothing is orphaned. Property-based tests (fast-check) cover the 15 correctness properties; unit, component, and integration tests follow the design's Testing Strategy. Test sub-tasks are marked optional with `*` and may be skipped for a faster MVP.

## Tasks

- [x] 1. Scaffold the Next.js App Router project and tooling
  - [x] 1.1 Initialize the Next.js (App Router, plain JS) project and base config
    - Create `package.json`, `next.config.js` (with `metadataBase`-friendly env handling and security/caching headers), `jsconfig.json` (`@/*` path alias), `postcss.config.js`, and the `src/app` directory with a placeholder `layout.js` and `page.js`
    - Add `public/` with `favicon.ico` and an empty `public/og/` folder
    - _Requirements: 10.1, 23.6_

  - [x] 1.2 Configure Tailwind, design tokens, and global styles
    - Create `tailwind.config.js` with `darkMode: 'class'`, content globs for `src/**`, and color names mapped to CSS variables
    - Create `src/styles/tokens.js` holding the green→yellow HSL token values and create `src/app/globals.css` with Tailwind directives plus `:root` (light) and `.dark` (dark) CSS-variable declarations using shadcn token names (primary = green, accent/secondary = yellow, dark foreground on yellow), `--ring`, and `motion-safe`/`motion-reduce` conventions
    - _Requirements: 21.6, 22.1, 22.2, 22.3, 22.4, 22.5_

  - [x] 1.3 Set up shadcn/ui (JS) primitives and the `cn()` helper
    - Add `components.json` (JavaScript style, `@/` aliases, Tailwind paths) and `src/lib/utils.js` exporting `cn()` (clsx + tailwind-merge)
    - Generate/author `src/components/ui/` primitives in plain JS: `button.js`, `card.js`, `badge.js`, `separator.js`
    - _Requirements: 3.3, 22.1_

  - [-]* 1.4 Set up the testing framework
    - Configure Vitest + React Testing Library + jsdom + fast-check, add test scripts to `package.json`, and add a smoke test that renders a shadcn `Button`
    - _Requirements: 10.3_

- [x] 2. Implement the Redux Toolkit store
  - [x] 2.1 Implement `uiSlice`
    - Create `src/store/slices/uiSlice.js` with `theme` (constrained to `'light' | 'dark' | 'system'`), `copiedBlockId`, sidebar open/closed, nav-drawer open/closed, and sidebar expanded-node state; add `setCopied`, `clearCopied`, `setTheme`, sidebar/nav toggle, and expand reducers
    - _Requirements: 7.2, 7.3, 7.4, 21.4, 23.4, 24.3_

  - [x] 2.2 Implement `searchSlice` and `progressSlice`
    - Create `src/store/slices/searchSlice.js` (query + results) and `src/store/slices/progressSlice.js` (reading progress)
    - _Requirements: 24.3_

  - [x] 2.3 Wire the store and provider
    - Create `src/store/index.js` (`configureStore` combining the three slices) and `src/store/StoreProvider.js` (`'use client'` Provider wrapper)
    - _Requirements: 7.2_

  - [ ]* 2.4 Write property test for single active copy and theme constraint
    - **Property 5: Single active copy** — at most one non-null `copiedBlockId`; `clearCopied` resets it to `null`
    - **Validates: Requirements 7.3, 7.4**

  - [ ]* 2.5 Write unit tests for the reducers
    - Test `setCopied`/`clearCopied`, sidebar/nav toggles, expand state, and `setTheme` rejecting values outside the allowed set
    - _Requirements: 7.3, 7.4, 21.4, 24.3_

- [x] 3. Implement the content data model and Content Access Layer
  - [x] 3.1 Create the content registry skeleton and category descriptors
    - Create `src/content/index.js` (registry of languages) and seed two fixture languages with `meta.js` + a small `topics/*.js` tree so downstream code and tests have data; define the eight categories and `getCategories()` ordering source
    - _Requirements: 2.2, 2.3, 4.3_

  - [x] 3.2 Implement slug helpers
    - Create `src/lib/slug.js` with slug ↔ path-array helpers used by routing and the access layer
    - _Requirements: 8.1_

  - [x] 3.3 Implement the Content Access Layer
    - Create `src/lib/content.js` (pure, synchronous) implementing `getLanguages`, `getLanguageMeta`, `getLanguageTree`, `getConcept`, `getAncestors`, `getAllConceptPaths`, `getLanguagesByCategory`, and `getCategories` with memoized registry loading
    - _Requirements: 2.2, 4.1, 4.2, 4.3, 4.4, 8.1, 8.2, 8.3, 8.5, 9.1, 9.2, 10.3_

  - [x] 3.4 Implement build-time content validation
    - Add a `validateContent()` routine that throws naming the offending node id when a `ConceptNode` is missing `note`, has `level` outside `[1,6]`, has a duplicate sibling slug, or when two nodes in a language share an `id`; ensure every rendered `Concept` has non-empty `code` and `note`
    - _Requirements: 5.4, 20.1, 20.2_

  - [ ]* 3.5 Write property test for routing soundness
    - **Property 1: Routing soundness** — every path from `getAllConceptPaths()` resolves via `getConcept` to a non-null node; exactly one entry per routable node
    - **Validates: Requirements 8.2, 8.5, 10.2**

  - [ ]* 3.6 Write property test for ancestor consistency
    - **Property 2: Ancestor consistency** — `getAncestors(...).first` is the language root and `.last` is the addressed node; unresolvable slugs return an empty chain
    - **Validates: Requirements 9.1**

  - [ ]* 3.7 Write property test for category partition completeness
    - **Property 9: Category partition completeness** — union of `getLanguagesByCategory()` values equals `getLanguages()`, lists are pairwise disjoint, each key ∈ `getCategories().map(c => c.key)`, sorted by `order`
    - **Validates: Requirements 2.3, 3.2, 4.1, 4.2, 4.3**

  - [ ]* 3.8 Write property test for concept well-formedness
    - **Property 7: Concept well-formedness** — every rendered `Concept` has non-empty `code` and `note`; validation rejects malformed nodes
    - **Validates: Requirements 5.4, 20.1, 20.2**

  - [ ]* 3.9 Write unit tests for the Content Access Layer
    - Test `getConcept` hit/miss/empty-slug, `getAncestors` chains, and `getAllConceptPaths` enumeration against fixture trees
    - _Requirements: 8.1, 8.3, 9.2_

- [x] 4. Checkpoint - data layer
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement the concept rendering pipeline
  - [x] 5.1 Implement CodeBlock with copy-to-clipboard
    - Create `src/components/content/CodeBlock.js` (`'use client'`): near-black code surface, monospaced font, bounded horizontal scroll, a ≥44px copy button; on click write exact `code` to clipboard and dispatch `setCopied`/`clearCopied`; on failure select the text and show a manual-copy hint without changing the store
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.5_

  - [ ]* 5.2 Write property test for copy fidelity
    - **Property 4: Copy fidelity** — after a successful copy the clipboard string equals the block's `code` exactly
    - **Validates: Requirements 7.1**

  - [ ]* 5.3 Write unit tests for CodeBlock copy success and fallback
    - Test the success path (store updated, "Copied!" shown, reset after window) and the rejection/unavailable path (text selected, hint shown, store unchanged)
    - _Requirements: 7.2, 7.5_

  - [x] 5.4 Implement ConceptBlock, Notes, Example, and Heading
    - Create `src/components/content/ConceptBlock.js`, `Notes.js`, `Example.js`, and `Heading.js` rendering the fixed order code → note → example, with `example` rendered last only when defined
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 5.5 Write property test for fixed render order
    - **Property 3: Fixed render order** — DOM order is always code → note → example; `example` appears only when defined
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 6. Implement the home page and LanguageDirectory
  - [x] 6.1 Implement the LanguageDirectory component
    - Create `src/components/layout/LanguageDirectory.js` (server component): group `LanguageMeta[]` by category in the stable order, render one section heading per non-empty category (from `getCategories()`), and a responsive grid of shadcn `Card`s with label, tagline, category `Badge`, and a "Learn {label} →" `Button asChild` wrapping a `next/link` to `/{key}`
    - _Requirements: 3.2, 3.3, 3.4, 3.6, 4.4_

  - [x] 6.2 Implement the home page
    - Implement `src/app/page.js` (server): single H1 + intro, fetch metas via `getLanguages().map(getLanguageMeta)`, and render `<LanguageDirectory />`
    - _Requirements: 3.1, 3.5, 3.6_

  - [ ]* 6.3 Write property test for home directory completeness
    - **Property 8: Home directory completeness** — the set of link targets equals `{ '/' + key : key ∈ getLanguages() }` with no missing/duplicate entries
    - **Validates: Requirements 3.1, 3.3**

- [x] 7. Implement the SEO foundation
  - [x] 7.1 Implement the SEO builders
    - Create `src/lib/seo.js` with `generateMetadata` helpers (title template "{Concept} in {Language} | {Site}", non-empty description, `alternates.canonical`, Open Graph + Twitter cards, `metadataBase` from env) and `buildJsonLd` producing `BreadcrumbList` (length = ancestor count), `TechArticle`, and `WebSite`/`Organization` with no null/undefined required fields
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.5_

  - [x] 7.2 Implement JsonLd and Breadcrumbs components
    - Create `src/components/seo/JsonLd.js` (emits `<script type="application/ld+json">`) and `src/components/seo/Breadcrumbs.js` (renders the ancestor chain from `getAncestors`)
    - _Requirements: 9.3, 12.1, 12.2_

  - [ ]* 7.3 Write property test for SEO completeness
    - **Property 6: SEO completeness** — every generated page has title, description, canonical, and a `BreadcrumbList` whose length equals ancestor count
    - **Validates: Requirements 11.1, 11.2, 11.3, 12.1, 12.5**

  - [ ]* 7.4 Write unit tests for the SEO builders
    - Test `buildJsonLd` shape/required fields and `generateMetadata` title/canonical/OG output
    - _Requirements: 11.1, 11.2, 11.4, 12.5_

- [x] 8. Implement routing, layout, and static generation
  - [x] 8.1 Implement the root layout
    - Implement `src/app/layout.js`: wrap children in `StoreProvider`, set `next/font`, export `metadata` (title template + `metadataBase`) and the `viewport` object (`width=device-width, initial-scale=1`), and include placeholder slots for nav/sidebar to be wired later
    - _Requirements: 11.5, 23.6_

  - [x] 8.2 Implement the language landing route
    - Implement `src/app/[language]/page.js` with `generateStaticParams` (from `getLanguages()`), `generateMetadata`, the topic index, and `notFound()` for unknown languages
    - _Requirements: 8.4, 10.1, 10.2_

  - [x] 8.3 Implement the concept route
    - Implement `src/app/[language]/[...slug]/page.js` with `generateStaticParams` (from `getAllConceptPaths()`), `generateMetadata`, breadcrumb + ConceptBlock rendering, BreadcrumbList/TechArticle JSON-LD, and `notFound()` when `getConcept` returns `null`
    - _Requirements: 8.4, 9.3, 10.1, 10.2, 12.1, 12.2_

  - [x] 8.4 Implement sitemap and robots
    - Implement `src/app/sitemap.js` enumerating every path from `getAllConceptPaths()`, `/projects`, and `/projects/{slug}` from `getAllProjectSlugs()` with accurate `lastModified`/`changeFrequency`/`priority`, excluding 404s; implement `src/app/robots.js` allowing crawling and referencing the sitemap
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 8.5 Write integration tests for routes and sitemap
    - Build the app and assert generated routes match `getAllConceptPaths`, the sitemap lists exactly the routable pages (excluding 404s), and pages contain valid JSON-LD + canonical/OG tags
    - _Requirements: 10.1, 13.1, 13.2_

- [x] 9. Checkpoint - content rendering and SEO
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement the build-time video feature
  - [x] 10.1 Implement the Video Fetcher
    - Create `src/lib/videos.js` with `fetchVideosForTopic(query, max)` (YouTube Data API v3, build-time only, reads `YOUTUBE_API_KEY` server-side), `buildVideoCache()` (cache-first write to `src/content/.cache/videos.json`, re-fetch only missing/stale), and synchronous `getVideosForTopic(topicId)` (cache read, no network); add a `fetch:videos` script; fall back to existing cache/empty list on API error, quota, or missing key
    - _Requirements: 14.1, 14.2, 14.3, 14.5, 14.6_

  - [x] 10.2 Implement VideoEmbeds lazy façade
    - Create `src/components/content/VideoEmbeds.js` (`'use client'`): render at most 3 videos, each as a lazy façade loading the `youtube-nocookie.com` iframe only on click; render nothing (no wrapper) when `videos` is empty; validate `videoId` against `[A-Za-z0-9_-]{11}` and skip cards whose thumbnail fails to load; single-column 16:9 container on narrow viewports
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6_

  - [x] 10.3 Wire videos into concept pages and JSON-LD
    - In the concept route, resolve videos via hand-authored `videos` (preferred) else `getVideosForTopic`, render `<VideoEmbeds />`, and emit one `VideoObject` JSON-LD per rendered video (name, description, thumbnailUrl, uploadDate, embedUrl); emit none when there are no videos
    - _Requirements: 12.3, 12.4, 14.3, 14.4, 15.1_

  - [ ]* 10.4 Write property test for video constraints
    - **Property 10: Video constraints** — at most 3 videos per topic; each `videoId` matches `[A-Za-z0-9_-]{11}`; section omitted when empty; render reads only the cache (no API call at render time)
    - **Validates: Requirements 14.3, 15.1, 15.3, 15.4**

  - [ ]* 10.5 Write unit tests for the Video Fetcher fallbacks
    - Test cache-first behavior and graceful fallback to cache/empty list on error, quota, or missing key
    - _Requirements: 14.2, 14.5_

- [x] 11. Implement the Projects feature
  - [x] 11.1 Implement the Projects registry and access layer
    - Create `src/content/projects/index.js` (registry) plus the `Project`/`StackLayer`/`TechRef`/`SystemDesign`/`DesignNode`/`DesignEdge` data shapes, and `src/lib/projects.js` (pure, synchronous) with `getProjects`, `getProject`, `getAllProjectSlugs`; seed two fixture projects for tests
    - _Requirements: 16.1, 16.3_

  - [x] 11.2 Implement project validation
    - Add build-time validation that throws naming the offending project slug/edge when a `DesignEdge.from`/`.to` references a non-existent `DesignNode.id`, and naming the offending `languageKey` when a non-null `TechRef.languageKey` is not in `getLanguages()`
    - _Requirements: 20.3, 20.4_

  - [x] 11.3 Implement the diagram layout function
    - Create `src/lib/diagram.js` with pure, deterministic `layoutSystemDesign(design)` that places every node exactly once into columns by `layer` (order from `design.layers`), computes `width`/`height` viewBox bounds containing all node boxes and edge paths, emits curved back-edge paths for cycles, and never mutates the input
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ]* 11.4 Write property test for diagram integrity
    - **Property 12: Diagram integrity** — every edge references an existing node; `layoutSystemDesign` is a bijection over input ids, deterministic, and its viewBox bounds contain all geometry
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.6, 20.3**

  - [x] 11.5 Implement SystemDesignDiagram (server inline SVG)
    - Create `src/components/projects/SystemDesignDiagram.js` (server, no client JS): emit `<svg role="img">` with `<title>`/`<desc>`, labeled node boxes with embedded icons, edge connector paths with optional labels, and `viewBox` + `preserveAspectRatio`; place wide diagrams in a bounded horizontally-scrolling wrapper
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

  - [x] 11.6 Implement StackFlow
    - Create `src/components/projects/StackFlow.js` (server): render `stack` layers in order with labels, each `TechRef` with icon/name/reason, wrapping techs with a non-null `languageKey` in a real `next/link` anchor to `/{languageKey}` (no client JS)
    - _Requirements: 17.1, 17.2, 17.3, 17.5_

  - [ ]* 11.7 Write property test for stack link validity
    - **Property 13: Stack link validity** — every non-null `TechRef.languageKey` is a member of `getLanguages()`
    - **Validates: Requirements 17.3, 17.4, 20.4**

  - [x] 11.8 Implement ProjectCard
    - Create `src/components/projects/ProjectCard.js`: shadcn `Card` showing icon, title, summary, difficulty `Badge`, tags, and a link to `/projects/{slug}`
    - _Requirements: 16.2_

  - [x] 11.9 Implement the Projects routes
    - Implement `src/app/projects/page.js` (responsive `ProjectCard` grid + JSON-LD) and `src/app/projects/[project]/page.js` with `generateStaticParams` (from `getAllProjectSlugs()`), `generateMetadata`, StackFlow + SystemDesignDiagram, BreadcrumbList/TechArticle JSON-LD, and `notFound()` when `getProject` returns `null`
    - _Requirements: 16.2, 16.3, 16.4, 17.1, 19.1_

  - [ ]* 11.10 Write property test for project routing soundness
    - **Property 11: Project routing soundness** — every slug from `getAllProjectSlugs()` resolves via `getProject` to a non-null project and appears in the sitemap; unknown slugs resolve to `null`
    - **Validates: Requirements 13.1, 16.3, 16.4**

  - [ ]* 11.11 Write component tests for the Projects UI
    - Test ProjectCard rendering and StackFlow anchor output (links without client JS)
    - _Requirements: 16.2, 17.5_

- [x] 12. Checkpoint - projects and media
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Implement theming (dark / light / system)
  - [x] 13.1 Implement the no-flash inline head script
    - Add an inline `<script>` in `app/layout.js` `<head>` that reads `localStorage`/`prefers-color-scheme` and sets the `dark` class on `<html>` before first paint
    - _Requirements: 21.1, 21.2_

  - [x] 13.2 Implement the ThemeToggle
    - Create `src/components/ui/ThemeToggle.js` (`'use client'`): cycle light → dark → system, update the DOM `dark` class, `localStorage`, and `uiSlice.theme` consistently with sun/moon/system icons and a ≥44px target
    - _Requirements: 21.3, 21.4_

  - [x] 13.3 Wire live system-preference sync
    - Subscribe to `prefers-color-scheme` changes while mode is `'system'` and re-apply the `dark` class live; resolve all themeable colors from CSS-variable tokens
    - _Requirements: 21.1, 21.5, 21.6_

  - [ ]* 13.4 Write property test for theme integrity
    - **Property 15: Theme integrity** — `dark` class present iff `theme === 'dark'` or (`'system'` and system dark); toggling keeps DOM class + `localStorage` + `uiSlice.theme` in sync; `theme` always ∈ `{light,dark,system}`
    - **Validates: Requirements 21.1, 21.2, 21.3, 21.4, 21.6**

  - [ ]* 13.5 Write unit tests for ThemeToggle cycling
    - Test the cycle order and that it toggles the `<html>` `dark` class and `localStorage`
    - _Requirements: 21.3_

- [x] 14. Implement responsive navigation, sidebar, and layout wiring
  - [x] 14.1 Implement the Navbar and LanguageNav drawer
    - Create `src/components/layout/Navbar.js` and `LanguageNav.js`: one link per `getLanguages()` plus a top-level `/projects` link on every page, active-language marking, ≥44px targets; below `md` collapse into a hamburger-triggered off-canvas drawer (driven by `uiSlice`) that closes via dismiss control, overlay tap, or Escape
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 23.3_

  - [x] 14.2 Implement the TopicSidebar
    - Create `src/components/layout/Sidebar.js`: nested expandable topic tree for the active language with current-concept active marking and expanded-node state persisted in `uiSlice`; below `lg` render as a dismissible off-canvas drawer that closes on topic selection
    - _Requirements: 23.4, 23.5, 24.1, 24.2, 24.3_

  - [x] 14.3 Implement RightRail and Footer
    - Create `src/components/layout/RightRail.js` (points-to-remember / quick nav) and `src/components/layout/Footer.js`
    - _Requirements: 23.1_

  - [x] 14.4 Wire navigation and sidebar into the layout and pages
    - Update `app/layout.js` to render Navbar + ThemeToggle, and the language/concept routes to render Sidebar, content column, breadcrumbs, and RightRail, ensuring no page-level horizontal overflow (wide content scrolls within bounded containers)
    - _Requirements: 23.1, 23.2_

  - [ ]* 14.5 Write component/responsive tests for navigation and drawers
    - **Property 14: Responsive layout** — at ~360px no page-level horizontal overflow; nav and topic drawers are openable and dismissible (button, overlay, Esc); interactive controls meet the tap-target minimum
    - **Validates: Requirements 1.4, 1.5, 23.1, 23.2, 23.3, 23.4, 23.5**

  - [ ]* 14.6 Write unit tests for sidebar active marking and expand state
    - Test current-concept active marking and expanded-node persistence in `uiSlice`
    - _Requirements: 24.2, 24.3_

- [x] 15. Implement client search
  - [x] 15.1 Implement the search index and search page
    - Create `src/lib/search-index.js` (build a flat index from the content registry) and `src/app/search/page.js` (client results driven by `searchSlice`) plus a Navbar search box
    - _Requirements: 2.2_

- [x] 16. Checkpoint - full UI shell
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Author the content catalog
  - [x] 17.1 Author the programming-language content modules
    - Create one folder per language under `src/content/` (`meta.js` with correct `category`/`order`/`tagline` + `topics/*.js` trees following code-first → note → example) for the 22 programming languages and register them in `src/content/index.js`
    - _Requirements: 2.1, 2.3, 5.1, 5.4_

  - [x] 17.2 Author the database/query-language content modules
    - Create folders for the 17 database/query languages with `database-sql`/`database-nosql` categories and topic trees, and register them
    - _Requirements: 2.1, 2.3, 5.1, 5.4_

  - [x] 17.3 Author the project modules
    - Create the ~20 project modules under `src/content/projects/` with `stack` (TechRefs linking to catalog `languageKey`s) and `design` (`nodes`/`edges`/`layers`), and register them
    - _Requirements: 16.1, 17.1, 17.4, 18.4_

  - [x] 17.4 Run full-catalog validation
    - Run `validateContent()` and project validation across the entire catalog and fix any reported node ids, duplicate slugs, dangling edges, or invalid `languageKey`s
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [ ]* 17.5 Author and run content/project validation tests
    - Add tests asserting the full catalog passes validation and that catalog counts (22 + 17 languages, ~20 projects) and category assignments hold
    - _Requirements: 2.1, 2.3, 20.1_

- [x] 18. Final checkpoint - full build and verification
  - Run `fetch:videos` (or rely on the committed cache), run the production build, and ensure all tests pass; ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP.
- Each task references specific requirements (granular clauses) for traceability.
- Property-based tests use fast-check and validate the 15 universal correctness properties; unit, component, and integration tests cover examples, edge cases, and end-to-end build behavior per the design's Testing Strategy.
- Checkpoints ensure incremental validation at natural breaks (data layer, rendering/SEO, projects/media, UI shell, final build).
- The implementation language is plain JavaScript (no TypeScript) throughout, per the design.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["2.1", "2.2", "3.1", "3.2", "11.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "2.5", "3.3", "11.3"] },
    { "id": 4, "tasks": ["3.4", "3.5", "3.6", "3.7", "3.8", "3.9", "5.1", "5.4", "7.1", "11.2", "11.4", "11.6", "11.8"] },
    { "id": 5, "tasks": ["5.2", "5.3", "5.5", "6.1", "7.2", "7.3", "7.4", "8.1", "10.1", "10.2", "11.5", "11.7", "13.2"] },
    { "id": 6, "tasks": ["6.2", "6.3", "8.2", "8.4", "13.1", "14.1", "14.2", "14.3"] },
    { "id": 7, "tasks": ["8.3", "11.9", "13.3", "13.4", "13.5", "15.1"] },
    { "id": 8, "tasks": ["8.5", "10.3", "11.10", "11.11"] },
    { "id": 9, "tasks": ["10.4", "10.5", "14.4"] },
    { "id": 10, "tasks": ["14.5", "14.6"] },
    { "id": 11, "tasks": ["17.1", "17.3"] },
    { "id": 12, "tasks": ["17.2"] },
    { "id": 13, "tasks": ["17.4"] },
    { "id": 14, "tasks": ["17.5"] }
  ]
}
```
