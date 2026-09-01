// Language landing route — topic index for a single language. Statically
// generated for every registered language; unknown languages 404.

import { notFound } from 'next/navigation';
import Link from 'next/link';

import {
  getLanguages,
  getLanguageMeta,
  getLanguageTree,
  getNavTree,
} from '@/lib/content';
import {
  buildLanguageMetadata,
  buildArticleJsonLd,
  buildCourseJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Sidebar from '@/components/layout/Sidebar';
import SidebarTrigger from '@/components/layout/SidebarTrigger';
import { FREE_TOPIC_LIMIT } from '@/lib/auth';

export function generateStaticParams() {
  return getLanguages().map((language) => ({ language }));
}

/** Top-level topic titles for a language, used for keywords and Course.teaches. */
function topLevelTopicTitles(language) {
  const root = getLanguageTree(language);
  return (root?.children || []).map((n) => n.title).filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { language } = await params;
  const meta = getLanguageMeta(language);
  if (!meta) return {};
  return buildLanguageMetadata({
    language: meta.label,
    description: meta.description,
    path: `/${meta.key}`,
    topics: topLevelTopicTitles(language),
  });
}

/** Render a nested list of routable topics with links and short descriptions. */
function TopicTree({ language, nodes, prefix = [] }) {
  return (
    <ul className="space-y-4">
      {nodes.map((node) => {
        const slugChain = node.slug ? [...prefix, node.slug] : prefix;
        const href = node.slug ? `/${language}/${slugChain.join('/')}` : null;
        // Extract a short description from the first concept's note
        const description = node.concepts?.[0]?.note
          || (node.children?.[0]?.concepts?.[0]?.note)
          || null;
        return (
          <li key={node.id} className="rounded-md border border-border p-3 transition-colors hover:border-primary/50">
            {href ? (
              <Link
                href={href}
                className="block"
              >
                <span className="font-semibold text-primary">{node.title}</span>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </Link>
            ) : (
              <div>
                <span className="font-semibold">{node.title}</span>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}
            {node.children && node.children.length > 0 && (
              <div className="ml-4 mt-3 border-l border-border pl-4">
                <TopicTree
                  language={language}
                  nodes={node.children}
                  prefix={slugChain}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default async function LanguagePage({ params }) {
  const { language } = await params;
  const meta = getLanguageMeta(language);
  const root = getLanguageTree(language);
  if (!meta || !root) notFound();

  const navTree = getNavTree(language);
  const topics = topLevelTopicTitles(language);
  const path = `/${meta.key}`;

  // Content-derived FAQ improves long-tail coverage and can earn FAQ rich results.
  const faqs = [
    {
      question: `What is ${meta.label}?`,
      answer: meta.description,
    },
    {
      question: `Is this ${meta.label} tutorial free?`,
      answer: `Yes. The entire ${meta.label} tutorial on ${'Dev Learning Platform'} is free, with copy-first code examples you can run immediately.`,
    },
    topics.length
      ? {
          question: `What topics does the ${meta.label} tutorial cover?`,
          answer: `It covers ${topics.slice(0, 8).join(', ')}${
            topics.length > 8 ? ', and more' : ''
          }.`,
        }
      : null,
  ].filter(Boolean);

  const jsonLd = [
    buildBreadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: meta.label, path },
    ]),
    buildArticleJsonLd({
      headline: `Learn ${meta.label}`,
      description: meta.description,
      path,
      programmingLanguage: meta.label,
      keywords: topics,
    }),
    ...buildCourseJsonLd({
      language: meta.label,
      description: meta.description,
      path,
      topics,
    }),
    buildFaqJsonLd(faqs),
  ].filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-10">
      <Sidebar
        language={language}
        tree={navTree}
        activeSlug={[]}
        freeLimit={FREE_TOPIC_LIMIT}
      />

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <JsonLd data={jsonLd} />
        <SidebarTrigger />
        <h1 className="text-4xl font-extrabold tracking-tight">{meta.label}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{meta.description}</p>
        <h2 className="mb-4 mt-10 text-2xl font-bold">Topics</h2>
        <TopicTree language={language} nodes={root.children} />
      </main>
    </div>
  );
}
