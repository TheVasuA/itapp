// progressSlice — lightweight reading-progress state.
//
// Tracks which concept pages the learner has visited/completed, keyed by a
// stable "language/slug" route key. Kept intentionally small and serializable
// so it can be persisted to localStorage by a client effect if desired.

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  /**
   * Map of route key -> true for visited/completed concepts.
   * @type {Object.<string, boolean>}
   */
  visited: {},
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    markVisited(state, action) {
      state.visited[action.payload] = true;
    },
    clearVisited(state, action) {
      delete state.visited[action.payload];
    },
    resetProgress(state) {
      state.visited = {};
    },
    /** Hydrate from a persisted snapshot. */
    setProgress(state, action) {
      state.visited = action.payload || {};
    },
  },
});

export const { markVisited, clearVisited, resetProgress, setProgress } =
  progressSlice.actions;

export default progressSlice.reducer;
