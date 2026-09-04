

import React, { useState } from "react";
import "./Login.css";

const API_URL = "http://localhost:5000/api";

function Login({
  onBackToHome,
  onRegister,
  onLoginSuccess,
}) {
  /* =====================================================
     STATES
  ===================================================== */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =====================================================
     PASSWORD VISIBILITY
  ===================================================== */

  const [showPassword, setShowPassword] =
    useState(false);

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      /* -----------------------------------------------
         SEND LOGIN REQUEST
      ------------------------------------------------ */

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Login API response:",
        data
      );

      /* -----------------------------------------------
         API ERROR
      ------------------------------------------------ */

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Invalid email or password."
        );
      }

      /* -----------------------------------------------
         GET TOKEN

         Backend may return:
         data.token

         or:
         data.data.token
      ------------------------------------------------ */

      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken;

      if (!token) {
        throw new Error(
          "Login successful, but no authentication token was received."
        );
      }

      /* -----------------------------------------------
         GET USER
      ------------------------------------------------ */

      const user =
        data?.user ||
        data?.data?.user ||
        null;

      /* -----------------------------------------------
         SAVE TOKEN
      ------------------------------------------------ */

      localStorage.setItem(
        "token",
        token
      );

      /* -----------------------------------------------
         SAVE USER
      ------------------------------------------------ */

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      /* -----------------------------------------------
         SUCCESS
      ------------------------------------------------ */

      setSuccess(
        "Login successful! Welcome to CricFusion."
      );

      console.log(
        "Authentication token saved."
      );

      console.log(
        "Logged-in user:",
        user
      );

      /* -----------------------------------------------
         MOVE TO MATCHES
      ------------------------------------------------ */

      setTimeout(() => {
        if (
          typeof onLoginSuccess ===
          "function"
        ) {
          onLoginSuccess();
        }
      }, 700);

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        err?.message ||
          "Unable to login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="login-page">

      {/* =================================================
          BACK TO HOME
      ================================================= */}

      <button
        type="button"
        className="back-home-btn"
        onClick={
          onBackToHome
        }
      >
        ← Back to Home
      </button>

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="login-left">

        <div className="left-logo-container">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion Logo"
            className="left-logo"
          />

        </div>

        <div className="hero-content">

          <div className="live-badge">

            <span></span>

            IPL & WPL TICKET BOOKING

          </div>

          <h1>

            Your Match.
            <br />

            <span>
              Your Seat.
            </span>

            <br />

            Your Experience.

          </h1>

          <p className="hero-text">

            Book your favourite IPL & WPL
            matches, choose your perfect seat,
            reserve parking and get your digital
            ticket — all in one seamless platform.

          </p>

          <div className="features">

            {/* IPL & WPL */}

            <div className="feature-card">

              <div className="feature-icon">
                🏏
              </div>

              <div>

                <strong>
                  IPL & WPL
                </strong>

                <small>
                  Live Match Booking
                </small>

              </div>

            </div>

            {/* SMART SEATS */}

            <div className="feature-card">

              <div className="feature-icon blue">
                ◉
              </div>

              <div>

                <strong>
                  Smart Seats
                </strong>

                <small>
                  Choose Your Seat
                </small>

              </div>

            </div>

            {/* DIGITAL TICKET */}

            <div className="feature-card">

              <div className="feature-icon pink">
                ▣
              </div>

              <div>

                <strong>
                  Digital Ticket
                </strong>

                <small>
                  Instant QR Ticket
                </small>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="login-right">

        <div className="login-card">

          {/* LOGO */}

          <div className="logo-container">

            <img
              src="/cricfusion-logo-transparent.png"
              alt="CricFusion Logo"
              className="main-logo"
            />

          </div>

          {/* HEADING */}

          <div className="login-heading">

            <p>
              WELCOME BACK
            </p>

            <h2>
              Sign in to CricFusion
            </h2>

            <span>
              Continue your match-day journey.
            </span>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div
              style={{
                marginBottom: "15px",
                padding: "11px 13px",
                borderRadius: "9px",
                background:
                  "rgba(239, 68, 68, 0.10)",
                border:
                  "1px solid rgba(239, 68, 68, 0.30)",
                color: "#fca5a5",
                fontSize: "13px",
              }}
            >
              {error}
            </div>

          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (

            <div
              style={{
                marginBottom: "15px",
                padding: "11px 13px",
                borderRadius: "9px",
                background:
                  "rgba(34, 197, 94, 0.10)",
                border:
                  "1px solid rgba(34, 197, 94, 0.30)",
                color: "#86efac",
                fontSize: "13px",
              }}
            >
              {success}
            </div>

          )}

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* EMAIL */}

            <div className="input-group">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="input-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <a href="#forgot-password">
                  Forgot password?
                </a>

              </div>

              <div className="input-wrapper">

                <span className="input-icon password-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                  autoComplete="current-password"
                  style={{
                    paddingRight: "48px"
                  }}
                />

                {/* EYE BUTTON */}

                <button
                  type="button"
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
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform:
                      "translateY(-50%)",
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                    padding: "4px",
                    fontSize: "17px",
                    lineHeight: "1",
                  }}
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

            {/* REMEMBER */}

            <label className="remember">

              <input
                type="checkbox"
                name="remember"
              />

              <span>
                Remember me
              </span>

            </label>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="divider">

            <span>
              OR CONTINUE WITH
            </span>

          </div>

          {/* =================================================
              SOCIAL LOGIN

              These remain visual buttons for now.
          ================================================= */}

          <div className="social-buttons">

            <button
              type="button"
              className="social-button"
              onClick={() =>
                alert(
                  "Google login will be added later."
                )
              }
            >

              <span className="google-icon">
                G
              </span>

              Google

            </button>

            <button
              type="button"
              className="social-button"
              onClick={() =>
                alert(
                  "Facebook login will be added later."
                )
              }
            >

              <span className="facebook-icon">
                f
              </span>

              Facebook

            </button>

          </div>

          {/* =================================================
              REGISTER
          ================================================= */}

          <p className="signup">

            Don't have an account?

            <button
              type="button"
              className="create-account-btn"
              onClick={
                onRegister
              }
            >
              Create Account
            </button>

          </p>

        </div>

        {/* FOOTER */}

        <p className="footer-text">

          🏟 IPL &nbsp; • &nbsp;
          WPL &nbsp; • &nbsp;
          MATCH DAY

        </p>

      </div>

    </div>
  );
}

export default Login;

