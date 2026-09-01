# Requirements Document

## Introduction

The Dev Learning Platform is a GeeksforGeeks-style IT/coding learning web application built with Next.js (App Router), Tailwind CSS, Redux Toolkit, and shadcn/ui, written in plain JavaScript. Every top-level navigation link is a programming or database/query language, and each language exposes a hierarchical tree of topics. Every concept is rendered in a fixed layout: a dark-themed code block with a copy button FIRST, followed by an explanatory note, followed by an optional worked example.

The platform is heavily SEO-optimized for global reach on Vercel: content pages are statically generated at build time (SSG), enriched with per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD structured data, an auto-generated sitemap, and robots rules. It additionally provides a Projects section that pairs recommended tech-stack flows with server-rendered inline-SVG system-design flowcharts, fetches related YouTube videos at build time, ships a green→yellow themed UI with dark/light/system modes, and is mobile-first responsive.

These requirements are derived from the approved design document and are organized so that every design correctness property and major component maps to one or more acceptance criteria.

## Glossary

- **Platform**: The Dev Learning Platform web application as a whole.
- **Content_Access_Layer**: The pure, synchronous module (`lib/content.js`) that traverses the content registry, resolves slugs, and enumerates routes (`getConcept`, `getAncestors`, `getAllConceptPaths`, `getLanguages`, `getLanguageMeta`, `getLanguagesByCategory`, `getCategories`, `getLanguageTree`).
- **Projects_Access_Layer**: The pure, synchronous module (`lib/projects.js`) that resolves project slugs and enumerates project routes (`getProjects`, `getProject`, `getAllProjectSlugs`).
- **Concept**: A "point to remember" data unit with a required `code` block, a required `note`, and an optional `example`.
- **ConceptNode**: A node in a language's topic hierarchy, optionally routable (has a `slug`), holding ordered `Concept` blocks and child nodes.
- **LanguageMeta**: Metadata for a language (`key`, `label`, `tagline`, `description`, `category`, `order`, `color`, `icon`).
- **Category**: Exactly one of `frontend`, `backend`, `mobile`, `systems`, `scripting`, `data`, `database-sql`, `database-nosql`.
- **ConceptBlock**: The component that renders a single `Concept` in fixed order (code → note → example).
- **CodeBlock**: The client component that renders source code on a near-black surface with a copy button.
- **Home_Directory**: The home page (`app/page.js`) plus `LanguageDirectory`, which lists every language grouped by category.
- **Video_Fetcher**: The build-time module (`lib/videos.js`) that fetches YouTube videos and reads the on-disk cache.
- **VideoRef**: A reference to a related video (`videoId`, `title`, optional `channel`/`thumbnail`/`publishedAt`).
- **VideoEmbeds**: The client component that renders up to 3 related videos as lazy façades.
- **Project**: A routable real-world project definition with `stack` and `design` data.
- **SystemDesign**: A project's `nodes` + `edges` + ordered `layers` data model.
- **Diagram_Layout**: The pure build-time function `layoutSystemDesign(design)` that turns a `SystemDesign` into a renderable geometry model.
- **SystemDesignDiagram**: The server component that emits accessible inline SVG from a `SystemDesign`.
- **StackFlow**: The server component that renders a project's recommended tech stack as a layered flow.
- **TechRef**: A recommended technology entry that may link (via `languageKey`) to a catalog language page.
- **SEO_Builder**: The module (`lib/seo.js`) that builds metadata and JSON-LD (`buildJsonLd`, `generateMetadata`).
- **Theme_Controller**: The combined inline head script + `ThemeToggle` + `uiSlice.theme` mechanism that applies and persists the appearance.
- **UI_Store**: The Redux Toolkit store (`uiSlice`, `searchSlice`, `progressSlice`) holding client-side UI state.

## Requirements

### Requirement 1: Language Navigation

**User Story:** As a learner, I want every programming and database language to be a top-level navigation link, so that I can reach any language's content from any page.

#### Acceptance Criteria

1. THE Platform SHALL render one navigation link per language returned by `getLanguages()`.
2. THE Platform SHALL render a top-level "Projects" navigation link pointing to `/projects` on every page.
3. WHEN a language page is active, THE Platform SHALL mark the corresponding navigation link as the active language.
4. WHERE the viewport width is below the `md` breakpoint, THE Platform SHALL collapse the language links and the "Projects" link into a hamburger-triggered drawer.
5. WHEN a user activates the navigation drawer dismiss control, the overlay, or the Escape key, THE Platform SHALL close the navigation drawer.

### Requirement 2: Content Catalog Completeness

**User Story:** As a learner, I want a complete catalog of programming and database/query languages, so that I can study any language with equal depth.

#### Acceptance Criteria

1. THE Platform SHALL register 22 programming languages and 17 database/query languages as first-class, equal-scope catalog entries.
2. THE Content_Access_Layer SHALL derive every navigation link, home-page entry, and static route from the content registry without manual per-language editing.
3. THE Platform SHALL assign each registered language exactly one Category from the eight allowed values.

### Requirement 3: Home Page Language Directory

**User Story:** As a visitor, I want a home page that lists every language by category with a short tagline, so that I can discover and choose what to learn.

#### Acceptance Criteria

1. THE Home_Directory SHALL render exactly one entry per registered language, such that the set of entry link targets equals `{ "/" + key : key ∈ getLanguages() }` with no missing or duplicate entries.
2. THE Home_Directory SHALL group languages into sections by Category in the stable order frontend → backend → mobile → systems → scripting → data → database-sql → database-nosql.
3. THE Home_Directory SHALL render each language as a shadcn Card containing the language label, its one-line tagline, and a navigation action linking to `/{key}`.
4. IF a Category contains no registered languages, THEN THE Home_Directory SHALL omit that Category section.
5. THE Home_Directory SHALL render exactly one H1 and one semantic section heading per non-empty Category.
6. THE Home_Directory SHALL render as a server component without requiring client JavaScript to display the language list.

### Requirement 4: Category Partitioning

**User Story:** As a content maintainer, I want each language assigned to exactly one category, so that the home page sections form a clean, complete partition.

#### Acceptance Criteria

1. THE Content_Access_Layer SHALL expose `getLanguagesByCategory()` whose values' union equals `getLanguages()` as a set.
2. THE Content_Access_Layer SHALL ensure the category lists returned by `getLanguagesByCategory()` are pairwise disjoint.
3. THE Content_Access_Layer SHALL ensure every key in `getLanguagesByCategory()` is a member of `getCategories().map(c => c.key)`.
4. THE Content_Access_Layer SHALL return languages within each Category sorted by their `order` field.

### Requirement 5: Concept Rendering Order

**User Story:** As a learner, I want every concept presented code-first, then a note, then an example, so that I can read code in a consistent, predictable layout.

#### Acceptance Criteria

1. THE ConceptBlock SHALL render a Concept's `code` block before its `note` and the `note` before its `example`.
2. WHERE a Concept defines an `example`, THE ConceptBlock SHALL render the `example` last.
3. IF a Concept does not define an `example`, THEN THE ConceptBlock SHALL render only the `code` block and the `note`.
4. THE Platform SHALL ensure every rendered Concept has a non-empty `code` and a non-empty `note`.

### Requirement 6: Code Block Display

**User Story:** As a developer, I want code shown on a dark surface with clear formatting, so that code is readable in both light and dark themes.

#### Acceptance Criteria

1. THE CodeBlock SHALL render source code on a near-black code surface using a monospaced font in both light and dark themes.
2. THE CodeBlock SHALL render a copy button within the block.
3. WHERE the viewport is narrow, THE CodeBlock SHALL scroll its code horizontally within its own bounded container so that long lines do not widen the page.
4. THE CodeBlock SHALL render its copy button with a tap target of at least 44px.

### Requirement 7: Copy to Clipboard

**User Story:** As a developer, I want to copy a code block to my clipboard with one click, so that I can reuse code quickly.

#### Acceptance Criteria

1. WHEN a user clicks a CodeBlock copy button, THE CodeBlock SHALL write the block's exact `code` string to the clipboard.
2. WHEN a clipboard write succeeds, THE UI_Store SHALL set `copiedBlockId` to that block's id and display "Copied!" feedback.
3. WHEN the copy feedback window elapses, THE UI_Store SHALL reset `copiedBlockId` to `null`.
4. THE UI_Store SHALL hold at most one non-null `copiedBlockId` at any time.
5. IF the clipboard write rejects or the Clipboard API is unavailable, THEN THE CodeBlock SHALL select the code text, display a manual-copy hint, and leave the UI_Store unchanged.

### Requirement 8: Concept Routing and Resolution

**User Story:** As a learner, I want deep topic URLs to resolve to the correct concept, so that I can navigate and share links to specific topics.

#### Acceptance Criteria

1. THE Content_Access_Layer SHALL resolve `getConcept(language, slugArray)` to the ConceptNode whose slug chain equals `slugArray`.
2. FOR ALL paths returned by `getAllConceptPaths()`, THE Content_Access_Layer SHALL resolve `getConcept(path.language, path.slug)` to a non-null node.
3. IF a requested slug path does not match any node, THEN THE Content_Access_Layer SHALL return `null`.
4. WHEN `getConcept` returns `null` for requested route params, THE Platform SHALL invoke `notFound()` and render a 404 page.
5. THE Content_Access_Layer SHALL enumerate exactly one entry per routable (slugged) node across all languages in `getAllConceptPaths()`.

### Requirement 9: Breadcrumb Ancestor Trail

**User Story:** As a learner, I want breadcrumb trails on concept pages, so that I understand where a topic sits in the hierarchy.

#### Acceptance Criteria

1. THE Content_Access_Layer SHALL return from `getAncestors(language, slugArray)` an ordered chain whose first element is the language root and whose last element is the addressed node.
2. IF a slug path is unresolvable, THEN THE Content_Access_Layer SHALL return an empty ancestor chain.
3. THE Platform SHALL render a breadcrumb trail on each concept page derived from the ancestor chain.

### Requirement 10: Static Generation at Build Time

**User Story:** As a site operator, I want all content pages pre-rendered at build time, so that the site is fast and reliably crawlable.

#### Acceptance Criteria

1. THE Platform SHALL statically generate every concept page, language landing page, project page, and the home page via `generateStaticParams` at build time.
2. THE Platform SHALL ensure each route param returned by `generateStaticParams` for concept pages resolves via `getConcept` to a non-null node.
3. THE Content_Access_Layer SHALL remain pure and synchronous so that content traversal requires no network access at build or render time.

### Requirement 11: Page Metadata

**User Story:** As a site operator, I want unique, complete metadata on every page, so that search engines and social platforms index and present pages correctly.

#### Acceptance Criteria

1. THE SEO_Builder SHALL produce for every generated page a non-empty `title` and a non-empty `description`.
2. THE SEO_Builder SHALL include a canonical URL on every generated page via `alternates.canonical`.
3. THE SEO_Builder SHALL include Open Graph and Twitter card fields on every generated page.
4. THE SEO_Builder SHALL format concept page titles using the pattern "{Concept} in {Language} | {Site}".
5. THE Platform SHALL set `metadataBase` from the production domain so relative Open Graph and canonical URLs resolve to absolute URLs.

### Requirement 12: Structured Data (JSON-LD)

**User Story:** As a site operator, I want structured data on content pages, so that pages are eligible for rich search results.

#### Acceptance Criteria

1. THE SEO_Builder SHALL emit a JSON-LD `BreadcrumbList` on every concept page whose `itemListElement` length equals the ancestor count.
2. THE SEO_Builder SHALL emit a `TechArticle` (or `Article`) JSON-LD entry on every concept page.
3. WHERE a concept page has related videos, THE SEO_Builder SHALL emit one `VideoObject` entry per rendered video including `name`, `description`, `thumbnailUrl`, `uploadDate`, and `embedUrl`.
4. IF a page has no related videos, THEN THE SEO_Builder SHALL emit no `VideoObject` entry.
5. THE SEO_Builder SHALL emit JSON-LD with no undefined or null required fields.

### Requirement 13: Sitemap and Robots

**User Story:** As a site operator, I want an accurate sitemap and robots file, so that crawlers discover all valid pages and skip invalid ones.

#### Acceptance Criteria

1. THE Platform SHALL enumerate in `sitemap.xml` every routable page from `getAllConceptPaths()`, the `/projects` hub, and every `/projects/{slug}` from `getAllProjectSlugs()`.
2. THE Platform SHALL exclude routes that resolve to 404 from the sitemap.
3. THE Platform SHALL emit a robots file that allows crawling and references the sitemap.
4. THE Platform SHALL include accurate `lastModified`, `changeFrequency`, and `priority` on each sitemap entry.

### Requirement 14: Build-Time Video Fetching

**User Story:** As a content maintainer, I want related YouTube videos fetched at build time and cached, so that pages show relevant videos without runtime API calls.

#### Acceptance Criteria

1. THE Video_Fetcher SHALL fetch up to 3 related videos per topic from the YouTube Data API v3 using a query derived from the language label and topic title.
2. THE Video_Fetcher SHALL write fetched results to an on-disk cache (`src/content/.cache/videos.json`) and re-fetch only missing or stale entries.
3. THE Platform SHALL read videos at render time only from the build-time cache via `getVideosForTopic`, performing no YouTube API call at request or render time.
4. WHERE a ConceptNode has a hand-authored `videos` array, THE Platform SHALL use it in preference to fetched results for that topic.
5. IF the YouTube API returns an error, the quota is exceeded, or `YOUTUBE_API_KEY` is missing, THEN THE Video_Fetcher SHALL fall back to the existing cache or an empty list so the build still succeeds.
6. THE Video_Fetcher SHALL never expose `YOUTUBE_API_KEY` to the browser and SHALL never call the API client-side.

### Requirement 15: Video Rendering

**User Story:** As a learner, I want related videos shown as fast, privacy-friendly embeds, so that I can watch tutorials without harming page performance.

#### Acceptance Criteria

1. THE VideoEmbeds component SHALL render at most 3 videos per topic.
2. THE VideoEmbeds component SHALL render each video as a lazy façade and load the `youtube-nocookie.com` iframe only after the user clicks the façade.
3. IF the `videos` array is empty, THEN THE VideoEmbeds component SHALL render nothing, including no "Related Videos" wrapper markup.
4. THE Platform SHALL ensure every rendered VideoRef has a `videoId` matching `[A-Za-z0-9_-]{11}` and a non-empty `title`.
5. IF a cached video's façade thumbnail fails to load, THEN THE VideoEmbeds component SHALL skip that card and still render the remaining valid videos.
6. WHERE the viewport is narrow, THE VideoEmbeds component SHALL use a single-column grid with a 16:9 aspect-ratio container to reserve space and avoid layout shift.

### Requirement 16: Projects Catalog and Index

**User Story:** As a learner, I want a Projects section listing real-world projects, so that I can study practical system designs and stacks.

#### Acceptance Criteria

1. THE Projects_Access_Layer SHALL register approximately 20 real-world projects, each addressable at `/projects/{slug}`.
2. THE Platform SHALL render the Projects index (`/projects`) as a responsive grid of shadcn ProjectCards showing each project's icon, title, summary, difficulty badge, tags, and a link to `/projects/{slug}`.
3. FOR ALL slugs returned by `getAllProjectSlugs()`, THE Projects_Access_Layer SHALL resolve `getProject(slug)` to a non-null Project.
4. IF `getProject` returns `null` for a requested slug, THEN THE Platform SHALL invoke `notFound()` and render a 404 page.

### Requirement 17: Project Stack Flow

**User Story:** As a learner, I want each project to show a recommended layered tech stack that links back to language pages, so that I can learn the technologies it uses.

#### Acceptance Criteria

1. THE StackFlow component SHALL render a project's `stack` layers in order, one group per layer with its label.
2. THE StackFlow component SHALL render each TechRef with its icon, name, and short reason.
3. WHERE a TechRef has a non-null `languageKey`, THE StackFlow component SHALL wrap the tech in a link to `/{languageKey}`.
4. THE Platform SHALL ensure that for every TechRef with a non-null `languageKey`, that `languageKey` is a member of `getLanguages()`.
5. THE StackFlow component SHALL render its links as real anchors without requiring client JavaScript.

### Requirement 18: System Design Diagram Layout

**User Story:** As a learner, I want a deterministic, complete layout for each project's system design, so that the rendered diagram is correct and stable.

#### Acceptance Criteria

1. THE Diagram_Layout SHALL place every input DesignNode exactly once in its output, forming a bijection over the input node ids.
2. THE Diagram_Layout SHALL be deterministic, producing identical output for identical input.
3. THE Diagram_Layout SHALL compute `width` and `height` viewBox bounds that contain all node boxes and edge paths.
4. THE Diagram_Layout SHALL place nodes into columns by `layer` using `design.layers` for column order.
5. IF the design graph contains a cycle, THEN THE Diagram_Layout SHALL emit a curved back-edge path so the diagram still renders.
6. THE Diagram_Layout SHALL NOT mutate the input `design`.

### Requirement 19: System Design Diagram Rendering

**User Story:** As a learner and a search crawler, I want system-design diagrams rendered as accessible inline SVG, so that the architecture is crawlable, fast, and screen-reader friendly.

#### Acceptance Criteria

1. THE SystemDesignDiagram SHALL render as a server component emitting inline SVG with no client JavaScript.
2. THE SystemDesignDiagram SHALL emit an `<svg role="img">` containing a `<title>` and `<desc>` describing the architecture.
3. THE SystemDesignDiagram SHALL render each node as a labeled box with an embedded icon and each edge as a connector path with its optional label.
4. THE SystemDesignDiagram SHALL use `viewBox` and `preserveAspectRatio` so the diagram scales without a fixed pixel size.
5. WHERE the viewport is narrow, THE SystemDesignDiagram SHALL place wide diagrams inside a bounded wrapper that scrolls horizontally so that only the diagram, not the page, scrolls.

### Requirement 20: Content and Project Validation

**User Story:** As a content maintainer, I want malformed content and project data to fail fast at build time, so that errors are caught before deployment.

#### Acceptance Criteria

1. IF a ConceptNode violates validation (missing `note`, `level` outside [1,6], or a duplicate sibling slug), THEN THE Platform SHALL throw at build time naming the offending node id.
2. IF two ConceptNodes within a language share an `id`, THEN THE Platform SHALL fail validation and list the conflicting ids.
3. IF a DesignEdge `from` or `to` references a non-existent DesignNode id, THEN THE Platform SHALL throw at build time naming the offending project slug and edge.
4. IF a TechRef `languageKey` is non-null but not a registered language key, THEN THE Platform SHALL throw at build time naming the offending `languageKey`.

### Requirement 21: Theming (Dark / Light / System)

**User Story:** As a user, I want dark, light, and system theme modes with my choice remembered, so that the interface matches my preference without flashing.

#### Acceptance Criteria

1. THE Theme_Controller SHALL set the `dark` class on `<html>` if and only if `theme === 'dark'`, or `theme === 'system'` and `prefers-color-scheme: dark` matches.
2. THE Theme_Controller SHALL apply the correct `dark` class before first paint via an inline head script so there is no flash of the wrong theme.
3. WHEN a user activates the ThemeToggle, THE Theme_Controller SHALL advance the mode in the cycle light → dark → system and update the DOM `dark` class, `localStorage`, and `uiSlice.theme` consistently.
4. THE UI_Store SHALL constrain `uiSlice.theme` to one of `'light'`, `'dark'`, or `'system'`.
5. WHILE the mode is `'system'`, THE Theme_Controller SHALL subscribe to `prefers-color-scheme` changes and re-apply the `dark` class live.
6. THE Platform SHALL resolve all themeable colors from CSS-variable tokens so that no component hard-codes brand green/yellow colors, except the documented near-black CodeBlock code surface.

### Requirement 22: Brand Visual Design

**User Story:** As a user, I want a polished green→yellow themed interface with accessible contrast, so that the platform looks cohesive and remains readable.

#### Acceptance Criteria

1. THE Platform SHALL define the brand palette as HSL CSS-variable tokens under `:root` (light) and `.dark` (dark) using shadcn/ui token names, with primary = green and accent/secondary = yellow.
2. THE Platform SHALL use a dark foreground for text on yellow/gold accent and secondary tokens to meet WCAG AA contrast.
3. THE Platform SHALL target a contrast ratio of at least 4.5:1 for body text and at least 3:1 for large text and UI controls in both themes.
4. THE Platform SHALL gate all motion/transitions behind `motion-safe:` and disable them under `motion-reduce:`.
5. THE Platform SHALL render visible `focus-visible` rings using the `--ring` token on every interactive control.

### Requirement 23: Mobile-First Responsive Layout

**User Story:** As a mobile user, I want pages to fit my screen without horizontal scrolling and with tappable controls, so that I can learn comfortably on a phone.

#### Acceptance Criteria

1. WHILE the viewport is at mobile width (down to ~360px), THE Platform SHALL produce no page-level horizontal overflow.
2. WHERE content is wider than the viewport (code blocks, system-design diagrams), THE Platform SHALL scroll that content within its own bounded container rather than the page.
3. THE Platform SHALL render interactive controls (nav and menu triggers, card actions, copy buttons, links) with a tap target of at least 44px.
4. WHERE the viewport is below the `lg` breakpoint, THE Platform SHALL render the TopicSidebar as a dismissible off-canvas drawer driven by `uiSlice`.
5. WHEN a user selects a topic in the mobile TopicSidebar drawer, THE Platform SHALL close the drawer so the content column is visible.
6. THE Platform SHALL export the App Router `viewport` object so the document uses `width=device-width, initial-scale=1`.

### Requirement 24: Topic Sidebar Navigation

**User Story:** As a learner, I want a collapsible topic tree for the active language, so that I can navigate its hierarchy.

#### Acceptance Criteria

1. THE Platform SHALL render the active language's topic hierarchy as a nested, expandable tree in the TopicSidebar.
2. THE Platform SHALL mark the current concept as active in the TopicSidebar.
3. THE UI_Store SHALL persist the sidebar expanded-node state in `uiSlice`.
