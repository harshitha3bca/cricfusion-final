
import React, { useState } from "react";
import "./Payment.css";

const API_URL = "http://localhost:5000/api";

function Payment({
  bookingData = null,
  onBack,
  onSuccess,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [upiId, setUpiId] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [expiry, setExpiry] =
    useState("");

  const [cvv, setCvv] =
    useState("");

  const [cardName, setCardName] =
    useState("");

  const [processing, setProcessing] =
    useState(false);

  const [error, setError] =
    useState("");

  /* =====================================================
     DATA
  ===================================================== */

  const seats =
    Array.isArray(
      bookingData?.seats
    )
      ? bookingData.seats
      : [];

  const parking =
    bookingData?.parking || null;

  const match =
    bookingData?.match || null;

  const matchId =
    bookingData?.matchId ||
    match?._id ||
    match?.id ||
    null;

  const stadiumName =
    bookingData?.stadiumName ||
    bookingData?.stadium?.name ||
    bookingData?.stadium?.stadium ||
    "Stadium";

  const matchName =
    match?.team1 &&
    match?.team2
      ? `${match.team1} vs ${match.team2}`
      : match?.teamA?.name &&
        match?.teamB?.name
      ? `${match.teamA.name} vs ${match.teamB.name}`
      : "IPL / WPL Match";

  /* =====================================================
     SEAT TOTAL
  ===================================================== */

  const calculatedSeatTotal =
    seats.reduce(
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
     PARKING TOTAL
  ===================================================== */

  const parkingTotal =
    Number(
      bookingData?.parkingTotal ||
        parking?.price ||
        parking?.slot?.price ||
        0
    );

  /* =====================================================
     TOTAL
  ===================================================== */

  const total =
    Number(
      bookingData?.total ||
        seatTotal +
          parkingTotal
    );

  /* =====================================================
     TOKEN
  ===================================================== */

  const getToken = () => {
    return localStorage.getItem(
      "token"
    );
  };

  /* =====================================================
     GET REAL SEAT IDS
  ===================================================== */

  const getSeatIds = () => {
    return seats
      .map((seat) =>
        seat?._id ||
        seat?.id ||
        seat?.seatId ||
        null
      )
      .filter(Boolean);
  };

  /* =====================================================
     PARKING ID
  ===================================================== */

  const getParkingId = () => {
    return (
      parking?.slot?._id ||
      parking?.slot?.id ||
      parking?.slotId ||
      null
    );
  };

  /* =====================================================
     FORMAT CARD
  ===================================================== */

  const handleCardNumberChange =
    (e) => {
      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.substring(
          0,
          16
        );

      value =
        value
          .replace(
            /(.{4})/g,
            "$1 "
          )
          .trim();

      setCardNumber(
        value
      );
    };

  /* =====================================================
     EXPIRY
  ===================================================== */

  const handleExpiryChange =
    (e) => {
      let value =
        e.target.value.replace(
          /\D/g,
          ""
        );

      value =
        value.substring(
          0,
          4
        );

      if (
        value.length >= 3
      ) {
        value =
          value.substring(
            0,
            2
          ) +
          "/" +
          value.substring(
            2
          );
      }

      setExpiry(
        value
      );
    };

  /* =====================================================
     CVV
  ===================================================== */

  const handleCvvChange =
    (e) => {
      const value =
        e.target.value
          .replace(
            /\D/g,
            ""
          )
          .substring(
            0,
            3
          );

      setCvv(
        value
      );
    };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validatePayment =
    () => {
      if (!matchId) {
        return "Match information is missing.";
      }

      const seatIds =
        getSeatIds();

      if (
        seatIds.length !==
        seats.length ||
        seatIds.length === 0
      ) {
        return (
          "Selected seats are missing their database IDs. " +
          "The seat selection must use the seats stored in MongoDB."
        );
      }

      if (
        paymentMethod ===
        "upi"
      ) {
        if (
          !upiId.trim()
        ) {
          return "Please enter your UPI ID.";
        }

        if (
          !upiId.includes(
            "@"
          )
        ) {
          return "Please enter a valid UPI ID.";
        }
      }

      if (
        paymentMethod ===
        "card"
      ) {
        const cleanCard =
          cardNumber.replace(
            /\s/g,
            ""
          );

        if (
          cleanCard.length !==
          16
        ) {
          return "Please enter a valid 16-digit card number.";
        }

        if (
          expiry.length !==
          5
        ) {
          return "Please enter the card expiry date.";
        }

        if (
          cvv.length !==
          3
        ) {
          return "Please enter a valid 3-digit CVV.";
        }

        if (
          !cardName.trim()
        ) {
          return "Please enter the name on the card.";
        }
      }

      return "";
    };

  /* =====================================================
     CREATE BOOKING
  ===================================================== */

  const createPendingBooking =
    async () => {
      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Please login before making a booking."
        );
      }

      const seatIds =
        getSeatIds();

      const parkingId =
        getParkingId();

      const requestBody = {
        matchId,
        seatIds,

        ...(parkingId
          ? {
              parkingId,
            }
          : {}),
      };

      console.log(
        "Creating booking with:",
        requestBody
      );

      const response =
        await fetch(
          `${API_URL}/bookings`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              requestBody
            ),
          }
        );

      const data =
        await response.json();

      console.log(
        "Create booking response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create booking."
        );
      }

      if (!data?.booking) {
        throw new Error(
          "Booking was created but no booking data was returned."
        );
      }

      return data.booking;
    };

  /* =====================================================
     CONFIRM BOOKING
  ===================================================== */

  const confirmBooking =
    async (bookingId) => {
      const token =
        getToken();

      const response =
        await fetch(
          `${API_URL}/bookings/${bookingId}/confirm`,
          {
            method: "PUT",

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
        "Confirm booking response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to confirm booking."
        );
      }

      if (!data?.booking) {
        throw new Error(
          "Booking confirmation failed."
        );
      }

      return data.booking;
    };

  /* =====================================================
     PAYMENT
  ===================================================== */

  const handlePayment =
    async (e) => {
      e.preventDefault();

      setError("");

      const validationError =
        validatePayment();

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      try {
        setProcessing(
          true
        );

        /* ---------------------------------------------
           STEP 1
           CREATE PENDING BOOKING
        --------------------------------------------- */

        const pendingBooking =
          await createPendingBooking();

        console.log(
          "Pending booking:",
          pendingBooking
        );

        /* ---------------------------------------------
           STEP 2
           DEMO PAYMENT

           No real money is charged.
        --------------------------------------------- */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              1200
            )
        );

        /* ---------------------------------------------
           STEP 3
           CONFIRM BOOKING
        --------------------------------------------- */

        const confirmedBooking =
          await confirmBooking(
            pendingBooking._id
          );

        console.log(
          "Confirmed booking:",
          confirmedBooking
        );

        /* ---------------------------------------------
           STEP 4
           SEND COMPLETE RESULT TO APP
        --------------------------------------------- */

        if (
          typeof onSuccess ===
          "function"
        ) {
          onSuccess(
            confirmedBooking
          );
        }

      } catch (err) {
        console.error(
          "Payment / booking error:",
          err
        );

        setError(
          err?.message ||
            "Payment failed. Please try again."
        );

      } finally {
        setProcessing(
          false
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
     DISPLAY BOOKING AMOUNT
  ===================================================== */

  const displayTotal =
    total > 0
      ? total
      : seatTotal +
        parkingTotal;

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="payment-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="payment-header">

        <button
          type="button"
          className="payment-back-btn"
          onClick={
            handleBack
          }
          disabled={
            processing
          }
        >
          ← Back to Parking
        </button>

        <div className="payment-header-content">

          <span className="payment-eyebrow">
            SECURE CHECKOUT
          </span>

          <h1>
            Complete Your Payment
          </h1>

          <p>
            Secure your seats and parking
            for match day.
          </p>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="payment-container">

        {/* =================================================
            PAYMENT
        ================================================= */}

        <section className="payment-card">

          <div className="payment-section-title">

            <span>
              PAYMENT METHOD
            </span>

            <h2>
              Choose how to pay
            </h2>

            <p>
              Demo payment — no real money
              will be charged.
            </p>

          </div>

          {/* METHODS */}

          <div className="payment-methods">

            {/* UPI */}

            <button
              type="button"
              className={`payment-method ${
                paymentMethod ===
                "upi"
                  ? "payment-method-active"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod(
                  "upi"
                )
              }
              disabled={
                processing
              }
            >

              <div className="method-icon">
                📱
              </div>

              <div>

                <strong>
                  UPI
                </strong>

                <span>
                  Google Pay, PhonePe, Paytm
                </span>

              </div>

              <div className="method-check">

                {paymentMethod ===
                "upi"
                  ? "✓"
                  : ""}

              </div>

            </button>

            {/* CARD */}

            <button
              type="button"
              className={`payment-method ${
                paymentMethod ===
                "card"
                  ? "payment-method-active"
                  : ""
              }`}
              onClick={() =>
                setPaymentMethod(
                  "card"
                )
              }
              disabled={
                processing
              }
            >

              <div className="method-icon">
                💳
              </div>

              <div>

                <strong>
                  Card
                </strong>

                <span>
                  Credit or Debit Card
                </span>

              </div>

              <div className="method-check">

                {paymentMethod ===
                "card"
                  ? "✓"
                  : ""}

              </div>

            </button>

          </div>

          {/* ERROR */}

          {error && (

            <div className="payment-error">
              ⚠️ {error}
            </div>

          )}

          {/* FORM */}

          <form
            className="payment-form"
            onSubmit={
              handlePayment
            }
          >

            {/* UPI */}

            {paymentMethod ===
              "upi" && (

              <div className="payment-input-group">

                <label htmlFor="upi">
                  UPI ID
                </label>

                <input
                  id="upi"
                  type="text"
                  placeholder="demo@upi"
                  value={
                    upiId
                  }
                  onChange={(
                    e
                  ) =>
                    setUpiId(
                      e.target.value
                    )
                  }
                  disabled={
                    processing
                  }
                />

                <small>
                  Demo example: demo@upi
                </small>

              </div>

            )}

            {/* CARD */}

            {paymentMethod ===
              "card" && (

              <>

                <div className="payment-input-group">

                  <label htmlFor="cardName">
                    Name on Card
                  </label>

                  <input
                    id="cardName"
                    type="text"
                    placeholder="Card holder name"
                    value={
                      cardName
                    }
                    onChange={(
                      e
                    ) =>
                      setCardName(
                        e.target.value
                      )
                    }
                    disabled={
                      processing
                    }
                  />

                </div>

                <div className="payment-input-group">

                  <label htmlFor="cardNumber">
                    Card Number
                  </label>

                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={
                      cardNumber
                    }
                    onChange={
                      handleCardNumberChange
                    }
                    disabled={
                      processing
                    }
                  />

                </div>

                <div className="payment-form-row">

                  <div className="payment-input-group">

                    <label htmlFor="expiry">
                      Expiry
                    </label>

                    <input
                      id="expiry"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={
                        expiry
                      }
                      onChange={
                        handleExpiryChange
                      }
                      disabled={
                        processing
                      }
                    />

                  </div>

                  <div className="payment-input-group">

                    <label htmlFor="cvv">
                      CVV
                    </label>

                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={
                        cvv
                      }
                      onChange={
                        handleCvvChange
                      }
                      disabled={
                        processing
                      }
                    />

                  </div>

                </div>

              </>

            )}

            {/* PAY */}

            <button
              type="submit"
              className="pay-now-btn"
              disabled={
                processing
              }
            >

              {processing
                ? "Processing Booking..."
                : `Pay ₹${displayTotal.toLocaleString(
                    "en-IN"
                  )}`}

              {!processing && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>

          {/* SECURITY */}

          <div className="payment-security">

            <span>
              🔒
            </span>

            <div>

              <strong>
                Secure Demo Payment
              </strong>

              <p>
                The payment is simulated.
                Your booking is saved through
                the CricFusion backend.
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <aside className="payment-summary">

          <div className="summary-badge">
            YOUR ORDER
          </div>

          <h2>
            Booking Summary
          </h2>

          {/* MATCH */}

          <div className="payment-summary-block">

            <span>
              MATCH
            </span>

            <strong>
              {matchName}
            </strong>

          </div>

          {/* STADIUM */}

          <div className="payment-summary-block">

            <span>
              STADIUM
            </span>

            <strong>
              {stadiumName}
            </strong>

          </div>

          {/* SEATS */}

          <div className="payment-summary-block">

            <span>
              SELECTED SEATS
            </span>

            {seats.length >
            0 ? (

              <div className="payment-seat-list">

                {seats.map(
                  (
                    seat,
                    index
                  ) => (

                    <div
                      key={
                        seat?._id ||
                        seat?.id ||
                        seat?.seat ||
                        index
                      }
                    >

                      <span>
                        {seat?.label ||
                          seat?.seatNumber ||
                          seat?.seat ||
                          seat?.number ||
                          `Seat ${
                            index + 1
                          }`}
                      </span>

                      <strong>
                        ₹
                        {Number(
                          seat?.price ||
                            seat?.amount ||
                            seat?.seatPrice ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

            ) : (

              <strong>
                No seats selected
              </strong>

            )}

          </div>

          {/* PARKING */}

          <div className="payment-summary-block">

            <span>
              PARKING
            </span>

            {parking ? (

              <div className="payment-parking-info">

                <strong>
                  {parking?.slot?.slotNumber ||
                    parking?.slot?.number ||
                    parking?.slot?.name ||
                    parking?.slotId ||
                    "Parking Slot"}
                </strong>

                <span>
                  {parking?.vehicleType ===
                  "bike"
                    ? "Bike"
                    : "Car"}
                </span>

              </div>

            ) : (

              <strong>
                No parking selected
              </strong>

            )}

          </div>

          {/* TOTAL */}

          <div className="payment-total-box">

            <div>

              <span>
                Seats
              </span>

              <strong>
                ₹
                {seatTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div>

              <span>
                Parking
              </span>

              <strong>
                ₹
                {parkingTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="payment-grand-total">

              <span>
                Total
              </span>

              <strong>
                ₹
                {displayTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Payment;
