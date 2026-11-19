import { FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function PostFeed({ posts, onDelete }) {
  const { user } = useAuth();

  if (!posts.length) {
    return (
      <div className="feed">
        <p className="muted empty">No posts yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <article key={post.id} className="post">
          <header>
            <Avatar user={post.user} size="small" />
            <strong>{post.user?.username || "Unknown"}</strong>
            <small>{post.created_at ? new Date(post.created_at).toLocaleString() : ""}</small>
          </header>

          {post.content && <p className="post-content">{post.content}</p>}
          {post.image_url && <img className="post-image" src={post.image_url} alt="post attachment" />}

          {user?.id === post.user_id && (
            <button type="button" className="delete-btn" onClick={() => onDelete(post.id)}>
              <FaTrash /> Delete
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
