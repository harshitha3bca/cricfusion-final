const Match = require("../models/Match");

// GET all matches
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("tournament", "name type season")
      .populate("teamA", "name shortName logo")
      .populate("teamB", "name shortName logo")
      .populate("stadium", "name city state image capacity")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Get matches error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch matches",
    });
  }
};

// GET single match
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
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
    console.error("Get match error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch match",
    });
  }
};

// CREATE match
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
        message: "Required match details are missing",
      });
    }

    if (teamA === teamB) {
      return res.status(400).json({
        success: false,
        message: "A team cannot play against itself",
      });
    }

    const match = await Match.create({
      tournament,
      teamA,
      teamB,
      stadium,
      matchNumber,
      date,
      startTime,
      ticketPrice,
    });

    const populatedMatch = await Match.findById(match._id)
      .populate("tournament")
      .populate("teamA")
      .populate("teamB")
      .populate("stadium");

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      match: populatedMatch,
    });
  } catch (error) {
    console.error("Create match error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create match",
    });
  }
};

// UPDATE match
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

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
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        match[field] = req.body[field];
      }
    });

    if (match.teamA.toString() === match.teamB.toString()) {
      return res.status(400).json({
        success: false,
        message: "A team cannot play against itself",
      });
    }

    await match.save();

    const updatedMatch = await Match.findById(match._id)
      .populate("tournament")
      .populate("teamA")
      .populate("teamB")
      .populate("stadium");

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("Update match error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update match",
    });
  }
};

// DELETE match
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    await match.deleteOne();

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });
  } catch (error) {
    console.error("Delete match error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete match",
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