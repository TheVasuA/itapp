// Home page — server component. Single H1 + intro paragraph + LanguageDirectory
// listing every registered language by category. No client JS needed (Req 3.6).
// Metadata generated via buildHomeMetadata; JSON-LD uses WebSite/Organization.

import LanguageDirectory from '@/components/layout/LanguageDirectory';
import JsonLd from '@/components/seo/JsonLd';
import { buildHomeMetadata, buildSiteJsonLd, buildCollectionJsonLd } from '@/lib/seo';
import { getLanguages, getLanguageMeta } from '@/lib/content';

export const metadata = buildHomeMetadata();

export default function HomePage() {
  const languageItems = getLanguages()
    .map((key) => {
      const meta = getLanguageMeta(key);
      return meta ? { name: `${meta.label} Tutorial`, path: `/${key}` } : null;
    })
    .filter(Boolean);

  const jsonLd = [
    ...buildSiteJsonLd(),
    buildCollectionJsonLd({
      name: 'Programming & Database Language Tutorials',
      description:
        'Browse free tutorials for programming languages and database/query languages.',
      path: '/',
      items: languageItems,
    }),
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <JsonLd data={jsonLd} />
      <h1 className="text-4xl font-extrabold tracking-tight">
        Dev Learning Platform
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
        Learn programming and database/query languages with copy-first code
        blocks, real-world projects, and server-rendered system-design diagrams.
      </p>
      <div className="mt-10">
        <LanguageDirectory />
      </div>
    </main>
  );
}
