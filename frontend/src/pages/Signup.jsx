import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage, getFieldErrors, isConnectionError } from "../api/errors";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    setErrors({});
    setGeneralError("");
    setBusy(true);

    try {
      await register(form.username, form.email, form.password);
      navigate("/dashboard", {
        replace: true,
        state: { notice: "Account created successfully. Welcome to My Blue App!" },
      });
    } catch (err) {
      if (isConnectionError(err)) {
        setGeneralError(getErrorMessage(err));
        return;
      }

      const fieldErrors = getFieldErrors(err);
      setErrors(fieldErrors);
      if (!Object.keys(fieldErrors).length) {
        setGeneralError(getErrorMessage(err, "Registration failed. Please try again."));
      }
    } finally {
      setBusy(false);
    }
  };

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

          <div>
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
            {errors.username?.[0] && <p className="field-error">{errors.username[0]}</p>}
          </div>

          <div>
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
            {errors.email?.[0] && <p className="field-error">{errors.email[0]}</p>}
          </div>

          <div>
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
            {errors.password?.[0] && <p className="field-error">{errors.password[0]}</p>}
          </div>

          {generalError && <p className="error">{generalError}</p>}

          <button className="btn" disabled={busy} type="submit">
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
