const Player = require("../models/Player");

// GET all players
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate("team", "name shortName logo")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Get players error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch players",
    });
  }
};

// GET players by team
const getPlayersByTeam = async (req, res) => {
  try {
    const players = await Player.find({
      team: req.params.teamId,
    })
      .populate("team", "name shortName logo")
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: players.length,
      players,
    });
  } catch (error) {
    console.error("Get team players error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch team players",
    });
  }
};

// GET player by ID
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate("team", "name shortName logo");

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    res.status(200).json({
      success: true,
      player,
    });
  } catch (error) {
    console.error("Get player error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch player",
    });
  }
};

// CREATE player
const createPlayer = async (req, res) => {
  try {
    const {
      name,
      team,
      role,
      nationality,
      photo,
    } = req.body;

    if (!name || !team || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, team and role are required",
      });
    }

    const player = await Player.create({
      name: name.trim(),
      team,
      role,
      nationality: nationality || "",
      photo: photo || "",
    });

    const populatedPlayer = await Player.findById(
      player._id
    ).populate("team", "name shortName logo");

    res.status(201).json({
      success: true,
      message: "Player created successfully",
      player: populatedPlayer,
    });
  } catch (error) {
    console.error("Create player error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create player",
    });
  }
};

// UPDATE player
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    const {
      name,
      team,
      role,
      nationality,
      photo,
    } = req.body;

    if (name !== undefined) {
      player.name = name.trim();
    }

    if (team !== undefined) {
      player.team = team;
    }

    if (role !== undefined) {
      player.role = role;
    }

    if (nationality !== undefined) {
      player.nationality = nationality;
    }

    if (photo !== undefined) {
      player.photo = photo;
    }

    await player.save();

    const updatedPlayer = await Player.findById(
      player._id
    ).populate("team", "name shortName logo");

    res.status(200).json({
      success: true,
      message: "Player updated successfully",
      player: updatedPlayer,
    });
  } catch (error) {
    console.error("Update player error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update player",
    });
  }
};

// DELETE player
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found",
      });
    }

    await player.deleteOne();

    res.status(200).json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error) {
    console.error("Delete player error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete player",
    });
  }
};

module.exports = {
  getPlayers,
  getPlayersByTeam,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
};