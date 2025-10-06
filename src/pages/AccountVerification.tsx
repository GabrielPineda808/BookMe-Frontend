import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { VerifyUserDto } from "../types/VerifyUserDto";
import api from "../api/Api";

export default function AccountVerification() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState(state?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleResend = async () => {
    if (!email) return;

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/resend", { email });
      setMessage("Verification code sent!");
      setTimer(60); // 1 minute cooldown
    } catch (err: any) {
      console.error(err);
      setMessage("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    setLoading(true);

    const payload: VerifyUserDto = {
      email,
      verificationCode,
    };

    try {
      const resp = await api.post("/auth/verify", payload);
      navigate("/login", { replace: true });
    } catch (err: any) {
      if (err.response) {
        const message =
          err.response.data?.message ||
          "Verification failed. Please check your input and try again.";
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
            <h4 className="mb-0">Verify your account</h4>
            <br />
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

            <div className="d-flex justify-content-center mb-3">
              <div className="w-100" style={{ maxWidth: 320 }}>
                <label htmlFor="code" className="form-label text-muted small">
                  Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  className="form-control auth-input text-center"
                  placeholder="XXXXXX"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  autoComplete="one-time-code"
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
                  Verifying Account...
                </>
              ) : (
                "Verify Account"
              )}
            </button>
            <div className="mt-3 text-center">
              <button
                type="button"
                className="btn p-0"
                onClick={handleResend}
                disabled={timer > 0 || loading}
                style={{ color: "white" }}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </button>

              {message && <p className="text-muted mt-2">{message}</p>}
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
