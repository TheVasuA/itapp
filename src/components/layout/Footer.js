// Footer — simple site footer (server component).
// Provides copyright, basic site navigation links, and attribution.
// Requirement 23.1 — no page-level horizontal overflow.

import Link from 'next/link';

import { SITE_NAME } from '@/lib/seo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {year} {SITE_NAME}. All rights reserved.
        </p>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="transition-colors hover:text-foreground"
          >
            Projects
          </Link>
        </nav>
      </div>
    </footer>
  );
}
