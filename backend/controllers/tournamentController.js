const Tournament = require("../models/Tournament");

// ========================================
// GET ALL TOURNAMENTS
// ========================================

const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .sort({ season: -1, type: 1 });

    res.status(200).json({
      success: true,
      count: tournaments.length,
      tournaments,
    });
  } catch (error) {
    console.error("Get tournaments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tournaments",
    });
  }
};

// ========================================
// GET TOURNAMENT BY ID
// ========================================

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(
      req.params.id
    );

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      success: true,
      tournament,
    });
  } catch (error) {
    console.error("Get tournament error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tournament",
    });
  }
};

// ========================================
// CREATE TOURNAMENT
// ========================================

const createTournament = async (req, res) => {
  try {
    const {
      name,
      type,
      season,
      startDate,
      endDate,
      status,
    } = req.body;

    if (!name || !type || !season) {
      return res.status(400).json({
        success: false,
        message: "Name, type and season are required",
      });
    }

    if (!["IPL", "WPL"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tournament type must be IPL or WPL",
      });
    }

    const existingTournament =
      await Tournament.findOne({
        type,
        season,
      });

    if (existingTournament) {
      return res.status(409).json({
        success: false,
        message:
          "A tournament for this type and season already exists",
      });
    }

    const tournament = await Tournament.create({
      name: name.trim(),
      type,
      season,
      startDate: startDate || null,
      endDate: endDate || null,
      status: status || "upcoming",
    });

    res.status(201).json({
      success: true,
      message: "Tournament created successfully",
      tournament,
    });
  } catch (error) {
    console.error("Create tournament error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create tournament",
    });
  }
};

// ========================================
// UPDATE TOURNAMENT
// ========================================

const updateTournament = async (req, res) => {
  try {
    const tournament =
      await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    const {
      name,
      type,
      season,
      startDate,
      endDate,
      status,
    } = req.body;

    if (name !== undefined) {
      tournament.name = name.trim();
    }

    if (type !== undefined) {
      if (!["IPL", "WPL"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Tournament type must be IPL or WPL",
        });
      }

      tournament.type = type;
    }

    if (season !== undefined) {
      tournament.season = season;
    }

    if (startDate !== undefined) {
      tournament.startDate = startDate;
    }

    if (endDate !== undefined) {
      tournament.endDate = endDate;
    }

    if (status !== undefined) {
      tournament.status = status;
    }

    await tournament.save();

    res.status(200).json({
      success: true,
      message: "Tournament updated successfully",
      tournament,
    });
  } catch (error) {
    console.error("Update tournament error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update tournament",
    });
  }
};

// ========================================
// DELETE TOURNAMENT
// ========================================

const deleteTournament = async (req, res) => {
  try {
    const tournament =
      await Tournament.findById(req.params.id);

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: "Tournament not found",
      });
    }

    await tournament.deleteOne();

    res.status(200).json({
      success: true,
      message: "Tournament deleted successfully",
    });
  } catch (error) {
    console.error("Delete tournament error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete tournament",
    });
  }
};

module.exports = {
  getTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
