
import React, {
  useEffect,
  useState,
} from "react";

import "./Ticket.css";

const API_URL =
  "http://localhost:5000/api";

function Ticket({
  booking = null,
  onBackToHome,
  onMyBookings,
}) {
  /* =====================================================
     STATE
  ===================================================== */

  const [matchData, setMatchData] =
    useState(
      booking?.match || null
    );

  const [matchLoading, setMatchLoading] =
    useState(false);

  /* =====================================================
     BOOKING MATCH ID
  ===================================================== */

  const matchId =
    booking?.match?._id ||
    booking?.match?.id ||
    booking?.matchId ||
    null;

  /* =====================================================
     LOAD FULL MATCH
     
     This is important because your Booking.populate("match")
     may populate the match document but leave teamA/teamB
     as ObjectIds.
  ===================================================== */

  useEffect(() => {
    const loadMatch = async () => {
      if (!matchId) {
        return;
      }

      /* -----------------------------------------------
         If team names already exist, no need to fetch.
      ------------------------------------------------ */

      const hasTeamNames =
        booking?.match?.teamA?.name &&
        booking?.match?.teamB?.name;

      if (hasTeamNames) {
        setMatchData(
          booking.match
        );

        return;
      }

      try {
        setMatchLoading(true);

        const response =
          await fetch(
            `${API_URL}/matches/${matchId}`
          );

        const data =
          await response.json();

        console.log(
          "TICKET MATCH RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load match information."
          );
        }

        const loadedMatch =
          data?.match ||
          data?.data ||
          data;

        setMatchData(
          loadedMatch
        );

      } catch (error) {
        console.error(
          "Ticket match loading error:",
          error
        );

        setMatchData(
          booking?.match || null
        );

      } finally {
        setMatchLoading(false);
      }
    };

    loadMatch();

  }, [
    matchId,
    booking,
  ]);

  /* =====================================================
     MATCH
  ===================================================== */

  const match =
    matchData ||
    booking?.match ||
    {};

  /* =====================================================
     TEAM NAMES
     
     Supports both:
     teamA.name / teamB.name
     and old:
     team1 / team2
  ===================================================== */

  const teamA =
    match?.teamA?.name ||
    match?.team1 ||
    booking?.teamA?.name ||
    booking?.team1 ||
    "Team A";

  const teamB =
    match?.teamB?.name ||
    match?.team2 ||
    booking?.teamB?.name ||
    booking?.team2 ||
    "Team B";

  /* =====================================================
     MATCH NAME
  ===================================================== */

  const matchName =
    `${teamA} vs ${teamB}`;

  /* =====================================================
     STADIUM
  ===================================================== */

  const stadiumName =
    match?.stadium?.name ||
    booking?.stadiumName ||
    booking?.stadium?.name ||
    "Stadium";

  /* =====================================================
     CITY
  ===================================================== */

  const stadiumCity =
    match?.stadium?.city ||
    booking?.stadium?.city ||
    "";

  /* =====================================================
     DATE
  ===================================================== */

  const formattedDate =
    match?.date
      ? new Date(
          match.date
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "Match Date";

  /* =====================================================
     TIME
  ===================================================== */

  const matchTime =
    match?.startTime ||
    booking?.match?.startTime ||
    "7:30 PM";

  /* =====================================================
     BOOKING ID
  ===================================================== */

  const bookingReference =
    booking?.bookingReference ||
    booking?.bookingId ||
    booking?._id ||
    "CF-BOOKING";

  /* =====================================================
     SEATS
  ===================================================== */

  const seats =
    Array.isArray(
      booking?.seats
    )
      ? booking.seats
      : [];

  /* =====================================================
     PARKING
  ===================================================== */

  const parking =
    booking?.parkingSlot ||
    booking?.parking ||
    null;

  const parkingSlot =
    parking?.slotNumber ||
    parking?.number ||
    parking?.name ||
    null;

  const parkingVehicle =
    parking?.vehicleType ||
    booking?.parkingVehicleType ||
    null;

  /* =====================================================
     AMOUNTS
  ===================================================== */

  const ticketAmount =
    Number(
      booking?.ticketAmount ??
        booking?.seatTotal ??
        0
    );

  const parkingAmount =
    Number(
      booking?.parkingAmount ??
        booking?.parkingTotal ??
        0
    );

  const totalAmount =
    Number(
      booking?.totalAmount ??
        booking?.total ??
        ticketAmount +
          parkingAmount
    );

  /* =====================================================
     QR
  ===================================================== */

  const qrCode =
    booking?.qrCode ||
    "";

  /* =====================================================
     STATUS
  ===================================================== */

  const bookingStatus =
    booking?.status ||
    "confirmed";

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="ticket-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="ticket-header">

        <button
          type="button"
          className="ticket-home-btn"
          onClick={
            onBackToHome
          }
        >
          ← Home
        </button>

        <div className="ticket-brand">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>
            Cric<span>Fusion</span>
          </span>

        </div>

        <button
          type="button"
          className="ticket-bookings-btn"
          onClick={
            onMyBookings
          }
        >
          My Bookings
        </button>

      </header>

      {/* =================================================
          SUCCESS
      ================================================= */}

      <section className="ticket-success">

        <div className="ticket-success-icon">
          ✓
        </div>

        <p>
          PAYMENT SUCCESSFUL
        </p>

        <h1>
          Your Ticket is Confirmed!
        </h1>

        <span>
          {matchLoading
            ? "Loading match information..."
            : `Your ${matchName} booking has been successfully confirmed.`}
        </span>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="ticket-container">

        <div className="ticket-card">

          {/* =================================================
              BOOKING HEADER
          ================================================= */}

          <div className="ticket-top">

            <div>

              <span className="ticket-label">
                BOOKING ID
              </span>

              <h2>
                {bookingReference}
              </h2>

            </div>

            <div className="confirmed-badge">
              {bookingStatus.toUpperCase()}
            </div>

          </div>

          <div className="ticket-divider" />

          {/* =================================================
              MATCH
          ================================================= */}

          <div className="ticket-match">

            <span className="ticket-label">
              MATCH
            </span>

            <h2>

              {matchLoading
                ? "Loading..."
                : teamA}

              <span>
                VS
              </span>

              {matchLoading
                ? "Loading..."
                : teamB}

            </h2>

          </div>

          {/* =================================================
              MATCH INFORMATION
          ================================================= */}

          <div className="ticket-info-grid">

            {/* DATE */}

            <div className="ticket-info-box">

              <span>
                DATE
              </span>

              <strong>
                {formattedDate}
              </strong>

            </div>

            {/* TIME */}

            <div className="ticket-info-box">

              <span>
                TIME
              </span>

              <strong>
                {matchTime}
              </strong>

            </div>

            {/* STADIUM */}

            <div className="ticket-info-box">

              <span>
                STADIUM
              </span>

              <strong>
                {stadiumName}
              </strong>

              {stadiumCity && (
                <small>
                  {stadiumCity}
                </small>
              )}

            </div>

          </div>

          {/* =================================================
              SEATS
          ================================================= */}

          <div className="ticket-section">

            <span className="ticket-label">
              SELECTED SEATS
            </span>

            {seats.length > 0 ? (

              <div className="ticket-seat-list">

                {seats.map(
                  (
                    seat,
                    index
                  ) => (

                    <div
                      className="ticket-seat"
                      key={
                        seat?._id ||
                        seat?.id ||
                        index
                      }
                    >

                      🎟️{" "}

                      {seat?.seatNumber ||
                        seat?.label ||
                        seat?.seat ||
                        `Seat ${index + 1}`}

                    </div>

                  )
                )}

              </div>

            ) : (

              <p>
                No seat information
              </p>

            )}

          </div>

          {/* =================================================
              PARKING
          ================================================= */}

          <div className="ticket-section">

            <span className="ticket-label">
              PARKING
            </span>

            {parkingSlot ? (

              <div className="ticket-parking">

                <strong>
                  🅿️ {parkingSlot}
                </strong>

                <span>
                  {parkingVehicle
                    ? parkingVehicle
                        .charAt(0)
                        .toUpperCase() +
                      parkingVehicle.slice(1)
                    : "Vehicle"}
                </span>

              </div>

            ) : (

              <div className="ticket-no-parking">
                🅿️ Parking not selected
              </div>

            )}

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="ticket-amount-box">

            <div className="ticket-amount-row">

              <span>
                Ticket Amount
              </span>

              <strong>
                ₹
                {ticketAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="ticket-amount-row">

              <span>
                Parking
              </span>

              <strong>
                ₹
                {parkingAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="ticket-total-row">

              <span>
                Total Paid
              </span>

              <strong>
                ₹
                {totalAmount.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

          {/* =================================================
              QR
          ================================================= */}

          <div className="ticket-qr-section">

            <div>

              <span className="ticket-label">
                DIGITAL TICKET
              </span>

              <h3>
                Scan at the stadium
              </h3>

              <p>
                Keep this ticket ready
                on match day.
              </p>

            </div>

            <div className="ticket-qr">

              {qrCode ? (

                <img
                  src={qrCode}
                  alt="Booking QR Code"
                />

              ) : (

                <div className="qr-placeholder">

                  <div className="qr-pattern">
                    ▦
                  </div>

                  <span>
                    QR
                  </span>

                </div>

              )}

            </div>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ticket-footer">

            <span>
              CricFusion
            </span>

            <span>
              IPL • WPL • MATCH DAY
            </span>

          </div>

        </div>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="ticket-actions">

          <button
            type="button"
            onClick={
              onBackToHome
            }
          >
            ← Back to Home
          </button>

          <button
            type="button"
            onClick={
              onMyBookings
            }
          >
            View My Bookings
          </button>

        </div>

      </main>

    </div>
  );
}

export default Ticket;
