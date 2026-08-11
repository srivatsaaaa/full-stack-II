import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const login = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const demoUsers = {
      editor: { password: "editor123", role: "editor" },
      viewer: { password: "viewer123", role: "viewer" },
    };

    const selectedUser = demoUsers[username];

    if (selectedUser && password === selectedUser.password) {
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        btoa(
          JSON.stringify({
            username,
            role: selectedUser.role,
            exp: Math.floor(Date.now() / 1000) + 3600,
          })
        ) +
        ".mock-signature";

      const decodedUser = jwtDecode(mockToken);
      setUser(decodedUser);
    } else {
      setError("Invalid username or password");
    }
  };

  const publishPost = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Please enter both title and content");
      return;
    }

    if (editingId) {
      const updatedPosts = posts.map((item) =>
        item.id === editingId
          ? { ...item, title: title.trim(), content: content.trim() }
          : item
      );
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      setMessage("Post updated successfully");
    } else {
      const newPost = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
      setMessage("Post published successfully");
    }

    setTitle("");
    setContent("");
    setEditingId(null);
  };

  const editPost = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditingId(post.id);
    setMessage("");
    setError("");
  };

  const deletePost = (id) => {
    const updatedPosts = posts.filter((item) => item.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setMessage("Post deleted successfully");
  };

  const logout = () => {
    setUser(null);
    setUsername("");
    setPassword("");
    setTitle("");
    setContent("");
    setError("");
    setMessage("");
  };

  if (user) {
    return (
      <div className="container">
        <div className="card">
          <h1>{user.role === "editor" ? "Post Page" : "View Post"}</h1>
          <p className="subtitle">Role: {user.role}</p>

          {user.role === "editor" ? (
            <>
              <form onSubmit={publishPost}>
                <input
                  type="text"
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Write your post here"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit">{editingId ? "Update Post" : "Publish Post"}</button>
              </form>

              <div className="view-box">
                <h3>Published Posts</h3>
                {posts.length > 0 ? (
                  posts.map((item) => (
                    <div key={item.id} className="post-item">
                      <p className="post-title">{item.title}</p>
                      <p>{item.content}</p>
                      <div className="post-actions">
                        <button type="button" onClick={() => editPost(item)}>
                          Edit
                        </button>
                        <button type="button" className="danger" onClick={() => deletePost(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No post published yet.</p>
                )}
              </div>
            </>
          ) : (
            <div className="view-box">
              <h3>Latest Post</h3>
              {posts.length > 0 ? (
                <>
                  <p className="post-title">{posts[0].title}</p>
                  <p>{posts[0].content}</p>
                </>
              ) : (
                <p>No post published yet.</p>
              )}
            </div>
          )}

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button className="logout" onClick={logout}>Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>JWT Authentication</h1>
        <p className="subtitle">Login as editor or viewer</p>

        <form onSubmit={login}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p className="hint">
          Try: <strong>editor / editor123</strong> or <strong>viewer / viewer123</strong>
        </p>
      </div>
    </div>
  );
}

export default App;