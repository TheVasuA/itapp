// Redux Toolkit store — combines the three client-side UI slices.
//
// A factory (`makeStore`) is exported so tests (and the per-request server
// boundary, if ever needed) can create isolated store instances. A default
// singleton is created for the client provider.

import { configureStore } from '@reduxjs/toolkit';

import uiReducer from './slices/uiSlice';
import searchReducer from './slices/searchSlice';
import progressReducer from './slices/progressSlice';
import authReducer from './slices/authSlice';

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      ui: uiReducer,
      search: searchReducer,
      progress: progressReducer,
      auth: authReducer,
    },
    preloadedState,
  });
}

const store = makeStore();

export default store;
