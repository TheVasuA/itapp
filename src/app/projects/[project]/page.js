// Project detail route — stack flow + system-design diagram + JSON-LD.
// Statically generated for every project slug; unknown slugs 404.

import { notFound } from 'next/navigation';

import { getProject, getAllProjectSlugs, ensureValidProjects } from '@/lib/projects';
import {
  buildProjectMetadata,
  buildBreadcrumbJsonLd,
  buildArticleJsonLd,
} from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import StackFlow from '@/components/projects/StackFlow';
import SystemDesignDiagram from '@/components/projects/SystemDesignDiagram';

/**
 * Generate static params from getAllProjectSlugs() so every project page is
 * pre-rendered at build time (SSG). Also triggers project validation once.
 */
export function generateStaticParams() {
  ensureValidProjects();
  return getAllProjectSlugs().map((slug) => ({ project: slug }));
}

/**
 * Generate per-page metadata using buildProjectMetadata from the SEO module.
 * Returns empty metadata for unknown slugs (the page will 404 at render).
 */
export async function generateMetadata({ params }) {
  const { project } = await params;
  const proj = getProject(project);
  if (!proj) return {};
  return buildProjectMetadata({
    title: proj.title,
    description: proj.summary,
    path: `/projects/${proj.slug}`,
    tags: proj.tags,
  });
}

export default async function ProjectPage({ params }) {
  const { project } = await params;
  const proj = getProject(project);
  if (!proj) notFound();

  const path = `/projects/${proj.slug}`;
  const crumbs = [
    { name: 'Projects', path: '/projects' },
    { name: proj.title, path },
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([{ name: 'Home', path: '/' }, ...crumbs]),
          buildArticleJsonLd({
            headline: proj.title,
            description: proj.summary,
            path,
            about: [proj.title, 'system design', 'software architecture'],
            keywords: Array.isArray(proj.tags) ? proj.tags : undefined,
          }),
        ]}
      />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="text-3xl font-extrabold tracking-tight">{proj.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{proj.summary}</p>

      <section className="mt-10">
        <h2 className="mb-2 text-2xl font-bold">Recommended Stack</h2>
        <StackFlow stack={proj.stack} />
      </section>

      <section className="mt-10">
        <h2 className="mb-2 text-2xl font-bold">System Design</h2>
        <SystemDesignDiagram
          design={proj.design}
          title={`${proj.title} architecture`}
          description={`High-level architecture for ${proj.title}.`}
        />
      </section>
    </main>
  );
}
