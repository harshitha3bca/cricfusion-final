const mongoose = require("mongoose");
require("dotenv").config();

const Tournament = require("./models/Tournament");
const Team = require("./models/Team");
const Stadium = require("./models/Stadium");
const Match = require("./models/Match");
const Seat = require("./models/Seat");
const Parking = require("./models/Parking");

// =====================================================
// MONGODB CONNECTION
// =====================================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// =====================================================
// MAIN SEED FUNCTION
// =====================================================

const seedData = async () => {
  try {
    await connectDB();

    console.log("Clearing old CricFusion data...");

    await Seat.deleteMany({});
    await Parking.deleteMany({});
    await Match.deleteMany({});
    await Stadium.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});

    // =====================================================
    // TOURNAMENTS
    // =====================================================

    const tournaments = await Tournament.insertMany([
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

    const ipl = tournaments.find((item) => item.type === "IPL");
    const wpl = tournaments.find((item) => item.type === "WPL");

    // =====================================================
    // IPL TEAMS
    // =====================================================

    const iplTeams = await Team.insertMany([
      {
        name: "Chennai Super Kings",
        shortName: "CSK",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg",
      },
      {
        name: "Mumbai Indians",
        shortName: "MI",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
      },
      {
        name: "Royal Challengers Bengaluru",
        shortName: "RCB",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/4/4f/Royal_Challengers_Bengaluru_Logo.svg",
      },
      {
        name: "Kolkata Knight Riders",
        shortName: "KKR",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/6/60/Kolkata_Knight_Riders_Logo.svg",
      },
      {
        name: "Rajasthan Royals",
        shortName: "RR",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg",
      },
      {
        name: "Sunrisers Hyderabad",
        shortName: "SRH",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_Logo.svg",
      },
      {
        name: "Delhi Capitals",
        shortName: "DC",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals_Logo.svg",
      },
      {
        name: "Punjab Kings",
        shortName: "PBKS",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg",
      },
      {
        name: "Gujarat Titans",
        shortName: "GT",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg",
      },
      {
        name: "Lucknow Super Giants",
        shortName: "LSG",
        tournamentType: "IPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/3/3e/Lucknow_Super_Giants_Logo.svg",
      },
    ]);

    // =====================================================
    // WPL TEAMS
    // =====================================================

    const wplTeams = await Team.insertMany([
      {
        name: "Mumbai Indians",
        shortName: "MI",
        tournamentType: "WPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg",
      },
      {
        name: "Delhi Capitals",
        shortName: "DC",
        tournamentType: "WPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals_Logo.svg",
      },
      {
        name: "Royal Challengers Bengaluru",
        shortName: "RCB",
        tournamentType: "WPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/4/4f/Royal_Challengers_Bengaluru_Logo.svg",
      },
      {
        name: "UP Warriorz",
        shortName: "UPW",
        tournamentType: "WPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/8/87/UP_Warriorz_logo.svg",
      },
      {
        name: "Gujarat Giants",
        shortName: "GG",
        tournamentType: "WPL",
        logo:
          "https://upload.wikimedia.org/wikipedia/en/4/4b/Gujarat_Giants_logo.svg",
      },
    ]);

    // =====================================================
    // 13 STADIUMS
    // =====================================================

    const stadiums = await Stadium.insertMany([
      {
        name: "M. Chinnaswamy Stadium",
        city: "Bengaluru",
        state: "Karnataka",
        address: "MG Road, Bengaluru, Karnataka",
        capacity: 40000,
        image: "chinnaswamy.jpg",
        description:
          "M. Chinnaswamy Stadium is the home ground of Royal Challengers Bengaluru and one of India's most iconic cricket venues.",
      },
      {
        name: "Wankhede Stadium",
        city: "Mumbai",
        state: "Maharashtra",
        address: "Churchgate, Mumbai, Maharashtra",
        capacity: 33108,
        image: "wankhede.jpg",
        description:
          "Wankhede Stadium is one of India's most famous cricket grounds and the home venue of Mumbai Indians.",
      },
      {
        name: "MA Chidambaram Stadium",
        city: "Chennai",
        state: "Tamil Nadu",
        address: "Chepauk, Chennai, Tamil Nadu",
        capacity: 38000,
        image: "chidambaram.jpg",
        description:
          "MA Chidambaram Stadium, popularly known as Chepauk, is the historic home ground of Chennai Super Kings.",
      },
      {
        name: "Arun Jaitley Stadium",
        city: "New Delhi",
        state: "Delhi",
        address: "Bahadur Shah Zafar Marg, New Delhi",
        capacity: 35200,
        image: "arun-jaitley.jpg",
        description:
          "Arun Jaitley Stadium is a historic cricket venue located in the national capital.",
      },
      {
        name: "Eden Gardens",
        city: "Kolkata",
        state: "West Bengal",
        address: "BBD Bagh, Kolkata, West Bengal",
        capacity: 68000,
        image: "eden-gardens.jpg",
        description:
          "Eden Gardens is one of India's oldest and most iconic cricket stadiums.",
      },
      {
        name: "Narendra Modi Stadium",
        city: "Ahmedabad",
        state: "Gujarat",
        address: "Motera, Ahmedabad, Gujarat",
        capacity: 132000,
        image: "narendra-modi.jpg",
        description:
          "Narendra Modi Stadium in Ahmedabad is one of India's largest cricket venues.",
      },
      {
        name: "Rajiv Gandhi International Cricket Stadium",
        city: "Hyderabad",
        state: "Telangana",
        address: "Uppal, Hyderabad, Telangana",
        capacity: 55000,
        image: "rajiv-gandhi.jpg",
        description:
          "Rajiv Gandhi International Cricket Stadium is the home ground of Sunrisers Hyderabad.",
      },
      {
        name:
          "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium",
        city: "Lucknow",
        state: "Uttar Pradesh",
        address: "Gomti Nagar, Lucknow, Uttar Pradesh",
        capacity: 50000,
        image: "ekana.jpg",
        description:
          "Ekana Cricket Stadium is a major cricket venue and home ground of Lucknow Super Giants.",
      },
      {
        name: "Maharaja Yadavindra Singh International Cricket Stadium",
        city: "Mullanpur",
        state: "Punjab",
        address: "Mullanpur, New Chandigarh, Punjab",
        capacity: 38000,
        image: "maharaja-yadavindra-singh.jpg",
        description:
          "Maharaja Yadavindra Singh International Cricket Stadium is a modern cricket venue in Punjab.",
      },
      {
        name: "Sawai Mansingh Stadium",
        city: "Jaipur",
        state: "Rajasthan",
        address: "Bajaj Nagar, Jaipur, Rajasthan",
        capacity: 30000,
        image: "sawai-mansingh.jpg",
        description:
          "Sawai Mansingh Stadium is the home ground of Rajasthan Royals.",
      },
      {
        name: "Himachal Pradesh Cricket Association Stadium",
        city: "Dharamshala",
        state: "Himachal Pradesh",
        address: "Dharamshala, Himachal Pradesh",
        capacity: 21200,
        image: "dharamshala.jpg",
        description:
          "HPCA Stadium in Dharamshala is one of India's most scenic cricket grounds.",
      },
      {
        name: "Barsapara Cricket Stadium",
        city: "Guwahati",
        state: "Assam",
        address: "Barsapara, Guwahati, Assam",
        capacity: 46000,
        image: "barsapara.jpg",
        description:
          "Barsapara Cricket Stadium is a major cricket venue in Assam.",
      },
      {
        name:
          "Shaheed Veer Narayan Singh International Cricket Stadium",
        city: "Raipur",
        state: "Chhattisgarh",
        address: "Naya Raipur, Chhattisgarh",
        capacity: 65000,
        image: "shaheed.jpg",
        description:
          "Shaheed Veer Narayan Singh International Cricket Stadium is a major cricket stadium in Raipur.",
      },
    ]);

    // =====================================================
    // TEAM HELPERS
    // =====================================================

    const findIPL = (shortName) =>
      iplTeams.find((team) => team.shortName === shortName);

    const findWPL = (shortName) =>
      wplTeams.find((team) => team.shortName === shortName);

    // =====================================================
    // STADIUM HELPER
    // =====================================================

    const findStadium = (name) =>
      stadiums.find((stadium) => stadium.name === name);

    // =====================================================
    // MATCHES - ALL 13 STADIUMS
    // =====================================================
    //
    // parkingMode:
    //
    // prebooking  = online parking slot booking
    // designated  = designated/event parking, no slot booking
    // firstCome   = first-come-first-served parking
    // unavailable = parking unavailable
    //
    // =====================================================

    const matchDefinitions = [
      // ===================================================
      // 1 - M. CHINNASWAMY STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("RCB"),
        teamB: findIPL("CSK"),
        stadium: findStadium("M. Chinnaswamy Stadium"),
        matchNumber: 1,
        date: "2026-10-01",
        startTime: "7:30 PM",
        ticketPrice: 1500,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 2 - WANKHEDE STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("MI"),
        teamB: findIPL("KKR"),
        stadium: findStadium("Wankhede Stadium"),
        matchNumber: 2,
        date: "2026-10-02",
        startTime: "7:30 PM",
        ticketPrice: 1800,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 3 - MA CHIDAMBARAM STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("CSK"),
        teamB: findIPL("MI"),
        stadium: findStadium("MA Chidambaram Stadium"),
        matchNumber: 3,
        date: "2026-10-03",
        startTime: "7:30 PM",
        ticketPrice: 2000,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 4 - ARUN JAITLEY STADIUM
      // ===================================================
      {
        tournament: wpl,
        teamA: findWPL("DC"),
        teamB: findWPL("RCB"),
        stadium: findStadium("Arun Jaitley Stadium"),
        matchNumber: 1,
        date: "2026-10-04",
        startTime: "7:30 PM",
        ticketPrice: 1500,
        parkingMode: "designated",
      },

      // ===================================================
      // 5 - EDEN GARDENS
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("KKR"),
        teamB: findIPL("RR"),
        stadium: findStadium("Eden Gardens"),
        matchNumber: 4,
        date: "2026-10-05",
        startTime: "7:30 PM",
        ticketPrice: 2000,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 6 - NARENDRA MODI STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("GT"),
        teamB: findIPL("SRH"),
        stadium: findStadium("Narendra Modi Stadium"),
        matchNumber: 5,
        date: "2026-10-06",
        startTime: "7:30 PM",
        ticketPrice: 2200,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 7 - RAJIV GANDHI INTERNATIONAL CRICKET STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("SRH"),
        teamB: findIPL("PBKS"),
        stadium: findStadium(
          "Rajiv Gandhi International Cricket Stadium"
        ),
        matchNumber: 6,
        date: "2026-10-07",
        startTime: "7:30 PM",
        ticketPrice: 1700,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 8 - EKANA CRICKET STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("LSG"),
        teamB: findIPL("GT"),
        stadium: findStadium(
          "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium"
        ),
        matchNumber: 7,
        date: "2026-10-08",
        startTime: "7:30 PM",
        ticketPrice: 1600,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 9 - MAHARAJA YADAVINDRA SINGH STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("PBKS"),
        teamB: findIPL("RCB"),
        stadium: findStadium(
          "Maharaja Yadavindra Singh International Cricket Stadium"
        ),
        matchNumber: 8,
        date: "2026-10-09",
        startTime: "7:30 PM",
        ticketPrice: 1500,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 10 - SAWAI MANSINGH STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("RR"),
        teamB: findIPL("KKR"),
        stadium: findStadium("Sawai Mansingh Stadium"),
        matchNumber: 9,
        date: "2026-10-10",
        startTime: "7:30 PM",
        ticketPrice: 1600,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 11 - HPCA STADIUM
      // ===================================================
      {
        tournament: wpl,
        teamA: findWPL("RCB"),
        teamB: findWPL("UPW"),
        stadium: findStadium(
          "Himachal Pradesh Cricket Association Stadium"
        ),
        matchNumber: 2,
        date: "2026-10-11",
        startTime: "7:30 PM",
        ticketPrice: 1500,
        parkingMode: "designated",
      },

      // ===================================================
      // 12 - BARSAPARA CRICKET STADIUM
      // ===================================================
      {
        tournament: wpl,
        teamA: findWPL("MI"),
        teamB: findWPL("GG"),
        stadium: findStadium("Barsapara Cricket Stadium"),
        matchNumber: 3,
        date: "2026-10-12",
        startTime: "7:30 PM",
        ticketPrice: 1500,
        parkingMode: "prebooking",
      },

      // ===================================================
      // 13 - SHAHEED VEER NARAYAN SINGH STADIUM
      // ===================================================
      {
        tournament: ipl,
        teamA: findIPL("DC"),
        teamB: findIPL("LSG"),
        stadium: findStadium(
          "Shaheed Veer Narayan Singh International Cricket Stadium"
        ),
        matchNumber: 10,
        date: "2026-10-13",
        startTime: "7:30 PM",
        ticketPrice: 1700,
        parkingMode: "prebooking",
      },
    ];

    // =====================================================
    // INSERT MATCHES
    // =====================================================

    const matches = await Match.insertMany(
      matchDefinitions.map((item) => ({
        tournament: item.tournament._id,
        teamA: item.teamA._id,
        teamB: item.teamB._id,
        stadium: item.stadium._id,
        matchNumber: item.matchNumber,
        date: new Date(item.date),
        startTime: item.startTime,
        ticketPrice: item.ticketPrice,
        status: "upcoming",

        // IMPORTANT:
        // Save parking arrangement into MongoDB
        parkingMode: item.parkingMode || "designated",
      }))
    );

    console.log("");
    console.log("===============================================");
    console.log("MATCH PARKING MODES");
    console.log("===============================================");

    matches.forEach((match, index) => {
      console.log(
        `Match ${index + 1}: ${match.parkingMode}`
      );
    });

    // =====================================================
    // 2026 STADIUM SECTION / STAND INVENTORY
    // =====================================================

    const stadiumSections = {
      // ===================================================
      // 1. M. CHINNASWAMY STADIUM
      // ===================================================

      "M. Chinnaswamy Stadium": [
        ["A Stand", 1500, "A", 8, 20],
        ["B Stand", 1500, "B", 8, 20],
        ["C Stand", 1500, "C", 8, 20],

        ["D Corporate", 3000, "DC", 6, 15],
        ["D Loft", 3000, "DL", 6, 15],

        ["E Executive Lounge", 5000, "EL", 5, 12],
        ["E Stand", 1800, "E", 8, 20],

        ["F - Block 1", 1800, "F1", 8, 20],
        ["F - Block 2", 1800, "F2", 8, 20],

        ["Grand Terrace", 5000, "GT", 8, 20],
        ["H Upper", 1800, "H", 8, 20],
        ["M1", 2000, "M1", 8, 20],

        ["Diamond Box", 8000, "DB", 5, 12],
      ],

      // ===================================================
      // 2. WANKHEDE STADIUM
      // ===================================================

      "Wankhede Stadium": [
        ["Sunil Gavaskar Stand", 2500, "SG", 10, 22],
        ["North Stand", 1500, "NS", 8, 20],
        ["Vijay Merchant Stand", 2500, "VM", 10, 22],
        ["Sachin Tendulkar Stand", 3000, "ST", 10, 22],
        ["MCA Stand", 4000, "MCA", 8, 20],
        ["Vitthal Divecha Stand", 3000, "VD", 10, 22],
        ["Garware Stand", 3000, "GW", 10, 22],
        ["Grand Stand", 5000, "GS", 10, 22],
        ["Garware Pavilion", 8000, "GP", 5, 12],
      ],

      // ===================================================
      // 3. MA CHIDAMBARAM STADIUM
      // ===================================================

      "MA Chidambaram Stadium": [
        ["KMK Lower", 1500, "KMKL", 8, 20],
        ["KMK Terrace", 2500, "KMKT", 8, 20],
        ["KMK Box", 6000, "KMKB", 5, 12],

        ["C Lower", 1500, "CL", 8, 20],
        ["C Upper", 1800, "CU", 8, 20],

        ["D Lower", 1500, "DL", 8, 20],
        ["D Upper", 1800, "DU", 8, 20],

        ["E Lower", 1500, "EL", 8, 20],
        ["E Upper", 1800, "EU", 8, 20],

        ["F Lower", 1500, "FL", 8, 20],
        ["F Upper", 1800, "FU", 8, 20],

        ["G Upper", 1800, "GU", 8, 20],

        ["H Lower", 1500, "HL", 8, 20],
        ["H Upper", 1800, "HU", 8, 20],

        ["I Upper", 1800, "IU", 8, 20],

        ["J Lower", 1500, "JL", 8, 20],
        ["J Upper", 1800, "JU", 8, 20],

        ["K Lower", 1500, "KL", 8, 20],
        ["K Upper", 1800, "KU", 8, 20],

        ["Hospitality Boxes", 6000, "HB", 5, 12],
        ["Hospitality Lounge", 8000, "HLG", 5, 12],
      ],

      // ===================================================
      // 4. ARUN JAITLEY STADIUM
      // ===================================================

      "Arun Jaitley Stadium": [
        ["East Stand Ground Floor", 1500, "EG", 8, 20],
        ["East Stand First Floor", 1700, "EF", 8, 20],
        ["East Stand Second Floor", 1800, "ES", 8, 20],

        ["West Ground Floor", 1800, "WG", 8, 20],
        ["West Third Floor", 2200, "WT", 8, 20],

        ["North West Ground", 1600, "NWG", 8, 20],
        ["North West First Floor", 1800, "NWF", 8, 20],
        ["North West Second Floor", 2000, "NWS", 8, 20],
        ["North West Third Floor", 2200, "NWT", 8, 20],

        ["North East Ground", 1600, "NEG", 8, 20],
        ["North East First Floor", 1800, "NEF", 8, 20],
        ["North East Second Floor", 2000, "NES", 8, 20],
        ["North East Third Floor", 2200, "NET", 8, 20],

        ["Hill A", 1500, "HA", 8, 20],
        ["Hill B", 1500, "HB", 8, 20],

        ["Old Club House", 4000, "OCH", 6, 16],
        ["Corporate Boxes", 8000, "CB", 5, 12],
        ["Platinum Gallery", 6000, "PG", 5, 12],
        ["DDCA Lounge", 9000, "DL", 5, 12],
      ],

      // ===================================================
      // 5. EDEN GARDENS
      // ===================================================

      "Eden Gardens": [
        ["Vida Pavilion - D Block", 1800, "VD", 8, 20],
        ["Vida Pavilion - D1 Block", 1800, "VD1", 8, 20],
        ["Vida Pavilion - G Block", 1800, "VG", 8, 20],
        ["Vida Pavilion - G1 Block", 1800, "VG1", 8, 20],

        ["Jio Pavilion - F Block", 2000, "JF", 8, 20],
        ["Jio Pavilion - F1 Block", 2000, "JF1", 8, 20],
        ["Jio Pavilion - K Block", 2200, "JK", 8, 20],
        ["Jio Pavilion - K1 Block", 2200, "JK1", 8, 20],

        ["Joy Pavilion - H Block", 2000, "JH", 8, 20],
        ["Joy Pavilion - H1 Block", 2000, "JH1", 8, 20],
        ["Joy Pavilion - I Block", 2000, "JI", 8, 20],
        ["Joy Pavilion - J Block", 2200, "JJ", 8, 20],

        ["BKT Tyres Pavilion - E Block", 1800, "BE", 8, 20],
        ["BKT Tyres Pavilion - B Block", 1800, "BB", 8, 20],
        ["BKT Tyres Pavilion - B1 Block", 1800, "BB1", 8, 20],

        ["RR Kabel Pavilion - C Block", 1800, "RC", 8, 20],
        ["RR Kabel Pavilion - C1 Block", 1800, "RC1", 8, 20],

        ["MAC Ghoshal Pavilion - L Block", 2200, "ML", 8, 20],
        ["MAC Ghoshal Pavilion - L1 Block", 2200, "ML1", 8, 20],

        ["Club House - Lower Tier", 4500, "CHL", 8, 20],
        ["Club House - Upper Tier", 5000, "CHU", 8, 20],

        ["Hospitality Suites", 9000, "HS", 5, 12],
        ["President's Box", 12000, "PB", 5, 12],
      ],

      // ===================================================
      // 6. NARENDRA MODI STADIUM
      // ===================================================

      "Narendra Modi Stadium": [
        ["Block J", 1500, "J", 10, 25],
        ["Block K", 1500, "K", 10, 25],
        ["Jio Block L", 1700, "L", 10, 25],
        ["Astral Pipes Block M", 1800, "M", 10, 25],
        ["Torrent Group Block N", 1800, "N", 10, 25],
        ["Torrent Group Block P", 2000, "P", 10, 25],
        ["BKT Tyres Block Q", 2000, "Q", 10, 25],
        ["BKT Tyres Block R", 2200, "R", 10, 25],

        ["Block A", 1500, "A", 10, 25],
        ["Block B", 1500, "B", 10, 25],
        ["Block C", 1600, "C", 10, 25],
        ["Block D", 1600, "D", 10, 25],
        ["Block G", 1700, "G", 10, 25],
        ["Block H", 1700, "H", 10, 25],

        ["South Premium Stand", 4000, "SPS", 8, 20],
        ["Torrent President Gallery", 9000, "TPG", 6, 16],
        ["Birla Estates Presidential Suites", 15000, "BPS", 5, 12],
        ["Premium Suites", 10000, "PS", 5, 12],
      ],

      // ===================================================
      // 7. RAJIV GANDHI INTERNATIONAL CRICKET STADIUM
      // ===================================================

      "Rajiv Gandhi International Cricket Stadium": [
        [
          "Jio Mohammed Azharuddin North Terrace 1",
          1700,
          "JMA1",
          8,
          20,
        ],
        [
          "Jio Mohammed Azharuddin North Terrace 2",
          1800,
          "JMA2",
          8,
          20,
        ],

        [
          "Shree Cement North Stand First Floor",
          1600,
          "SN",
          8,
          20,
        ],
        ["North Stand Terrace", 1700, "NT", 8, 20],

        [
          "Arun Ice Cream East Stand First Floor",
          1800,
          "AE",
          8,
          20,
        ],
        [
          "BKT Tyres East Stand Ground Floor",
          1600,
          "BE",
          8,
          20,
        ],
        [
          "AirAsia East Stand First Floor",
          1900,
          "AAE",
          8,
          20,
        ],

        [
          "Shree Cement West Stand First Floor",
          1800,
          "SW",
          8,
          20,
        ],
        [
          "Lubi Pumps West Stand Ground Floor",
          1700,
          "LW",
          8,
          20,
        ],
        [
          "Dream11 West Stand First Floor",
          1900,
          "DW",
          8,
          20,
        ],

        ["Kuhl South East Terrace", 1700, "KSE", 8, 20],
        [
          "AirAsia South East First Floor",
          1900,
          "ASE",
          8,
          20,
        ],
        ["Jio South East First Floor", 1900, "JSE", 8, 20],
        ["Kent South East Terrace", 1800, "KST", 8, 20],

        [
          "Shree Cement South West Terrace",
          1700,
          "SSW",
          8,
          20,
        ],
        [
          "Ecolink South West First Floor",
          1900,
          "ESW",
          8,
          20,
        ],

        ["SRH Gold West Lounge", 6000, "SGW", 5, 12],
        ["Orange Army West Lounge", 6000, "OAW", 5, 12],
        ["SRH Gold East Lounge", 6000, "SGE", 5, 12],
        ["Risers Gold Lounge", 7000, "RGL", 5, 12],

        ["South West Pavilion", 5000, "SWP", 6, 16],
        ["South Pavilion", 5000, "SP", 6, 16],
      ],

      // ===================================================
      // 8. EKANA CRICKET STADIUM
      // ===================================================

      "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium":
        [
          ["Lower Block 1", 1500, "LB1", 8, 20],
          ["Lower Block 2", 1500, "LB2", 8, 20],
          ["Lower Block 3", 1600, "LB3", 8, 20],
          ["Lower Block 4", 1600, "LB4", 8, 20],
          ["Lower Block 5", 1700, "LB5", 8, 20],
          ["Lower Block 7", 1700, "LB7", 8, 20],
          ["Lower Block 8", 1700, "LB8", 8, 20],
          ["Lower Block 9", 1800, "LB9", 8, 20],
          ["Lower Block 10", 1800, "LB10", 8, 20],
          ["Lower Block 11", 1800, "LB11", 8, 20],

          ["Upper Block 1", 1800, "UB1", 8, 20],
          ["Upper Block 2", 1800, "UB2", 8, 20],
          ["Upper Block 3", 1900, "UB3", 8, 20],
          ["Upper Block 4", 1900, "UB4", 8, 20],
          ["Upper Block 5", 2000, "UB5", 8, 20],
          ["Upper Block 7", 2000, "UB7", 8, 20],
          ["Upper Block 8", 2100, "UB8", 8, 20],
          ["Upper Block 9", 2100, "UB9", 8, 20],
          ["Upper Block 10", 2200, "UB10", 8, 20],
          ["Upper Block 11", 2200, "UB11", 8, 20],

          ["North Corporate Box 1-10", 8000, "NCB", 5, 12],
          ["South Corporate Box 1-22", 9000, "SCB", 5, 12],

          ["UPCA Lounge", 7000, "UPCA", 5, 12],

          ["North Platinum Lawn 1", 3500, "NPL1", 6, 16],
          ["North Platinum Lawn 2", 3500, "NPL2", 6, 16],

          ["IPL Lounge", 6000, "IPL", 5, 12],
          ["South Premium Lounge", 6000, "SPL", 5, 12],
          ["Super Giants Lounge", 6500, "SGL", 5, 12],

          ["North Presidential Gallery A", 10000, "NPGA", 5, 12],
          ["North Presidential Gallery Centre", 11000, "NPGC", 5, 12],
          ["North Presidential Gallery B", 10000, "NPGB", 5, 12],

          ["South Presidential Gallery", 11000, "SPG", 5, 12],
        ],

      // ===================================================
      // 9. MAHARAJA YADAVINDRA SINGH INTERNATIONAL
      // ===================================================

      "Maharaja Yadavindra Singh International Cricket Stadium":
        [
          ["Kent West Upper Tier A", 1700, "KWUA", 8, 20],
          ["Kent West Upper Tier B", 1700, "KWUB", 8, 20],
          ["Kent West Terrace A", 1800, "KWTA", 8, 20],
          ["Kent West Terrace", 1800, "KWT", 8, 20],

          ["Jio North Upper Tier A", 1700, "JNUA", 8, 20],
          ["Jio North Upper Tier B", 1700, "JNUB", 8, 20],

          ["Jio East Upper Tier A", 1800, "JEUA", 8, 20],
          ["Jio East Upper Tier Lower", 1700, "JEUL", 8, 20],

          ["Kent Yuvraj Singh Stand", 3000, "YSS", 10, 22],
          ["Harmanpreet Kaur Stand", 3000, "HKS", 10, 22],

          ["All Seasons North Pavilion", 4500, "ANP", 6, 16],
          ["All Seasons North Elevation", 4000, "ANE", 6, 16],

          ["CF Plus South East Upper Tier", 2200, "CPS", 8, 20],
          ["CP Plus Lounge", 6000, "CPL", 5, 12],

          ["South Upper Tier", 2000, "SUT", 8, 20],
        ],

      // ===================================================
      // 10. SAWAI MANSINGH STADIUM
      // ===================================================

      "Sawai Mansingh Stadium": [
        ["North East Stand 1", 1500, "NES1", 8, 20],
        ["North East Stand 2", 1600, "NES2", 8, 20],
        ["North West Stand 1", 1500, "NWS1", 8, 20],
        ["North West Stand 2", 1600, "NWS2", 8, 20],

        ["North East Lawn", 1300, "NEL", 6, 16],
        ["North West Lawn", 1300, "NWL", 6, 16],

        ["Secretary Box", 6000, "SB", 5, 12],
        ["North Rooftop", 3000, "NR", 6, 16],

        ["East Stand 1", 1600, "ES1", 8, 20],
        ["East Stand 2", 1700, "ES2", 8, 20],
        ["East Stand 3", 1800, "ES3", 8, 20],

        ["East Lawn 1", 1400, "EL1", 6, 16],
        ["East Lawn 2", 1400, "EL2", 6, 16],

        ["South East Stand 1", 1600, "SES1", 8, 20],
        ["South East Stand 2", 1700, "SES2", 8, 20],

        ["South West Stand 1", 1600, "SWS1", 8, 20],
        ["South West Stand 2", 1700, "SWS2", 8, 20],

        ["South East Long Room", 4500, "SELR", 6, 16],
        ["South West Long Room", 4500, "SWLR", 6, 16],

        ["President Gallery", 7000, "PG", 5, 12],
        ["President East Box", 8000, "PEB", 5, 12],
        ["President Box", 10000, "PB", 5, 12],
        ["President West Box", 8000, "PWB", 5, 12],

        ["President Members Gold 1", 5000, "PMG1", 5, 12],
        ["President Members Gold 2", 5000, "PMG2", 5, 12],

        ["Secretary Members Gold Lounge", 6000, "SMGL", 5, 12],
        ["West Corporate Box", 8000, "WCB", 5, 12],
        ["West Rooftop", 3000, "WR", 6, 16],
      ],

      // ===================================================
      // 11. HPCA STADIUM
      // ===================================================

      "Himachal Pradesh Cricket Association Stadium": [
        ["North VIP Stand", 5000, "NVIP", 6, 16],

        ["North 1 Lower", 1500, "N1L", 8, 20],
        ["North 1 Upper", 1700, "N1U", 8, 20],

        ["North 2 Lower", 1500, "N2L", 8, 20],
        ["North 2 Upper", 1700, "N2U", 8, 20],

        ["East Stand 1", 1500, "E1", 8, 20],
        ["East Stand 2", 1600, "E2", 8, 20],
        ["East Stand 3", 1700, "E3", 8, 20],

        ["East Stand Corporate Box", 7000, "EC", 5, 12],

        ["Pavilion Terrace", 3500, "PT", 6, 16],
        ["VVIP Area", 8000, "VVIP", 5, 12],
        ["Club Lounge", 6000, "CL", 5, 12],

        ["West Stand 1", 1500, "W1", 8, 20],
        ["West Stand 2", 1600, "W2", 8, 20],

        ["West Stand Corporate Box", 7000, "WC", 5, 12],

        ["North West Stand", 1600, "NW", 8, 20],
        ["General Stand 1", 1200, "GS1", 8, 20],
      ],

      // ===================================================
      // 12. BARSAPARA CRICKET STADIUM
      // ===================================================

      "Barsapara Cricket Stadium": [
        ["North Block A", 1500, "NA", 8, 20],
        ["North Block G", 1500, "NG", 8, 20],

        ["West Stand Block E", 1500, "WE", 8, 20],
        ["West Stand Block F", 1500, "WF", 8, 20],

        ["East Stand Block B", 1600, "EB", 8, 20],

        ["South Stand Block C", 1600, "SC", 8, 20],
        ["South Stand Block D", 1600, "SD", 8, 20],

        ["VIP North Boxes", 6000, "VNB", 5, 12],
        ["VIP South Boxes", 6000, "VSB", 5, 12],
      ],

      // ===================================================
      // 13. SHAHEED VEER NARAYAN SINGH INTERNATIONAL
      // ===================================================

      "Shaheed Veer Narayan Singh International Cricket Stadium":
        [
          ["BKT Tyres Upper Stand 5", 1700, "BKT5", 8, 20],
          ["Boat Upper Stand 6", 1700, "BOAT6", 8, 20],

          ["Jio Lower 5 & 6 Stand", 1600, "JIO56", 8, 20],

          ["Sun Pharma P Terrace", 2000, "SPT", 8, 20],

          ["Puma Super Stand 9", 2200, "PSS9", 8, 20],

          ["Sun Pharma P1 Annexe A", 2500, "P1A", 8, 20],
          ["NOTHING (R) P1 Annexe B", 2500, "P1B", 8, 20],

          ["General Stands", 1200, "GS", 8, 20],
          ["Mid-Tier Stands", 1800, "MTS", 8, 20],

          ["Hospitality", 6000, "HOSP", 5, 12],
          ["Corporate Boxes", 8000, "CB", 5, 12],
        ],
    };

    // =====================================================
    // SEAT HELPER
    // =====================================================

    const seatData = [];

    const addSeats = (
      match,
      section,
      price,
      rowPrefix,
      rows,
      seatsPerRow
    ) => {
      for (let row = 1; row <= rows; row++) {
        for (let number = 1; number <= seatsPerRow; number++) {
          seatData.push({
            stadium: match.stadium,
            match: match._id,
            seatNumber: `${rowPrefix}${row}-${number}`,
            row: `${rowPrefix}${row}`,
            section,
            price,
            status: "available",
          });
        }
      }
    };

    // =====================================================
    // CREATE SEATS FOR EVERY MATCH / STADIUM
    // =====================================================

    for (const match of matches) {
      const stadium = stadiums.find(
        (item) =>
          item._id.toString() === match.stadium.toString()
      );

      if (!stadium) {
        console.warn(
          `Skipping seats: stadium not found for match ${match._id}`
        );
        continue;
      }

      const sections = stadiumSections[stadium.name];

      if (!sections || sections.length === 0) {
        console.warn(
          `No seat sections found for stadium: ${stadium.name}`
        );
        continue;
      }

      for (const [
        section,
        price,
        rowPrefix,
        rows,
        seatsPerRow,
      ] of sections) {
        addSeats(
          match,
          section,
          price,
          rowPrefix,
          rows,
          seatsPerRow
        );
      }
    }

    // =====================================================
    // INSERT SEATS
    // =====================================================

    if (seatData.length > 0) {
      await Seat.insertMany(seatData);
    }

    console.log(
      `Created ${seatData.length} seats across all matches`
    );

    // =====================================================
    // PARKING - MATCH SPECIFIC
    // =====================================================
    //
    // IMPORTANT:
    // Parking slots are now associated with the MATCH.
    //
    // This allows:
    //
    // /parking/match/:matchId
    //
    // to return only the parking slots belonging to
    // that particular match.
    //
    // =====================================================

    const parkingData = [];

    for (const match of matches) {
      // ---------------------------------------------------
      // Only create online parking inventory for matches
      // whose parking mode is prebooking.
      // ---------------------------------------------------

      if (match.parkingMode !== "prebooking") {
        console.log(
          `Skipping online parking inventory for match ${match._id} - mode: ${match.parkingMode}`
        );
        continue;
      }

      // ===================================================
      // CAR PARKING
      // ===================================================

      for (let i = 1; i <= 10; i++) {
        parkingData.push({
          stadium: match.stadium,
          match: match._id,
          slotNumber: `C${i}`,
          vehicleType: "car",
          price: 200,
          status: "available",
        });
      }

      // ===================================================
      // BIKE PARKING
      // ===================================================

      for (let i = 1; i <= 10; i++) {
        parkingData.push({
          stadium: match.stadium,
          match: match._id,
          slotNumber: `B${i}`,
          vehicleType: "bike",
          price: 100,
          status: "available",
        });
      }
    }

    // =====================================================
    // INSERT PARKING
    // =====================================================

    if (parkingData.length > 0) {
      await Parking.insertMany(parkingData);
    }

    // =====================================================
    // PARKING SUMMARY
    // =====================================================

    console.log("");
    console.log("===============================================");
    console.log("PARKING INVENTORY");
    console.log("===============================================");

    const prebookingMatches = matches.filter(
      (match) => match.parkingMode === "prebooking"
    );

    const designatedMatches = matches.filter(
      (match) => match.parkingMode === "designated"
    );

    console.log(
      `Pre-booking matches : ${prebookingMatches.length}`
    );

    console.log(
      `Designated matches  : ${designatedMatches.length}`
    );

    console.log(
      `Parking slots       : ${parkingData.length}`
    );

    console.log("===============================================");

    // =====================================================
    // SUMMARY
    // =====================================================

    console.log("");
    console.log("===============================================");
    console.log("CricFusion database seeded successfully");
    console.log("===============================================");
    console.log(`Tournaments : ${tournaments.length}`);
    console.log(`IPL Teams   : ${iplTeams.length}`);
    console.log(`WPL Teams   : ${wplTeams.length}`);
    console.log(`Stadiums    : ${stadiums.length}`);
    console.log(`Matches     : ${matches.length}`);
    console.log(`Seats       : ${seatData.length}`);
    console.log(`Parking     : ${parkingData.length}`);
    console.log("Seat inventory: 2026 stadium sections");
    console.log("Parking inventory: Match-specific");
    console.log("===============================================");

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);

    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error(
        "MongoDB close error:",
        closeError.message
      );
    }

    process.exit(1);
  }
};

// =====================================================
// START
// =====================================================

seedData();