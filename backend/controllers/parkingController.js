const mongoose = require("mongoose");
const Parking = require("../models/Parking");
const Match = require("../models/Match");

// ========================================
// GET PARKING SLOTS FOR A MATCH
// ========================================

const getParkingByMatch = async (req, res) => {
  try {
    const { matchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid match ID",
      });
    }

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const parkingSlots = await Parking.find({
      stadium: match.stadium,
      $or: [
        {
          bookedForMatch: null,
        },
        {
          bookedForMatch: matchId,
        },
      ],
    }).sort({
      vehicleType: 1,
      slotNumber: 1,
    });

    res.status(200).json({
      success: true,
      count: parkingSlots.length,
      parkingSlots,
    });
  } catch (error) {
    console.error("Get parking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch parking slots",
    });
  }
};

// ========================================
// GET SINGLE PARKING SLOT
// ========================================

const getParkingById = async (req, res) => {
  try {
    const parking = await Parking.findById(
      req.params.id
    )
      .populate("stadium", "name location")
      .populate("bookedBy", "name email")
      .populate("bookedForMatch");

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking slot not found",
      });
    }

    res.status(200).json({
      success: true,
      parking,
    });
  } catch (error) {
    console.error(
      "Get parking slot error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch parking slot",
    });
  }
};

// ========================================
// RESERVE PARKING SLOT
// ========================================

const reserveParking = async (req, res) => {
  try {
    const {
      parkingId,
      matchId,
    } = req.body;

    if (!parkingId || !matchId) {
      return res.status(400).json({
        success: false,
        message:
          "Parking ID and match ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(parkingId) ||
      !mongoose.Types.ObjectId.isValid(matchId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid parking ID or match ID",
      });
    }

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    const parking = await Parking.findOneAndUpdate(
      {
        _id: parkingId,
        stadium: match.stadium,
        status: "available",
      },
      {
        $set: {
          status: "reserved",
          bookedBy: req.user._id,
          bookedForMatch: matchId,
        },
      },
      {
        new: true,
      }
    );

    if (!parking) {
      return res.status(409).json({
        success: false,
        message:
          "This parking slot is no longer available",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Parking slot reserved successfully",
      parking,
    });
  } catch (error) {
    console.error(
      "Reserve parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to reserve parking slot",
    });
  }
};

// ========================================
// RELEASE PARKING SLOT
// ========================================

const releaseParking = async (req, res) => {
  try {
    const { parkingId } = req.body;

    if (!parkingId) {
      return res.status(400).json({
        success: false,
        message: "Parking ID is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(parkingId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid parking ID",
      });
    }

    const parking = await Parking.findOneAndUpdate(
      {
        _id: parkingId,
        status: "reserved",
        bookedBy: req.user._id,
      },
      {
        $set: {
          status: "available",
          bookedBy: null,
          bookedForMatch: null,
        },
      },
      {
        new: true,
      }
    );

    if (!parking) {
      return res.status(404).json({
        success: false,
        message:
          "Parking slot not found or cannot be released",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Parking slot released successfully",
      parking,
    });
  } catch (error) {
    console.error(
      "Release parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to release parking slot",
    });
  }
};

// ========================================
// CREATE PARKING SLOT
// ADMIN ONLY
// ========================================

const createParking = async (req, res) => {
  try {
    const {
      stadium,
      slotNumber,
      vehicleType,
      price,
    } = req.body;

    if (
      !stadium ||
      !slotNumber ||
      !vehicleType ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stadium, slot number, vehicle type and price are required",
      });
    }

    const existingParking =
      await Parking.findOne({
        stadium,
        slotNumber,
      });

    if (existingParking) {
      return res.status(409).json({
        success: false,
        message:
          "This parking slot already exists in this stadium",
      });
    }

    const parking = await Parking.create({
      stadium,
      slotNumber,
      vehicleType,
      price,
      status: "available",
      bookedBy: null,
      bookedForMatch: null,
    });

    res.status(201).json({
      success: true,
      message:
        "Parking slot created successfully",
      parking,
    });
  } catch (error) {
    console.error(
      "Create parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create parking slot",
    });
  }
};

// ========================================
// CREATE MULTIPLE PARKING SLOTS
// ADMIN ONLY
// ========================================

const createMultipleParking = async (
  req,
  res
) => {
  try {
    const { parkingSlots } = req.body;

    if (
      !Array.isArray(parkingSlots) ||
      parkingSlots.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "parkingSlots array is required",
      });
    }

    const slots = parkingSlots.map((slot) => ({
      stadium: slot.stadium,
      slotNumber: slot.slotNumber,
      vehicleType: slot.vehicleType,
      price: slot.price,
      status: "available",
      bookedBy: null,
      bookedForMatch: null,
    }));

    const createdSlots =
      await Parking.insertMany(slots, {
        ordered: false,
      });

    res.status(201).json({
      success: true,
      message:
        "Parking slots created successfully",
      count: createdSlots.length,
      parkingSlots: createdSlots,
    });
  } catch (error) {
    console.error(
      "Create multiple parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Some parking slots could not be created. Check for duplicate slot numbers.",
    });
  }
};

// ========================================
// UPDATE PARKING SLOT
// ADMIN ONLY
// ========================================

const updateParking = async (req, res) => {
  try {
    const parking =
      await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking slot not found",
      });
    }

    const {
      slotNumber,
      vehicleType,
      price,
    } = req.body;

    if (slotNumber !== undefined) {
      parking.slotNumber = slotNumber;
    }

    if (vehicleType !== undefined) {
      parking.vehicleType = vehicleType;
    }

    if (price !== undefined) {
      parking.price = price;
    }

    await parking.save();

    res.status(200).json({
      success: true,
      message:
        "Parking slot updated successfully",
      parking,
    });
  } catch (error) {
    console.error(
      "Update parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update parking slot",
    });
  }
};

// ========================================
// DELETE PARKING SLOT
// ADMIN ONLY
// ========================================

const deleteParking = async (req, res) => {
  try {
    const parking =
      await Parking.findById(req.params.id);

    if (!parking) {
      return res.status(404).json({
        success: false,
        message: "Parking slot not found",
      });
    }

    await parking.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Parking slot deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete parking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete parking slot",
    });
  }
};

module.exports = {
  getParkingByMatch,
  getParkingById,
  reserveParking,
  releaseParking,
  createParking,
  createMultipleParking,
  updateParking,
  deleteParking,
};