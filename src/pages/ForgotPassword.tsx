import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/Api";

export default function ForgotPassword() {
  const { state } = useLocation();
  const [email, setEmail] = useState(state?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage("");
    setLoading(true);

    try {
      const resp = await api.post("/auth/forgot", { email });
      setMessage("INSTRUCTIONS HAVE BEEN SENT TO YOUR EMAIL");
    } catch (err: any) {
      if (err.response) {
        const message =
          err.response.data?.message ||
          "Operation failed. Please check your input and try again.";
        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-root d-flex align-items-center justify-content-center">
      <div className="verify-container rounded-0 shadow-sm">
        <div className="verify-code-box p-4 text-center">
          <div className="brand mb-4">
            <h4 className="mb-0">BookMe</h4>
            <small className="text-muted">Manage bookings effortlessly</small>
          </div>

          <div>
            <h4 className="mb-0">Reset your password</h4>
            <br />
          </div>

          {message && <p className="alert-success mt-2">{message}</p>}

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

            <div className="d-flex justify-content-center mb-3">
              <div className="w-100" style={{ maxWidth: 320 }}>
                <label htmlFor="code" className="form-label text-muted small">
                  Please enter email below.
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control auth-input text-center"
                  placeholder="you@email.com"
                  defaultValue={state?.email || ""}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
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
                  Sending request...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-4">
            <small className="text-muted">
              Have an account?{" "}
              <Link to="/login" className="text-light">
                Login
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
