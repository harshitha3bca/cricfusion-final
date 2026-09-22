import React, {
  useEffect,
  useState,
} from "react";

import "./AdminDashboard.css";
import AdminMatches from "./AdminMatches";
import AdminTeams from "./AdminTeams";
import AdminStadiums from "./AdminStadiums";
import AdminParking from "./AdminParking";
import AdminBookings from "./AdminBookings";

const API_URL =
  "http://localhost:5000/api";

function AdminDashboard({
  onLogout,
  onHome,
}) {
  const [stats, setStats] =
    useState({
      totalUsers: 0,
      totalMatches: 0,
      totalTeams: 0,
      totalPlayers: 0,
      totalStadiums: 0,
      totalSeats: 0,
      totalParkingSlots: 0,
      totalBookings: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [activeMenu, setActiveMenu] =
    useState("dashboard");

  // ========================================
  // LOAD DASHBOARD DATA
  // ========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Admin authentication is required."
          );
        }

        const response =
          await fetch(
            `${API_URL}/admin/dashboard`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load dashboard."
          );
        }

        setStats(
          data?.stats || {}
        );
      } catch (err) {
        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "isAdmin"
    );

    if (
      typeof onLogout ===
      "function"
    ) {
      onLogout();
    }
  };

  // ========================================
  // BACK TO HOME
  // ========================================

  const handleBackToHome = () => {
    if (
      typeof onHome ===
      "function"
    ) {
      onHome();
    }
  };

  // ========================================
  // SIDEBAR MENU
  // ========================================

  const menuItems = [
    {
      id: "dashboard",
      icon: "▦",
      label: "Dashboard",
    },
    {
      id: "matches",
      icon: "🏏",
      label: "Matches",
    },
    {
      id: "teams",
      icon: "👥",
      label: "Teams & Players",
    },
    {
      id: "stadiums",
      icon: "🏟️",
      label: "Stadiums & Seats",
    },
    {
      id: "parking",
      icon: "🚗",
      label: "Parking",
    },
    {
      id: "bookings",
      icon: "🎟️",
      label: "Bookings",
    },
  ];

  // ========================================
  // DASHBOARD STAT CARDS
  // ========================================

  const statCards = [
    {
      value: stats.totalUsers,
      label: "Total Users",
      icon: "👤",
    },
    {
      value: stats.totalMatches,
      label: "Total Matches",
      icon: "🏏",
    },
    {
      value: stats.totalTeams,
      label: "Total Teams",
      icon: "👥",
    },
    {
      value: stats.totalPlayers,
      label: "Total Players",
      icon: "⭐",
    },
    {
      value: stats.totalStadiums,
      label: "Total Stadiums",
      icon: "🏟️",
    },
    {
      value: stats.totalSeats,
      label: "Total Seats",
      icon: "💺",
    },
    {
      value: stats.totalParkingSlots,
      label: "Parking Slots",
      icon: "🚗",
    },
    {
      value: stats.totalBookings,
      label: "Total Bookings",
      icon: "🎟️",
    },
  ];

  // ========================================
  // PAGE TITLE
  // ========================================

  const getPageTitle = () => {
    if (
      activeMenu === "matches"
    ) {
      return "Manage Matches";
    }

    if (
      activeMenu === "teams"
    ) {
      return "Manage Teams & Players";
    }

    if (
      activeMenu === "stadiums"
    ) {
      return "Manage Stadiums & Seats";
    }

    if (
      activeMenu === "parking"
    ) {
      return "Manage Parking";
    }

    if (
      activeMenu === "bookings"
    ) {
      return "Manage Bookings";
    }

    return "Dashboard";
  };

  // ========================================
  // PAGE DESCRIPTION
  // ========================================

  const getPageDescription = () => {
    if (
      activeMenu === "matches"
    ) {
      return "Create, edit and manage IPL & WPL matches.";
    }

    if (
      activeMenu === "teams"
    ) {
      return "Manage IPL & WPL teams and players.";
    }

    if (
      activeMenu === "stadiums"
    ) {
      return "Manage stadiums and seating information.";
    }

    if (
      activeMenu === "parking"
    ) {
      return "Create, edit and manage parking inventory.";
    }

    if (
      activeMenu === "bookings"
    ) {
      return "View and manage customer ticket bookings.";
    }

    return "Manage your IPL & WPL ticket booking platform.";
  };

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="admin-dashboard-page">

      {/* ====================================
          SIDEBAR
      ==================================== */}

      <aside className="admin-sidebar">

        {/* LOGO */}

        <div className="admin-sidebar-logo">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <div>

            <strong>
              Cric<span>Fusion</span>
            </strong>

            <small>
              ADMIN PANEL
            </small>

          </div>

        </div>

        <div className="admin-sidebar-divider"></div>

        {/* MENU */}

        <nav className="admin-sidebar-nav">

          {menuItems.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                className={
                  activeMenu ===
                  item.id
                    ? "admin-menu-item active"
                    : "admin-menu-item"
                }
                onClick={() => {
                  setActiveMenu(
                    item.id
                  );

                  setError("");
                }}
              >

                <span className="admin-menu-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </button>
            )
          )}

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          {/* ADMIN PROFILE */}

          <div className="admin-admin-profile">

            <div className="admin-profile-avatar">
              A
            </div>

            <div>

              <strong>
                Administrator
              </strong>

              <small>
                CricFusion Admin
              </small>

            </div>

          </div>

          {/* BACK TO HOME */}

          <button
            type="button"
            className="admin-home-button"
            onClick={
              handleBackToHome
            }
          >

            <span>
              🏠
            </span>

            Back to Home

          </button>

          {/* LOGOUT */}

          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
          >

            <span>
              ⇥
            </span>

            Logout

          </button>

        </div>

      </aside>

      {/* ====================================
          MAIN CONTENT
      ==================================== */}

      <main className="admin-dashboard-main">

        {/* HEADER */}

        <header className="admin-dashboard-header">

          <div>

            <span className="admin-dashboard-label">
              CRICFUSION • ADMINISTRATION
            </span>

            <h1>
              {getPageTitle()}
            </h1>

            <p>
              {getPageDescription()}
            </p>

          </div>

          <div className="admin-header-right">

            <div className="admin-live-status">

              <span></span>

              System Online

            </div>

            <div className="admin-header-avatar">
              A
            </div>

          </div>

        </header>

        {/* ====================================
            MATCHES
        ==================================== */}

        {activeMenu ===
        "matches" ? (

          <AdminMatches />

        ) : activeMenu ===
          "teams" ? (

          <AdminTeams />

        ) : activeMenu ===
          "stadiums" ? (

          <AdminStadiums />

        ) : activeMenu ===
          "parking" ? (

          <AdminParking />

        ) : activeMenu ===
          "bookings" ? (

          <AdminBookings />

        ) : (

          /* ==================================
             DASHBOARD HOME
          ================================== */

          <>

            {/* ERROR */}

            {error && (
              <div className="admin-dashboard-error">
                {error}
              </div>
            )}

            {/* ==================================
                STATISTICS
            ================================== */}

            <section className="admin-stats-grid">

              {statCards.map(
                (card) => (
                  <article
                    key={
                      card.label
                    }
                    className="admin-stat-card"
                  >

                    <div className="admin-stat-top">

                      <div className="admin-stat-icon">
                        {card.icon}
                      </div>

                      <span className="admin-stat-arrow">
                        ↗
                      </span>

                    </div>

                    <div className="admin-stat-value">

                      {loading
                        ? "—"
                        : card.value}

                    </div>

                    <div className="admin-stat-label">
                      {card.label}
                    </div>

                  </article>
                )
              )}

            </section>

            {/* ==================================
                OVERVIEW
            ================================== */}

            <section className="admin-overview-grid">

              {/* PLATFORM OVERVIEW */}

              <div className="admin-overview-card">

                <div className="admin-section-heading">

                  <div>

                    <span>
                      PLATFORM
                    </span>

                    <h2>
                      CricFusion Overview
                    </h2>

                  </div>

                  <div className="admin-overview-badge">
                    LIVE
                  </div>

                </div>

                <div className="admin-overview-content">

                  <div className="admin-overview-item">

                    <span>
                      🏏
                    </span>

                    <div>

                      <strong>
                        IPL & WPL
                      </strong>

                      <small>
                        Cricket tournaments
                      </small>

                    </div>

                  </div>

                  <div className="admin-overview-item">

                    <span>
                      🎟️
                    </span>

                    <div>

                      <strong>
                        Ticket Management
                      </strong>

                      <small>
                        Seats & bookings
                      </small>

                    </div>

                  </div>

                  <div className="admin-overview-item">

                    <span>
                      🏟️
                    </span>

                    <div>

                      <strong>
                        Stadium Management
                      </strong>

                      <small>
                        Stadiums & seating
                      </small>

                    </div>

                  </div>

                  <div className="admin-overview-item">

                    <span>
                      🚗
                    </span>

                    <div>

                      <strong>
                        Parking Management
                      </strong>

                      <small>
                        Parking inventory
                      </small>

                    </div>

                  </div>

                </div>

              </div>

              {/* SECURITY */}

              <div className="admin-quick-card">

                <span className="admin-quick-label">
                  ADMIN ACCESS
                </span>

                <div className="admin-quick-icon">
                  🔐
                </div>

                <h2>
                  Secure Administration
                </h2>

                <p>
                  Only authenticated
                  administrators can access
                  CricFusion management
                  operations.
                </p>

                <div className="admin-security-status">

                  <span></span>

                  Administrator verified

                </div>

              </div>

            </section>

            {/* FOOTER */}

            <footer className="admin-dashboard-footer">

              <span>
                CRICFUSION
              </span>

              <strong>
                IPL • WPL
              </strong>

              <small>
                Administration Panel
              </small>

            </footer>

          </>

        )}

      </main>

    </div>
  );
}

export default AdminDashboard;