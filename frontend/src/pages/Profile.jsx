import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RightWidget from "../components/RightWidget";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts").then((res) => setPosts(res.data.data)).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      <div className="app-shell">
        <Sidebar />
        <main className="feed-column">
          <section className="profile-head">
            <Avatar user={user} size="lg" />
            <h2>{user?.username || "Name"}</h2>
          </section>

          <section className="profile-card">
            <div className="profile-picture">Picture</div>
            <p className="muted">picture</p>
            <p className="profile-name">{user?.username || "Name"}</p>
          </section>

          <h2 className="feed-heading">YOUR POST</h2>
          {posts.length ? (
            <div className="post-list">
              {posts.map((post) => (
                <article key={post.id} className="post">
                  <header>
                    <strong>{post.user?.username || "Name"}</strong>
                  </header>
                  {post.content && <p className="post-content">{post.content}</p>}
                  {post.image_url && <img className="post-image" src={post.image_url} alt="post attachment" />}
                </article>
              ))}
            </div>
          ) : (
            <p className="muted empty">No posts yet.</p>
          )}
        </main>
        <RightWidget />
      </div>
    </>
  );
}
