// LanguageDirectory — server component listing every language grouped by
// category, in the stable category order, each as a shadcn Card linking to
// its landing page. Purely presentational, no client JS.

import Link from 'next/link';

import { getCategories, getLanguagesByCategory } from '@/lib/content';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function LanguageDirectory() {
  const categories = getCategories();
  const grouped = getLanguagesByCategory();

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const langs = grouped[category.key];
        if (!langs || langs.length === 0) return null; // omit empty categories

        return (
          <section key={category.key} aria-labelledby={`cat-${category.key}`}>
            <h2
              id={`cat-${category.key}`}
              className="text-2xl font-bold tracking-tight"
            >
              {category.label}
            </h2>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {langs.map((lang) => (
                <Card key={lang.key} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-xl">{lang.label}</CardTitle>
                      <Badge variant="secondary">{category.label}</Badge>
                    </div>
                    <CardDescription>{lang.tagline}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <Button asChild className="w-full">
                      <Link href={`/${lang.key}`}>Learn {lang.label} →</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
