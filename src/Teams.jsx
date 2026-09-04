
import React, { useMemo, useState } from "react";
import "./Teams.css";

/* =====================================================
   TEAM LOGOS
===================================================== */

import rcbLogo from "./assets/teams/rcb.png";
import cskLogo from "./assets/teams/csk.png";
import miLogo from "./assets/teams/mi.png";
import kkrLogo from "./assets/teams/kkr.png";
import rrLogo from "./assets/teams/rr.png";
import srhLogo from "./assets/teams/srh.png";
import dcLogo from "./assets/teams/dc.png";
import pbksLogo from "./assets/teams/pbks.png";
import gtLogo from "./assets/teams/gt.png";
import lsgLogo from "./assets/teams/lsg.png";

import miWplLogo from "./assets/teams/mi-wpl.png";
import dcWplLogo from "./assets/teams/dc-wpl.png";
import rcbWplLogo from "./assets/teams/rcb-wpl.png";
import upwWplLogo from "./assets/teams/upw-wpl.png";
import ggWplLogo from "./assets/teams/gg-wpl.png";


function Teams({ onHome, onPlayers }) {
  const [activeLeague, setActiveLeague] = useState("IPL");
  const [searchTerm, setSearchTerm] = useState("");

  const teams = {
    IPL: [
      {
        name: "Royal Challengers Bengaluru",
        shortName: "RCB",
        city: "Bengaluru",
        stadium: "M. Chinnaswamy Stadium",
        captain: "Rajat Patidar",
        coach: "Andy Flower",
        color: "#e10600",
        logo: rcbLogo,
      },
      {
        name: "Chennai Super Kings",
        shortName: "CSK",
        city: "Chennai",
        stadium: "MA Chidambaram Stadium",
        captain: "Ruturaj Gaikwad",
        coach: "Stephen Fleming",
        color: "#f9cd05",
        logo: cskLogo,
      },
      {
        name: "Mumbai Indians",
        shortName: "MI",
        city: "Mumbai",
        stadium: "Wankhede Stadium",
        captain: "Hardik Pandya",
        coach: "Mahela Jayawardene",
        color: "#004b8d",
        logo: miLogo,
      },
      {
        name: "Kolkata Knight Riders",
        shortName: "KKR",
        city: "Kolkata",
        stadium: "Eden Gardens",
        captain: "Ajinkya Rahane",
        coach: "Chandrakant Pandit",
        color: "#3a225d",
        logo: kkrLogo,
      },
      {
        name: "Rajasthan Royals",
        shortName: "RR",
        city: "Jaipur",
        stadium: "Sawai Mansingh Stadium",
        captain: "Sanju Samson",
        coach: "Rahul Dravid",
        color: "#ea1a85",
        logo: rrLogo,
      },
      {
        name: "Sunrisers Hyderabad",
        shortName: "SRH",
        city: "Hyderabad",
        stadium: "Rajiv Gandhi International Stadium",
        captain: "Pat Cummins",
        coach: "Daniel Vettori",
        color: "#ff822e",
        logo: srhLogo,
      },
      {
        name: "Delhi Capitals",
        shortName: "DC",
        city: "Delhi",
        stadium: "Arun Jaitley Stadium",
        captain: "Axar Patel",
        coach: "Hemang Badani",
        color: "#17479e",
        logo: dcLogo,
      },
      {
        name: "Punjab Kings",
        shortName: "PBKS",
        city: "Punjab",
        stadium: "Maharaja Yadavindra Singh International Cricket Stadium",
        captain: "Shreyas Iyer",
        coach: "Ricky Ponting",
        color: "#ed1b24",
        logo: pbksLogo,
      },
      {
        name: "Gujarat Titans",
        shortName: "GT",
        city: "Ahmedabad",
        stadium: "Narendra Modi Stadium",
        captain: "Shubman Gill",
        coach: "Ashish Nehra",
        color: "#1c1c1c",
        logo: gtLogo,
      },
      {
        name: "Lucknow Super Giants",
        shortName: "LSG",
        city: "Lucknow",
        stadium: "BRSABVE Cricket Stadium",
        captain: "Rishabh Pant",
        coach: "Justin Langer",
        color: "#00a8e8",
        logo: lsgLogo,
      },
    ],

    WPL: [
      {
        name: "Mumbai Indians",
        shortName: "MI",
        city: "Mumbai",
        stadium: "Wankhede Stadium",
        captain: "Harmanpreet Kaur",
        coach: "Charlotte Edwards",
        color: "#004b8d",
        logo: miWplLogo,
      },
      {
        name: "Delhi Capitals",
        shortName: "DC",
        city: "Delhi",
        stadium: "Arun Jaitley Stadium",
        captain: "Jemimah Rodrigues",
        coach: "Jonathan Batty",
        color: "#17479e",
        logo: dcWplLogo,
      },
      {
        name: "Royal Challengers Bengaluru",
        shortName: "RCB",
        city: "Bengaluru",
        stadium: "M. Chinnaswamy Stadium",
        captain: "Smriti Mandhana",
        coach: "Luke Williams",
        color: "#e10600",
        logo: rcbWplLogo,
      },
      {
        name: "UP Warriorz",
        shortName: "UPW",
        city: "Lucknow",
        stadium: "BRSABVE Cricket Stadium",
        captain: "Alyssa Healy",
        coach: "Jon Lewis",
        color: "#8b2c83",
        logo: upwWplLogo,
      },
      {
        name: "Gujarat Giants",
        shortName: "GG",
        city: "Ahmedabad",
        stadium: "Narendra Modi Stadium",
        captain: "Ashleigh Gardner",
        coach: "Michael Klinger",
        color: "#f36f21",
        logo: ggWplLogo,
      },
    ],
  };

  const filteredTeams = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return teams[activeLeague];
    }

    return teams[activeLeague].filter(
      (team) =>
        team.name.toLowerCase().includes(search) ||
        team.shortName.toLowerCase().includes(search) ||
        team.city.toLowerCase().includes(search)
    );
  }, [activeLeague, searchTerm]);

  const handleViewTeam = (team) => {
    alert(
      `${team.name}\n\nCaptain: ${team.captain}\nCoach: ${team.coach}\nHome Ground: ${team.stadium}`
    );
  };

  return (
    <div className="teams-page">

      {/* ================= NAVBAR ================= */}

      <nav className="teams-navbar">

        <button
          type="button"
          className="teams-logo"
          onClick={onHome}
        >
          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            Cric<span>Fusion</span>
          </span>
        </button>

        <div className="teams-nav-links">

          <button type="button" onClick={onHome}>
            Home
          </button>

          <button type="button">
            Matches
          </button>

          <button
            type="button"
            className="active"
          >
            Teams
          </button>

          <button
            type="button"
            onClick={onPlayers}
          >
            Players
          </button>

          <button type="button">
            Stadiums
          </button>

          <button type="button">
            Offers
          </button>

        </div>

        <div className="teams-auth">

          <button type="button">
            Login
          </button>

          <button type="button">
            Register
          </button>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="teams-header">

        <span className="teams-label">
          CRICFUSION • TEAMS
        </span>

        <h1>
          IPL & WPL <span>Teams</span>
        </h1>

        <p>
          Explore the teams, captains, coaches and home grounds 
          competing in IPL and WPL.
        </p>

      </section>


      {/* ================= LEAGUE SWITCH ================= */}

      <div className="league-switch">

        <button
          type="button"
          className={activeLeague === "IPL" ? "selected" : ""}
          onClick={() => {
            setActiveLeague("IPL");
            setSearchTerm("");
          }}
        >
          IPL 2026
        </button>

        <button
          type="button"
          className={activeLeague === "WPL" ? "selected" : ""}
          onClick={() => {
            setActiveLeague("WPL");
            setSearchTerm("");
          }}
        >
          WPL 2026
        </button>

      </div>


      {/* ================= SEARCH ================= */}

      <div className="teams-search">

        <span>⌕</span>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeLeague} teams...`}
        />

        {searchTerm && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}

      </div>


      {/* ================= TEAM COUNT ================= */}

      <div className="teams-count">

        <span>
          {activeLeague} 2026
        </span>

        <strong>
          {filteredTeams.length} Teams
        </strong>

      </div>


      {/* ================= TEAM GRID ================= */}

      <main className="teams-container">

        {filteredTeams.length === 0 ? (

          <div className="no-teams">

            <h2>No teams found</h2>

            <p>
              Try searching with another team name or city.
            </p>

          </div>

        ) : (

          <div className="teams-grid">

            {filteredTeams.map((team) => (

              <article
                key={`${activeLeague}-${team.shortName}-${team.city}`}
                className="team-card"
              >

                <div
                  className="team-card-top"
                  style={{
                    "--team-color": team.color,
                  }}
                ></div>


                <div className="team-logo-box">

                  <img
                    src={team.logo}
                    alt={team.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling.style.display =
                        "flex";
                    }}
                  />

                  <div className="logo-fallback">
                    {team.shortName}
                  </div>

                </div>


                <div className="team-card-content">

                  <div className="team-league-badge">
                    {activeLeague}
                  </div>

                  <h2>
                    {team.name}
                  </h2>

                  <div className="team-code">
                    {team.shortName}
                  </div>


                  <div className="team-details">

                    <div className="team-detail">
                      <span>📍</span>

                      <div>
                        <small>City</small>
                        <strong>{team.city}</strong>
                      </div>
                    </div>


                    <div className="team-detail">
                      <span>🏟️</span>

                      <div>
                        <small>Home Ground</small>
                        <strong>{team.stadium}</strong>
                      </div>
                    </div>


                    <div className="team-detail">
                      <span>👑</span>

                      <div>
                        <small>Captain</small>
                        <strong>{team.captain}</strong>
                      </div>
                    </div>


                    <div className="team-detail">
                      <span>🎯</span>

                      <div>
                        <small>Coach</small>
                        <strong>{team.coach}</strong>
                      </div>
                    </div>

                  </div>


                  <button
                    type="button"
                    className="view-team-btn"
                    onClick={() => handleViewTeam(team)}
                  >
                    View Team
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>


      {/* ================= FOOTER TEXT ================= */}

      <div className="teams-footer-text">
        <span>YOUR TEAM.</span>
        <strong>YOUR PASSION.</strong>
        <span>OUR FUSION.</span>
      </div>

    </div>
  );
}

export default Teams;

