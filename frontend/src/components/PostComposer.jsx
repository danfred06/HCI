import { useEffect, useRef, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import api from "../api/axios";

export default function PostComposer({ onPosted }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return undefined;
    }

    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const clearImage = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    const formData = new FormData();
    if (content.trim()) formData.append("content", content.trim());
    if (image) formData.append("image", image);

    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/posts", formData);
      onPosted(data);
      setContent("");
      clearImage();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.image?.[0] ||
          "Could not publish your post.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="composer" onSubmit={submit}>
      <div className="composer-top">
        <Avatar user={user} size="small" />
        <textarea
          className="composer-input"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
        />
        <button
          type="button"
          className="icon-btn"
          title="Add an image"
          onClick={() => fileRef.current?.click()}
        >
          <FaImage />
        </button>
        <button type="submit" className="btn post-btn" disabled={busy}>
          {busy ? "Posting..." : "Post"}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      {image && (
        <div className="attachment">
          <img src={preview} alt="Selected preview" />
          <span>{image.name}</span>
          <button type="button" className="icon-btn remove" onClick={clearImage} title="Remove image">
            <FaTimes />
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </form>
  );
}
