'use client';

// SearchBox — navbar search input that dispatches setQuery/setResults to
// searchSlice and navigates to /search?q={query}.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Search } from 'lucide-react';

import { setQuery, setResults } from '@/store/slices/searchSlice';
import { searchConcepts } from '@/lib/search-index';

export default function SearchBox() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const submit = (e) => {
    e.preventDefault();
    const q = value.trim();
    // Dispatch query and results into searchSlice so the search page has them
    dispatch(setQuery(q));
    dispatch(setResults(searchConcepts(q)));
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <form onSubmit={submit} role="search" className="relative hidden sm:block">
      <Search
        className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search…"
        aria-label="Search concepts"
        className="min-h-11 w-40 rounded-md border border-input bg-background pl-8 pr-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:w-56"
      />
    </form>
  );
}
