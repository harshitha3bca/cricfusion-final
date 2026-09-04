import React, { useState } from "react";
import SeatSelection from "./SeatSelection.jsx";
import "./StadiumDetails.css";

/* =====================================================
   STADIUM DATA
===================================================== */

const stadiumData = {
  "Wankhede Stadium": {
    image: "/src/assets/stadiums/wankhede.jpg",
    address:
      "D Road, Churchgate, Mumbai, Maharashtra 400020, India",
    parking:
      "Match-day parking arrangements may vary according to event instructions.",
    pitch: "Batting-friendly",
    pitchDescription:
      "Generally known for good batting conditions, with good pace and bounce. Fast bowlers may get some early assistance.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Beverages"],
      ["🛍️", "Team Store"],
    ],
    stands: [
      {
        name: "Sachin Tendulkar Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "Sunil Gavaskar Stand",
        type: "Regular Stand",
        price: 3000,
      },
      {
        name: "Garware Club House",
        type: "Premium / Hospitality",
        price: 6000,
      },
      {
        name: "Grand Stand",
        type: "Premium Stand",
        price: 5000,
      },
    ],
  },

  "M. Chinnaswamy Stadium": {
    image:
      "/src/assets/stadiums/chinnaswamy.jpg",
    address:
      "Cubbon Road, Bengaluru, Karnataka 560001, India",
    parking:
      "Parking arrangements may vary depending on the match and event.",
    pitch: "Batting-friendly",
    pitchDescription:
      "Known for high-scoring matches and generally favorable conditions for stroke-making. The short boundaries can make it a challenging venue for bowlers.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Beverages"],
      ["🏏", "Indoor Training Facility"],
      ["🏋️", "Health Club & Gym"],
    ],
    stands: [
      {
        name: "P1 Stand",
        type: "Regular Stand",
        price: 2000,
      },
      {
        name: "P2 Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "Grand Terrace",
        type: "Premium Stand",
        price: 4000,
      },
      {
        name: "Corporate / Hospitality",
        type: "Hospitality",
        price: 6500,
      },
    ],
  },

  "MA Chidambaram Stadium": {
    image:
      "/src/assets/stadiums/chidambaram.jpg",
    address:
      "Victoria Hostel Road, Chepauk, Chennai, Tamil Nadu 600005, India",
    parking:
      "Parking arrangements depend on match-day and event instructions.",
    pitch: "Spin-friendly",
    pitchDescription:
      "The Chepauk surface is traditionally known for assisting spin bowling, especially as the game progresses. Batters who rotate the strike well can be rewarded.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Beverages"],
      ["🛍️", "Team Store"],
      ["🏟️", "Match-day Facilities"],
    ],
    stands: [
      {
        name: "A Stand",
        type: "Regular Stand",
        price: 2000,
      },
      {
        name: "C Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "I Stand",
        type: "Premium Stand",
        price: 3500,
      },
      {
        name: "K Stand",
        type: "Premium Stand",
        price: 4000,
      },
      {
        name: "Hospitality Lounge",
        type: "Hospitality",
        price: 6500,
      },
    ],
  },

  "Rajiv Gandhi International Stadium": {
    image:
      "/src/assets/stadiums/rajiv-gandhi.jpg",
    address:
      "Uppal, Hyderabad, Telangana, India",
    parking:
      "Parking arrangements depend on the individual match and event.",
    pitch: "Balanced",
    pitchDescription:
      "Generally provides a reasonable contest between bat and ball, with conditions changing during the match.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Beverages"],
    ],
    stands: [
      {
        name: "North Stand",
        type: "Regular Stand",
        price: 1800,
      },
      {
        name: "South Stand",
        type: "Regular Stand",
        price: 2000,
      },
      {
        name: "East Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "West Stand",
        type: "Premium Stand",
        price: 3500,
      },
      {
        name: "Hospitality Lounge",
        type: "Hospitality",
        price: 6000,
      },
    ],
  },

  "Arun Jaitley Stadium": {
    image:
      "/src/assets/stadiums/arun-jaitley.jpg",
    address:
      "Bahadur Shah Zafar Marg, New Delhi, Delhi, India",
    parking:
      "Parking arrangements depend on match-day and event instructions.",
    pitch: "Spin-friendly",
    pitchDescription:
      "The surface can assist spin bowling, particularly as the match progresses. Batters need to adapt to the slower conditions.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Catering"],
    ],
    stands: [
      {
        name: "North Stand",
        type: "Regular Stand",
        price: 1800,
      },
      {
        name: "South Stand",
        type: "Regular Stand",
        price: 2000,
      },
      {
        name: "East Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "West Stand",
        type: "Premium Stand",
        price: 3500,
      },
      {
        name: "Hospitality Lounge",
        type: "Hospitality",
        price: 6000,
      },
    ],
  },

  "Narendra Modi Stadium": {
    image:
      "/src/assets/stadiums/narendra-modi.jpg",
    address:
      "Motera, Ahmedabad, Gujarat, India",
    parking:
      "Match-day parking arrangements depend on the event traffic plan.",
    pitch: "Balanced",
    pitchDescription:
      "Pitch conditions can vary depending on the surface prepared for the match.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food Courts"],
      ["🏢", "Corporate Boxes"],
    ],
    stands: [
      {
        name: "East Stand",
        type: "Regular Stand",
        price: 2000,
      },
      {
        name: "West Stand",
        type: "Regular Stand",
        price: 2500,
      },
      {
        name: "North Stand",
        type: "Premium Stand",
        price: 3500,
      },
      {
        name: "South Stand",
        type: "Premium Stand",
        price: 4000,
      },
      {
        name: "Corporate Box",
        type: "Hospitality",
        price: 7500,
      },
    ],
  },

  "BRSABVE Cricket Stadium": {
    image:
      "/src/assets/stadiums/ekana.jpg",
    address:
      "Ekana Sports City, Lucknow, Uttar Pradesh, India",
    parking:
      "Parking arrangements depend on the individual match and event.",
    pitch: "Bowling-friendly",
    pitchDescription:
      "The surface can provide assistance to bowlers and may become slower as the match progresses.",
    facilities: [
      ["♿", "Wheelchair Access"],
      ["🍴", "Food & Beverages"],
    ],
    stands: [
      {
        name: "North Stand",
        type: "Regular Stand",
        price: 1500,
      },
      {
        name: "South Stand",
        type: "Regular Stand",
        price: 1800,
      },
      {
        name: "East Stand",
        type: "Regular Stand",
        price: 2200,
      },
      {
        name: "West Stand",
        type: "Premium Stand",
        price: 3000,
      },
      {
        name: "Hospitality Lounge",
        type: "Hospitality",
        price: 5500,
      },
    ],
  },
};

/* =====================================================
   GET STADIUM NAME
===================================================== */

function getStadiumName(stadium) {
  if (!stadium) {
    return "";
  }

  if (typeof stadium === "string") {
    return stadium;
  }

  const combined = `
    ${stadium.name || ""}
    ${stadium.stadium || ""}
    ${stadium.address || ""}
    ${stadium.image || ""}
  `.toLowerCase();

  if (
    combined.includes("chinnaswamy") ||
    combined.includes("cubbon road") ||
    combined.includes("bengaluru")
  ) {
    return "M. Chinnaswamy Stadium";
  }

  if (combined.includes("wankhede")) {
    return "Wankhede Stadium";
  }

  if (
    combined.includes("chidambaram") ||
    combined.includes("chepauk") ||
    combined.includes("chennai")
  ) {
    return "MA Chidambaram Stadium";
  }

  if (
    combined.includes("rajiv gandhi") ||
    combined.includes("rajiv-gandhi") ||
    combined.includes("hyderabad")
  ) {
    return "Rajiv Gandhi International Stadium";
  }

  if (
    combined.includes("arun jaitley") ||
    combined.includes("arun-jaitley")
  ) {
    return "Arun Jaitley Stadium";
  }

  if (
    combined.includes("narendra modi") ||
    combined.includes("narendra-modi") ||
    combined.includes("ahmedabad")
  ) {
    return "Narendra Modi Stadium";
  }

  if (
    combined.includes("brsabve") ||
    combined.includes("ekana") ||
    combined.includes("lucknow")
  ) {
    return "BRSABVE Cricket Stadium";
  }

  return (
    stadium.name ||
    stadium.stadium ||
    "Stadium"
  );
}

/* =====================================================
   COMPONENT
===================================================== */

function StadiumDetails({
  stadium,
  match,
  onBack,
  onContinue,
}) {
  const [selectedStand, setSelectedStand] =
    useState(null);

  /* ===================================================
     NO STADIUM
  =================================================== */

  if (!stadium) {
    return (
      <div className="stadium-details-page">
        <button
          type="button"
          className="stadium-back-btn"
          onClick={onBack}
        >
          ← Back to Matches
        </button>

        <div className="stadium-details-container">
          <section className="stadium-info-section">
            <h2>No Stadium Selected</h2>
            <p>Please select a match first.</p>
          </section>
        </div>
      </div>
    );
  }

  const selectedStadium =
    getStadiumName(stadium);

  const stadiumKey =
    selectedStadium.toLowerCase();

  let details = null;

  if (
    stadiumKey.includes("chinnaswamy") ||
    stadiumKey.includes("bengaluru")
  ) {
    details =
      stadiumData[
        "M. Chinnaswamy Stadium"
      ];
  } else if (
    stadiumKey.includes("wankhede")
  ) {
    details =
      stadiumData["Wankhede Stadium"];
  } else if (
    stadiumKey.includes("chidambaram") ||
    stadiumKey.includes("chepauk") ||
    stadiumKey.includes("chennai")
  ) {
    details =
      stadiumData["MA Chidambaram Stadium"];
  } else if (
    stadiumKey.includes("rajiv gandhi")
  ) {
    details =
      stadiumData[
        "Rajiv Gandhi International Stadium"
      ];
  } else if (
    stadiumKey.includes("arun jaitley")
  ) {
    details =
      stadiumData[
        "Arun Jaitley Stadium"
      ];
  } else if (
    stadiumKey.includes("narendra modi")
  ) {
    details =
      stadiumData[
        "Narendra Modi Stadium"
      ];
  } else if (
    stadiumKey.includes("brsabve") ||
    stadiumKey.includes("ekana")
  ) {
    details =
      stadiumData[
        "BRSABVE Cricket Stadium"
      ];
  }

  /* ===================================================
     NOT FOUND
  =================================================== */

  if (!details) {
    return (
      <div className="stadium-details-page">
        <button
          type="button"
          className="stadium-back-btn"
          onClick={onBack}
        >
          ← Back to Matches
        </button>

        <div className="stadium-details-container">
          <section className="stadium-info-section">
            <h2>{selectedStadium}</h2>
            <p>
              Stadium information is not available yet.
            </p>
          </section>
        </div>
      </div>
    );
  }

  /* ===================================================
     OPEN SEAT SELECTION
  =================================================== */

  if (selectedStand) {
    return (
      <SeatSelection
        stadium={details}
        match={match}
        stand={selectedStand}
        onBack={() =>
          setSelectedStand(null)
        }
        onContinue={(seatData) => {
          console.log(
            "Seat selection completed:",
            seatData
          );

          if (onContinue) {
            onContinue({
              ...seatData,
              originalStadium: stadium,
              stadiumId:
                stadium?._id ||
                stadium?.id ||
                null,
              match:
                seatData?.match ||
                match,
            });
          } else {
            alert(
              "Parking connection is not available."
            );
          }
        }}
      />
    );
  }

  /* ===================================================
     PAGE
  =================================================== */

  return (
    <div className="stadium-details-page">

      <button
        type="button"
        className="stadium-back-btn"
        onClick={onBack}
      >
        ← Back to Matches
      </button>

      {/* HERO */}

      <section className="stadium-hero">

        <img
          src={details.image}
          alt={selectedStadium}
          className="stadium-hero-image"
        />

        <div className="stadium-hero-overlay">

          <p>
            STADIUM DETAILS
          </p>

          <h1>
            {selectedStadium}
          </h1>

        </div>

      </section>

      <div className="stadium-details-container">

        {/* ADDRESS */}

        <section className="stadium-info-section">

          <h2>
            📍 Stadium Address
          </h2>

          <p className="stadium-address">
            {details.address}
          </p>

        </section>

        {/* FACILITIES */}

        <section className="stadium-info-section">

          <h2>
            🏟️ Available Facilities
          </h2>

          <div className="facilities-grid">

            {details.facilities.map(
              ([icon, facility], index) => (

                <div
                  className="facility-item"
                  key={index}
                >

                  <span>
                    {icon}
                  </span>

                  <p>
                    {facility}
                  </p>

                </div>

              )
            )}

          </div>

        </section>

        {/* PARKING */}

        <section className="stadium-info-section">

          <h2>
            🅿️ Parking
          </h2>

          <p>
            {details.parking}
          </p>

        </section>

        {/* PITCH */}

        <section className="stadium-info-section">

          <h2>
            🏏 Pitch Information
          </h2>

          <div className="pitch-card">

            <h3>
              {details.pitch}
            </h3>

            <p>
              {details.pitchDescription}
            </p>

          </div>

        </section>

        {/* =================================================
            STANDS & LOUNGES
        ================================================= */}

        <section className="stadium-info-section">

          <div className="stadium-stands-heading">

            <div>

              <h2>
                🎟️ Stands & Lounges
              </h2>

              <p>
                Choose your preferred seating category.
              </p>

            </div>

            <span className="stadium-demo-price">
              Demo prices
            </span>

          </div>

          <div className="stadium-stands-grid">

            {details.stands.map(
              (stand, index) => (

                <div
                  className="stadium-stand-card"
                  key={index}
                >

                  <div className="stadium-stand-top">

                    <div className="stadium-stand-icon">
                      🏟️
                    </div>

                    <div className="stadium-stand-info">

                      <h3>
                        {stand.name}
                      </h3>

                      <p>
                        {stand.type}
                      </p>

                      <strong>

                        ₹
                        {stand.price.toLocaleString(
                          "en-IN"
                        )}

                        <span>
                          / seat
                        </span>

                      </strong>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="stadium-select-seat-btn"
                    onClick={() =>
                      setSelectedStand(
                        stand
                      )
                    }
                  >
                    Select Seats →
                  </button>

                </div>

              )
            )}

          </div>

        </section>

        {/* CONTINUE */}

        <button
          type="button"
          className="stadium-book-btn"
          onClick={() => {

            if (
              details.stands.length > 0
            ) {
              setSelectedStand(
                details.stands[0]
              );
            }

          }}
        >
          Continue to Seat Selection →
        </button>

        <p className="demo-notice">

          Seat availability, prices and layouts
          shown in this prototype are for
          demonstration and are not live ticket
          inventory.

        </p>

      </div>

    </div>
  );
}

export default StadiumDetails;