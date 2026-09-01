'use client';

// ConceptGate — client-side content gate for a single concept page. If the
// topic is beyond the free limit and the visitor is signed out, the concept
// body is replaced with a sign-in prompt. Signed-in users (or free topics)
// see the children normally.
//
// `locked` is computed on the server from the topic's position in the tree and
// passed in; this component only reacts to the current auth state.

import { useSelector, useDispatch } from 'react-redux';
import { Lock } from 'lucide-react';

import { openSignInModal } from '@/store/slices/authSlice';
import { FREE_TOPIC_LIMIT } from '@/lib/auth';

export default function ConceptGate({ locked, children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hydrated = useSelector((state) => state.auth.hydrated);

  // Not gated, or the user is signed in → show content.
  if (!locked || user) return children;

  // Render the real content on the server and before hydration so crawlers and
  // the initial paint always see it (preserves SEO). Only after hydration
  // confirms a signed-out visitor do we replace it with the sign-in prompt.
  if (!hydrated) return children;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-muted/30 p-8 text-center">
      <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Lock className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold tracking-tight">This topic is locked</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        The first {FREE_TOPIC_LIMIT} topics are free. Sign in with Google to
        unlock this topic and the full curriculum for every language.
      </p>
      <button
        type="button"
        onClick={() => dispatch(openSignInModal())}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Sign in with Google
      </button>
    </div>
  );
}
