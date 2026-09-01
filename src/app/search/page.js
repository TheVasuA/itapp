'use client';

// Search results page — client-side filtering of the build-time search index,
// driven by searchSlice. Reads the initial query from the ?q= param.

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import { setQuery, setResults } from '@/store/slices/searchSlice';
import { searchConcepts } from '@/lib/search-index';

function SearchResults() {
  const dispatch = useDispatch();
  const params = useSearchParams();
  const query = useSelector((state) => state.search.query);
  const results = useSelector((state) => state.search.results);

  // Seed from the URL on first render.
  useEffect(() => {
    const q = params.get('q') || '';
    dispatch(setQuery(q));
    dispatch(setResults(searchConcepts(q)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const q = e.target.value;
    dispatch(setQuery(q));
    dispatch(setResults(searchConcepts(q)));
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Search</h1>
      <input
        type="search"
        value={query}
        onChange={onChange}
        placeholder="Search concepts…"
        aria-label="Search concepts"
        className="mt-4 min-h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <div className="mt-6">
        {query && results.length === 0 && (
          <p className="text-muted-foreground">No results for “{query}”.</p>
        )}
        <ul className="space-y-3">
          {results.map((r) => (
            <li key={r.path}>
              <Link href={r.path} className="block rounded-md border border-border p-3 hover:border-primary">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {r.languageLabel}
                </div>
                <div className="font-semibold text-primary">{r.title}</div>
                {r.snippet && (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {r.snippet}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10">Loading…</div>}>
      <SearchResults />
    </Suspense>
  );
}
