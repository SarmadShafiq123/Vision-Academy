import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../store/slices/themeSlice.js';
import authReducer from '../features/lms/auth/authSlice.js';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth:  authReducer,
  },
});

export default store;
