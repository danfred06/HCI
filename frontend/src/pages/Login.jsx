import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form.login, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.errors?.login?.[0] ||
          err.response?.data?.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="brand">
          <Logo className="brand-logo" />
        </div>

        <form className="card" onSubmit={onSubmit}>
          <h2>Login</h2>
          <p className="muted">Welcome back! please enter your details</p>

          <div className="input-group">
            <FaUser />
            <input
              name="login"
              placeholder="Username or Email"
              value={form.login}
              onChange={onChange}
              autoComplete="username"
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="eye"
              title={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw(!showPw)}
            >
              {showPw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn" disabled={busy}>
            {busy ? "Logging in..." : "Login"}
          </button>

          <p className="small">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </main>
    </>
  );
}
