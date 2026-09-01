'use client';

// CodeBlock — renders source code on a near-black surface with a copy button.
//
// The near-black code surface is the one documented exception to the
// CSS-variable token rule (it must stay dark in both themes for readability).
// On copy success it writes the EXACT `code` string to the clipboard and drives
// the single-active-copy feedback through uiSlice. On failure (rejection or no
// Clipboard API) it selects the text and shows a manual-copy hint WITHOUT
// touching the store.

import { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Copy } from 'lucide-react';

import { setCopied, clearCopied } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

const COPY_FEEDBACK_MS = 2000;

let counter = 0;
function nextId() {
  counter += 1;
  return `codeblock-${counter}`;
}

export default function CodeBlock({ code, lang, blockId, className }) {
  const idRef = useRef(blockId || null);
  if (!idRef.current) idRef.current = nextId();
  const id = idRef.current;

  const dispatch = useDispatch();
  const copiedBlockId = useSelector((state) => state.ui.copiedBlockId);
  const isCopied = copiedBlockId === id;

  const preRef = useRef(null);
  const timerRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const selectText = useCallback(() => {
    const node = preRef.current;
    if (!node || typeof window === 'undefined') return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }, []);

  const handleCopy = async () => {
    const clipboard =
      typeof navigator !== 'undefined' ? navigator.clipboard : null;

    if (!clipboard || typeof clipboard.writeText !== 'function') {
      // Clipboard API unavailable — fallback, leave store unchanged.
      selectText();
      setShowHint(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowHint(false), COPY_FEEDBACK_MS);
      return;
    }

    try {
      await clipboard.writeText(code);
      // Success: dispatch store actions for single-active-copy feedback
      dispatch(setCopied(id));
      setShowHint(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(clearCopied());
      }, COPY_FEEDBACK_MS);
    } catch {
      // Write rejected — fallback, leave store unchanged.
      selectText();
      setShowHint(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowHint(false), COPY_FEEDBACK_MS);
    }
  };

  return (
    <div
      className={cn(
        'relative my-4 overflow-hidden rounded-md border border-border',
        className
      )}
    >
      {/* Copy button — ≥44px tap target (h-11 w-11 = 44px × 44px) */}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={isCopied ? 'Copied' : 'Copy code'}
        className="absolute right-2 top-2 z-10 inline-flex h-11 w-11 items-center justify-center rounded-md bg-zinc-800/80 text-zinc-100 ring-offset-zinc-900 transition-colors motion-reduce:transition-none hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {isCopied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {/* "Copied!" success feedback */}
      {isCopied && (
        <span
          role="status"
          className="absolute right-14 top-4 z-10 text-xs font-medium text-zinc-100"
        >
          Copied!
        </span>
      )}

      {/* Manual-copy hint on clipboard failure — store unchanged */}
      {showHint && !isCopied && (
        <span
          role="status"
          className="absolute right-14 top-4 z-10 text-xs font-medium text-yellow-300"
        >
          Press Ctrl+C to copy
        </span>
      )}

      {/* Code surface: near-black bg, monospaced font, horizontal scroll */}
      <pre
        ref={preRef}
        className="overflow-x-auto bg-zinc-950 p-4 pr-16 text-sm leading-relaxed text-zinc-100"
      >
        <code className="font-mono" data-lang={lang}>
          {code}
        </code>
      </pre>
    </div>
  );
}
