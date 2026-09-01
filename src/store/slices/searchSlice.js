// searchSlice — client-side search state.
//
// Holds the current query string and the list of matching results produced by
// the flat search index (see lib/search-index.js). The search page subscribes
// to this slice to render results without any server round-trip.

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  /** @type {string} current query text */
  query: '',
  /** @type {Array<{language:string, slug:string[], title:string, snippet?:string}>} */
  results: [],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload ?? '';
    },
    setResults(state, action) {
      state.results = Array.isArray(action.payload) ? action.payload : [];
    },
    clearSearch(state) {
      state.query = '';
      state.results = [];
    },
  },
});

export const { setQuery, setResults, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
