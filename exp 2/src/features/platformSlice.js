import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  entities: {
    twitter: { id: 'twitter', name: 'Twitter', characterLimit: 280 },
    instagram: { id: 'instagram', name: 'Instagram', characterLimit: 2200 },
    linkedin: { id: 'linkedin', name: 'LinkedIn', characterLimit: 3000 },
  },
  ids: ['twitter', 'instagram', 'linkedin'],
};

const platformSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform(state, action) {
      const platform = action.payload;
      state.entities[platform.id] = platform;
      state.ids.push(platform.id);
    },
    updatePlatform(state, action) {
      const { id, changes } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = { ...state.entities[id], ...changes };
      }
    },
  },
});

export const { addPlatform, updatePlatform } = platformSlice.actions;

export default platformSlice.reducer;
