'use client';

// AuthProvider — loads Google Identity Services once, hydrates the persisted
// session from localStorage into Redux, and initializes GIS with the credential
// callback. Renders nothing visible; mount it high in the tree (root layout).

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setUser, setHydrated } from '@/store/slices/authSlice';
import {
  GOOGLE_CLIENT_ID,
  GIS_SRC,
  decodeGoogleCredential,
  readStoredUser,
  writeStoredUser,
  isGoogleConfigured,
} from '@/lib/auth';

/** Load the GIS script once; resolves when window.google.accounts.id exists. */
function loadGis() {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Hydrate from localStorage immediately so the UI reflects prior sign-in.
    const stored = readStoredUser();
    if (stored) dispatch(setUser(stored));
    dispatch(setHydrated(true));

    if (!isGoogleConfigured()) return;

    let cancelled = false;

    // 2. Load GIS and initialize with our credential callback.
    loadGis()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            const user = decodeGoogleCredential(response?.credential || '');
            if (user) {
              writeStoredUser(user);
              dispatch(setUser(user));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        // Expose a flag so the modal knows GIS is ready to render buttons.
        window.__gisReady = true;
        window.dispatchEvent(new Event('gis-ready'));
      })
      .catch(() => {
        /* network/script failure — sign-in simply stays unavailable */
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return children;
}
