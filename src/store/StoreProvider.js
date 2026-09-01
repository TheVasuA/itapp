'use client';

// Client boundary that provides the Redux store to the React tree.
//
// The store instance is created once per client (held in a ref) so it survives
// re-renders without being recreated, while still being safe to import from a
// server component layout (this file is a client component).

import { useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore } from './index';

export default function StoreProvider({ children, preloadedState }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
