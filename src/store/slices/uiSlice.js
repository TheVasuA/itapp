// uiSlice — client-side UI state for the Dev Learning Platform.
//
// Holds: the appearance theme (constrained to 'light' | 'dark' | 'system'),
// the id of the code block currently showing "Copied!" feedback (at most one),
// the open/closed state of the navigation drawer and the topic sidebar drawer,
// and the set of expanded topic-tree node ids in the sidebar.

import { createSlice } from '@reduxjs/toolkit';

/** Allowed theme modes. `setTheme` rejects anything outside this set. */
export const THEMES = Object.freeze(['light', 'dark', 'system']);

const initialState = {
  /** @type {'light'|'dark'|'system'} */
  theme: 'system',
  /** @type {string|null} id of the block currently showing copy feedback */
  copiedBlockId: null,
  /** desktop topic sidebar collapsed/expanded */
  sidebarOpen: true,
  /** mobile off-canvas navigation drawer */
  navDrawerOpen: false,
  /** mobile off-canvas topic-sidebar drawer */
  sidebarDrawerOpen: false,
  /** desktop mega menu: which category key is hovered/active (null = closed) */
  megaMenuOpen: null,
  /** mobile nav: set of expanded category accordion keys */
  mobileExpandedCategories: {},
  /**
   * Expanded topic-tree node ids, keyed by id -> true. A map keeps the reducer
   * O(1) and serializable.
   * @type {Object.<string, boolean>}
   */
  expandedNodes: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Mark a single code block as copied. Enforces the "single active copy"
     * invariant — setting a new id replaces any previous one.
     */
    setCopied(state, action) {
      state.copiedBlockId = action.payload;
    },
    /** Clear copy feedback. */
    clearCopied(state) {
      state.copiedBlockId = null;
    },
    /**
     * Set the appearance theme. Values outside THEMES are ignored so the
     * store can never hold an invalid mode.
     */
    setTheme(state, action) {
      if (THEMES.includes(action.payload)) {
        state.theme = action.payload;
      }
    },
    // Desktop sidebar collapse/expand
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = Boolean(action.payload);
    },
    // Mobile navigation drawer
    toggleNavDrawer(state) {
      state.navDrawerOpen = !state.navDrawerOpen;
    },
    setNavDrawerOpen(state, action) {
      state.navDrawerOpen = Boolean(action.payload);
    },
    // Mobile topic-sidebar drawer
    toggleSidebarDrawer(state) {
      state.sidebarDrawerOpen = !state.sidebarDrawerOpen;
    },
    setSidebarDrawerOpen(state, action) {
      state.sidebarDrawerOpen = Boolean(action.payload);
    },
    /** Toggle a single topic-tree node — accordion style: only one open at a time. */
    toggleNode(state, action) {
      const id = action.payload;
      if (state.expandedNodes[id]) {
        // Closing the current node
        delete state.expandedNodes[id];
      } else {
        // Close all others, open only this one
        state.expandedNodes = { [id]: true };
      }
    },
    /** Explicitly set a node's expanded state. */
    setNodeExpanded(state, action) {
      const { id, expanded } = action.payload;
      if (expanded) {
        state.expandedNodes[id] = true;
      } else {
        delete state.expandedNodes[id];
      }
    },
    /** Replace the whole expanded-node map (e.g. when seeding from a route). */
    setExpandedNodes(state, action) {
      state.expandedNodes = action.payload || {};
    },
    // Mega menu (desktop)
    setMegaMenuOpen(state, action) {
      state.megaMenuOpen = action.payload; // category key or null
    },
    // Mobile accordion categories — only one open at a time
    toggleMobileCategory(state, action) {
      const key = action.payload;
      if (state.mobileExpandedCategories[key]) {
        state.mobileExpandedCategories = {};
      } else {
        state.mobileExpandedCategories = { [key]: true };
      }
    },
  },
});

export const {
  setCopied,
  clearCopied,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleNavDrawer,
  setNavDrawerOpen,
  toggleSidebarDrawer,
  setSidebarDrawerOpen,
  toggleNode,
  setNodeExpanded,
  setExpandedNodes,
  setMegaMenuOpen,
  toggleMobileCategory,
} = uiSlice.actions;

export default uiSlice.reducer;
