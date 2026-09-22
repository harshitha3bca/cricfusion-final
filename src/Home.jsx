
import React, { useState } from "react";
import "./Home.css";

function Home({
  onLogin,
  onRegister,
  onMatches,
  onHowItWorks,
  onTeams,
  onPlayers,
  onStadiums,
  onAdminLogin,
  onMyBookings,
}) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [showSettings, setShowSettings] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [accountUser, setAccountUser] = useState({});

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = accountUser;

  const handleHowItWorks = () => {
    if (onHowItWorks) {
      onHowItWorks();
      return;
    }

    setShowHowItWorks(true);
  };

  const handleSettingsClick = () => {
    setShowSettings((previous) => !previous);
  };

  const handleAccountClick = () => {
    const currentUser = getUser();

    setAccountUser(currentUser);
    setEditName(currentUser?.name || "");
    setEditEmail(currentUser?.email || "");
    setIsEditingAccount(false);

    setShowAccount(true);
    setShowSettings(false);
  };

  const handleEditAccount = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditingAccount(true);
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || "");
    setEditEmail(user?.email || "");
    setIsEditingAccount(false);
  };

  const handleSaveAccount = () => {
    const currentUser = getUser();

    const updatedUser = {
      ...currentUser,
      name: editName.trim(),
      email: editEmail.trim(),
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    setAccountUser(updatedUser);
    setIsEditingAccount(false);
  };

  const handleMyBookings = () => {
    setShowSettings(false);

    if (onMyBookings) {
      onMyBookings();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");

    setShowSettings(false);
    setShowAccount(false);
    setIsLoggedIn(false);

    window.location.reload();
  };

  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="navbar">

        {/* LOGO */}

        <div className="logo-section">
          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            CricFusion
          </span>
        </div>


        {/* NAVIGATION */}

        <div className="nav-links">

          <a
            href="#home"
            className="active"
          >
            Home
          </a>

          <a
            href="#matches"
            onClick={(event) => {
              event.preventDefault();

              if (onMatches) {
                onMatches();
              }
            }}
          >
            Matches
          </a>

          <a
            href="#teams"
            onClick={(event) => {
              event.preventDefault();

              if (onTeams) {
                onTeams();
              }
            }}
          >
            Teams
          </a>

          <a
            href="#players"
            onClick={(event) => {
              event.preventDefault();

              if (onPlayers) {
                onPlayers();
              }
            }}
          >
            Players
          </a>

          <a
            href="#stadiums"
            onClick={(event) => {
              event.preventDefault();

              if (onStadiums) {
                onStadiums();
              }
            }}
          >
            Stadiums
          </a>

          <a href="#offers">
            Offers
          </a>

        </div>


        {/* =================================================
            AUTH / SETTINGS
        ================================================= */}

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

              <button
                type="button"
                className="login-btn"
                onClick={onAdminLogin}
              >
                Admin Login
              </button>
            </>

          ) : (

            <div className="settings-menu">

              {/* SETTINGS BUTTON */}

              <button
                type="button"
                className="settings-btn"
                onClick={handleSettingsClick}
              >
                <span>
                  Settings
                </span>

                <span
                  className={`settings-main-arrow ${
                    showSettings ? "open" : ""
                  }`}
                >
                  ▾
                </span>
              </button>


              {/* SETTINGS DROPDOWN */}

              {showSettings && (

                <div className="settings-dropdown">

                  {/* ACCOUNT */}

                  <button
                    type="button"
                    className="settings-dropdown-item"
                    onClick={handleAccountClick}
                  >
                    <span>
                      Account
                    </span>
                  </button>


                  {/* MY BOOKINGS */}

                  <button
                    type="button"
                    className="settings-dropdown-item"
                    onClick={handleMyBookings}
                  >
                    <span>
                      My Bookings
                    </span>
                  </button>


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="settings-dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <span>
                      Logout
                    </span>
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-content">

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


          {/* HERO RIGHT */}

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


      {/* =====================================================
          FEATURES
      ===================================================== */}

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


      {/* =====================================================
          BOTTOM TEXT
      ===================================================== */}

      <div className="bottom-text">

        Your Match. Your Seat.{" "}

        <span>
          Our Fusion.
        </span>

      </div>


      {/* =====================================================
          HOW IT WORKS MODAL
      ===================================================== */}

      {showHowItWorks && (

        <div
          className="how-overlay"
          onClick={() => setShowHowItWorks(false)}
        >

          <div
            className="how-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="how-close"
              onClick={() => setShowHowItWorks(false)}
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
                    Browse upcoming IPL and WPL matches and select your favorite match.
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
                    View the stadium seating map and select your preferred available seats.
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
                    Choose a parking slot for your vehicle or skip parking when you don't need it.
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
                    Complete the payment process and confirm your booking.
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
                    Your booking confirmation and digital ticket are generated instantly.
                  </p>

                </div>

              </div>

            </div>


            <button
              type="button"
              className="how-done-btn"
              onClick={() => setShowHowItWorks(false)}
            >
              Got It
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          ACCOUNT POPUP
      ===================================================== */}

      {showAccount && (

        <div
          className="account-overlay"
          onClick={() => setShowAccount(false)}
        >

          <div
            className="account-popup"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="account-close"
              onClick={() => setShowAccount(false)}
            >
              ×
            </button>


            <div className="account-profile-icon">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>


            <h2>
              Account
            </h2>


            <p className="account-subtitle">
              Your CricFusion account
            </p>


            {!isEditingAccount ? (

              <>
                <div className="account-info">

                  <div className="account-info-row">

                    <span>
                      Name
                    </span>

                    <strong>
                      {user?.name || "User"}
                    </strong>

                  </div>


                  <div className="account-info-row">

                    <span>
                      Email
                    </span>

                    <strong>
                      {user?.email || "Not available"}
                    </strong>

                  </div>

                </div>


                <button
                  type="button"
                  className="account-edit-btn"
                  onClick={handleEditAccount}
                >
                  Edit Profile
                </button>


                <button
                  type="button"
                  className="account-close-btn"
                  onClick={() => setShowAccount(false)}
                >
                  Close
                </button>
              </>

            ) : (

              <div className="account-edit-form">

                <div className="account-edit-field">

                  <label>
                    Name
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(event) =>
                      setEditName(event.target.value)
                    }
                    placeholder="Enter your name"
                  />

                </div>


                <div className="account-edit-field">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    value={editEmail}
                    onChange={(event) =>
                      setEditEmail(event.target.value)
                    }
                    placeholder="Enter your email"
                  />

                </div>


                <div className="account-edit-actions">

                  <button
                    type="button"
                    className="account-save-btn"
                    onClick={handleSaveAccount}
                  >
                    Save Changes
                  </button>

                  <button
                    type="button"
                    className="account-cancel-btn"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;
