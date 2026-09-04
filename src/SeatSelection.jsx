import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./SeatSelection.css";

const API_URL =
  "http://localhost:5000/api";

/* =====================================================
   STADIUM STANDS
   YOUR ORIGINAL DATA
===================================================== */

const stadiumSeatData = {
  "Wankhede Stadium": [
    ["North Stand", 900],
    ["Sunil Gavaskar Stand", 1500],
    ["Vijay Merchant Stand", 2000],
    ["Sachin Tendulkar Stand", 3000],
    ["MCA Stand", 3500],
    ["Vitthal Divecha Stand", 2500],
    ["Garware Stand", 4500],
    ["Grand Stand", 6000],
    ["Garware Pavilion", 8000],
    ["Tata End", 1500],
  ],

  "M. Chinnaswamy Stadium": [
    ["P1 Stand", 2000],
    ["P2 Stand", 2500],
    ["Sun Pharma A Stand", 3750],
    ["Puma B Stand", 3750],
    ["Boat C Stand", 3750],
    ["Confirmtkt D Corporate", 10000],
    ["E Stand", 3750],
    ["Javagal Srinath P1 Annexe", 3750],
    ["Venkatesh Prasad P4", 3750],
    ["Grand Terrace", 4000],
    ["BS Chandrashekhar P Terrace", 7500],
    ["Corporate / Hospitality", 6500],
  ],

  "Rajiv Gandhi International Stadium": [
    ["East Stand", 1500],
    ["North Stand", 2000],
    ["West Stand", 2500],
    ["South Stand", 2000],
    ["Premium Stand", 3500],
    ["North Pavilion", 5000],
    ["South Pavilion", 5000],
    ["Executive Lounge", 7500],
    ["VIP Lounge", 10000],
  ],

  "Arun Jaitley Stadium": [
    ["East Stand", 1400],
    ["North East Stand", 2100],
    ["North Central Stand", 2100],
    ["North West Stand", 2100],
    ["West Stand", 1900],
    ["Virat Kohli Pavilion", 5000],
    ["Willingdon Pavilion", 5000],
    ["Hill A Premium Gallery", 5000],
    ["Old Club House", 7500],
    ["DC Lounge", 10000],
  ],

  "Narendra Modi Stadium": [
    ["Block J Bay 1-5 Upper", 1000],
    ["Block K Bay 1-2 Upper", 1000],
    ["Jio Block L", 1500],
    ["BKT Tyres Blocks Q/R", 1500],
    ["Astral Pipes Block", 1800],
    ["Torrent Group Blocks M/N/P", 1800],
    ["North Gallery", 3000],
    ["South Gallery", 3000],
    ["Grew Solar Block", 3000],
    ["Torrent Group President Gallery", 10000],
    ["VIP Gallery", 12000],
  ],

  "BRSABVE Cricket Stadium": [
    ["East Stand", 1000],
    ["North Stand", 1200],
    ["West Stand", 1500],
    ["South Stand", 1500],
    ["Premium Stand", 2000],
    ["Pavilion", 3500],
    ["Executive Lounge", 5000],
    ["Corporate Box", 7500],
    ["VIP Lounge", 10000],
  ],
};

/* =====================================================
   STADIUM NAME
===================================================== */

function getStadiumName(stadium) {
  if (!stadium) {
    return "Wankhede Stadium";
  }

  if (typeof stadium === "string") {
    const value =
      stadium.toLowerCase();

    if (
      value.includes("wankhede")
    ) {
      return "Wankhede Stadium";
    }

    if (
      value.includes("chinnaswamy") ||
      value.includes("bengaluru") ||
      value.includes("bangalore")
    ) {
      return "M. Chinnaswamy Stadium";
    }

    if (
      value.includes("rajiv gandhi") ||
      value.includes("rajiv-gandhi") ||
      value.includes("hyderabad")
    ) {
      return "Rajiv Gandhi International Stadium";
    }

    if (
      value.includes("arun jaitley") ||
      value.includes("arun-jaitley") ||
      value.includes("delhi")
    ) {
      return "Arun Jaitley Stadium";
    }

    if (
      value.includes("narendra modi") ||
      value.includes("narendra-modi") ||
      value.includes("ahmedabad")
    ) {
      return "Narendra Modi Stadium";
    }

    if (
      value.includes("brsabve") ||
      value.includes("ekana") ||
      value.includes("lucknow")
    ) {
      return "BRSABVE Cricket Stadium";
    }

    return "Wankhede Stadium";
  }

  const combined =
    `
      ${stadium.name || ""}
      ${stadium.stadium || ""}
      ${stadium.address || ""}
      ${stadium.image || ""}
    `.toLowerCase();

  if (
    combined.includes("chinnaswamy") ||
    combined.includes("bengaluru") ||
    combined.includes("bangalore") ||
    combined.includes("cubbon road")
  ) {
    return "M. Chinnaswamy Stadium";
  }

  if (
    combined.includes("wankhede")
  ) {
    return "Wankhede Stadium";
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
    combined.includes("arun-jaitley") ||
    combined.includes("delhi")
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

  return "Wankhede Stadium";
}

/* =====================================================
   SECTION TYPE
===================================================== */

function getSectionType(name) {
  const value =
    name.toLowerCase();

  if (
    value.includes("lounge") ||
    value.includes("corporate") ||
    value.includes("vip") ||
    value.includes("box") ||
    value.includes("club")
  ) {
    return "HOSPITALITY";
  }

  if (
    value.includes("pavilion") ||
    value.includes("gallery") ||
    value.includes("terrace")
  ) {
    return "PREMIUM";
  }

  return "STAND";
}

/* =====================================================
   SECTION CLASS
===================================================== */

function getSectionClass(name) {
  const type =
    getSectionType(name);

  if (
    type === "HOSPITALITY"
  ) {
    return "hospitality";
  }

  if (
    type === "PREMIUM"
  ) {
    return "premium";
  }

  return "regular";
}

/* =====================================================
   STADIUM POSITIONS
===================================================== */

const STADIUM_LAYOUTS = {
  "Wankhede Stadium": [
    270,
    306,
    342,
    18,
    54,
    90,
    126,
    162,
    198,
    234,
  ],

  "M. Chinnaswamy Stadium": [
    270,
    300,
    330,
    0,
    30,
    60,
    90,
    120,
    150,
    180,
    210,
    240,
  ],

  "Rajiv Gandhi International Stadium": [
    270,
    310,
    350,
    30,
    70,
    110,
    150,
    190,
    230,
  ],

  "Arun Jaitley Stadium": [
    270,
    306,
    342,
    18,
    54,
    90,
    126,
    162,
    198,
    234,
  ],

  "Narendra Modi Stadium": [
    270,
    302,
    334,
    6,
    38,
    70,
    102,
    134,
    166,
    198,
    230,
  ],

  "BRSABVE Cricket Stadium": [
    270,
    310,
    350,
    30,
    70,
    110,
    150,
    190,
    230,
  ],
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

function SeatSelection({
  stadium,
  match,
  onBack,
  onContinue,
}) {
  const stadiumName =
    getStadiumName(
      stadium
    );

  const matchId =
    match?._id ||
    match?.id ||
    match?.matchId ||
    null;

  const team1 =
    match?.team1 ||
    match?.teamA?.name ||
    "Team A";

  const team2 =
    match?.team2 ||
    match?.teamB?.name ||
    "Team B";

  const matchName =
    `${team1} vs ${team2}`;

  /* ===================================================
     BUILD STANDS
  =================================================== */

  const rawSections =
    stadiumSeatData[
      stadiumName
    ] || [];

  const sections =
    useMemo(() => {

      const positions =
        STADIUM_LAYOUTS[
          stadiumName
        ] || [];

      return rawSections.map(
        (
          [name, price],
          index
        ) => {

          let angle;

          if (
            positions.length >
            0
          ) {
            angle =
              positions[
                index %
                  positions.length
              ];
          } else {
            angle =
              (360 /
                rawSections.length) *
                index -
              90;
          }

          return {
            name,
            price,
            index,
            angle,
            type:
              getSectionType(
                name
              ),
            className:
              getSectionClass(
                name
              ),
          };

        }
      );

    }, [
      stadiumName,
      rawSections,
    ]);

  /* ===================================================
     STATE
  =================================================== */

  const [
    dbSeats,
    setDbSeats,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    selectedSeats,
    setSelectedSeats,
  ] = useState([]);

  const [
    activeSection,
    setActiveSection,
  ] = useState(null);

  const [
    previewSeat,
    setPreviewSeat,
  ] = useState(null);

  const [
    locking,
    setLocking,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ===================================================
     LOAD MONGODB SEATS
  =================================================== */

  useEffect(() => {

    const loadSeats =
      async () => {

        if (!matchId) {

          setError(
            "Match information is missing."
          );

          setLoading(
            false
          );

          return;
        }

        try {

          setLoading(
            true
          );

          setError("");

          const response =
            await fetch(
              `${API_URL}/seats/match/${matchId}`
            );

          const data =
            await response.json();

          console.log(
            "MONGODB SEATS:",
            data
          );

          if (!response.ok) {
            throw new Error(
              data?.message ||
                "Unable to load seats."
            );
          }

          const seats =
            Array.isArray(
              data?.seats
            )
              ? data.seats
              : [];

          setDbSeats(
            seats
          );

        } catch (
          err
        ) {

          console.error(
            "Seat loading error:",
            err
          );

          setError(
            err?.message ||
              "Unable to load seats."
          );

          setDbSeats([]);

        } finally {

          setLoading(
            false
          );

        }
      };

    loadSeats();

  }, [
    matchId,
  ]);

  /* ===================================================
     SORT DATABASE SEATS
  =================================================== */

  const sortedDbSeats =
    useMemo(() => {

      return [
        ...dbSeats,
      ].sort(
        (
          a,
          b
        ) => {

          const aName =
            String(
              a?.seatNumber ||
                ""
            );

          const bName =
            String(
              b?.seatNumber ||
                ""
            );

          return aName.localeCompare(
            bName,
            undefined,
            {
              numeric: true,
            }
          );

        }
      );

    }, [
      dbSeats,
    ]);

  /* ===================================================
     DISTRIBUTE REAL DB SEATS

     We have real database seats.
     Each stand receives a different chunk.

     This prevents every stand from showing
     the exact same seats.
  =================================================== */

  const seatsBySection =
    useMemo(() => {

      const result = {};

      const standCount =
        sections.length;

      if (
        standCount ===
        0
      ) {
        return result;
      }

      sections.forEach(
        (section) => {

          result[
            section.name
          ] = [];

        }
      );

      sortedDbSeats.forEach(
        (
          seat,
          index
        ) => {

          const sectionIndex =
            index %
            standCount;

          const section =
            sections[
              sectionIndex
            ];

          if (
            section
          ) {

            result[
              section.name
            ].push(
              seat
            );

          }

        }
      );

      return result;

    }, [
      sections,
      sortedDbSeats,
    ]);

  /* ===================================================
     STATUS
  =================================================== */

  const getStatus =
    (seat) => {

      const value =
        String(
          seat?.status ||
            "available"
        )
          .trim()
          .toLowerCase();

      if (
        value ===
          "booked" ||
        value ===
          "occupied" ||
        value ===
          "reserved"
      ) {
        return "booked";
      }

      if (
        value ===
        "locked"
      ) {
        return "locked";
      }

      return "available";
    };

  /* ===================================================
     ID
  =================================================== */

  const getSeatId =
    (seat) =>
      seat?._id ||
      seat?.id ||
      seat?.seatId ||
      null;

  /* ===================================================
     SELECTED CHECK
  =================================================== */

  const checkSelected =
    (seat) => {

      const id =
        getSeatId(
          seat
        );

      return selectedSeats.some(
        (item) =>
          String(
            getSeatId(
              item
            )
          ) ===
          String(id)
      );

    };

  /* ===================================================
     OPEN SECTION
  =================================================== */

  const openSection =
    (section) => {

      setActiveSection(
        section
      );

      setPreviewSeat(
        null
      );

    };

  /* ===================================================
     SEAT CLICK
  =================================================== */

  const handleSeatClick =
    (
      seat,
      section
    ) => {

      const status =
        getStatus(
          seat
        );

      /* ---------------------------------------------
         REAL BOOKED/LOCKED SEATS CANNOT BE SELECTED
      --------------------------------------------- */

      if (
        status !==
        "available"
      ) {
        return;
      }

      const seatId =
        getSeatId(
          seat
        );

      if (!seatId) {

        alert(
          "This seat does not have a database ID."
        );

        return;
      }

      /* ---------------------------------------------
         PREVIEW

         IMPORTANT:
         Use the selected stand price instead of
         the MongoDB seat price.
      --------------------------------------------- */

      setPreviewSeat({

        ...seat,

        section:
          section.name,

        price:
          section.price,

        zoom:
          section.type ===
          "HOSPITALITY"
            ? 1.45
            : section.type ===
              "PREMIUM"
            ? 1.2
            : 1,

      });

      setSelectedSeats(
        (previous) => {

          const exists =
            previous.some(
              (item) =>
                String(
                  getSeatId(
                    item
                  )
                ) ===
                String(
                  seatId
                )
            );

          if (
            exists
          ) {

            return previous.filter(
              (item) =>
                String(
                  getSeatId(
                    item
                  )
                ) !==
                String(
                  seatId
                )
            );

          }

          return [
            ...previous,
            {
              ...seat,

              section:
                section.name,

              /* ---------------------------------
                 IMPORTANT PRICE FIX
                 Every seat in the same stand
                 gets the stand's original price.
              --------------------------------- */

              price:
                section.price,
            },
          ];

        }
      );

    };

  /* ===================================================
     TOTAL
  =================================================== */

  const totalPrice =
    selectedSeats.reduce(
      (
        total,
        seat
      ) =>
        total +
        Number(
          seat?.price ||
            0
        ),
      0
    );

  /* ===================================================
     LOCK + CONTINUE
  =================================================== */

  const handleContinue =
    async () => {

      if (
        selectedSeats.length ===
        0
      ) {

        alert(
          "Please select at least one seat."
        );

        return;
      }

      if (!matchId) {

        alert(
          "Match information is missing."
        );

        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        alert(
          "Please login before continuing."
        );

        return;
      }

      const seatIds =
        selectedSeats
          .map(
            getSeatId
          )
          .filter(Boolean);

      if (
        seatIds.length !==
        selectedSeats.length
      ) {

        alert(
          "One or more selected seats are missing their database ID."
        );

        return;
      }

      try {

        setLocking(
          true
        );

        setError("");

        const response =
          await fetch(
            `${API_URL}/seats/lock`,
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
                  seatIds,
                }),
            }
          );

        const data =
          await response.json();

        console.log(
          "SEAT LOCK RESPONSE:",
          data
        );

        if (!response.ok) {

          throw new Error(
            data?.message ||
              "Unable to reserve selected seats."
          );

        }

        if (
          typeof onContinue ===
          "function"
        ) {

          onContinue({

            stadium,

            stadiumId:
              stadium?._id ||
              stadium?.id ||
              null,

            stadiumName,

            match,

            matchId,

            seats:
              selectedSeats,

            seatIds,

            seatTotal:
              totalPrice,

            total:
              totalPrice,

            lockedUntil:
              data?.lockedUntil ||
              null,

          });

        }

      } catch (
        err
      ) {

        console.error(
          "Seat lock error:",
          err
        );

        setError(
          err?.message ||
            "Unable to reserve selected seats."
        );

      } finally {

        setLocking(
          false
        );

      }

    };

  /* ===================================================
     BACK
  =================================================== */

  const handleBack =
    () => {

      if (
        typeof onBack ===
        "function"
      ) {
        onBack();
      }

    };

  /* ===================================================
     RENDER SEAT
  =================================================== */

  const renderSeat =
    (
      seat,
      section
    ) => {

      if (!seat) {
        return null;
      }

      const status =
        getStatus(
          seat
        );

      const selected =
        checkSelected(
          seat
        );

      let className =
        "individual-seat available";

      if (
        status ===
        "booked"
      ) {

        className =
          "individual-seat booked";

      } else if (
        status ===
        "locked"
      ) {

        className =
          "individual-seat locked";

      } else if (
        selected
      ) {

        className =
          "individual-seat selected";

      }

      return (

        <button
          key={
            String(
              getSeatId(
                seat
              )
            )
          }
          type="button"
          className={`${className} ${section.className}`}
          disabled={
            status !==
            "available"
          }
          onClick={() =>
            handleSeatClick(
              seat,
              section
            )
          }
          title={`${section.name} • ${
            seat?.seatNumber ||
            "Seat"
          } • ${status}`}
        >

          {status ===
          "booked"
            ? "×"
            : seat?.seatNumber}

        </button>

      );

    };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {

    return (

      <div className="seat-page">

        <header className="seat-header">

          <button
            type="button"
            className="seat-back-btn"
            onClick={
              handleBack
            }
          >
            ← Back
          </button>

          <div>

            <p className="seat-small-title">
              SELECT YOUR SEATS
            </p>

            <h1>
              Loading Seats...
            </h1>

            <p className="seat-match-name">
              {matchName}
            </p>

          </div>

        </header>

        <div className="seat-message">

          <h2>
            Loading seats...
          </h2>

          <p>
            Getting live seat availability
            from MongoDB.
          </p>

        </div>

      </div>

    );

  }

  /* ===================================================
     PAGE
  =================================================== */

  return (

    <div className="seat-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="seat-header">

        <button
          type="button"
          className="seat-back-btn"
          onClick={
            handleBack
          }
        >
          ← Back
        </button>

        <div>

          <p className="seat-small-title">
            SELECT YOUR SEATS
          </p>

          <h1>
            {stadiumName}
          </h1>

          <p className="seat-match-name">
            {matchName}
          </p>

        </div>

      </header>

      {/* =================================================
          LEGEND
      ================================================= */}

      <div className="seat-legend">

        <div>

          <span className="legend-dot available" />

          Available

        </div>

        <div>

          <span className="legend-dot limited" />

          Limited

        </div>

        <div>

          <span className="legend-dot premium" />

          Premium

        </div>

        <div>

          <span className="legend-dot booked" />

          Booked

        </div>

        <div>

          <span className="legend-dot selected" />

          Selected

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div
          style={{
            width:
              "86%",
            maxWidth:
              "1100px",
            margin:
              "0 auto 15px",
            padding:
              "12px 16px",
            borderRadius:
              "10px",
            background:
              "#fff1f2",
            color:
              "#b91c1c",
            border:
              "1px solid #fecdd3",
            textAlign:
              "center",
            fontWeight:
              "700",
            fontSize:
              "13px",
          }}
        >
          {error}
        </div>

      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <div className="seat-layout">

        {/* =================================================
            LEFT - CIRCULAR STADIUM
        ================================================= */}

        <section className="stadium-map-card">

          <div className="stadium-map">

            <div className="stadium-outer">

              <div className="stadium-lights" />

              <div className="stadium-seating-ring" />

              {/* FIELD */}

              <div className="field-wrapper">

                <div className="outfield">

                  <div className="boundary-line" />

                  <div className="pitch">

                    <div className="pitch-strip">

                      <div className="crease crease-top" />

                      <div className="crease crease-bottom" />

                      <div className="pitch-middle-line" />

                    </div>

                  </div>

                </div>

              </div>

              {/* STANDS */}

              {sections.map(
                (
                  section
                ) => (

                  <StadiumSection
                    key={
                      section.name
                    }
                    section={
                      section
                    }
                    angle={
                      section.angle
                    }
                    active={
                      activeSection?.name ===
                      section.name
                    }
                    onClick={() =>
                      openSection(
                        section
                      )
                    }
                  />

                )
              )}

            </div>

          </div>

          <div className="stadium-map-note">

            Click any stand, pavilion,
            gallery or lounge to open
            its seats.

          </div>

        </section>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <aside className="seat-sidebar">

          {/* =================================================
              SELECTED STAND SEATS
          ================================================= */}

          {activeSection && (

            <div className="section-seat-card">

              <div className="section-card-header">

                <div>

                  <span>
                    {activeSection.type}
                  </span>

                  <h2>
                    {activeSection.name}
                  </h2>

                </div>

                <strong>
                  ₹
                  {activeSection.price.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <button
                type="button"
                className="close-section"
                onClick={() =>
                  setActiveSection(
                    null
                  )
                }
              >
                ×
              </button>

              <div className="seat-grid">

                {seatsBySection[
                  activeSection.name
                ]?.map(
                  (
                    seat
                  ) =>
                    renderSeat(
                      seat,
                      activeSection
                    )
                )}

              </div>

              {(
                seatsBySection[
                  activeSection.name
                ] || []
              ).length ===
                0 && (

                <p
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "25px",
                  }}
                >
                  No seats available
                  for this stand.
                </p>

              )}

            </div>

          )}

          {/* =================================================
              VIEW FROM YOUR SEAT
          ================================================= */}

          <div className="view-preview">

            <div className="preview-header">

              <h2>
                View From Your Seat
              </h2>

              <span>
                AI PREVIEW
              </span>

            </div>

            <div
              className={`view-image ${
                previewSeat
                  ? "seat-view-active"
                  : ""
              }`}
              style={{
                "--seat-zoom":
                  previewSeat?.zoom ??
                  1,
              }}
            >

              <div className="preview-sky" />

              <div className="sun-glare" />

              <div className="ai-stadium">

                <div className="ai-tier ai-tier-back" />

                <div className="ai-scoreboard" />

                <div className="ai-tier ai-tier-middle" />

                <div className="ai-tier ai-tier-front" />

              </div>

              <div className="ai-floodlight left">

                <span />
                <span />
                <span />
                <span />

              </div>

              <div className="ai-floodlight right">

                <span />
                <span />
                <span />
                <span />

              </div>

              <div className="ai-crowd">

                {Array.from({
                  length: 130,
                }).map(
                  (
                    _,
                    index
                  ) => (

                    <i
                      key={
                        index
                      }
                    />

                  )
                )}

              </div>

              <div className="ai-field">

                <div className="ai-field-lines" />

                <div className="ai-preview-pitch">

                  <span />

                </div>

                <div className="ai-fielders">

                  {Array.from({
                    length: 6,
                  }).map(
                    (
                      _,
                      index
                    ) => (

                      <i
                        key={
                          index
                        }
                      />

                    )
                  )}

                </div>

              </div>

              <div className="ai-seat-row">

                {Array.from({
                  length: 12,
                }).map(
                  (
                    _,
                    index
                  ) => (

                    <i
                      key={
                        index
                      }
                    />

                  )
                )}

              </div>

              <div className="view-vignette" />

              <div className="preview-seat-label">

                {previewSeat
                  ? `${previewSeat.section} • ${previewSeat.seatNumber}`
                  : "SELECT A SEAT"}

              </div>

            </div>

            {!previewSeat ? (

              <p className="view-description">

                Select a stand and choose
                a seat to see an AI-style
                view from that position.

              </p>

            ) : (

              <div className="preview-details">

                <strong>
                  {previewSeat.section}
                </strong>

                <span>
                  Seat{" "}
                  {previewSeat.seatNumber}
                </span>

                <b>
                  ₹
                  {Number(
                    previewSeat.price ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </b>

              </div>

            )}

          </div>

          {/* =================================================
              SELECTED SEATS
          ================================================= */}

          <div className="selected-card">

            <h2>
              🎟️ Selected Seats
            </h2>

            {selectedSeats.length ===
            0 ? (

              <p className="empty-selection">
                No seats selected yet.
              </p>

            ) : (

              <div className="selected-list">

                {selectedSeats.map(
                  (
                    seat
                  ) => (

                    <div
                      className="selected-seat"
                      key={
                        String(
                          getSeatId(
                            seat
                          )
                        )
                      }
                    >

                      <div>

                        <strong>
                          {seat.seatNumber}
                        </strong>

                        <span>
                          {seat.section}
                        </span>

                      </div>

                      <strong>
                        ₹
                        {Number(
                          seat.price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}

            <div className="total-row">

              <span>
                Total
              </span>

              <strong>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <button
              type="button"
              className="continue-seat-btn"
              onClick={
                handleContinue
              }
              disabled={
                locking ||
                selectedSeats.length ===
                  0
              }
            >

              {locking
                ? "Reserving Seats..."
                : "Continue to Parking →"}

            </button>

          </div>

        </aside>

      </div>

    </div>
  );
}

/* =====================================================
   STADIUM SECTION
===================================================== */

function StadiumSection({
  section,
  angle,
  active,
  onClick,
}) {
  const radius =
    39;

  const x =
    50 +
    radius *
      Math.cos(
        (angle *
          Math.PI) /
          180
      );

  const y =
    50 +
    radius *
      Math.sin(
        (angle *
          Math.PI) /
          180
      );

  return (

    <button
      type="button"
      className={`stadium-section ${
        section.className
      } ${
        active
          ? "section-active"
          : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={
        onClick
      }
    >

      <span className="section-type">
        {section.type}
      </span>

      <strong>
        {section.name}
      </strong>

      <small>
        ₹
        {section.price.toLocaleString(
          "en-IN"
        )}
      </small>

    </button>

  );
}

export default SeatSelection;