// Notes — the explanatory prose that follows a concept's code block.

import { cn } from '@/lib/utils';

export default function Notes({ children, className }) {
  return (
    <p className={cn('my-3 leading-relaxed text-foreground', className)}>
      {children}
    </p>
  );
}
