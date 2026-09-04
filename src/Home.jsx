import React, { useState } from "react";
import "./Home.css";

function Home({
  onLogin,
  onRegister,
  onMatches,
  onHowItWorks,
  onTeams,
}) {

  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const handleHowItWorks = () => {

    // If App.jsx provides a handler, use it
    if (onHowItWorks) {
      onHowItWorks();
      return;
    }

    // Otherwise open the How It Works popup here
    setShowHowItWorks(true);
  };


  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    window.location.reload();
  };


  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo-section">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            CricFusion
          </span>

        </div>


        <div className="nav-links">

          <a
            href="#home"
            className="active"
          >
            Home
          </a>


          <a
            href="#matches"
            onClick={(e) => {

              e.preventDefault();

              if (onMatches) {
                onMatches();
              }

            }}
          >
            Matches
          </a>


          <a
            href="#teams"
            onClick={(e) => {

              e.preventDefault();

              if (onTeams) {
                onTeams();
              }

            }}
          >
            Teams
          </a>


          <a href="#players">
            Players
          </a>


          <a href="#stadiums">
            Stadiums
          </a>


          <a href="#offers">
            Offers
          </a>

        </div>


        {/* ================= AUTH BUTTONS ================= */}

        <div className="auth-buttons">

          {!isLoggedIn ? (
            <>
              <button
                type="button"
                className="login-btn"
                onClick={onLogin}
              >
                Login
              </button>

              <button
                type="button"
                className="register-btn"
                onClick={onRegister}
              >
                Register
              </button>
            </>
          ) : (

            <button
              type="button"
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          )}

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content">

          {/* ================= LEFT ================= */}

          <div className="hero-left">

            <div className="small-title">
              IPL & WPL
            </div>


            <h1>

              LIVE THE
              <br />

              <span>
                THRILL
              </span>

            </h1>


            <p className="hero-description">

              Book your favorite match tickets,
              <br />

              choose the best seats,
              <br />

              enjoy the game!

            </p>


            <div className="hero-buttons">

              <button
                type="button"
                className="explore-btn"
                onClick={onMatches}
              >
                Explore Matches
              </button>


              <button
                type="button"
                className="how-btn"
                onClick={handleHowItWorks}
              >
                How It Works
              </button>

            </div>

          </div>


          {/* ================= RIGHT ================= */}

          <div className="hero-right">

            <div className="stadium-glow"></div>


            <img
              src="/cricfusion-logo-transparent.png"
              alt="CricFusion Logo"
              className="hero-logo"
            />

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            ▣
          </div>

          <h3>
            All Matches
          </h3>

          <p>
            IPL & WPL
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ♧
          </div>

          <h3>
            Best Seats
          </h3>

          <p>
            Interactive Seat Map
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon secure">
            ✓
          </div>

          <h3>
            Secure Booking
          </h3>

          <p>
            100% Safe Payments
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ▣
          </div>

          <h3>
            Instant Tickets
          </h3>

          <p>
            E-Ticket Available
          </p>

        </div>


        <div className="feature-card">

          <div className="feature-icon">
            ▤
          </div>

          <h3>
            Parking Pass
          </h3>

          <p>
            Reserve Parking Slot
          </p>

        </div>

      </section>


      {/* ================= BOTTOM ================= */}

      <div className="bottom-text">

        Your Match. Your Seat.
        {" "}

        <span>
          Our Fusion.
        </span>

      </div>


      {/* ================= HOW IT WORKS POPUP ================= */}

      {showHowItWorks && (

        <div
          className="how-overlay"
          onClick={() =>
            setShowHowItWorks(false)
          }
        >

          <div
            className="how-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="how-close"
              onClick={() =>
                setShowHowItWorks(false)
              }
            >
              ×
            </button>


            <h2>
              How It Works
            </h2>


            <p className="how-subtitle">
              Book your IPL or WPL match ticket in a few simple steps.
            </p>


            <div className="how-steps">

              <div className="how-step">

                <div className="step-number">
                  1
                </div>

                <div>

                  <h3>
                    Choose a Match
                  </h3>

                  <p>
                    Browse upcoming IPL and WPL matches and select
                    your favorite match.
                  </p>

                </div>

              </div>


              <div className="how-step">

                <div className="step-number">
                  2
                </div>

                <div>

                  <h3>
                    Select Your Seat
                  </h3>

                  <p>
                    View the stadium seating map and select your
                    preferred available seats.
                  </p>

                </div>

              </div>


              <div className="how-step">

                <div className="step-number">
                  3
                </div>

                <div>

                  <h3>
                    Reserve Parking
                  </h3>

                  <p>
                    Choose a parking slot for your vehicle or skip
                    parking when you don't need it.
                  </p>

                </div>

              </div>


              <div className="how-step">

                <div className="step-number">
                  4
                </div>

                <div>

                  <h3>
                    Make Payment
                  </h3>

                  <p>
                    Complete the demo payment process and confirm
                    your booking.
                  </p>

                </div>

              </div>


              <div className="how-step">

                <div className="step-number">
                  5
                </div>

                <div>

                  <h3>
                    Get Your E-Ticket
                  </h3>

                  <p>
                    Your booking confirmation and digital ticket
                    are generated instantly.
                  </p>

                </div>

              </div>

            </div>


            <button
              type="button"
              className="how-done-btn"
              onClick={() =>
                setShowHowItWorks(false)
              }
            >
              Got It
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;