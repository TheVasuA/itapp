// Breadcrumbs — renders the ancestor chain as an accessible nav trail.
//
// Expects pre-built crumbs ({ name, path }) derived from getAncestors so the
// visual trail and the BreadcrumbList JSON-LD stay in lockstep.

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ crumbs = [] }) {
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="hover:text-foreground hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
