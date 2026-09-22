import React, { useState } from "react";
import "./AdminLogin.css";

const API_URL = "http://localhost:5000/api";

function AdminLogin({
  onBackToHome,
  onAdminLoginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Admin login response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Invalid email or password."
        );
      }

      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken;

      if (!token) {
        throw new Error(
          "Authentication token was not received."
        );
      }

      const user =
        data?.user ||
        data?.data?.user ||
        null;

      /* =========================================
         ADMIN ROLE CHECK
      ========================================= */

      if (!user || user.role !== "admin") {
        throw new Error(
          "Access denied. This account is not an administrator."
        );
      }

      /* =========================================
         SAVE ADMIN AUTHENTICATION
      ========================================= */

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "isAdmin",
        "true"
      );

      console.log(
        "Admin authentication successful."
      );

      /* =========================================
         OPEN ADMIN DASHBOARD
      ========================================= */

      if (
        typeof onAdminLoginSuccess ===
        "function"
      ) {
        onAdminLoginSuccess(user);
      }

    } catch (err) {
      console.error(
        "Admin login error:",
        err
      );

      setError(
        err?.message ||
          "Unable to sign in as administrator."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      {/* =========================================
          BACK BUTTON
      ========================================= */}

      <button
        type="button"
        className="admin-back-btn"
        onClick={onBackToHome}
      >
        ← Back to Home
      </button>

      {/* =========================================
          ADMIN CARD
      ========================================= */}

      <div className="admin-login-card">

        {/* LOGO */}

        <div className="admin-logo-container">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion Logo"
            className="admin-logo"
          />

        </div>

        {/* BADGE */}

        <div className="admin-badge">
          ADMIN PANEL
        </div>

        {/* HEADING */}

        <div className="admin-heading">

          <h1>
            Administrator Login
          </h1>

          <p>
            Sign in to manage CricFusion
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="admin-login-form"
        >

          {/* EMAIL */}

          <div className="admin-input-group">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="admin-input-wrapper">

              <span className="admin-input-icon">
                ✉
              </span>

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                autoComplete="email"
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="admin-input-group">

            <label htmlFor="admin-password">
              Password
            </label>

            <div className="admin-input-wrapper">

              <span className="admin-input-icon">
                🔒
              </span>

              <input
                id="admin-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter admin password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-eye-btn"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In as Admin"}

            {!loading && (
              <span>
                →
              </span>
            )}
          </button>

        </form>

        {/* SECURITY NOTE */}

        <div className="admin-security-note">

          <span>
            🔐
          </span>

          <p>
            Authorized administrators only.
            <br />
            Customer accounts cannot access
            this panel.
          </p>

        </div>

      </div>

      {/* FOOTER */}

      <p className="admin-footer">
        CRICFUSION &nbsp; • &nbsp;
        IPL &nbsp; • &nbsp;
        WPL &nbsp; • &nbsp;
        ADMINISTRATION
      </p>

    </div>
  );
}

export default AdminLogin;