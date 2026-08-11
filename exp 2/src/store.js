import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './features/postsSlice.js';
import platformsReducer from './features/platformSlice.js';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
  },
});
