'use client';

// SignInModal — a centered dialog offering Google Sign-In. Opened from the
// sidebar's locked topics / sign-in button. Renders the official Google button
// via GIS when configured; otherwise shows a short configuration hint.

import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Lock } from 'lucide-react';

import { closeSignInModal } from '@/store/slices/authSlice';
import { isGoogleConfigured, FREE_TOPIC_LIMIT } from '@/lib/auth';

export default function SignInModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.auth.signInModalOpen);
  const user = useSelector((state) => state.auth.user);
  const btnRef = useRef(null);
  const [gisReady, setGisReady] = useState(
    typeof window !== 'undefined' && !!window.__gisReady
  );

  const close = () => dispatch(closeSignInModal());

  // Close the modal automatically once the user is signed in.
  useEffect(() => {
    if (user && open) dispatch(closeSignInModal());
  }, [user, open, dispatch]);

  // Track GIS readiness so we can render the Google button.
  useEffect(() => {
    if (gisReady) return;
    const onReady = () => setGisReady(true);
    window.addEventListener('gis-ready', onReady);
    return () => window.removeEventListener('gis-ready', onReady);
  }, [gisReady]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Render the official Google button into the modal when open + ready.
  useEffect(() => {
    if (!open || !gisReady || !btnRef.current) return;
    if (!window.google?.accounts?.id) return;
    btnRef.current.innerHTML = '';
    try {
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 260,
      });
      // Also surface the One Tap prompt as a convenience.
      window.google.accounts.id.prompt();
    } catch {
      /* ignore render failures */
    }
  }, [open, gisReady]);

  if (!open) return null;

  const configured = isGoogleConfigured();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signin-title"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close sign-in"
        onClick={close}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="mb-4 flex flex-col items-center text-center">
          <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 id="signin-title" className="text-xl font-bold tracking-tight">
            Unlock all topics
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The first {FREE_TOPIC_LIMIT} topics are free. Sign in with Google to
            unlock the full curriculum for every language.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {configured ? (
            <>
              {/* Google renders its official button here */}
              <div ref={btnRef} className="min-h-[44px]" />
              {!gisReady && (
                <p className="text-xs text-muted-foreground">
                  Loading Google Sign-In…
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
              Google Sign-In is not configured yet. Set{' '}
              <code className="rounded bg-muted px-1 py-0.5 font-mono">
                NEXT_PUBLIC_GOOGLE_CLIENT_ID
              </code>{' '}
              in your environment to enable it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
