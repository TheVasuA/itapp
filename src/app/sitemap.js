// Dynamic sitemap — enumerates the home page, every language landing, every
// routable concept page, the projects hub, and every project detail page.
// Routes that would 404 are never emitted (we only enumerate resolvable paths).

import { getLanguages, getAllConceptPaths } from '@/lib/content';
import { getAllProjectSlugs } from '@/lib/projects';
import { absoluteUrl } from '@/lib/seo';

export default function sitemap() {
  const now = new Date();
  const entries = [];

  // Home
  entries.push({
    url: absoluteUrl('/'),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1,
  });

  // Projects hub
  entries.push({
    url: absoluteUrl('/projects'),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // Language landings — high-priority hub pages (real 200 pages).
  for (const language of getLanguages()) {
    entries.push({
      url: absoluteUrl(`/${language}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Concept pages — shallower topics rank slightly higher than deep leaves.
  for (const { language, slug } of getAllConceptPaths()) {
    const depth = slug.length; // 1 = top-level section, 2 = subtopic, ...
    const priority = depth <= 1 ? 0.8 : depth === 2 ? 0.7 : 0.6;
    entries.push({
      url: absoluteUrl(`/${language}/${slug.join('/')}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority,
    });
  }

  // Project detail pages
  for (const slug of getAllProjectSlugs()) {
    entries.push({
      url: absoluteUrl(`/projects/${slug}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
