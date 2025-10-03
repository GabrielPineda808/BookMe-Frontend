import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Api";
import { useAuth } from "../auth/AuthContext";
import "../styles/AuthDark.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      login(token); // persists token and sets user
      navigate("/home", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root d-flex align-items-center justify-content-center">
      <div className="auth-container rounded-0 shadow-sm">
        <div className="auth-side-left p-4">
          <div className="brand mb-4">
            <h4 className="mb-0">BookMe</h4>
            <small className="text-muted">Manage bookings effortlessly</small>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div
                className="alert alert-danger py-2 px-3"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label text-muted small">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label text-muted small d-flex justify-content-between"
              >
                <span>Password</span>
                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 text-muted"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-control auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="remember"
                >
                  Remember me
                </label>
              </div>
              <Link to="#" className="small text-muted">
                Forgot?
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block btn-auth"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <small className="text-muted">
              New here?{" "}
              <Link to="/signup" className="text-light">
                Create account
              </Link>
            </small>
          </div>
        </div>
        <div className="auth-side-right d-none d-md-flex flex-column justify-content-center align-items-center p-4">
          <div className="promo text-center px-3">
            <h5 className="text-light">Welcome back</h5>
            <p className="text-muted small">
              Fast bookings, clear schedules, and effortless management — all in
              one place.
            </p>
            <div className="feature-list mt-3">
              <div className="feature-item text-muted small">
                • Realtime availability
              </div>
              <div className="feature-item text-muted small">
                • Simple booking flows
              </div>
              <div className="feature-item text-muted small">
                • Secure authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
