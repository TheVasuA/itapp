// Concept route — a deep topic/concept page. Statically generated for every
// routable node via getAllConceptPaths(); unresolvable paths 404.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import {
  getConcept,
  getAncestors,
  getAllConceptPaths,
  getLanguageMeta,
  getNavTree,
  getTopicOrdinal,
  getAdjacentTopics,
  isContentNode,
  ensureValidContent,
} from '@/lib/content';
import {
  buildConceptMetadata,
  buildJsonLd,
} from '@/lib/seo';
import { getVideosForTopic } from '@/lib/videos';
import { FREE_TOPIC_LIMIT } from '@/lib/auth';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ConceptBlock from '@/components/content/ConceptBlock';
import VideoEmbeds from '@/components/content/VideoEmbeds';
import ConceptGate from '@/components/auth/ConceptGate';
import Sidebar from '@/components/layout/Sidebar';
import SidebarTrigger from '@/components/layout/SidebarTrigger';

export function generateStaticParams() {
  ensureValidContent();
  return getAllConceptPaths().map(({ language, slug }) => ({
    language,
    slug,
  }));
}

/** A section-index card listing the subtopics of a section node. */
function SectionIndex({ language, node, currentSlug }) {
  const children = (node.children || []).filter((c) => c.slug);
  return (
    <ul className="mt-6 space-y-3">
      {children.map((child) => {
        const href = `/${language}/${[...currentSlug, child.slug].join('/')}`;
        const desc =
          child.concepts?.[0]?.note ||
          child.children?.[0]?.concepts?.[0]?.note ||
          null;
        return (
          <li
            key={child.id}
            className="rounded-lg border border-border p-4 transition-colors hover:border-primary/50"
          >
            <Link href={href} className="block">
              <span className="font-semibold text-primary">{child.title}</span>
              {desc && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {desc}
                </p>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Build breadcrumb crumbs ({ name, path }) from the ancestor chain. */
function buildCrumbs(language, slug) {
  const ancestors = getAncestors(language, slug);
  const crumbs = [];
  let acc = [];
  for (const node of ancestors) {
    if (node.level === 0) {
      crumbs.push({ name: node.title, path: `/${language}` });
    } else if (node.slug) {
      acc = [...acc, node.slug];
      crumbs.push({ name: node.title, path: `/${language}/${acc.join('/')}` });
    }
  }
  return crumbs;
}

export async function generateMetadata({ params }) {
  const { language, slug } = await params;
  const concept = getConcept(language, slug);
  const meta = getLanguageMeta(language);
  if (!concept || !meta) return {};

  const description =
    concept.concepts?.[0]?.note ||
    `Learn ${concept.title} in ${meta.label} with copy-first code examples.`;

  // Derive extra keyword phrases from this topic's child titles for long-tail reach.
  const childTitles = (concept.children || [])
    .map((c) => c.title)
    .filter(Boolean)
    .slice(0, 6);

  return buildConceptMetadata({
    concept: concept.title,
    language: meta.label,
    description,
    path: `/${language}/${slug.join('/')}`,
    keywords: childTitles,
  });
}

export default async function ConceptPage({ params }) {
  const { language, slug } = await params;
  const node = getConcept(language, slug);
  const meta = getLanguageMeta(language);
  if (!node || !meta) notFound();

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  // A node is a real page if it has concepts OR children (a section index).
  // Truly empty slugged nodes 404 rather than showing a blank page.
  if (!isContentNode(node) && !hasChildren) notFound();

  // Section node (no concepts, but has children): render a section-index page.
  const isSection = !isContentNode(node) && hasChildren;

  const crumbs = buildCrumbs(language, slug);
  const path = `/${language}/${slug.join('/')}`;
  const description =
    node.concepts?.[0]?.note ||
    node.children?.[0]?.concepts?.[0]?.note ||
    `Learn ${node.title} in ${meta.label}.`;

  // Hand-authored videos take precedence over the build-time fetched cache.
  const videos =
    Array.isArray(node.videos) && node.videos.length
      ? node.videos
      : getVideosForTopic(node.id);

  const navTree = getNavTree(language);

  // Content gating: content topics beyond the free limit are locked for
  // signed-out visitors. Section-index pages are never gated (free navigation).
  const ordinal = getTopicOrdinal(language, slug);
  const locked = !isSection && ordinal >= 0 && ordinal >= FREE_TOPIC_LIMIT;

  // Previous / next topic in sidebar order for bottom navigation.
  const { prev, next } = getAdjacentTopics(language, slug);
  const prevHref = prev ? `/${language}/${prev.slug.join('/')}` : null;
  const nextHref = next ? `/${language}/${next.slug.join('/')}` : null;

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8">
      <Sidebar
        language={language}
        tree={navTree}
        activeSlug={slug}
        freeLimit={FREE_TOPIC_LIMIT}
      />

      <article className="min-w-0 flex-1 overflow-x-hidden">
        <JsonLd
          data={buildJsonLd(
            { ...node, slug },
            crumbs.map((c) => ({ name: c.name, path: c.path })),
            language,
            videos,
            { languageLabel: meta.label }
          )}
        />
        <SidebarTrigger />
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-3xl font-extrabold tracking-tight">{node.title}</h1>

        {isSection && (
          <p className="mt-3 text-muted-foreground">
            {node.title} topics in {meta.label}. Choose a topic below to begin.
          </p>
        )}

        <ConceptGate locked={locked}>
          {isSection ? (
            <SectionIndex language={language} node={node} currentSlug={slug} />
          ) : node.concepts && node.concepts.length > 0 ? (
            node.concepts.map((concept, i) => (
              <ConceptBlock key={concept.id || i} concept={concept} />
            ))
          ) : null}

          {/* Mobile: videos inline below content */}
          <div className="xl:hidden">
            <VideoEmbeds videos={videos} />
          </div>
        </ConceptGate>

        {/* Previous / Next topic navigation */}
        <nav
          aria-label="Topic navigation"
          className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-stretch sm:justify-between"
        >
          {prevHref ? (
            <Link
              href={prevHref}
              rel="prev"
              className="group flex min-h-11 flex-1 items-center gap-3 rounded-md border border-border px-4 py-3 text-left transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">Previous</span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" aria-hidden="true" />
          )}

          {nextHref ? (
            <Link
              href={nextHref}
              rel="next"
              className="group flex min-h-11 flex-1 items-center justify-end gap-3 rounded-md border border-border px-4 py-3 text-right transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">Next topic</span>
                <span className="block truncate text-sm font-medium text-foreground">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            </Link>
          ) : (
            <span className="hidden flex-1 sm:block" aria-hidden="true" />
          )}
        </nav>
      </article>

      {/* Right column: Suggested Videos (replaces Points to Remember) */}
      <aside className="hidden w-72 shrink-0 xl:block" aria-label="Suggested videos">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <VideoEmbeds videos={videos} />
        </div>
      </aside>
    </div>
  );
}
