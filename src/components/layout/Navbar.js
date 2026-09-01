'use client';

// Navbar — polished top navigation bar with a single mega-menu trigger.
//
// Desktop (≥md): "Languages" button opens a full-width mega panel showing all
// categories in a multi-column grid. Clean, no overflow, no scrolling.
// Mobile (<md): hamburger opens a full-screen slide-over with accordions.

import { useCallback, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Menu, ChevronDown, Grid3X3 } from 'lucide-react';

import { toggleNavDrawer } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ui/ThemeToggle';
import SearchBox from './SearchBox';
import MobileNav from './MobileNav';

export default function Navbar({ menuData = [] }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimerRef = useRef(null);
  const headerRef = useRef(null);
  const megaPanelRef = useRef(null);

  const activeLanguage = pathname?.split('/')[1] || '';

  const openMega = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMegaOpen(true);
  }, []);

  const scheduleMegaClose = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 250);
  }, []);

  const closeMegaImmediate = useCallback(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setMegaOpen(false);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeMegaImmediate();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [megaOpen, closeMegaImmediate]);

  // Close on outside click
  useEffect(() => {
    if (!megaOpen) return;
    const onClick = (e) => {
      const inHeader = headerRef.current?.contains(e.target);
      const inPanel = megaPanelRef.current?.contains(e.target);
      if (!inHeader && !inPanel) {
        closeMegaImmediate();
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [megaOpen, closeMegaImmediate]);

  // Close on route change
  useEffect(() => {
    closeMegaImmediate();
  }, [pathname, closeMegaImmediate]);

  return (
    <>
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      onMouseLeave={scheduleMegaClose}
    >
      {/* Main bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 sm:h-16">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => dispatch(toggleNavDrawer())}
            aria-label="Open navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Brand */}
          <Link
            href="/"
            className="ml-2 flex items-center gap-0.5 font-bold tracking-tight text-lg md:ml-0"
            onClick={closeMegaImmediate}
          >
            Dev<span className="text-primary">Learn</span>
          </Link>

          {/* Desktop nav — hidden below md */}
          <nav
            aria-label="Primary"
            className="ml-8 hidden items-center gap-1 md:flex"
          >
            {/* Mega menu trigger */}
            <div
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
            >
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => (megaOpen ? closeMegaImmediate() : openMega())}
                className={cn(
                  'inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-sm transition-all hover:bg-muted hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  megaOpen && 'bg-muted shadow-inner border-primary/30'
                )}
              >
                <Grid3X3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Languages
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-muted-foreground transition-transform',
                    megaOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Projects link */}
            <Link
              href="/projects"
              onClick={closeMegaImmediate}
              onMouseEnter={closeMegaImmediate}
              aria-current={pathname?.startsWith('/projects') ? 'page' : undefined}
              className={cn(
                'inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                pathname?.startsWith('/projects') && 'bg-muted text-foreground'
              )}
            >
              Projects
            </Link>
          </nav>

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-1.5">
            <SearchBox />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mega menu panel — full-width, 75vh height, two-column categories */}
      {megaOpen && (
        <div
          ref={megaPanelRef}
          className="hidden md:block fixed inset-x-0 top-[57px] sm:top-[65px] z-50 border-b border-border bg-background shadow-2xl"
          onMouseEnter={openMega}
          onMouseLeave={scheduleMegaClose}
          role="menu"
          aria-label="Languages navigation"
        >
          <div className="mx-auto h-[75vh] max-h-[700px] w-full max-w-7xl overflow-y-auto px-8 py-8">
            <div className="space-y-8">
              {menuData.map((cat) => (
                <div key={cat.key} className="mb-6 last:mb-0">
                  {/* Category heading */}
                  <h3 className="mb-3 rounded-md bg-muted/60 px-3 py-2 text-sm font-bold tracking-wide text-foreground">
                    {cat.label}
                  </h3>
                  {/* Language links — 4-column grid within each category */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 lg:grid-cols-4">
                    {cat.languages.map((lang) => (
                      <Link
                        key={lang.key}
                        href={`/${lang.key}`}
                        onClick={closeMegaImmediate}
                        role="menuitem"
                        className={cn(
                          'group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          activeLanguage === lang.key && 'bg-primary/10'
                        )}
                      >
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                          style={{ backgroundColor: lang.color || 'hsl(var(--primary))' }}
                          aria-hidden="true"
                        />
                        <span className={cn(
                          'truncate transition-colors group-hover:text-foreground',
                          activeLanguage === lang.key
                            ? 'text-primary font-semibold'
                            : 'text-foreground/80'
                        )}>
                          {lang.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile navigation — rendered outside header to avoid stacking context issues */}
    </header>
    <MobileNav menuData={menuData} />
    </>
  );
}
