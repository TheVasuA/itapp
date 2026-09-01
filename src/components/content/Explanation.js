// Explanation — a rich, structured explanation block for a concept.
//
// Renders (all parts optional):
//   - an optional sub-heading
//   - intro prose
//   - a list of highlighted key points (bold term + detail)
//
// Designed to make each topic read like a proper tutorial section rather than a
// single terse sentence. Backward compatible: concepts without `explanation`
// simply don't render this.

import { cn } from '@/lib/utils';

export default function Explanation({ explanation, className }) {
  if (!explanation) return null;
  const { heading, intro, points } = explanation;
  const hasPoints = Array.isArray(points) && points.length > 0;
  if (!heading && !intro && !hasPoints) return null;

  return (
    <div className={cn('my-4', className)}>
      {heading ? (
        <h3 className="mb-2 mt-6 text-lg font-semibold tracking-tight text-foreground">
          {heading}
        </h3>
      ) : null}

      {intro ? (
        <p className="my-2 leading-relaxed text-foreground">{intro}</p>
      ) : null}

      {hasPoints ? (
        <ul className="my-3 space-y-2">
          {points.map((pt, i) => (
            <li
              key={i}
              className="flex gap-2 leading-relaxed text-foreground"
            >
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              <span>
                {pt.term ? (
                  <strong className="font-semibold text-foreground">
                    {pt.term}
                    {pt.detail ? ' — ' : ''}
                  </strong>
                ) : null}
                {pt.detail ? (
                  <span className="text-muted-foreground">{pt.detail}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
