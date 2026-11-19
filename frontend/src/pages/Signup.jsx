import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBusy(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data?.errors || { general: ["Registration failed."] });
    } finally {
      setBusy(false);
    }
  };

  const firstError = Object.values(errors)[0]?.[0];

  return (
    <>
      <Navbar />
      <main className="auth-page signup">
        <div className="brand">
          <Logo className="brand-logo" />
        </div>

        <form className="card" onSubmit={onSubmit}>
          <h2>Create an Account</h2>
          <p className="muted">Fill the details below to get started.</p>

          <div className="input-group">
            <FaUser />
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={onChange}
              autoComplete="username"
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
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              name="password"
              type="password"
              placeholder="Password (min. 8 characters)"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          {firstError && <p className="error">{firstError}</p>}

          <button className="btn" disabled={busy}>
            {busy ? "Creating..." : "Sign Up"}
          </button>

          <p className="small">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </form>
      </main>
    </>
  );
}
