# Experiment 2: Redux Toolkit State Management

## Aim
Design and implement a centralized state management system using Redux Toolkit for managing posts and platform-related data.

## Overview
This experiment demonstrates:
- React app setup with Vite
- Redux Toolkit store configuration
- Normalized state for `posts` and `platforms`
- CRUD operations for posts using Redux reducers
- Async mock data loading with `createAsyncThunk`
- React-Redux hooks (`useSelector`, `useDispatch`)

## Project structure
- `src/main.jsx` — app bootstrap and Redux `Provider`
- `src/store.js` — Redux store configuration
- `src/features/postsSlice.js` — posts slice with actions and async thunk
- `src/features/platformSlice.js` — platform slice with normalized data
- `src/App.jsx` — UI for adding, listing, and deleting posts
- `src/index.css` — basic styling

## Getting started
1. Open a terminal in `fs/exp 2`
2. Run `npm install`
3. Run `npm run dev`
4. Open the local Vite URL in your browser

## Expected outcome
- Centralized Redux store holding global state
- Reduced prop drilling by sharing state via Redux
- Manageable and scalable architecture for posts and platforms
- Simple post authoring UI with platform character limits
