// StackFlow — server component rendering a project's recommended tech stack as
// layered groups. Each TechRef shows its icon, name, and reason. Techs with a
// non-null languageKey link to /{languageKey} as real anchors (no client JS).

import Link from 'next/link';
import { icons } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

/**
 * Resolve a Lucide icon component by name string.
 * Returns null if the name is not found in the icon set.
 */
function getIcon(name) {
  if (!name) return null;
  return icons[name] || null;
}

export default function StackFlow({ stack = [] }) {
  if (!stack.length) return null;

  return (
    <section className="my-6 space-y-4" aria-label="Tech Stack">
      {stack.map((layer, i) => (
        <div key={layer.label}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {layer.label}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {layer.techs.map((tech) => {
              const IconComponent = getIcon(tech.icon);

              const body = (
                <Card className="h-full transition-colors motion-reduce:transition-none hover:border-primary">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {IconComponent && (
                        <IconComponent
                          className="h-5 w-5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-semibold">{tech.name}</span>
                    </div>
                    {tech.reason && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tech.reason}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );

              return tech.languageKey ? (
                <Link
                  key={tech.name}
                  href={`/${tech.languageKey}`}
                  className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {body}
                </Link>
              ) : (
                <div key={tech.name}>{body}</div>
              );
            })}
          </div>
          {i < stack.length - 1 && (
            <div
              className="mt-4 flex justify-center text-muted-foreground"
              aria-hidden="true"
            >
              ↓
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
