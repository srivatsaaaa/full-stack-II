import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, deletePost, fetchMockPosts } from './features/postsSlice.js';

function App() {
  const dispatch = useDispatch();
  const platforms = useSelector((state) => state.platforms.ids.map((id) => state.platforms.entities[id]));
  const posts = useSelector((state) => state.posts.ids.map((id) => state.posts.entities[id]));
  const postStatus = useSelector((state) => state.posts.status);
  const postError = useSelector((state) => state.posts.error);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platformId, setPlatformId] = useState('twitter');

  const platform = platforms.find((item) => item.id === platformId);
  const limit = platform?.characterLimit || 280;
  const isValid = content.length <= limit;

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchMockPosts());
    }
  }, [dispatch, postStatus]);

  const handleAddPost = () => {
    if (!title.trim() || !content.trim() || !isValid) return;
    dispatch(addPost({ title: title.trim(), content: content.trim(), platform: platform.name }));
    setTitle('');
    setContent('');
  };

  return (
    <div className="app-shell">
      <section className="panel">
        <h1>Redux Toolkit Experiment 2</h1>
        <p>Centralized state management with posts and platform data.</p>

        <div className="form-grid">
          <label>
            Post Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
          </label>

          <label>
            Platform
            <select value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
              {platforms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="full-width">
            Post Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder={`Write post for ${platform?.name}`}
            />
          </label>

          <div className="meta-row full-width">
            <span>Characters: {content.length}/{limit}</span>
            <span className={isValid ? 'valid' : 'invalid'}>
              {isValid ? 'Within limit' : 'Character limit exceeded'}
            </span>
          </div>

          <button className="submit-button" onClick={handleAddPost} disabled={!title.trim() || !content.trim() || !isValid}>
            Publish Post
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Post List</h2>
        {postStatus === 'loading' && <p>Loading posts...</p>}
        {postStatus === 'failed' && <p className="invalid">Error: {postError}</p>}
        {postStatus === 'succeeded' && posts.length === 0 && <p>No posts created yet.</p>}
        {postStatus === 'succeeded' && posts.length > 0 && (
          <div className="post-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-header">
                  <strong>{post.title}</strong>
                  <span>{post.platform}</span>
                </div>
                <p>{post.content}</p>
                <div className="post-footer">
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                  <button className="delete-button" onClick={() => dispatch(deletePost(post.id))}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
