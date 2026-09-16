import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'va_theme';

function readPersistedTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* ignore */
  }
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    /* ignore */
  }
  return 'light';
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { value: readPersistedTheme() },
  reducers: {
    toggleTheme(state) {
      state.value = state.value === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action) {
      state.value = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.value;

export default themeSlice.reducer;
