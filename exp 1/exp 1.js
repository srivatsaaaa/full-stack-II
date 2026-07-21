import React, { useState } from "react";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  let limit = 0;

  if (platform === "Twitter") {
    limit = 100;
  } else if (platform === "Instagram") {
    limit = 2200;
  } else if (platform === "LinkedIn") {
    limit = 3000;
  }

  const count = post.length;

  const isValid = count <= limit;

  return (
    <div
      style={{
        width: "90%",
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        border: "2px solid black",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h2>Social Media Post Composer</h2>

      <label>Select Platform:</label>
      <br />
      <br />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
        style={{ width: "200px", padding: "5px" }}
      >
        <option>Twitter</option>
        <option>Instagram</option>
        <option>LinkedIn</option>
      </select>

      <br />
      <br />

      <textarea
        rows="5"
        cols="40"
        value={post}
        onChange={(e) => setPost(e.target.value)}
        placeholder="Write your post"
      />

      <p>
        Characters: {count}/{limit}
      </p>

      {isValid ? (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Valid Post
        </p>
      ) : (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Error: Character limit exceeded!
        </p>
      )}

      <button disabled={!isValid}>
        Publish
      </button>
    </div>
  );
}

export default App;