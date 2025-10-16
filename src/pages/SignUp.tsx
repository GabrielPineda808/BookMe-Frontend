import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/Api";
import "../styles/AuthDark.css";
import type { UserDto } from "../types/UserDto";
import { validateEmail, validatePassword } from "../utils/Validators";
import type { RegisterUserDto } from "../types/RegisterUserDto";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // trim inputs
    const tEmail = email.trim();
    const tFirst = firstName.trim();
    const tLast = lastName.trim();

    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);

    if (!passwordsMatch) {
      setError("Please ensure passwords match.");
      return;
    }

    if (!tEmail || !password || !tFirst || !tLast) {
      setError("Please enter all fields before continuing.");
      return;
    }

    setError(null);

    setLoading(true);

    const payload: RegisterUserDto = {
      email,
      password,
      firstName,
      lastName,
    };

    try {
      const resp = await api.post<UserDto>("/auth/signup", payload);
      console.log(resp.data);
      navigate("/verify", {
        replace: true,
        state: { email: resp.data.email },
      });
    } catch (err: any) {
      if (err.response) {
        const message =
          err.response.data?.message ||
          "Registration failed. Please check your input and try again.";
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
      <div className="auth-container rounded-0 shadow-sm">
        <div className="auth-side-left p-4">
          <div className="brand mb-4">
            <h4 className="mb-0">BookMe</h4>
            <small className="text-muted">Manage bookings effortlessly</small>
          </div>

          <div>
            <h4 className="mb-0">Create your account</h4>
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

            <div className="row g-2 mb-3">
              <div className="col-12 col-md-6">
                <label
                  htmlFor="firstName"
                  className="form-label text-muted small px-1 "
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="form-control auth-input"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="lastName"
                  className="form-label text-muted small px-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="form-control auth-input"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-muted small px-1"
              >
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
              <div className="col-12 col-md-6">
                <label
                  htmlFor="password"
                  className="form-label text-muted small d-flex justify-content-between px-1"
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
                />
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="confirmPassword"
                  className="form-label text-muted small d-flex justify-content-between px-1"
                >
                  <span style={{ display: "flex" }}>Confirm Password</span>
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
              className="btn btn-dark btn-block btn-auth"
              disabled={loading || !passwordsMatch}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <small className="text-muted">
              Have an account?{" "}
              <Link to="/login" className="text-light">
                Login
              </Link>
            </small>
          </div>
        </div>
        <div className="auth-side-right d-none d-md-flex flex-column justify-content-center align-items-center p-4">
          <div className="promo text-center px-3">
            <h5 className="text-light">Welcome {firstName}!</h5>
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
