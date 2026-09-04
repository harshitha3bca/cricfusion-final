import React, { useEffect, useState } from "react";
import "./Matches.css";

/* =====================================================
   IPL TEAM LOGOS
===================================================== */

import miLogo from "./assets/teams/mi.png";
import cskLogo from "./assets/teams/csk.png";
import rcbLogo from "./assets/teams/rcb.png";
import kkrLogo from "./assets/teams/kkr.png";
import rrLogo from "./assets/teams/rr.png";
import srhLogo from "./assets/teams/srh.png";
import dcLogo from "./assets/teams/dc.png";
import pbksLogo from "./assets/teams/pbks.png";
import gtLogo from "./assets/teams/gt.png";
import lsgLogo from "./assets/teams/lsg.png";

/* =====================================================
   WPL TEAM LOGOS
===================================================== */

import dcWplLogo from "./assets/teams/dc-wpl.png";
import miWplLogo from "./assets/teams/mi-wpl.png";
import rcbWplLogo from "./assets/teams/rcb-wpl.png";
import upwLogo from "./assets/teams/upw-wpl.png";
import ggWplLogo from "./assets/teams/gg-wpl.png";

/* =====================================================
   API
===================================================== */

const API_URL = "http://localhost:5000/api";

/* =====================================================
   TEAM LOGO MAP
===================================================== */

const teamLogoMap = {
  "Mumbai Indians": miLogo,
  "Chennai Super Kings": cskLogo,
  "Royal Challengers Bengaluru": rcbLogo,
  "Kolkata Knight Riders": kkrLogo,
  "Rajasthan Royals": rrLogo,
  "Sunrisers Hyderabad": srhLogo,
  "Delhi Capitals": dcLogo,
  "Punjab Kings": pbksLogo,
  "Gujarat Titans": gtLogo,
  "Lucknow Super Giants": lsgLogo,

  "UP Warriorz": upwLogo,
  "Gujarat Giants": ggWplLogo,
};

/* =====================================================
   WPL LOGO OVERRIDE
===================================================== */

function getTeamLogo(teamName, tournamentType) {
  if (
    tournamentType === "WPL" &&
    teamName === "Delhi Capitals"
  ) {
    return dcWplLogo;
  }

  if (
    tournamentType === "WPL" &&
    teamName === "Mumbai Indians"
  ) {
    return miWplLogo;
  }

  if (
    tournamentType === "WPL" &&
    teamName ===
      "Royal Challengers Bengaluru"
  ) {
    return rcbWplLogo;
  }

  return (
    teamLogoMap[teamName] || null
  );
}

/* =====================================================
   FORMAT DATE
===================================================== */

function formatMatchDate(dateValue) {
  if (!dateValue) {
    return "DATE TBA";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

/* =====================================================
   MATCH NORMALIZER

   Converts backend data:

   teamA.name
   teamB.name
   stadium.name

   into the shape used by your existing UI.
===================================================== */

function normalizeMatch(match) {
  const tournamentType =
    match?.tournament?.type ||
    "";

  const team1 =
    match?.teamA?.name ||
    "";

  const team2 =
    match?.teamB?.name ||
    "";

  const stadiumName =
    match?.stadium?.name ||
    "";

  return {
    /* KEEP REAL DATABASE ID */
    _id: match?._id,

    matchId:
      match?._id,

    tournament:
      match?.tournament,

    tournamentType,

    date:
      formatMatchDate(
        match?.date
      ),

    rawDate:
      match?.date,

    team1,

    team1Logo:
      getTeamLogo(
        team1,
        tournamentType
      ),

    team2,

    team2Logo:
      getTeamLogo(
        team2,
        tournamentType
      ),

    stadium:
      stadiumName,

    stadiumId:
      match?.stadium?._id ||
      null,

    city:
      match?.stadium?.city ||
      "",

    state:
      match?.stadium?.state ||
      "",

    venue:
      stadiumName,

    time:
      match?.startTime ||
      "7:30 PM",

    ticketPrice:
      Number(
        match?.ticketPrice || 0
      ),

    status:
      match?.status ||
      "upcoming",

    matchNumber:
      match?.matchNumber,
  };
}

/* =====================================================
   COMPONENT
===================================================== */

function Matches({
  onBackToHome,
  onStadium,
}) {
  const [activeLeague, setActiveLeague] =
    useState("IPL");

  const [allMatches, setAllMatches] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD MATCHES FROM BACKEND
  ===================================================== */

  useEffect(() => {
    const loadMatches =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              `${API_URL}/matches`
            );

          const data =
            await response.json();

          console.log(
            "Backend matches:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                data?.error ||
                "Unable to load matches."
            );
          }

          const backendMatches =
            Array.isArray(
              data?.matches
            )
              ? data.matches
              : [];

          const normalizedMatches =
            backendMatches.map(
              normalizeMatch
            );

          console.log(
            "Normalized matches:",
            normalizedMatches
          );

          setAllMatches(
            normalizedMatches
          );

        } catch (err) {
          console.error(
            "Matches loading error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load matches."
          );

          setAllMatches([]);

        } finally {
          setLoading(false);
        }
      };

    loadMatches();
  }, []);

  /* =====================================================
     FILTER BY IPL / WPL
  ===================================================== */

  const matches =
    allMatches.filter(
      (match) =>
        match.tournamentType ===
        activeLeague
    );

  /* =====================================================
     BOOK TICKETS
  ===================================================== */

  const handleBookTickets =
    (match) => {

      if (!match) {
        alert(
          "Match information is missing."
        );

        return;
      }

      if (!match._id) {
        alert(
          "This match does not have a database ID."
        );

        return;
      }

      if (!match.stadium) {
        alert(
          "Stadium information is missing."
        );

        return;
      }

      console.log(
        "================================"
      );

      console.log(
        "MATCHES → STADIUM"
      );

      console.log(
        "REAL MATCH ID:",
        match._id
      );

      console.log(
        "MATCH:",
        match
      );

      console.log(
        "================================"
      );

      /* ---------------------------------------------
         IMPORTANT

         We send the backend match object and a
         frontend-friendly stadium object.

         The real _id is preserved.
      --------------------------------------------- */

      const stadiumData = {
        _id:
          match.stadiumId,

        id:
          match.stadiumId,

        name:
          match.stadium,

        city:
          match.city,

        state:
          match.state,
      };

      if (
        typeof onStadium ===
        "function"
      ) {
        onStadium(
          stadiumData,
          match
        );
      } else {
        console.error(
          "onStadium is not connected."
        );

        alert(
          "Stadium connection is not available."
        );
      }
    };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="matches-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="matches-navbar">

        <div className="matches-logo">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            CricFusion
          </span>

        </div>

        <div className="matches-nav-links">

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();

              if (
                typeof onBackToHome ===
                "function"
              ) {
                onBackToHome();
              }
            }}
          >
            Home
          </a>

          <a
            href="#matches"
            className="active"
          >
            Matches
          </a>

          <a href="#teams">
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

      </nav>

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="matches-header">

        <p className="matches-small-title">
          IPL & WPL
        </p>

        <h1>
          Upcoming{" "}
          <span>Matches</span>
        </h1>

        <p>
          Choose your match and book your perfect seat.
        </p>

      </section>

      {/* =================================================
          LEAGUE BUTTONS
      ================================================= */}

      <div className="league-buttons">

        <button
          type="button"
          className={
            activeLeague === "IPL"
              ? "league-btn active"
              : "league-btn"
          }
          onClick={() =>
            setActiveLeague("IPL")
          }
        >
          🏏 IPL
        </button>

        <button
          type="button"
          className={
            activeLeague === "WPL"
              ? "league-btn active"
              : "league-btn"
          }
          onClick={() =>
            setActiveLeague("WPL")
          }
        >
          🏏 WPL
        </button>

      </div>

      {/* =================================================
          CURRENT LEAGUE
      ================================================= */}

      <div className="current-league">

        <h2>
          {activeLeague} Matches
        </h2>

        <p>
          {activeLeague === "IPL"
            ? "Indian Premier League"
            : "Women's Premier League"}
        </p>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="matches-message">

          <div className="message-icon">
            🏏
          </div>

          <h3>
            Loading matches...
          </h3>

          <p>
            Getting the latest matches from
            CricFusion.
          </p>

        </div>

      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading &&
        error && (

          <div className="matches-message error">

            <div className="message-icon">
              ⚠️
            </div>

            <h3>
              Unable to load matches
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="retry-button"
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </button>

          </div>

        )}

      {/* =================================================
          NO MATCHES
      ================================================= */}

      {!loading &&
        !error &&
        matches.length === 0 && (

          <div className="matches-message">

            <div className="message-icon">
              🏏
            </div>

            <h3>
              No {activeLeague} matches available
            </h3>

            <p>
              There are currently no
              {activeLeague} matches in the
              database.
            </p>

          </div>

        )}

      {/* =================================================
          MATCH CARDS
      ================================================= */}

      {!loading &&
        !error &&
        matches.length > 0 && (

          <section className="matches-container">

            {matches.map(
              (match) => (

                <div
                  className="match-card"
                  key={match._id}
                >

                  {/* STATUS */}

                  <div className="match-status">
                    {String(
                      match.status ||
                        "upcoming"
                    ).toUpperCase()}
                  </div>

                  {/* DATE */}

                  <div className="match-date">

                    {match.date}

                  </div>

                  {/* TEAMS */}

                  <div className="match-teams">

                    {/* TEAM 1 */}

                    <div className="team">

                      <div className="team-logo">

                        {match.team1Logo ? (

                          <img
                            src={
                              match.team1Logo
                            }
                            alt={
                              match.team1
                            }
                          />

                        ) : (

                          <span>
                            🏏
                          </span>

                        )}

                      </div>

                      <h3>
                        {match.team1}
                      </h3>

                    </div>

                    {/* VS */}

                    <div className="vs">
                      VS
                    </div>

                    {/* TEAM 2 */}

                    <div className="team">

                      <div className="team-logo">

                        {match.team2Logo ? (

                          <img
                            src={
                              match.team2Logo
                            }
                            alt={
                              match.team2
                            }
                          />

                        ) : (

                          <span>
                            🏏
                          </span>

                        )}

                      </div>

                      <h3>
                        {match.team2}
                      </h3>

                    </div>

                  </div>

                  {/* MATCH INFO */}

                  <div className="match-info">

                    <span>
                      🏟{" "}
                      {match.stadium}
                    </span>

                    <span>
                      🕗{" "}
                      {match.time}
                    </span>

                  </div>

                  {/* PRICE */}

                  <div className="match-price">

                    <span>
                      From
                    </span>

                    <strong>
                      ₹
                      {Number(
                        match.ticketPrice ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                  {/* BOOK */}

                  <button
                    type="button"
                    className="book-btn"
                    onClick={() =>
                      handleBookTickets(
                        match
                      )
                    }
                  >
                    Book Tickets →
                  </button>

                </div>

              )
            )}

          </section>

        )}

      {/* =================================================
          BACK HOME
      ================================================= */}

      <div className="matches-back">

        <button
          type="button"
          onClick={
            onBackToHome
          }
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Matches;
