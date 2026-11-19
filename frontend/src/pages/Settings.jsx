import { useRef, useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaImage } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("email", form.email);
    if (form.password) formData.append("password", form.password);
    if (avatar) formData.append("avatar", avatar);

    try {
      await updateProfile(formData);
      setForm((current) => ({ ...current, password: "" }));
      setAvatar(null);
      if (fileRef.current) fileRef.current.value = "";
      setMessage("Profile updated.");
    } catch (err) {
      const errors = err.response?.data?.errors || {};
      setError(
        errors.username?.[0] ||
          errors.email?.[0] ||
          errors.password?.[0] ||
          errors.avatar?.[0] ||
          "Could not save changes.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="settings-page">
        <form className="card settings-card" onSubmit={onSubmit}>
          <h2>Settings</h2>
          <p className="muted">Update your profile details.</p>

          <div className="avatar-picker">
            <Avatar user={user} size="lg" />
            <button type="button" className="file-picker" onClick={() => fileRef.current?.click()}>
              <FaImage /> Change avatar
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
            />
            {avatar && <small className="file-name">{avatar.name}</small>}
          </div>

          <div className="input-group">
            <FaUser />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              name="password"
              type="password"
              placeholder="New password (optional)"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <button className="btn" disabled={busy}>
            {busy ? "Saving..." : "Save changes"}
          </button>

          {message && <p className="success">{message}</p>}
          {error && <p className="error">{error}</p>}
        </form>
      </main>
    </>
  );
}
