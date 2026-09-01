// Projects index — responsive grid of ProjectCards plus WebSite/ItemList JSON-LD.

import { getProjects } from '@/lib/projects';
import { buildMetadata, buildCollectionJsonLd } from '@/lib/seo';
import ProjectCard from '@/components/projects/ProjectCard';
import JsonLd from '@/components/seo/JsonLd';

export const metadata = buildMetadata({
  title: 'Real-World Software Projects',
  description:
    'Real-world software projects with recommended tech stacks and system-design diagrams — learn how production systems are architected.',
  path: '/projects',
  ogType: 'website',
  keywords: [
    'software projects',
    'system design examples',
    'tech stack',
    'architecture diagrams',
    'project ideas',
    'full-stack projects',
  ],
});

export default function ProjectsPage() {
  const projects = getProjects();

  const jsonLd = buildCollectionJsonLd({
    name: 'Real-World Software Projects',
    description:
      'Real-world software projects with recommended tech stacks and system-design diagrams.',
    path: '/projects',
    items: projects.map((p) => ({
      name: p.title,
      path: `/projects/${p.slug}`,
    })),
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <h1 className="text-4xl font-extrabold tracking-tight">Projects</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Study real-world systems: each project pairs a recommended tech stack
        with a server-rendered system-design diagram.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </main>
  );
}
