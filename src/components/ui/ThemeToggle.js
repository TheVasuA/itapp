'use client';

// ThemeToggle — cycles light → dark → system, keeping the DOM `dark` class,
// localStorage, and uiSlice.theme in sync. While in 'system' mode it subscribes
// to prefers-color-scheme changes and re-applies the class live.

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Monitor } from 'lucide-react';

import { setTheme } from '@/store/slices/uiSlice';

const ORDER = ['light', 'dark', 'system'];
const ICONS = { light: Sun, dark: Moon, system: Monitor };
const LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

function systemPrefersDark() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function applyTheme(mode) {
  if (typeof document === 'undefined') return;
  const isDark = mode === 'dark' || (mode === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', isDark);
}

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  // Hydrate the store from the persisted choice on mount (the inline head
  // script already applied the class; this aligns Redux with it).
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      // ignore
    }
    if (stored && ORDER.includes(stored) && stored !== theme) {
      dispatch(setTheme(stored));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live system-preference sync while in 'system' mode.
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [theme]);

  const cycle = () => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];
    dispatch(setTheme(next));
    try {
      localStorage.setItem('theme', next);
    } catch {
      // ignore
    }
    applyTheme(next);
  };

  const Icon = ICONS[theme] || Monitor;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${LABELS[theme] || 'System'} (click to change)`}
      title={`Theme: ${LABELS[theme] || 'System'}`}
      className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors motion-reduce:transition-none hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
