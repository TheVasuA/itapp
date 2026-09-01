'use client';

// MobileNav — full-height slide-over drawer for mobile (<md).
// Fixed header inside the drawer (no scroll). Content area scrolls independently.
// Accordion-style category groups with smooth expand/collapse.

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { X, ChevronRight, Layers } from 'lucide-react';

import {
  setNavDrawerOpen,
  toggleMobileCategory,
} from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

export default function MobileNav({ menuData = [] }) {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.navDrawerOpen);
  const expandedCategories = useSelector((state) => state.ui.mobileExpandedCategories);
  const pathname = usePathname();
  const closeButtonRef = useRef(null);

  const activeLanguage = pathname?.split('/')[1] || '';
  const close = () => dispatch(setNavDrawerOpen(false));

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Focus management
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel — fixed height, internal scroll */}
      <aside className="absolute inset-y-0 left-0 flex w-[300px] max-w-[85vw] flex-col bg-background shadow-2xl">
        {/* Fixed header — never scrolls */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            onClick={close}
            className="font-bold text-lg tracking-tight"
          >
            Dev<span className="text-primary">Learn</span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Close navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          {/* Projects link */}
          <Link
            href="/projects"
            onClick={close}
            aria-current={pathname?.startsWith('/projects') ? 'page' : undefined}
            className={cn(
              'mb-3 flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              pathname?.startsWith('/projects')
                ? 'bg-primary/10 text-primary'
                : 'text-foreground'
            )}
          >
            <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            Projects
          </Link>

          {/* Divider */}
          <div className="mb-3 border-t border-border" />

          {/* Category sections */}
          <div className="space-y-0.5">
            {menuData.map((cat) => {
              const isExpanded = !!expandedCategories[cat.key];
              const hasCategoryActive = cat.languages.some(
                (lang) => lang.key === activeLanguage
              );

              return (
                <div key={cat.key}>
                  {/* Category trigger */}
                  <button
                    type="button"
                    onClick={() => dispatch(toggleMobileCategory(cat.key))}
                    aria-expanded={isExpanded}
                    className={cn(
                      'flex w-full h-11 items-center justify-between rounded-lg px-3 text-sm font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      hasCategoryActive && !isExpanded && 'text-primary'
                    )}
                  >
                    <span>{cat.label}</span>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform duration-200',
                        isExpanded && 'rotate-90'
                      )}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Language links */}
                  {isExpanded && (
                    <ul className="ml-3 border-l border-border/60 py-1 pl-3">
                      {cat.languages.map((lang) => (
                        <li key={lang.key}>
                          <Link
                            href={`/${lang.key}`}
                            onClick={close}
                            aria-current={activeLanguage === lang.key ? 'page' : undefined}
                            className={cn(
                              'flex h-10 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              activeLanguage === lang.key
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-foreground/80'
                            )}
                          >
                            <span
                              className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                              style={{ backgroundColor: lang.color || 'hsl(var(--primary))' }}
                              aria-hidden="true"
                            />
                            {lang.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed footer — never scrolls */}
        <div className="shrink-0 border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground text-center">
            Learn. Build. Ship.
          </p>
        </div>
      </aside>
    </div>
  );
}
