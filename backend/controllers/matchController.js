
const Match = require("../models/Match");
const Seat = require("../models/Seat");

// =====================================================
// GET ALL MATCHES
// =====================================================

const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate(
        "tournament",
        "name type season"
      )
      .populate(
        "teamA",
        "name shortName logo"
      )
      .populate(
        "teamB",
        "name shortName logo"
      )
      .populate(
        "stadium",
        "name city state image capacity"
      )
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error(
      "Get matches error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch matches",
    });
  }
};

// =====================================================
// GET SINGLE MATCH
// =====================================================

const getMatchById = async (req, res) => {
  try {
    const match =
      await Match.findById(
        req.params.id
      )
        .populate("tournament")
        .populate("teamA")
        .populate("teamB")
        .populate("stadium");

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    console.error(
      "Get match error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch match",
    });
  }
};

// =====================================================
// CREATE MATCH
// =====================================================

const createMatch = async (req, res) => {
  try {
    const {
      tournament,
      teamA,
      teamB,
      stadium,
      matchNumber,
      date,
      startTime,
      ticketPrice,

      parkingMode,
      parkingLocation,
      parkingInstructions,
    } = req.body;

    if (
      !tournament ||
      !teamA ||
      !teamB ||
      !stadium ||
      !date ||
      !startTime ||
      ticketPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required match details are missing",
      });
    }

    if (teamA === teamB) {
      return res.status(400).json({
        success: false,
        message:
          "A team cannot play against itself",
      });
    }

    const match =
      await Match.create({
        tournament,
        teamA,
        teamB,
        stadium,
        matchNumber,
        date,
        startTime,
        ticketPrice,

        parkingMode:
          parkingMode ||
          "designated",

        parkingLocation:
          parkingLocation ||
          "",

        parkingInstructions:
          parkingInstructions ||
          "",
      });

    // =====================================================
    // AUTOMATIC SEAT INVENTORY
    // =====================================================
    //
    // Find an existing seat layout belonging to the
    // selected stadium and copy it to this new match.
    //
    // This automatically gives the new match:
    // - Correct stadium stands
    // - Correct section names
    // - Correct rows
    // - Correct seat numbers
    // - Correct stand prices
    //
    // No changes are required in SeatSelection.jsx.
    //
    // =====================================================

    try {
      const templateSeat =
        await Seat.findOne({
          stadium: stadium,
        }).sort({ createdAt: 1 });

      if (templateSeat) {
        const templateSeats =
          await Seat.find({
            stadium: stadium,
            match: templateSeat.match,
          }).lean();

        if (
          templateSeats &&
          templateSeats.length > 0
        ) {
          const newSeatData =
            templateSeats.map(
              (seat) => ({
                stadium: match.stadium,
                match: match._id,
                seatNumber:
                  seat.seatNumber,
                row: seat.row,
                section:
                  seat.section,
                price: seat.price,
                status: "available",
                lockedBy: null,
                lockedUntil: null,
              })
            );

          await Seat.insertMany(
            newSeatData
          );

          console.log(
            `Created ${newSeatData.length} seats for new match ${match._id}`
          );
        } else {
          console.warn(
            `No seat template found for stadium ${stadium}`
          );
        }
      } else {
        console.warn(
          `No existing seat inventory found for stadium ${stadium}`
        );
      }
    } catch (seatError) {
      console.error(
        "Automatic seat creation error:",
        seatError
      );
    }

    // =====================================================
    // POPULATE CREATED MATCH
    // =====================================================

    const populatedMatch =
      await Match.findById(
        match._id
      )
        .populate("tournament")
        .populate("teamA")
        .populate("teamB")
        .populate("stadium");

    res.status(201).json({
      success: true,
      message:
        "Match created successfully",
      match: populatedMatch,
    });
  } catch (error) {
    console.error(
      "Create match error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create match",
    });
  }
};

// =====================================================
// UPDATE MATCH
// =====================================================

const updateMatch = async (req, res) => {
  try {
    const match =
      await Match.findById(
        req.params.id
      );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const allowedFields = [
      "tournament",
      "teamA",
      "teamB",
      "stadium",
      "matchNumber",
      "date",
      "startTime",
      "ticketPrice",
      "status",

      "parkingMode",
      "parkingLocation",
      "parkingInstructions",
    ];

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          match[field] =
            req.body[field];
        }
      }
    );

    if (
      match.teamA.toString() ===
      match.teamB.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A team cannot play against itself",
      });
    }

    await match.save();

    const updatedMatch =
      await Match.findById(
        match._id
      )
        .populate("tournament")
        .populate("teamA")
        .populate("teamB")
        .populate("stadium");

    res.status(200).json({
      success: true,
      message:
        "Match updated successfully",
      match: updatedMatch,
    });
  } catch (error) {
    console.error(
      "Update match error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update match",
    });
  }
};

// =====================================================
// DELETE MATCH
// =====================================================

const deleteMatch = async (req, res) => {
  try {
    const match =
      await Match.findById(
        req.params.id
      );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    await match.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Match deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete match error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete match",
    });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
