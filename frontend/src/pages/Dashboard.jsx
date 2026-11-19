import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostComposer from "../components/PostComposer";
import PostFeed from "../components/PostFeed";
import RightWidget from "../components/RightWidget";
import api from "../api/axios";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(() => {
    setLoading(true);
    api
      .get("/posts")
      .then((res) => {
        setPosts(res.data.data);
        setError("");
      })
      .catch(() => setError("Could not load posts."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const addPost = (post) => setPosts((prev) => [post, ...prev]);

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch {
      setError("Could not delete that post.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />

        <main className="feed-column">
          <div className="composer-card">
            <PostComposer onPosted={addPost} />
          </div>

          <h2 className="feed-heading">News Feed</h2>

          {error && (
            <p className="error">
              {error}{" "}
              <button type="button" className="link-btn" onClick={loadPosts}>Try again</button>
            </p>
          )}

          {loading ? <p className="muted">Loading posts...</p> : <PostFeed posts={posts} onDelete={deletePost} />}
        </main>

        <RightWidget />
      </div>
    </>
  );
}
