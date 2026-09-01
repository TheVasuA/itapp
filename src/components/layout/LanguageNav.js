'use client';

// LanguageNav — the off-canvas navigation drawer used below the `md` breakpoint.
// Lists one link per language (from getLanguages()) plus the top-level Projects
// link, driven by uiSlice.navDrawerOpen. Closes via the dismiss button (X),
// overlay tap, or Escape key. All interactive targets are ≥44px.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';

import { setNavDrawerOpen } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

export default function LanguageNav({ languages = [] }) {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.navDrawerOpen);
  const pathname = usePathname();
  const closeButtonRef = useRef(null);

  const close = () => dispatch(setNavDrawerOpen(false));

  // Determine active language from the current path
  const activeLanguage = pathname?.split('/')[1] || '';

  // Close on Escape key while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus the close button when drawer opens for accessibility
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Overlay — closes on tap */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={close}
        className="absolute inset-0 bg-black/50"
        tabIndex={-1}
      />

      {/* Panel */}
      <nav
        aria-label="Languages"
        className="absolute left-0 top-0 h-full w-72 max-w-[80vw] overflow-y-auto bg-background p-4 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Browse</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <ul className="space-y-1">
          {/* Projects link */}
          <li>
            <Link
              href="/projects"
              onClick={close}
              aria-current={pathname?.startsWith('/projects') ? 'page' : undefined}
              className={cn(
                'flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                pathname?.startsWith('/projects') && 'bg-accent text-accent-foreground'
              )}
            >
              Projects
            </Link>
          </li>

          {/* One link per language */}
          {languages.map((lang) => (
            <li key={lang.key}>
              <Link
                href={`/${lang.key}`}
                onClick={close}
                aria-current={activeLanguage === lang.key ? 'page' : undefined}
                className={cn(
                  'flex min-h-[44px] items-center rounded-md px-3 text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  activeLanguage === lang.key && 'bg-accent text-accent-foreground font-medium'
                )}
              >
                {lang.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
