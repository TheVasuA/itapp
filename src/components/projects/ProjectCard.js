// ProjectCard — server component rendering a shadcn Card for the projects index
// grid. Shows icon, title, summary, difficulty badge, tags, and a link to
// /projects/{slug}. No client JS required.

import Link from 'next/link';
import * as Icons from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Resolve a lucide-react icon component by name string.
 * Falls back to a generic Layers icon when the name isn't found.
 */
function getIcon(name) {
  if (!name) return Icons.Layers;
  return Icons[name] || Icons.Layers;
}

export default function ProjectCard({ project }) {
  const Icon = getIcon(project.icon);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg leading-tight">
                {project.title}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0">
                {project.difficulty}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2">
          {project.summary}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-1.5">
          {(project.tags || []).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/projects/${project.slug}`}>View project →</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
