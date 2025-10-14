import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/Api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = decodeURIComponent(searchParams.get("email") || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const [cooldown, setCooldown] = useState<number>(() => {
    const t = sessionStorage.getItem("resendCooldownUntil");
    if (!t) return 0;
    const until = parseInt(t, 10);
    const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
    return remaining;
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          sessionStorage.removeItem("resendCooldownUntil");
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  function startCooldown(seconds = 60) {
    const until = Date.now() + seconds * 1000;
    sessionStorage.setItem("resendCooldownUntil", String(until));
    setCooldown(seconds);
  }

  async function handleResend(e?: React.MouseEvent) {
    e?.preventDefault();
    if (!email) {
      setError("No email available to resend to.");
      return;
    }
    if (cooldown > 0) {
      setMessage(`Please wait ${cooldown}s before resending.`);
      return;
    }

    setLoading(true);
    setError(null);
    setMessage("");
    try {
      await api.post("/auth/forgot", { email });
      setMessage("If an account exists, we've sent reset instructions.");
      startCooldown(60);
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Failed to resend. Try again later."
      );
    } finally {
      setLoading(false);
    }
  }

  // call backend to resend reset
  async function resendResetEmail(emailToSend: string) {
    // if cooling down, return early
    if (cooldown > 0) {
      setMessage(`Please wait ${cooldown}s before requesting another code.`);
      return;
    }
    try {
      setMessage("Resending reset instructions...");
      await api.post("/auth/forgot", { email: emailToSend });
      setMessage(
        "If an account exists, we've sent reset instructions to that email."
      );
      startCooldown(60); // 1 minute cooldown
    } catch (err: any) {
      // network or server error — show friendly message
      setError(
        err?.response?.data?.message ||
          "Failed to resend reset instructions. Try again later."
      );
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset", {
        email,
        token,
        newPassword: password, // or "password" if your API expects that field name
      });

      setMessage("Password changed — please log in.");
      // consider auto-revoking session etc. server-side
      navigate("/login", { replace: true });
    } catch (err: any) {
      // inspect server response
      const serverMessage = err?.response?.data?.message || err.message || "";

      // If token invalid/expired — automatically resend reset instructions
      if (
        serverMessage === "Invalid or expired token" ||
        serverMessage === "Invalid token"
      ) {
        // Avoid infinite loop: only try automatic resend once per invalid-token error.
        // We attempt to resend and then navigate to the forgot page if needed.
        await resendResetEmail(email);
        setError(
          "Your reset link expired. We resent instructions — check your email."
        );
        // Optionally route to a dedicated "Check your email" page or stay here.
        // If you prefer to take them to a page that says "Check your email", uncomment:
        // navigate("/forgot-password", { replace: true, state: { email } });
        return;
      }

      // Other errors
      setError(serverMessage || "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return <div>Invalid reset link. Please request a new one.</div>;
  }

  return (
    <div className="auth-root d-flex align-items-center justify-content-center">
      <div
        className="verify-container rounded-0 shadow-sm w-300"
        style={{ maxWidth: 320 }}
      >
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

            {password && (
              <ul className="text-muted small mt-1 mb-3">
                <li
                  className={
                    /[A-Z]/.test(password) ? "text-success" : "text-danger"
                  }
                >
                  • At least one uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(password) ? "text-success" : "text-danger"
                  }
                >
                  • At least one lowercase letter
                </li>
                <li
                  className={
                    /\d/.test(password) ? "text-success" : "text-danger"
                  }
                >
                  • At least one number
                </li>
                <li
                  className={
                    /[@$!%*?&]/.test(password) ? "text-success" : "text-danger"
                  }
                >
                  • At least one special character (@$!%*?&)
                </li>
                <li
                  className={
                    password.length >= 8 ? "text-success" : "text-danger"
                  }
                >
                  • Minimum 8 characters
                </li>
              </ul>
            )}

            <div className=" row g-2 mb-3">
              <div className="col-12">
                <label
                  htmlFor="password"
                  className="form-label text-muted small d-flex justify-content-between"
                >
                  <span>New Password</span>
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
                />
              </div>

              <div className="col-12">
                <label
                  htmlFor="confirmPassword"
                  className="form-label text-muted small d-flex justify-content-between"
                >
                  <span>Confirm New Password</span>
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
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="form-control auth-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* inline password mismatch hint */}
            {!passwordsMatch && confirmPassword.length > 0 && (
              <div className="text-danger small mb-2" role="alert">
                Passwords do not match
              </div>
            )}

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
                "CONTINUE"
              )}
            </button>
            <div className="mt-2">
              <small className="text-muted">
                <button
                  onClick={handleResend}
                  className="btn btn-link text-light p-0"
                  disabled={loading || cooldown > 0}
                  aria-disabled={loading || cooldown > 0}
                >
                  {cooldown > 0
                    ? `Resend Email (${cooldown}s)`
                    : loading
                    ? "Resending..."
                    : "Resend Email"}
                </button>
              </small>
            </div>
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
