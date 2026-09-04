import React from "react";
import "./HowItWorks.css";

function HowItWorks({ onBackToHome, onStartBooking }) {
  return (
    <div className="how-page">

      {/* ================= NAVBAR ================= */}

      <nav className="how-navbar">

        <div className="how-logo">

          <img
            src="/cricfusion-logo-transparent.png"
            alt="CricFusion"
          />

          <span>CricFusion</span>

        </div>

        <button
          className="how-home-btn"
          onClick={onBackToHome}
        >
          ← Back to Home
        </button>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="how-header">

        <p>CRICFUSION</p>

        <h1>
          How It <span>Works</span>
        </h1>

        <div>
          Book your favourite cricket match in a few simple steps.
        </div>

      </section>


      {/* ================= STEPS ================= */}

      <section className="how-steps">

        {/* STEP 1 */}

        <div className="how-card">

          <div className="how-number">
            01
          </div>

          <div className="how-icon">
            🏏
          </div>

          <h2>
            Choose IPL or WPL
          </h2>

          <p>
            Select whether you want to explore Indian Premier League
            or Women's Premier League matches.
          </p>

        </div>


        {/* STEP 2 */}

        <div className="how-card">

          <div className="how-number">
            02
          </div>

          <div className="how-icon">
            📅
          </div>

          <h2>
            Select Your Match
          </h2>

          <p>
            Browse upcoming matches and choose the match you want
            to watch.
          </p>

        </div>


        {/* STEP 3 */}

        <div className="how-card">

          <div className="how-number">
            03
          </div>

          <div className="how-icon">
            💺
          </div>

          <h2>
            Choose Your Seat
          </h2>

          <p>
            View the stadium seating layout and select the seats
            that are perfect for you.
          </p>

        </div>


        {/* STEP 4 */}

        <div className="how-card">

          <div className="how-number">
            04
          </div>

          <div className="how-icon">
            🎟️
          </div>

          <h2>
            Book Your Ticket
          </h2>

          <p>
            Confirm your selected seats and complete your ticket
            booking.
          </p>

        </div>


        {/* STEP 5 */}

        <div className="how-card">

          <div className="how-number">
            05
          </div>

          <div className="how-icon">
            💳
          </div>

          <h2>
            Complete Payment
          </h2>

          <p>
            Make your payment securely and receive your booking
            confirmation.
          </p>

        </div>


        {/* STEP 6 */}

        <div className="how-card">

          <div className="how-number">
            06
          </div>

          <div className="how-icon">
            📱
          </div>

          <h2>
            Get Your Digital Ticket
          </h2>

          <p>
            Receive your digital ticket and QR code, ready to use
            on match day.
          </p>

        </div>

      </section>


      {/* ================= BOTTOM ================= */}

      <section className="how-bottom">

        <h2>
          Your Match. Your Seat. <span>Our Fusion.</span>
        </h2>

        <button
          onClick={onStartBooking || onBackToHome}
        >
          Start Booking →
        </button>

      </section>

    </div>
  );
}

export default HowItWorks;