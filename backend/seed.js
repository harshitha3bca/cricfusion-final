
const mongoose = require("mongoose");
require("dotenv").config();

const Tournament = require("./models/Tournament");
const Team = require("./models/Team");
const Stadium = require("./models/Stadium");
const Match = require("./models/Match");
const Seat = require("./models/Seat");
const Parking = require("./models/Parking");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing old demo data...");

    await Seat.deleteMany({});
    await Parking.deleteMany({});
    await Match.deleteMany({});
    await Stadium.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});

    // =========================================
    // TOURNAMENTS
    // =========================================

    const tournaments =
      await Tournament.insertMany([
        {
          name: "Indian Premier League",
          type: "IPL",
          season: 2026,
          status: "upcoming",
        },
        {
          name: "Women's Premier League",
          type: "WPL",
          season: 2026,
          status: "upcoming",
        },
      ]);

    const ipl = tournaments.find(
      (tournament) =>
        tournament.type === "IPL"
    );

    const wpl = tournaments.find(
      (tournament) =>
        tournament.type === "WPL"
    );

    console.log("Tournaments added");

    // =========================================
    // IPL TEAMS
    // =========================================

    const iplTeams =
      await Team.insertMany([
        {
          name: "Chennai Super Kings",
          shortName: "CSK",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg",
        },
        {
          name: "Mumbai Indians",
          shortName: "MI",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
        },
        {
          name: "Royal Challengers Bengaluru",
          shortName: "RCB",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Royal_Challengers_Bengaluru_Logo.svg",
        },
        {
          name: "Kolkata Knight Riders",
          shortName: "KKR",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/6/60/Kolkata_Knight_Riders_Logo.svg",
        },
        {
          name: "Rajasthan Royals",
          shortName: "RR",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg",
        },
        {
          name: "Sunrisers Hyderabad",
          shortName: "SRH",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_Logo.svg",
        },
        {
          name: "Delhi Capitals",
          shortName: "DC",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals_Logo.svg",
        },
        {
          name: "Punjab Kings",
          shortName: "PBKS",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg",
        },
        {
          name: "Gujarat Titans",
          shortName: "GT",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
        },
        {
          name: "Lucknow Super Giants",
          shortName: "LSG",
          tournamentType: "IPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/3/3e/Lucknow_Super_Giants_Logo.svg",
        },
      ]);

    // =========================================
    // WPL TEAMS
    // =========================================

    const wplTeams =
      await Team.insertMany([
        {
          name: "Mumbai Indians",
          shortName: "MI",
          tournamentType: "WPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
        },
        {
          name: "Delhi Capitals",
          shortName: "DC",
          tournamentType: "WPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals_Logo.svg",
        },
        {
          name: "Royal Challengers Bengaluru",
          shortName: "RCB",
          tournamentType: "WPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Royal_Challengers_Bengaluru_Logo.svg",
        },
        {
          name: "UP Warriorz",
          shortName: "UPW",
          tournamentType: "WPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/8/87/UP_Warriorz_logo.svg",
        },
        {
          name: "Gujarat Giants",
          shortName: "GG",
          tournamentType: "WPL",
          logo: "https://upload.wikimedia.org/wikipedia/en/4/4b/Gujarat_Giants_logo.svg",
        },
      ]);

    console.log("Teams added");

    // =========================================
    // STADIUMS
    // =========================================

    const stadiums =
      await Stadium.insertMany([
        {
          name: "M. Chinnaswamy Stadium",
          city: "Bengaluru",
          state: "Karnataka",
          address:
            "MG Road, Bengaluru, Karnataka",
          capacity: 40000,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/9/9b/M._Chinnaswamy_Stadium%2C_Bangalore.jpg",
          description:
            "A famous cricket stadium located in the heart of Bengaluru.",
        },
        {
          name: "Wankhede Stadium",
          city: "Mumbai",
          state: "Maharashtra",
          address:
            "Churchgate, Mumbai, Maharashtra",
          capacity: 33000,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/6/6d/Wankhede_Stadium.jpg",
          description:
            "One of India's iconic cricket venues near Marine Drive.",
        },
        {
          name: "MA Chidambaram Stadium",
          city: "Chennai",
          state: "Tamil Nadu",
          address:
            "Chepauk, Chennai, Tamil Nadu",
          capacity: 50000,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/6/6f/M._A._Chidambaram_Stadium.jpg",
          description:
            "Historic cricket stadium popularly known as Chepauk.",
        },
        {
          name: "Arun Jaitley Stadium",
          city: "New Delhi",
          state: "Delhi",
          address:
            "Bahadur Shah Zafar Marg, New Delhi",
          capacity: 35000,
          image:
            "https://upload.wikimedia.org/wikipedia/commons/1/1e/Arun_Jaitley_Stadium.jpg",
          description:
            "Major cricket venue located in the national capital.",
        },
      ]);

    console.log("Stadiums added");

    // =========================================
    // FIND IPL TEAMS
    // =========================================

    const csk = iplTeams.find(
      (team) =>
        team.shortName === "CSK"
    );

    const miIPL = iplTeams.find(
      (team) =>
        team.shortName === "MI"
    );

    const rcbIPL = iplTeams.find(
      (team) =>
        team.shortName === "RCB"
    );

    const kkr = iplTeams.find(
      (team) =>
        team.shortName === "KKR"
    );

    // =========================================
    // FIND WPL TEAMS
    // =========================================

    const miWPL = wplTeams.find(
      (team) =>
        team.shortName === "MI"
    );

    const dcWPL = wplTeams.find(
      (team) =>
        team.shortName === "DC"
    );

    // =========================================
    // FIND STADIUMS
    // =========================================

    const chinnaswamy =
      stadiums.find(
        (stadium) =>
          stadium.name ===
          "M. Chinnaswamy Stadium"
      );

    const wankhede =
      stadiums.find(
        (stadium) =>
          stadium.name ===
          "Wankhede Stadium"
      );

    const chepauk =
      stadiums.find(
        (stadium) =>
          stadium.name ===
          "MA Chidambaram Stadium"
      );

    const delhiStadium =
      stadiums.find(
        (stadium) =>
          stadium.name ===
          "Arun Jaitley Stadium"
      );

    // =========================================
    // MATCHES
    // =========================================

    const matches =
      await Match.insertMany([
        {
          tournament: ipl._id,
          teamA: rcbIPL._id,
          teamB: csk._id,
          stadium: chinnaswamy._id,
          matchNumber: 1,
          date: new Date("2026-09-05"),
          startTime: "7:30 PM",
          ticketPrice: 750,
          status: "upcoming",
        },
        {
          tournament: ipl._id,
          teamA: miIPL._id,
          teamB: kkr._id,
          stadium: wankhede._id,
          matchNumber: 2,
          date: new Date("2026-09-06"),
          startTime: "7:30 PM",
          ticketPrice: 850,
          status: "upcoming",
        },
        {
          tournament: ipl._id,
          teamA: csk._id,
          teamB: miIPL._id,
          stadium: chepauk._id,
          matchNumber: 3,
          date: new Date("2026-09-08"),
          startTime: "7:30 PM",
          ticketPrice: 900,
          status: "upcoming",
        },
        {
          tournament: wpl._id,
          teamA: miWPL._id,
          teamB: dcWPL._id,
          stadium: delhiStadium._id,
          matchNumber: 1,
          date: new Date("2026-09-12"),
          startTime: "7:30 PM",
          ticketPrice: 500,
          status: "upcoming",
        },
      ]);

    console.log("Matches added");

    // =========================================
    // SEATS
    // =========================================

    const seatData = [];

    for (const match of matches) {
      for (
        let row = 1;
        row <= 5;
        row++
      ) {
        for (
          let number = 1;
          number <= 10;
          number++
        ) {
          seatData.push({
            stadium: match.stadium,
            match: match._id,
            seatNumber:
              `A${row}-${number}`,
            row: `A${row}`,
            section: "General",
            price:
              match.ticketPrice,
            status: "available",
          });
        }
      }
    }

    await Seat.insertMany(
      seatData
    );

    console.log(
      `${seatData.length} seats added`
    );

    // =========================================
    // PARKING
    // =========================================

    const parkingData = [];

    for (const stadium of stadiums) {

      // CAR PARKING
      for (
        let i = 1;
        i <= 10;
        i++
      ) {
        parkingData.push({
          stadium:
            stadium._id,
          slotNumber:
            `C${i}`,
          vehicleType:
            "car",
          price: 200,
          status:
            "available",
        });
      }

      // BIKE PARKING
      for (
        let i = 1;
        i <= 10;
        i++
      ) {
        parkingData.push({
          stadium:
            stadium._id,
          slotNumber:
            `B${i}`,
          vehicleType:
            "bike",
          price: 100,
          status:
            "available",
        });
      }
    }

    await Parking.insertMany(
      parkingData
    );

    console.log(
      `${parkingData.length} parking slots added`
    );

    console.log("");
    console.log(
      "=============================="
    );
    console.log(
      "CricFusion seed completed!"
    );
    console.log(
      "=============================="
    );
    console.log("");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {

    console.error(
      "Seed failed:",
      error
    );

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
