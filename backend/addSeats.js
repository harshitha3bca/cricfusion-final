
const mongoose = require("mongoose");
require("dotenv").config();

const Match = require("./models/Match");
const Seat = require("./models/Seat");
const Stadium = require("./models/Stadium");

/* =====================================================
   STADIUM STAND DATA
   50 SEATS PER STAND
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
   CREATE STAND CODE
===================================================== */

function makeStandCode(
  standName,
  index
) {
  const cleaned =
    standName
      .replace(
        /[^A-Za-z0-9]/g,
        ""
      )
      .toUpperCase();

  return (
    cleaned.substring(
      0,
      5
    ) ||
    `ST${index + 1}`
  );
}

/* =====================================================
   GENERATE 50 SEATS
   5 ROWS × 10 SEATS
===================================================== */

function generateSeats({
  stadiumId,
  matchId,
  standName,
  price,
  standIndex,
}) {
  const seats = [];

  const rows = [
    "A",
    "B",
    "C",
    "D",
    "E",
  ];

  const standCode =
    makeStandCode(
      standName,
      standIndex
    );

  rows.forEach(
    (row) => {
      for (
        let number = 1;
        number <= 10;
        number++
      ) {
        seats.push({
          stadium:
            stadiumId,

          match:
            matchId,

          seatNumber:
            `${standCode}-${row}${number}`,

          row,

          section:
            standName,

          price,

          status:
            "available",

          lockedBy:
            null,

          lockedUntil:
            null,
        });
      }
    }
  );

  return seats;
}

/* =====================================================
   MAIN
===================================================== */

async function addSeats() {
  try {
    /* -----------------------------------------------
       CONNECT
    ------------------------------------------------ */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from .env"
      );
    }

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected."
    );

    /* -----------------------------------------------
       LOAD MATCHES WITH STADIUM
    ------------------------------------------------ */

    const matches =
      await Match.find().lean();

    console.log(
      `Found ${matches.length} matches.`
    );

    let totalCreated = 0;

    /* -----------------------------------------------
       PROCESS EACH MATCH
    ------------------------------------------------ */

    for (
      const match of matches
    ) {
      if (
        !match.stadium
      ) {
        console.log(
          `Skipping match ${match._id}: stadium missing.`
        );

        continue;
      }

      /* ---------------------------------------------
         FIND STADIUM DOCUMENT
      --------------------------------------------- */

      const stadium =
        await Stadium.findById(
          match.stadium
        ).lean();

      if (!stadium) {
        console.log(
          `Skipping match ${match._id}: stadium document not found.`
        );

        continue;
      }

      const stadiumName =
        stadium.name;

      console.log(
        "\n========================================"
      );

      console.log(
        `Match ID: ${match._id}`
      );

      console.log(
        `Stadium: ${stadiumName}`
      );

      /* ---------------------------------------------
         GET STANDS
      --------------------------------------------- */

      const stands =
        stadiumSeatData[
          stadiumName
        ];

      if (
        !stands ||
        stands.length === 0
      ) {
        console.log(
          `No stand configuration for ${stadiumName}.`
        );

        continue;
      }

      /* ---------------------------------------------
         EXISTING SEATS FOR THIS MATCH
      --------------------------------------------- */

      const existingSeats =
        await Seat.find(
          {
            match:
              match._id,
          },
          {
            seatNumber: 1,
          }
        ).lean();

      const existingNumbers =
        new Set(
          existingSeats.map(
            (
              seat
            ) =>
              seat.seatNumber
          )
        );

      console.log(
        `Existing seats for this match: ${existingSeats.length}`
      );

      /* ---------------------------------------------
         BUILD NEW SEATS
      --------------------------------------------- */

      const seatsToCreate =
        [];

      stands.forEach(
        (
          [
            standName,
            price,
          ],
          standIndex
        ) => {

          const generated =
            generateSeats({
              stadiumId:
                match.stadium,

              matchId:
                match._id,

              standName,

              price,

              standIndex,
            });

          generated.forEach(
            (
              seat
            ) => {

              if (
                !existingNumbers.has(
                  seat.seatNumber
                )
              ) {
                seatsToCreate.push(
                  seat
                );
              }

            }
          );

        }
      );

      /* ---------------------------------------------
         INSERT
      --------------------------------------------- */

      if (
        seatsToCreate.length ===
        0
      ) {

        console.log(
          "All required seats already exist."
        );

        continue;
      }

      const created =
        await Seat.insertMany(
          seatsToCreate,
          {
            ordered:
              false,
          }
        );

      totalCreated +=
        created.length;

      console.log(
        `Created ${created.length} new seats.`
      );

      console.log(
        `Target: ${stands.length} stands × 50 seats = ${stands.length * 50} seats`
      );
    }

    /* -----------------------------------------------
       FINAL
    ------------------------------------------------ */

    const finalCount =
      await Seat.countDocuments();

    console.log(
      "\n========================================"
    );

    console.log(
      `New seats created: ${totalCreated}`
    );

    console.log(
      `Total seats now in database: ${finalCount}`
    );

    console.log(
      "Seat creation completed successfully."
    );

    console.log(
      "========================================"
    );

  } catch (
    error
  ) {

    console.error(
      "\nSeat creation failed:"
    );

    console.error(
      error
    );

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected."
    );

  }
}

addSeats();
