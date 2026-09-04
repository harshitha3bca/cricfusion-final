const Team = require("../models/Team");

// ========================================
// GET ALL TEAMS
// ========================================

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get teams error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};

// ========================================
// GET TEAM BY ID
// ========================================

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    res.status(200).json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("Get team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team",
    });
  }
};

// ========================================
// CREATE TEAM
// ========================================

const createTeam = async (req, res) => {
  try {
    const {
      name,
      shortName,
      logo,
      tournamentType,
    } = req.body;

    if (!name || !shortName || !tournamentType) {
      return res.status(400).json({
        success: false,
        message:
          "Name, short name and tournament type are required",
      });
    }

    const existingTeam = await Team.findOne({
      $or: [
        { name: name.trim() },
        { shortName: shortName.trim().toUpperCase() },
      ],
    });

    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: "Team already exists",
      });
    }

    const team = await Team.create({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase(),
      logo: logo || "",
      tournamentType,
    });

    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("Create team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create team",
    });
  }
};

// ========================================
// UPDATE TEAM
// ========================================

const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const {
      name,
      shortName,
      logo,
      tournamentType,
    } = req.body;

    if (name !== undefined) {
      team.name = name.trim();
    }

    if (shortName !== undefined) {
      team.shortName = shortName
        .trim()
        .toUpperCase();
    }

    if (logo !== undefined) {
      team.logo = logo;
    }

    if (tournamentType !== undefined) {
      team.tournamentType = tournamentType;
    }

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    console.error("Update team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update team",
    });
  }
};

// ========================================
// DELETE TEAM
// ========================================

const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    await team.deleteOne();

    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Delete team error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete team",
    });
  }
};

module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
};