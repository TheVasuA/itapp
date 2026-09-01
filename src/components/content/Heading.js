// Heading — renders a ConceptNode title at the correct semantic level (h2..h6).
//
// `level` maps to the heading tag; the page's single H1 is owned by the route.

import { cn } from '@/lib/utils';

const SIZES = {
  2: 'text-2xl font-bold',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold',
  6: 'text-sm font-semibold',
};

export default function Heading({ level = 2, id, children, className }) {
  const clamped = Math.min(6, Math.max(2, level));
  const Tag = `h${clamped}`;
  return (
    <Tag
      id={id}
      className={cn('mt-8 mb-2 scroll-mt-20', SIZES[clamped], className)}
    >
      {children}
    </Tag>
  );
}
