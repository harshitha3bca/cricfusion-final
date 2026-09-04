const Stadium = require("../models/Stadium");

// GET all stadiums
const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: stadiums.length,
      stadiums,
    });
  } catch (error) {
    console.error("Get stadiums error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stadiums",
    });
  }
};

// GET single stadium
const getStadiumById = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);

    if (!stadium) {
      return res.status(404).json({
        success: false,
        message: "Stadium not found",
      });
    }

    res.status(200).json({
      success: true,
      stadium,
    });
  } catch (error) {
    console.error("Get stadium error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stadium",
    });
  }
};

// CREATE stadium
const createStadium = async (req, res) => {
  try {
    const {
      name,
      city,
      state,
      address,
      image,
      capacity,
      description,
    } = req.body;

    if (!name || !city || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Name, city and capacity are required",
      });
    }

    const stadium = await Stadium.create({
      name,
      city,
      state,
      address,
      image,
      capacity,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Stadium created successfully",
      stadium,
    });
  } catch (error) {
    console.error("Create stadium error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create stadium",
    });
  }
};

// UPDATE stadium
const updateStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!stadium) {
      return res.status(404).json({
        success: false,
        message: "Stadium not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stadium updated successfully",
      stadium,
    });
  } catch (error) {
    console.error("Update stadium error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update stadium",
    });
  }
};

// DELETE stadium
const deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);

    if (!stadium) {
      return res.status(404).json({
        success: false,
        message: "Stadium not found",
      });
    }

    await stadium.deleteOne();

    res.status(200).json({
      success: true,
      message: "Stadium deleted successfully",
    });
  } catch (error) {
    console.error("Delete stadium error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete stadium",
    });
  }
};

module.exports = {
  getStadiums,
  getStadiumById,
  createStadium,
  updateStadium,
  deleteStadium,
};