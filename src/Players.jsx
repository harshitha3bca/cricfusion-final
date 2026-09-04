import React, { useEffect, useState } from "react";
import "./Parking.css";

const API_URL = "http://localhost:5000/api";

function Parking({
  stadium,
  match,
  selectedSeats = [],
  bookingData = null,
  onBack,
  onContinue,
}) {
  /* =====================================================
     MATCH ID
  ===================================================== */

  const matchId =
    match?._id ||
    match?.id ||
    match?.matchId ||
    bookingData?.matchId ||
    bookingData?.match?._id ||
    bookingData?.match?.id ||
    null;

  /* =====================================================
     STADIUM ID
  ===================================================== */

  const stadiumId =
    stadium?._id ||
    stadium?.id ||
    stadium?.stadiumId ||
    bookingData?.stadiumId ||
    bookingData?.stadium?._id ||
    bookingData?.stadium?.id ||
    match?.stadium?._id ||
    match?.stadium?.id ||
    bookingData?.match?.stadium?._id ||
    bookingData?.match?.stadium?.id ||
    null;

  /* =====================================================
     STADIUM NAME
  ===================================================== */

  const stadiumName =
    stadium?.name ||
    stadium?.stadium ||
    bookingData?.stadiumName ||
    bookingData?.stadium?.name ||
    match?.stadium?.name ||
    "Stadium";

  /* =====================================================
     MATCH NAME
  ===================================================== */

  const teamA =
    match?.teamA?.name ||
    match?.team1 ||
    bookingData?.match?.teamA?.name ||
    bookingData?.match?.team1 ||
    bookingData?.teamA ||
    "Team A";

  const teamB =
    match?.teamB?.name ||
    match?.team2 ||
    bookingData?.match?.teamB?.name ||
    bookingData?.match?.team2 ||
    bookingData?.teamB ||
    "Team B";

  const matchName = `${teamA} vs ${teamB}`;

  /* =====================================================
     IMPORTANT:
     GET SEATS FROM EITHER PROP OR BOOKING DATA
  ===================================================== */

  const seats =
    Array.isArray(selectedSeats) && selectedSeats.length > 0
      ? selectedSeats
      : Array.isArray(bookingData?.seats)
      ? bookingData.seats
      : [];

  /* =====================================================
     STATE
  ===================================================== */

  const [vehicleType, setVehicleType] =
    useState("car");

  const [parkingSlots, setParkingSlots] =
    useState([]);

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [reserving, setReserving] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     SEAT TOTAL
  ===================================================== */

  const calculatedSeatTotal = seats.reduce(
    (total, seat) =>
      total +
      Number(
        seat?.price ||
          seat?.amount ||
          seat?.seatPrice ||
          0
      ),
    0
  );

  const seatTotal =
    calculatedSeatTotal > 0
      ? calculatedSeatTotal
      : Number(
          bookingData?.seatTotal || 0
        );

  /* =====================================================
     PARKING PRICE
  ===================================================== */

  const parkingPrice =
    Number(
      selectedSlot?.price ||
        selectedSlot?.amount ||
        selectedSlot?.parkingPrice ||
        0
    );

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    seatTotal +
    parkingPrice;

  /* =====================================================
     LOAD PARKING
  ===================================================== */

  useEffect(() => {
    const loadParking = async () => {
      if (!matchId) {
        setError(
          "Match information is missing. Parking cannot be loaded."
        );

        setParkingSlots([]);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setSelectedSlot(null);

        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            `${API_URL}/parking/match/${matchId}`,
            {
              method: "GET",

              headers: {
                "Content-Type":
                  "application/json",

                ...(token
                  ? {
                      Authorization:
                        `Bearer ${token}`,
                    }
                  : {}),
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "PARKING LOAD RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to load parking slots."
          );
        }

        let slots =
          data?.parkingSlots ||
          data?.parking ||
          data?.slots ||
          data?.data ||
          [];

        if (!Array.isArray(slots)) {
          slots = [];
        }

        const filteredSlots =
          slots.filter(
            (slot) => {
              const type =
                String(
                  slot?.vehicleType ||
                    slot?.vehicle ||
                    ""
                ).toLowerCase();

              return (
                !type ||
                type ===
                  vehicleType.toLowerCase()
              );
            }
          );

        setParkingSlots(
          filteredSlots
        );
      } catch (err) {
        console.error(
          "Parking loading error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load parking slots."
        );

        setParkingSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadParking();
  }, [
    matchId,
    vehicleType,
  ]);

  /* =====================================================
     SLOT STATUS
  ===================================================== */

  const getSlotStatus =
    (slot) => {
      const status =
        String(
          slot?.status ||
            slot?.availability ||
            "available"
        ).toLowerCase();

      if (
        status === "booked" ||
        status === "occupied" ||
        status === "unavailable" ||
        status === "reserved"
      ) {
        return "booked";
      }

      return "available";
    };

  /* =====================================================
     SLOT ID
  ===================================================== */

  const getSlotId =
    (slot) =>
      slot?._id ||
      slot?.id ||
      slot?.parkingId ||
      slot?.slotId ||
      null;

  /* =====================================================
     SLOT NAME
  ===================================================== */

  const getSlotName =
    (slot, index) =>
      slot?.slotNumber ||
      slot?.number ||
      slot?.name ||
      `P${index + 1}`;

  /* =====================================================
     SELECT SLOT
  ===================================================== */

  const handleSelectSlot =
    (slot) => {
      if (
        getSlotStatus(slot) !==
        "available"
      ) {
        return;
      }

      setSelectedSlot(slot);
    };

  /* =====================================================
     CONTINUE WITH PARKING
  ===================================================== */

  const handleContinue =
    async () => {
      if (!selectedSlot) {
        alert(
          "Please select a parking slot or choose Skip Parking."
        );
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please login before continuing."
        );
        return;
      }

      if (!matchId) {
        alert(
          "Match information is missing."
        );
        return;
      }

      const parkingId =
        getSlotId(
          selectedSlot
        );

      if (!parkingId) {
        alert(
          "Selected parking slot does not have a database ID."
        );
        return;
      }

      try {
        setReserving(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/parking/reserve`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  parkingId,
                  matchId,
                }),
            }
          );

        const data =
          await response.json();

        console.log(
          "PARKING RESERVE RESPONSE:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Unable to reserve parking slot."
          );
        }

        const reservedParking =
          data?.parking ||
          data?.parkingSlot ||
          data?.slot ||
          selectedSlot;

        const reservedId =
          reservedParking?._id ||
          parkingId;

        const reservedPrice =
          Number(
            reservedParking?.price ||
              reservedParking?.amount ||
              selectedSlot?.price ||
              0
          );

        /* =================================================
           KEEP ALL SEAT DATA
        ================================================= */

        const paymentData = {
          ...(bookingData || {}),

          stadium:
            stadium ||
            bookingData?.stadium ||
            null,

          stadiumId,

          stadiumName,

          match:
            match ||
            bookingData?.match ||
            null,

          matchId,

          teamA,
          teamB,

          seats,

          seatIds:
            seats
              .map(
                (seat) =>
                  seat?._id ||
                  seat?.id ||
                  seat?.seatId
              )
              .filter(Boolean),

          parking: {
            slot:
              reservedParking,

            slotId:
              reservedId,

            vehicleType,

            price:
              reservedPrice,
          },

          parkingSkipped:
            false,

          seatTotal,

          parkingTotal:
            reservedPrice,

          total:
            seatTotal +
            reservedPrice,
        };

        console.log(
          "PARKING → PAYMENT:",
          paymentData
        );

        if (
          typeof onContinue ===
          "function"
        ) {
          onContinue(
            paymentData
          );
        }
      } catch (err) {
        console.error(
          "Parking reservation error:",
          err
        );

        setError(
          err?.message ||
            "Unable to reserve parking slot."
        );
      } finally {
        setReserving(false);
      }
    };

  /* =====================================================
     SKIP PARKING
  ===================================================== */

  const handleSkipParking =
    () => {
      const skipData = {
        ...(bookingData || {}),

        stadium:
          stadium ||
          bookingData?.stadium ||
          null,

        stadiumId,

        stadiumName,

        match:
          match ||
          bookingData?.match ||
          null,

        matchId,

        teamA,
        teamB,

        seats,

        seatIds:
          seats
            .map(
              (seat) =>
                seat?._id ||
                seat?.id ||
                seat?.seatId
            )
            .filter(Boolean),

        parking:
          null,

        parkingSkipped:
          true,

        seatTotal,

        parkingTotal:
          0,

        total:
          seatTotal,
      };

      console.log(
        "SKIP PARKING → PAYMENT:",
        skipData
      );

      if (
        typeof onContinue ===
        "function"
      ) {
        onContinue(
          skipData
        );
      }
    };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack =
    () => {
      if (
        typeof onBack ===
        "function"
      ) {
        onBack();
      }
    };

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="parking-page">

      <header className="parking-header">

        <button
          type="button"
          className="parking-back-btn"
          onClick={
            handleBack
          }
        >
          ← Back to Seats
        </button>

        <div className="parking-header-content">

          <span className="parking-eyebrow">
            PARKING
          </span>

          <h1>
            Reserve Your Parking
          </h1>

          <p>
            {stadiumName}
          </p>

          <small>
            {matchName}
          </small>

        </div>

      </header>

      <main className="parking-container">

        <section className="vehicle-section">

          <div className="section-title">

            <span>
              STEP 1
            </span>

            <h2>
              Choose Vehicle Type
            </h2>

            <p>
              Select the vehicle you are bringing
              to the stadium.
            </p>

          </div>

          <div className="vehicle-options">

            <button
              type="button"
              className={`vehicle-card ${
                vehicleType === "car"
                  ? "vehicle-active"
                  : ""
              }`}
              onClick={() =>
                setVehicleType("car")
              }
            >

              <div className="vehicle-icon">
                🚗
              </div>

              <div>
                <strong>
                  Car
                </strong>

                <span>
                  Four-wheeler parking
                </span>
              </div>

              <div className="vehicle-check">
                {vehicleType === "car"
                  ? "✓"
                  : ""}
              </div>

            </button>

            <button
              type="button"
              className={`vehicle-card ${
                vehicleType === "bike"
                  ? "vehicle-active"
                  : ""
              }`}
              onClick={() =>
                setVehicleType("bike")
              }
            >

              <div className="vehicle-icon">
                🏍️
              </div>

              <div>
                <strong>
                  Bike
                </strong>

                <span>
                  Two-wheeler parking
                </span>
              </div>

              <div className="vehicle-check">
                {vehicleType === "bike"
                  ? "✓"
                  : ""}
              </div>

            </button>

          </div>

        </section>

        <section className="parking-slots-section">

          <div className="parking-section-header">

            <div>

              <span>
                STEP 2
              </span>

              <h2>
                Select Parking Slot
              </h2>

              <p>
                Choose an available slot or skip
                parking.
              </p>

            </div>

            <div className="parking-legend">

              <div>
                <i className="slot-dot available"></i>
                Available
              </div>

              <div>
                <i className="slot-dot selected"></i>
                Selected
              </div>

              <div>
                <i className="slot-dot booked"></i>
                Booked
              </div>

            </div>

          </div>

          {loading && (
            <div className="parking-message">

              <div className="parking-spinner"></div>

              <h3>
                Loading parking slots...
              </h3>

              <p>
                Checking parking for {matchName}.
              </p>

            </div>
          )}

          {!loading && error && (
            <div className="parking-message error-message">

              <div className="message-icon">
                ⚠️
              </div>

              <h3>
                Unable to load parking
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

            </div>
          )}

          {!loading &&
            !error &&
            parkingSlots.length === 0 && (
              <div className="parking-message">

                <div className="message-icon">
                  🅿️
                </div>

                <h3>
                  No parking slots available
                </h3>

                <p>
                  No {vehicleType} parking slots
                  are currently available.
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            parkingSlots.length > 0 && (
              <div className="parking-area">

                <div className="parking-road">
                  <div className="road-line"></div>
                </div>

                <div className="parking-grid">

                  {parkingSlots.map(
                    (slot, index) => {

                      const slotId =
                        getSlotId(slot) ||
                        `slot-${index}`;

                      const slotNumber =
                        getSlotName(
                          slot,
                          index
                        );

                      const status =
                        getSlotStatus(
                          slot
                        );

                      const selected =
                        selectedSlot &&
                        String(
                          getSlotId(
                            selectedSlot
                          )
                        ) ===
                          String(
                            getSlotId(slot)
                          );

                      const price =
                        Number(
                          slot?.price ||
                            slot?.amount ||
                            0
                        );

                      return (
                        <button
                          key={String(slotId)}
                          type="button"
                          className={`
                            parking-slot
                            ${
                              status === "booked"
                                ? "slot-booked"
                                : ""
                            }
                            ${
                              selected
                                ? "slot-selected"
                                : ""
                            }
                          `}
                          disabled={
                            status === "booked" ||
                            reserving
                          }
                          onClick={() =>
                            handleSelectSlot(
                              slot
                            )
                          }
                        >

                          <div className="slot-top">
                            <span>
                              🅿️
                            </span>

                            <strong>
                              {slotNumber}
                            </strong>
                          </div>

                          <div className="slot-vehicle">
                            {vehicleType === "car"
                              ? "🚗"
                              : "🏍️"}
                          </div>

                          <div className="slot-bottom">

                            <span>
                              {status === "booked"
                                ? "Booked"
                                : selected
                                ? "Selected"
                                : "Available"}
                            </span>

                            <strong>
                              ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                        </button>
                      );
                    }
                  )}

                </div>

              </div>
            )}

        </section>

        <section className="parking-summary">

          <div className="summary-left">

            <span>
              STEP 3
            </span>

            <h2>
              Booking Summary
            </h2>

            <p>
              Review your seats and parking
              before payment.
            </p>

          </div>

          <div className="summary-content">

            <div className="summary-row">

              <div>
                <span>
                  Stadium
                </span>

                <strong>
                  {stadiumName}
                </strong>
              </div>

            </div>

            <div className="summary-row">

              <div>
                <span>
                  Match
                </span>

                <strong>
                  {matchName}
                </strong>
              </div>

            </div>

            {/* SELECTED SEATS */}

            <div className="summary-row">

              <div>

                <span>
                  Selected Seats
                </span>

                <strong>

                  {seats.length > 0
                    ? seats
                        .map(
                          (seat) =>
                            seat?.seatNumber ||
                            seat?.label ||
                            seat?.seat ||
                            "Seat"
                        )
                        .join(", ")
                    : "No seats selected"}

                </strong>

              </div>

              <strong>
                ₹
                {seatTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* PARKING */}

            <div className="summary-row">

              <div>

                <span>
                  Parking
                </span>

                <strong>

                  {selectedSlot
                    ? `${getSlotName(
                        selectedSlot,
                        0
                      )} • ${
                        vehicleType === "car"
                          ? "Car"
                          : "Bike"
                      }`
                    : "No parking selected"}

                </strong>

              </div>

              <strong>
                ₹
                {parkingPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            {/* TOTAL */}

            <div className="summary-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "18px",
              }}
            >

              <button
                type="button"
                className="parking-continue-btn"
                onClick={
                  handleContinue
                }
                disabled={
                  !selectedSlot ||
                  reserving
                }
              >
                {reserving
                  ? "Reserving Parking..."
                  : "Continue to Payment →"}
              </button>

              <button
                type="button"
                onClick={
                  handleSkipParking
                }
                disabled={
                  reserving
                }
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  border: "1px solid #7c3aed",
                  borderRadius: "10px",
                  background: "#ffffff",
                  color: "#7c3aed",
                  fontSize: "14px",
                  fontWeight: "800",
                  cursor: reserving
                    ? "not-allowed"
                    : "pointer",
                  opacity: reserving
                    ? 0.6
                    : 1,
                }}
              >
                Skip Parking →
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Parking;