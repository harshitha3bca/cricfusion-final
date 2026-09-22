
import React, {
  useEffect,
  useState,
} from "react";

import "./MyBookings.css";

const API_URL =
  "http://localhost:5000/api";

function MyBookings({
  onHome,
  onViewTicket,
}) {
  /* =====================================================
     STATE
  ===================================================== */

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD BOOKINGS
  ===================================================== */

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "Please login to view your bookings."
        );

        setBookings([]);

        return;
      }

      const response =
        await fetch(
          `${API_URL}/bookings/my`,
          {
            method: "GET",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "MY BOOKINGS RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to load bookings."
        );
      }

      setBookings(
        Array.isArray(
          data?.bookings
        )
          ? data.bookings
          : []
      );
    } catch (err) {
      console.error(
        "My bookings error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load your bookings."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {
    loadBookings();
  }, []);

  /* =====================================================
     TEAM NAME
  ===================================================== */

  const getTeamName = (team) => {
    if (!team) {
      return "";
    }

    /*
      If backend has populated the team:
      {
        _id: "...",
        name: "Royal Challengers Bengaluru"
      }
    */

    if (
      typeof team === "object"
    ) {
      return (
        team?.name ||
        team?.teamName ||
        team?.shortName ||
        team?.displayName ||
        team?.title ||
        ""
      );
    }

    /*
      If backend sends a string,
      return it as it is.
    */

    if (
      typeof team === "string"
    ) {
      return team;
    }

    return "";
  };

  /* =====================================================
     MATCH NAME
  ===================================================== */

  const getMatchName = (
    booking
  ) => {
    const match =
      booking?.match || {};

    const teamA =
      getTeamName(
        match?.teamA
      ) ||
      getTeamName(
        match?.team1
      ) ||
      getTeamName(
        match?.homeTeam
      ) ||
      "Team A";

    const teamB =
      getTeamName(
        match?.teamB
      ) ||
      getTeamName(
        match?.team2
      ) ||
      getTeamName(
        match?.awayTeam
      ) ||
      "Team B";

    return `${teamA} vs ${teamB}`;
  };

  /* =====================================================
     STADIUM
  ===================================================== */

  const getStadiumName = (
    booking
  ) => {
    const stadium =
      booking?.match
        ?.stadium;

    if (
      typeof stadium ===
      "string"
    ) {
      return stadium;
    }

    if (
      typeof stadium ===
      "object" &&
      stadium !== null
    ) {
      return (
        stadium?.name ||
        stadium?.stadiumName ||
        stadium?.title ||
        "Stadium"
      );
    }

    return (
      booking?.stadiumName ||
      "Stadium"
    );
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =====================================================
     TIME
  ===================================================== */

  const getTime = (
    booking
  ) => {
    const match =
      booking?.match || {};

    return (
      match?.startTime ||
      match?.time ||
      booking?.startTime ||
      "7:30 PM"
    );
  };

  /* =====================================================
     SEAT NAMES
  ===================================================== */

  const getSeatNames = (
    booking
  ) => {
    if (
      !Array.isArray(
        booking?.seats
      )
    ) {
      return [];
    }

    return booking.seats.map(
      (
        seat,
        index
      ) => {
        if (
          typeof seat ===
          "string"
        ) {
          return seat;
        }

        return (
          seat?.seatNumber ||
          seat?.label ||
          seat?.name ||
          `Seat ${index + 1}`
        );
      }
    );
  };

  /* =====================================================
     PARKING
  ===================================================== */

  const getParkingName = (
    booking
  ) => {
    const parking =
      booking?.parkingSlot;

    if (!parking) {
      return null;
    }

    if (
      typeof parking ===
      "string"
    ) {
      return parking;
    }

    return (
      parking?.slotNumber ||
      parking?.number ||
      parking?.name ||
      "Parking"
    );
  };

  /* =====================================================
     PARKING VEHICLE TYPE
  ===================================================== */

  const getParkingVehicleType = (
    booking
  ) => {
    const parking =
      booking?.parkingSlot;

    if (!parking) {
      return "";
    }

    return (
      parking?.vehicleType ||
      parking?.type ||
      ""
    );
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status ||
          "pending"
      ).toLowerCase();

    if (
      value ===
      "confirmed"
    ) {
      return "status-confirmed";
    }

    if (
      value ===
      "cancelled"
    ) {
      return "status-cancelled";
    }

    return "status-pending";
  };

  /* =====================================================
     VIEW TICKET
  ===================================================== */

  const handleViewTicket =
    (booking) => {
      if (
        typeof onViewTicket ===
        "function"
      ) {
        onViewTicket(
          booking
        );
      }
    };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="my-bookings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="my-bookings-header">

        <button
          type="button"
          className="my-bookings-back"
          onClick={onHome}
        >
          ← Home
        </button>

        <div className="my-bookings-brand">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            Cric<span>Fusion</span>
          </span>

        </div>

        <div className="my-bookings-title-small">
          MY BOOKINGS
        </div>

      </header>

      {/* =================================================
          TITLE
      ================================================= */}

      <section className="my-bookings-hero">

        <span>
          CRICFUSION • YOUR BOOKINGS
        </span>

        <h1>
          My <strong>Bookings</strong>
        </h1>

        <p>
          View your match tickets, selected
          seats and parking details.
        </p>

      </section>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="my-bookings-container">

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="my-bookings-message">

            <div className="booking-spinner"></div>

            <h2>
              Loading your bookings...
            </h2>

            <p>
              Getting your latest booking
              information.
            </p>

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading &&
          error && (

            <div className="my-bookings-message">

              <div className="booking-message-icon">
                ⚠️
              </div>

              <h2>
                Unable to load bookings
              </h2>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={
                  loadBookings
                }
              >
                Try Again
              </button>

            </div>

          )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          bookings.length ===
            0 && (

            <div className="my-bookings-message">

              <div className="booking-message-icon">
                🎟️
              </div>

              <h2>
                No bookings yet
              </h2>

              <p>
                Your confirmed match bookings
                will appear here.
              </p>

            </div>

          )}

        {/* =================================================
            BOOKINGS
        ================================================= */}

        {!loading &&
          !error &&
          bookings.length >
            0 && (

            <div className="booking-list">

              {bookings.map(
                (
                  booking,
                  index
                ) => {

                  const match =
                    booking?.match ||
                    {};

                  const seatNames =
                    getSeatNames(
                      booking
                    );

                  const parkingName =
                    getParkingName(
                      booking
                    );

                  const parkingVehicleType =
                    getParkingVehicleType(
                      booking
                    );

                  const total =
                    Number(
                      booking?.totalAmount ||
                        booking?.total ||
                        0
                    );

                  return (

                    <article
                      className="booking-card"
                      key={
                        booking?._id ||
                        booking?.bookingReference ||
                        index
                      }
                    >

                      {/* ---------------------------------
                          TOP
                      --------------------------------- */}

                      <div className="booking-card-top">

                        <div>

                          <span className="booking-reference-label">
                            BOOKING ID
                          </span>

                          <h2>
                            {booking?.bookingReference ||
                              booking?._id ||
                              "CF-BOOKING"}
                          </h2>

                        </div>

                        <span
                          className={`booking-status ${getStatusClass(
                            booking?.status
                          )}`}
                        >
                          {String(
                            booking?.status ||
                              "pending"
                          ).toUpperCase()}
                        </span>

                      </div>

                      {/* ---------------------------------
                          MATCH
                      --------------------------------- */}

                      <div className="booking-match">

                        <span>
                          MATCH
                        </span>

                        <h3>
                          {getMatchName(
                            booking
                          )}
                        </h3>

                      </div>

                      {/* ---------------------------------
                          DETAILS
                      --------------------------------- */}

                      <div className="booking-details-grid">

                        <div>

                          <span>
                            DATE
                          </span>

                          <strong>
                            {formatDate(
                              match?.date
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            TIME
                          </span>

                          <strong>
                            {getTime(
                              booking
                            )}
                          </strong>

                        </div>

                        <div>

                          <span>
                            STADIUM
                          </span>

                          <strong>
                            {getStadiumName(
                              booking
                            )}
                          </strong>

                        </div>

                      </div>

                      {/* ---------------------------------
                          SEATS
                      --------------------------------- */}

                      <div className="booking-info-row">

                        <div>

                          <span>
                            🎟️ SEATS
                          </span>

                          <strong>

                            {seatNames.length >
                            0
                              ? seatNames.join(
                                  ", "
                                )
                              : "No seats"}

                          </strong>

                        </div>

                      </div>

                      {/* ---------------------------------
                          PARKING
                      --------------------------------- */}

                      <div className="booking-info-row">

                        <div>

                          <span>
                            🅿️ PARKING
                          </span>

                          <strong>

                            {parkingName ||
                              "Parking not selected"}

                          </strong>

                        </div>

                        {parkingVehicleType && (

                          <small>

                            {String(
                              parkingVehicleType
                            )
                              .charAt(0)
                              .toUpperCase() +
                              String(
                                parkingVehicleType
                              ).slice(1)}

                          </small>

                        )}

                      </div>

                      {/* ---------------------------------
                          BOTTOM
                      --------------------------------- */}

                      <div className="booking-card-bottom">

                        <div>

                          <span>
                            TOTAL PAID
                          </span>

                          <strong>
                            ₹
                            {total.toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewTicket(
                              booking
                            )
                          }
                        >
                          View Ticket →
                        </button>

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          )}

      </main>

    </div>
  );
}

export default MyBookings;
