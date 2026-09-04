import React, { useState } from "react";
import "./Register.css";

const API_URL = "http://localhost:5000/api";

function Register({ onBackToHome, onLogin }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [showTerms, setShowTerms] =
    useState(false);


  /* =====================================================
     PASSWORD STRENGTH
  ===================================================== */

  const passwordChecks = {
    length:
      formData.password.length >= 8,

    uppercase:
      /[A-Z]/.test(formData.password),

    lowercase:
      /[a-z]/.test(formData.password),

    number:
      /[0-9]/.test(formData.password),

    special:
      /[^A-Za-z0-9]/.test(formData.password)
  };


  const isStrongPassword =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;


  /* =====================================================
     SUGGEST STRONG PASSWORD
  ===================================================== */

  const suggestStrongPassword = () => {

    const suggestedPassword =
      "Cric@" +
      Math.floor(
        1000 + Math.random() * 9000
      ) +
      "Fusion!";

    setFormData(
      (previousData) => ({
        ...previousData,
        password:
          suggestedPassword
      })
    );

    setShowPassword(true);
  };


  /* =====================================================
     HANDLE CHANGE
  ===================================================== */

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    });

  };


  /* =====================================================
     REGISTER
  ===================================================== */

  const handleSubmit = async (e) => {

    e.preventDefault();


    /* -----------------------------------------------
       PASSWORD VALIDATION
    ------------------------------------------------ */

    if (!isStrongPassword) {

      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
      );

      return;
    }


    /* -----------------------------------------------
       CONFIRM PASSWORD
    ------------------------------------------------ */

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      alert(
        "Passwords do not match."
      );

      return;
    }


    try {

      /* ---------------------------------------------
         REGISTER REQUEST
      --------------------------------------------- */

      const response =
        await fetch(
          `${API_URL}/auth/register`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name:
                formData.name.trim(),

              email:
                formData.email.trim(),

              password:
                formData.password
            })
          }
        );


      const data =
        await response.json();


      console.log(
        "Register API response:",
        data
      );


      /* ---------------------------------------------
         API ERROR
      --------------------------------------------- */

      if (!response.ok) {

        throw new Error(
          data?.message ||
          data?.error ||
          "Registration failed."
        );

      }


      /* ---------------------------------------------
         REGISTRATION SUCCESS
      --------------------------------------------- */

      alert(
        "CricFusion registration successful!"
      );


      /* ---------------------------------------------
         GO TO LOGIN
      --------------------------------------------- */

      if (
        typeof onLogin ===
        "function"
      ) {

        onLogin();

      }


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      alert(
        error?.message ||
        "Unable to create account."
      );

    }

  };


  return (
    <div className="register-page">


      {/* =================================================
          BACK TO HOME
      ================================================= */}

      <button
        type="button"
        className="register-back-home-btn"
        onClick={onBackToHome}
      >
        ← Back to Home
      </button>


      {/* =================================================
          LEFT
      ================================================= */}

      <div className="register-left">

        <div className="register-left-logo">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion Logo"
          />

        </div>


        <div className="register-hero-content">

          <div className="register-live-badge">

            <span></span>

            JOIN CRICFUSION

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


          <p className="register-hero-text">

            Create your CricFusion account and
            get ready to book IPL & WPL matches,
            choose your seats and enjoy match day.

          </p>


          <div className="register-features">

            <div className="register-feature-card">

              <div className="register-feature-icon">
                🏏
              </div>

              <div>

                <strong>
                  IPL & WPL
                </strong>

                <small>
                  Live cricket
                </small>

              </div>

            </div>


            <div className="register-feature-card">

              <div className="register-feature-icon blue">
                🎟️
              </div>

              <div>

                <strong>
                  Easy Booking
                </strong>

                <small>
                  Simple & fast
                </small>

              </div>

            </div>


            <div className="register-feature-card">

              <div className="register-feature-icon pink">
                🏟️
              </div>

              <div>

                <strong>
                  Best Seats
                </strong>

                <small>
                  Choose your view
                </small>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          RIGHT
      ================================================= */}

      <div className="register-right">

        <div className="register-card">


          {/* LOGO */}

          <div className="register-logo-container">

            <img
              src="/cricfusion-logo-transparent.png"
              alt="CricFusion"
              className="register-main-logo"
            />

          </div>


          {/* HEADING */}

          <div className="register-heading">

            <p>
              WELCOME TO CRICFUSION
            </p>

            <h2>
              Create Your Account
            </h2>

            <span>
              Start your match-day journey.
            </span>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
          >


            {/* NAME */}

            <div className="register-input-group">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="register-input-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  ✉
                </span>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="register-input-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>


              {/* PASSWORD REQUIREMENTS */}

              {formData.password && (

                <div className="password-requirements">

                  <small
                    className={
                      passwordChecks.length
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }
                  >
                    {passwordChecks.length
                      ? "✓"
                      : "✕"}{" "}
                    At least 8 characters
                  </small>


                  <small
                    className={
                      passwordChecks.uppercase
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }
                  >
                    {passwordChecks.uppercase
                      ? "✓"
                      : "✕"}{" "}
                    At least 1 uppercase letter
                  </small>


                  <small
                    className={
                      passwordChecks.lowercase
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }
                  >
                    {passwordChecks.lowercase
                      ? "✓"
                      : "✕"}{" "}
                    At least 1 lowercase letter
                  </small>


                  <small
                    className={
                      passwordChecks.number
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }
                  >
                    {passwordChecks.number
                      ? "✓"
                      : "✕"}{" "}
                    At least 1 number
                  </small>


                  <small
                    className={
                      passwordChecks.special
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }
                  >
                    {passwordChecks.special
                      ? "✓"
                      : "✕"}{" "}
                    At least 1 special character
                  </small>

                </div>

              )}


              {/* SUGGEST PASSWORD */}

              <button
                type="button"
                className="suggest-password-btn"
                onClick={
                  suggestStrongPassword
                }
              >
                🔐 Suggest Strong Password
              </button>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-input-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <span className="register-input-icon">
                  🔒
                </span>

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* TERMS */}

            <label className="register-terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the{" "}

                <button
                  type="button"
                  onClick={() =>
                    setShowTerms(true)
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color: "#a579ff",
                    fontWeight: "700",
                    cursor: "pointer",
                    padding: "0",
                    fontFamily:
                      "inherit"
                  }}
                >
                  Terms & Conditions
                </button>
              </span>

            </label>


            {/* CREATE ACCOUNT */}

            <button
              type="submit"
              className="register-create-button"
            >
              Create Account

              <span>
                →
              </span>

            </button>

          </form>


          {/* DIVIDER */}

          <div className="register-divider">
            OR
          </div>


          {/* SOCIAL BUTTONS */}

          <div className="register-social-buttons">

            <button
              type="button"
              className="register-social-button"
              onClick={() =>
                alert(
                  "Google registration is a demo feature."
                )
              }
            >

              <span className="register-google-icon">
                G
              </span>

              Google

            </button>


            <button
              type="button"
              className="register-social-button"
              onClick={() =>
                alert(
                  "Facebook registration is a demo feature."
                )
              }
            >

              <span className="register-facebook-icon">
                f
              </span>

              Facebook

            </button>

          </div>


          {/* LOGIN */}

          <p className="register-login">

            Already have an account?

            {" "}

            <button
              type="button"
              onClick={onLogin}
              style={{
                border: "none",
                background:
                  "transparent",
                color: "#a579ff",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily:
                  "inherit"
              }}
            >
              Sign In
            </button>

          </p>


        </div>

      </div>


      {/* =================================================
          TERMS & CONDITIONS
      ================================================= */}

      {showTerms && (

        <div
          style={{
            position: "fixed",
            inset: "0",
            background:
              "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: "9999"
          }}
          onClick={() =>
            setShowTerms(false)
          }
        >

          <div
            style={{
              width:
                "min(650px, 100%)",
              maxHeight: "80vh",
              overflowY: "auto",
              background: "#111111",
              border:
                "1px solid rgba(139, 92, 246, 0.35)",
              borderRadius: "16px",
              padding: "28px",
              color: "#ffffff",
              boxShadow:
                "0 25px 70px rgba(0, 0, 0, 0.5)"
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px"
              }}
            >

              <h2
                style={{
                  margin: 0,
                  color: "#ffffff"
                }}
              >
                Terms & Conditions
              </h2>


              <button
                type="button"
                onClick={() =>
                  setShowTerms(false)
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color: "#ffffff",
                  fontSize: "24px",
                  cursor: "pointer"
                }}
              >
                ×
              </button>

            </div>


            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#d0d0d0",
                fontSize: "12px",
                lineHeight: "1.6"
              }}
            >

              <li>
                By creating a CricFusion account,
                you agree to use the platform
                responsibly and provide accurate
                information.
              </li>

              <li>
                CricFusion provides IPL and WPL
                match information, seat selection,
                parking reservation and demo
                payment services for the academic
                project.
              </li>

              <li>
                Ticket availability, match
                information, stadium information
                and pricing displayed by the
                application may be subject to
                change.
              </li>

              <li>
                The payment system is a
                demonstration feature and does not
                process real financial transactions.
                Users are responsible for keeping
                their login credentials secure.
              </li>

            </ol>


            <button
              type="button"
              onClick={() =>
                setShowTerms(false)
              }
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "12px",
                border: "none",
                borderRadius: "9px",
                background:
                  "linear-gradient(135deg, #6d28d9, #9333ea)",
                color: "#ffffff",
                fontWeight: "800",
                cursor: "pointer"
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Register;