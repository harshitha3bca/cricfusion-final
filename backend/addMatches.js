const mongoose = require("mongoose");
require("dotenv").config();

const Match = require("./models/Match");
const Tournament = require("./models/Tournament");
const Team = require("./models/Team");
const Stadium = require("./models/Stadium");

/* =====================================================
   CONNECT TO DATABASE
===================================================== */

async function connectDB() {
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
}

/* =====================================================
   FIND TEAM
===================================================== */

async function findTeam(name) {
  const team =
    await Team.findOne({
      name,
    });

  if (!team) {
    throw new Error(
      `Team not found: ${name}`
    );
  }

  return team;
}

/* =====================================================
   FIND STADIUM
===================================================== */

async function findStadium(name) {
  const stadium =
    await Stadium.findOne({
      name,
    });

  if (!stadium) {
    throw new Error(
      `Stadium not found: ${name}`
    );
  }

  return stadium;
}

/* =====================================================
   FIND TOURNAMENT
===================================================== */

async function findTournament(type) {
  const tournament =
    await Tournament.findOne({
      type,
      season: 2026,
    });

  if (!tournament) {
    throw new Error(
      `Tournament not found: ${type} 2026`
    );
  }

  return tournament;
}

/* =====================================================
   MATCHES TO ADD
   USING ONLY EXISTING STADIUMS
===================================================== */

const matchDefinitions = [

  /* ===================================================
     IPL
  =================================================== */

  {
    tournament: "IPL",
    matchNumber: 5,
    date: "2026-09-14",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Mumbai Indians",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 850,
  },

  {
    tournament: "IPL",
    matchNumber: 6,
    date: "2026-09-16",
    startTime: "7:30 PM",
    teamA: "Chennai Super Kings",
    teamB: "Kolkata Knight Riders",
    stadium: "MA Chidambaram Stadium",
    ticketPrice: 900,
  },

  {
    tournament: "IPL",
    matchNumber: 7,
    date: "2026-09-18",
    startTime: "7:30 PM",
    teamA: "Delhi Capitals",
    teamB: "Sunrisers Hyderabad",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 800,
  },

  {
    tournament: "IPL",
    matchNumber: 8,
    date: "2026-09-20",
    startTime: "7:30 PM",
    teamA: "Gujarat Titans",
    teamB: "Rajasthan Royals",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 950,
  },

  {
    tournament: "IPL",
    matchNumber: 9,
    date: "2026-09-22",
    startTime: "7:30 PM",
    teamA: "Punjab Kings",
    teamB: "Lucknow Super Giants",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 750,
  },

  {
    tournament: "IPL",
    matchNumber: 10,
    date: "2026-09-24",
    startTime: "7:30 PM",
    teamA: "Mumbai Indians",
    teamB: "Delhi Capitals",
    stadium: "Wankhede Stadium",
    ticketPrice: 850,
  },

  {
    tournament: "IPL",
    matchNumber: 11,
    date: "2026-09-26",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Sunrisers Hyderabad",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 850,
  },

  {
    tournament: "IPL",
    matchNumber: 12,
    date: "2026-09-28",
    startTime: "7:30 PM",
    teamA: "Kolkata Knight Riders",
    teamB: "Rajasthan Royals",
    stadium: "Wankhede Stadium",
    ticketPrice: 800,
  },

  {
    tournament: "IPL",
    matchNumber: 13,
    date: "2026-09-30",
    startTime: "7:30 PM",
    teamA: "Chennai Super Kings",
    teamB: "Royal Challengers Bengaluru",
    stadium: "MA Chidambaram Stadium",
    ticketPrice: 900,
  },

  {
    tournament: "IPL",
    matchNumber: 14,
    date: "2026-10-02",
    startTime: "7:30 PM",
    teamA: "Delhi Capitals",
    teamB: "Punjab Kings",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 800,
  },

  {
    tournament: "IPL",
    matchNumber: 15,
    date: "2026-10-04",
    startTime: "7:30 PM",
    teamA: "Mumbai Indians",
    teamB: "Chennai Super Kings",
    stadium: "Wankhede Stadium",
    ticketPrice: 900,
  },

  {
    tournament: "IPL",
    matchNumber: 16,
    date: "2026-10-06",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Punjab Kings",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 800,
  },

  {
    tournament: "IPL",
    matchNumber: 17,
    date: "2026-10-08",
    startTime: "7:30 PM",
    teamA: "Kolkata Knight Riders",
    teamB: "Delhi Capitals",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 850,
  },

  {
    tournament: "IPL",
    matchNumber: 18,
    date: "2026-10-10",
    startTime: "7:30 PM",
    teamA: "Rajasthan Royals",
    teamB: "Lucknow Super Giants",
    stadium: "MA Chidambaram Stadium",
    ticketPrice: 800,
  },

  /* ===================================================
     WPL
  =================================================== */

  {
    tournament: "WPL",
    matchNumber: 2,
    date: "2026-10-04",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Mumbai Indians",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 600,
  },

  {
    tournament: "WPL",
    matchNumber: 3,
    date: "2026-10-06",
    startTime: "7:30 PM",
    teamA: "Delhi Capitals",
    teamB: "Gujarat Giants",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 550,
  },

  {
    tournament: "WPL",
    matchNumber: 4,
    date: "2026-10-08",
    startTime: "7:30 PM",
    teamA: "UP Warriorz",
    teamB: "Mumbai Indians",
    stadium: "Wankhede Stadium",
    ticketPrice: 500,
  },

  {
    tournament: "WPL",
    matchNumber: 5,
    date: "2026-10-10",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Delhi Capitals",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 600,
  },

  {
    tournament: "WPL",
    matchNumber: 6,
    date: "2026-10-12",
    startTime: "7:30 PM",
    teamA: "Gujarat Giants",
    teamB: "UP Warriorz",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 500,
  },

  {
    tournament: "WPL",
    matchNumber: 7,
    date: "2026-10-14",
    startTime: "7:30 PM",
    teamA: "Mumbai Indians",
    teamB: "Delhi Capitals",
    stadium: "Wankhede Stadium",
    ticketPrice: 550,
  },

  {
    tournament: "WPL",
    matchNumber: 8,
    date: "2026-10-16",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Gujarat Giants",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 550,
  },

  {
    tournament: "WPL",
    matchNumber: 9,
    date: "2026-10-18",
    startTime: "7:30 PM",
    teamA: "UP Warriorz",
    teamB: "Delhi Capitals",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 500,
  },

  {
    tournament: "WPL",
    matchNumber: 10,
    date: "2026-10-20",
    startTime: "7:30 PM",
    teamA: "Mumbai Indians",
    teamB: "Royal Challengers Bengaluru",
    stadium: "MA Chidambaram Stadium",
    ticketPrice: 550,
  },

  {
    tournament: "WPL",
    matchNumber: 11,
    date: "2026-10-22",
    startTime: "7:30 PM",
    teamA: "Delhi Capitals",
    teamB: "UP Warriorz",
    stadium: "Wankhede Stadium",
    ticketPrice: 500,
  },

  {
    tournament: "WPL",
    matchNumber: 12,
    date: "2026-10-24",
    startTime: "7:30 PM",
    teamA: "Gujarat Giants",
    teamB: "Mumbai Indians",
    stadium: "M. Chinnaswamy Stadium",
    ticketPrice: 550,
  },

  {
    tournament: "WPL",
    matchNumber: 13,
    date: "2026-10-26",
    startTime: "7:30 PM",
    teamA: "Royal Challengers Bengaluru",
    teamB: "UP Warriorz",
    stadium: "MA Chidambaram Stadium",
    ticketPrice: 500,
  },

  {
    tournament: "WPL",
    matchNumber: 14,
    date: "2026-10-28",
    startTime: "7:30 PM",
    teamA: "Delhi Capitals",
    teamB: "Gujarat Giants",
    stadium: "Arun Jaitley Stadium",
    ticketPrice: 500,
  },
];

/* =====================================================
   CHECK DUPLICATE
===================================================== */

async function matchAlreadyExists(
  tournamentId,
  matchNumber
) {
  return await Match.findOne({
    tournament:
      tournamentId,

    matchNumber,
  });
}

/* =====================================================
   ADD MATCHES
===================================================== */

async function addMatches() {
  try {
    await connectDB();

    let createdCount = 0;

    for (
      const definition of matchDefinitions
    ) {
      console.log(
        "\n----------------------------------------"
      );

      console.log(
        `${definition.tournament} Match ${definition.matchNumber}`
      );

      /* ---------------------------------------------
         TOURNAMENT
      --------------------------------------------- */

      const tournament =
        await findTournament(
          definition.tournament
        );

      /* ---------------------------------------------
         DUPLICATE CHECK
      --------------------------------------------- */

      const existing =
        await matchAlreadyExists(
          tournament._id,
          definition.matchNumber
        );

      if (existing) {
        console.log(
          "Already exists - skipped."
        );

        continue;
      }

      /* ---------------------------------------------
         TEAM A
      --------------------------------------------- */

      const teamA =
        await findTeam(
          definition.teamA
        );

      /* ---------------------------------------------
         TEAM B
      --------------------------------------------- */

      const teamB =
        await findTeam(
          definition.teamB
        );

      /* ---------------------------------------------
         STADIUM
      --------------------------------------------- */

      const stadium =
        await findStadium(
          definition.stadium
        );

      /* ---------------------------------------------
         CREATE
      --------------------------------------------- */

      await Match.create({

        tournament:
          tournament._id,

        teamA:
          teamA._id,

        teamB:
          teamB._id,

        stadium:
          stadium._id,

        matchNumber:
          definition.matchNumber,

        date:
          new Date(
            definition.date
          ),

        startTime:
          definition.startTime,

        ticketPrice:
          definition.ticketPrice,

        status:
          "upcoming",
      });

      createdCount++;

      console.log(
        `Created: ${definition.teamA} vs ${definition.teamB}`
      );

      console.log(
        `Stadium: ${definition.stadium}`
      );

      console.log(
        `Date: ${definition.date}`
      );
    }

    /* =================================================
       FINAL COUNT
    ================================================= */

    const totalMatches =
      await Match.countDocuments();

    const iplCount =
      await Match.countDocuments({
        tournament: {
          $in: await Tournament.find(
            {
              type: "IPL",
              season: 2026,
            }
          ).distinct("_id"),
        },
      });

    const wplCount =
      await Match.countDocuments({
        tournament: {
          $in: await Tournament.find(
            {
              type: "WPL",
              season: 2026,
            }
          ).distinct("_id"),
        },
      });

    console.log(
      "\n========================================"
    );

    console.log(
      `New matches created: ${createdCount}`
    );

    console.log(
      `Total matches: ${totalMatches}`
    );

    console.log(
      `IPL matches: ${iplCount}`
    );

    console.log(
      `WPL matches: ${wplCount}`
    );

    console.log(
      "========================================"
    );

  } catch (error) {

    console.error(
      "\nFailed to add matches:"
    );

    console.error(
      error.message
    );

  } finally {

    await mongoose.disconnect();

    console.log(
      "MongoDB disconnected."
    );
  }
}

/* =====================================================
   RUN
===================================================== */

addMatches();