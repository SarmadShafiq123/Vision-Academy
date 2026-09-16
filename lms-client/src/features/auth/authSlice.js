import { createSlice } from '@reduxjs/toolkit';

const PERSISTED_USER_KEY = 'lms_user';

function loadPersistedUser() {
  try {
    const raw = sessionStorage.getItem(PERSISTED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

const persistedUser = loadPersistedUser();

const initialState = {
  user:            persistedUser,
  accessToken:     null,
  isAuthenticated: persistedUser !== null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { user, accessToken } = action.payload;
      state.user            = user;
      state.accessToken     = accessToken;
      state.isAuthenticated = true;
      try {
        sessionStorage.setItem(PERSISTED_USER_KEY, JSON.stringify(user));
      } catch (_e) {
        void _e;
      }
    },
    clearCredentials(state) {
      state.user            = null;
      state.accessToken     = null;
      state.isAuthenticated = false;
      try {
        sessionStorage.removeItem(PERSISTED_USER_KEY);
      } catch (_e) {
        void _e;
      }
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export const selectUser            = (state) => state.auth.user;
export const selectAccessToken     = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectRole            = (state) => state.auth.user?.role ?? null;

export default authSlice.reducer;
