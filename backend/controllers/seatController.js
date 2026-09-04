const mongoose = require("mongoose");
const Seat = require("../models/Seat");
const Match = require("../models/Match");

// ========================================
// GET SEATS FOR A MATCH
// ========================================

const getSeatsByMatch = async (req, res) => {
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

    // Release expired locks
    await Seat.updateMany(
      {
        match: matchId,
        status: "locked",
        lockedUntil: {
          $lte: new Date(),
        },
      },
      {
        $set: {
          status: "available",
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    const seats = await Seat.find({
      match: matchId,
    }).sort({
      section: 1,
      row: 1,
      seatNumber: 1,
    });

    res.status(200).json({
      success: true,
      count: seats.length,
      seats,
    });
  } catch (error) {
    console.error("Get seats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seats",
    });
  }
};

// ========================================
// GET SINGLE SEAT
// ========================================

const getSeatById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({
        success: false,
        message: "Seat not found",
      });
    }

    // Release expired lock
    if (
      seat.status === "locked" &&
      seat.lockedUntil &&
      seat.lockedUntil <= new Date()
    ) {
      seat.status = "available";
      seat.lockedBy = null;
      seat.lockedUntil = null;

      await seat.save();
    }

    res.status(200).json({
      success: true,
      seat,
    });
  } catch (error) {
    console.error("Get seat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch seat",
    });
  }
};

// ========================================
// LOCK SEATS
// ========================================

const lockSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    if (
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one seat must be selected",
      });
    }

    // Remove duplicate IDs
    const uniqueSeatIds = [
      ...new Set(seatIds.map(String)),
    ];

    // Validate IDs
    const invalidIds = uniqueSeatIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more seat IDs are invalid",
      });
    }

    // Release expired locks first
    await Seat.updateMany(
      {
        _id: {
          $in: uniqueSeatIds,
        },
        status: "locked",
        lockedUntil: {
          $lte: new Date(),
        },
      },
      {
        $set: {
          status: "available",
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    const seats = await Seat.find({
      _id: {
        $in: uniqueSeatIds,
      },
    });

    if (seats.length !== uniqueSeatIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more seats were not found",
      });
    }

    // Check availability
    const unavailableSeats = seats.filter(
      (seat) =>
        seat.status !== "available"
      ||
        (
          seat.lockedBy &&
          seat.lockedBy.toString() !==
            req.user._id.toString()
        )
    );

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "One or more selected seats are no longer available",
        unavailableSeats: unavailableSeats.map(
          (seat) => ({
            id: seat._id,
            seatNumber: seat.seatNumber,
            status: seat.status,
          })
        ),
      });
    }

    // Lock for 10 minutes
    const lockedUntil = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Atomically lock each seat
    const lockedSeats = [];

    for (const seatId of uniqueSeatIds) {
      const lockedSeat = await Seat.findOneAndUpdate(
        {
          _id: seatId,
          status: "available",
        },
        {
          $set: {
            status: "locked",
            lockedBy: req.user._id,
            lockedUntil,
          },
        },
        {
          new: true,
        }
      );

      if (!lockedSeat) {
        // Release seats already locked in this request
        await Seat.updateMany(
          {
            _id: {
              $in: lockedSeats.map(
                (seat) => seat._id
              ),
            },
            lockedBy: req.user._id,
            status: "locked",
          },
          {
            $set: {
              status: "available",
              lockedBy: null,
              lockedUntil: null,
            },
          }
        );

        return res.status(409).json({
          success: false,
          message:
            "A selected seat became unavailable. Please try again.",
        });
      }

      lockedSeats.push(lockedSeat);
    }

    res.status(200).json({
      success: true,
      message: "Seats locked successfully",
      lockedUntil,
      seats: lockedSeats,
    });
  } catch (error) {
    console.error("Lock seats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to lock seats",
    });
  }
};

// ========================================
// RELEASE SEATS
// ========================================

const releaseSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    if (
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Seat IDs are required",
      });
    }

    const result = await Seat.updateMany(
      {
        _id: {
          $in: seatIds,
        },
        status: "locked",
        lockedBy: req.user._id,
      },
      {
        $set: {
          status: "available",
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Seats released successfully",
      releasedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Release seats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to release seats",
    });
  }
};

// ========================================
// CREATE SEAT
// ADMIN ONLY
// ========================================

const createSeat = async (req, res) => {
  try {
    const {
      stadium,
      match,
      seatNumber,
      row,
      section,
      price,
    } = req.body;

    if (
      !stadium ||
      !match ||
      !seatNumber ||
      !row ||
      !section ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Stadium, match, seat number, row, section and price are required",
      });
    }

    const existingSeat = await Seat.findOne({
      match,
      seatNumber,
    });

    if (existingSeat) {
      return res.status(409).json({
        success: false,
        message:
          "This seat already exists for this match",
      });
    }

    const seat = await Seat.create({
      stadium,
      match,
      seatNumber,
      row,
      section,
      price,
      status: "available",
    });

    res.status(201).json({
      success: true,
      message: "Seat created successfully",
      seat,
    });
  } catch (error) {
    console.error("Create seat error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create seat",
    });
  }
};

// ========================================
// CREATE MULTIPLE SEATS
// ADMIN ONLY
// ========================================

const createMultipleSeats = async (req, res) => {
  try {
    const { seats } = req.body;

    if (
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Seats array is required",
      });
    }

    const createdSeats = await Seat.insertMany(
      seats.map((seat) => ({
        ...seat,
        status: "available",
      })),
      {
        ordered: false,
      }
    );

    res.status(201).json({
      success: true,
      message: "Seats created successfully",
      count: createdSeats.length,
      seats: createdSeats,
    });
  } catch (error) {
    console.error(
      "Create multiple seats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Some seats could not be created. Check for duplicate seat numbers.",
    });
  }
};

module.exports = {
  getSeatsByMatch,
  getSeatById,
  lockSeats,
  releaseSeats,
  createSeat,
  createMultipleSeats,
};