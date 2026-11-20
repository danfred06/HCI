import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, getFieldErrors, isConnectionError } from "../api/errors";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    setErrors({});
    setError("");
    setBusy(true);

    try {
      await login(form.login, form.password);
      navigate("/dashboard", {
        replace: true,
        state: { notice: "Welcome back!" },
      });
    } catch (err) {
      if (isConnectionError(err)) {
        setError(getErrorMessage(err));
        return;
      }

      const fieldErrors = getFieldErrors(err);
      setErrors(fieldErrors);
      setError(
        fieldErrors.login?.[0] ||
          fieldErrors.password?.[0] ||
          getErrorMessage(err, "Login failed. Please try again."),
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

          <div>
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
            {errors.login?.[0] && <p className="field-error">{errors.login[0]}</p>}
          </div>

          <div>
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
            {errors.password?.[0] && <p className="field-error">{errors.password[0]}</p>}
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn" disabled={busy} type="submit">
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
