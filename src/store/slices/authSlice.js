// authSlice — client-side Google auth state.
//
// Holds the signed-in user's public profile (name/email/picture) decoded from
// the Google Identity Services credential, plus the sign-in modal open state.
// Persistence to localStorage is handled by the AuthProvider on the client;
// this slice is the single source of truth for the current session in the UI.

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  /** @type {null | { name: string, email: string, picture?: string, sub?: string }} */
  user: null,
  /** whether the sign-in modal is open */
  signInModalOpen: false,
  /** true once we've attempted to read persisted auth from localStorage */
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Set the signed-in user (or null to sign out). */
    setUser(state, action) {
      state.user = action.payload || null;
    },
    /** Clear the session. */
    signOut(state) {
      state.user = null;
    },
    openSignInModal(state) {
      state.signInModalOpen = true;
    },
    closeSignInModal(state) {
      state.signInModalOpen = false;
    },
    setHydrated(state, action) {
      state.hydrated = action.payload !== false;
    },
  },
});

export const {
  setUser,
  signOut,
  openSignInModal,
  closeSignInModal,
  setHydrated,
} = authSlice.actions;

export default authSlice.reducer;
