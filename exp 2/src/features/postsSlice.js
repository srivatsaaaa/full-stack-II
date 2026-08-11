import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  entities: {},
  ids: [],
  status: 'idle',
  error: null,
};

export const fetchMockPosts = createAsyncThunk('posts/fetchMockPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: nanoid(),
      title: 'Launch announcement',
      content: 'Introducing our new Redux Toolkit experiment for managing posts and platforms!',
      platform: 'Twitter',
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      title: 'Platform rules',
      content: 'Learn how to normalize state for platforms and keep UI components simple.',
      platform: 'LinkedIn',
      createdAt: new Date().toISOString(),
    },
  ];
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        const post = action.payload;
        state.entities[post.id] = post;
        state.ids.push(post.id);
      },
      prepare({ title, content, platform }) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            platform,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, changes } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = { ...state.entities[id], ...changes };
      }
    },
    deletePost(state, action) {
      const id = action.payload;
      if (state.entities[id]) {
        delete state.entities[id];
        state.ids = state.ids.filter((postId) => postId !== id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMockPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMockPosts.fulfilled, (state, action) => {
        const posts = action.payload;
        state.entities = posts.reduce((map, post) => {
          map[post.id] = post;
          return map;
        }, {});
        state.ids = posts.map((post) => post.id);
        state.status = 'succeeded';
      })
      .addCase(fetchMockPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;

export default postsSlice.reducer;
