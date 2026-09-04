
const mongoose = require("mongoose");
const crypto = require("crypto");

const Booking = require("../models/Booking");
const Match = require("../models/Match");
const Seat = require("../models/Seat");
const Parking = require("../models/Parking");

// ========================================
// GENERATE BOOKING REFERENCE
// ========================================

const generateBookingReference = () => {
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CF-${Date.now()}-${randomPart}`;
};

// ========================================
// CREATE BOOKING
// ========================================

const createBooking = async (req, res) => {
  try {
    const {
      matchId,
      seatIds,
      parkingId,
    } = req.body;

    // ------------------------------------
    // VALIDATION
    // ------------------------------------

    if (!matchId) {
      return res.status(400).json({
        success: false,
        message: "Match ID is required",
      });
    }

    if (
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one seat is required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(matchId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid match ID",
      });
    }

    // ------------------------------------
    // FIND MATCH
    // ------------------------------------

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    // ------------------------------------
    // CLEAN SEAT IDS
    // ------------------------------------

    const uniqueSeatIds = [
      ...new Set(seatIds.map(String)),
    ];

    const invalidSeatIds =
      uniqueSeatIds.filter(
        (id) =>
          !mongoose.Types.ObjectId.isValid(id)
      );

    if (invalidSeatIds.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "One or more seat IDs are invalid",
      });
    }

    // ------------------------------------
    // FIND SEATS
    // ------------------------------------

    const seats = await Seat.find({
      _id: {
        $in: uniqueSeatIds,
      },
      match: matchId,
    });

    if (
      seats.length !== uniqueSeatIds.length
    ) {
      return res.status(404).json({
        success: false,
        message:
          "One or more selected seats were not found for this match",
      });
    }

    // ------------------------------------
    // CHECK SEAT LOCK
    // ------------------------------------

    const now = new Date();

    const invalidSeats = seats.filter(
      (seat) =>
        seat.status !== "locked" ||
        !seat.lockedBy ||
        seat.lockedBy.toString() !==
          req.user._id.toString() ||
        !seat.lockedUntil ||
        seat.lockedUntil <= now
    );

    if (invalidSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "One or more seats are not locked by you or their lock has expired",
      });
    }

    // ------------------------------------
    // PARKING
    // ------------------------------------

    let parking = null;

    if (parkingId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          parkingId
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid parking ID",
        });
      }

      parking = await Parking.findOne({
        _id: parkingId,
        stadium: match.stadium,
      });

      if (!parking) {
        return res.status(404).json({
          success: false,
          message:
            "Parking slot not found for this stadium",
        });
      }

      if (
        parking.status !== "reserved" ||
        !parking.bookedBy ||
        parking.bookedBy.toString() !==
          req.user._id.toString() ||
        !parking.bookedForMatch ||
        parking.bookedForMatch.toString() !==
          matchId
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Parking slot is not reserved by you for this match",
        });
      }
    }

    // ------------------------------------
    // CALCULATE AMOUNTS
    // ------------------------------------

    const ticketAmount = seats.reduce(
      (total, seat) =>
        total + Number(seat.price || 0),
      0
    );

    const parkingAmount = parking
      ? Number(parking.price || 0)
      : 0;

    const totalAmount =
      ticketAmount + parkingAmount;

    // ------------------------------------
    // BOOKING REFERENCE
    // ------------------------------------

    const bookingReference =
      generateBookingReference();

    // ------------------------------------
    // CREATE BOOKING
    // ------------------------------------

    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      match: matchId,
      seats: uniqueSeatIds,
      parkingSlot: parking
        ? parking._id
        : null,
      ticketAmount,
      parkingAmount,
      totalAmount,
      status: "pending",
      qrCode: "",
    });

    // ------------------------------------
    // BOOK SEATS
    // ------------------------------------

    await Seat.updateMany(
      {
        _id: {
          $in: uniqueSeatIds,
        },
        status: "locked",
        lockedBy: req.user._id,
      },
      {
        $set: {
          status: "booked",
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    // ------------------------------------
    // PARKING REMAINS RESERVED
    // ------------------------------------

    const populatedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("match")
        .populate("seats")
        .populate("parkingSlot");

    res.status(201).json({
      success: true,
      message:
        "Booking created successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create booking",
    });
  }
};

// ========================================
// CONFIRM BOOKING
// DEMO PAYMENT SUCCESS
// ========================================

const confirmBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      );

    // ------------------------------------
    // CHECK BOOKING
    // ------------------------------------

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ------------------------------------
    // CHECK USER
    // ------------------------------------

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ------------------------------------
    // CHECK STATUS
    // ------------------------------------

    if (booking.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message:
          "Booking is already confirmed",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled booking cannot be confirmed",
      });
    }

    // ------------------------------------
    // CONFIRM BOOKING
    // ------------------------------------

    booking.status = "confirmed";

    await booking.save();

    // ------------------------------------
    // OCCUPY PARKING
    // ------------------------------------

    if (booking.parkingSlot) {
      await Parking.findOneAndUpdate(
        {
          _id: booking.parkingSlot,
          bookedBy: req.user._id,
          bookedForMatch: booking.match,
          status: "reserved",
        },
        {
          $set: {
            status: "occupied",
          },
        }
      );
    }

    // ------------------------------------
    // GET UPDATED BOOKING
    // ------------------------------------

    const confirmedBooking =
      await Booking.findById(
        booking._id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("match")
        .populate("seats")
        .populate("parkingSlot");

    // ------------------------------------
    // RESPONSE
    // ------------------------------------

    res.status(200).json({
      success: true,
      message:
        "Booking confirmed successfully",
      booking: confirmedBooking,
    });

  } catch (error) {
    console.error(
      "Confirm booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to confirm booking",
    });
  }
};

// ========================================
// GET MY BOOKINGS
// ========================================

const getMyBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await Booking.find({
        user: req.user._id,
      })
        .populate("match")
        .populate("seats")
        .populate("parkingSlot")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error(
      "Get my bookings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch bookings",
    });
  }
};

// ========================================
// GET BOOKING BY ID
// ========================================

const getBookingById = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email"
        )
        .populate("match")
        .populate("seats")
        .populate("parkingSlot");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    if (
      booking.user._id.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });

  } catch (error) {
    console.error(
      "Get booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch booking",
    });
  }
};

// ========================================
// CANCEL BOOKING
// ========================================

const cancelBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await Booking.findById(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Booking not found",
      });
    }

    if (
      booking.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (
      booking.status === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Booking is already cancelled",
      });
    }

    // ------------------------------------
    // CANCEL BOOKING
    // ------------------------------------

    booking.status = "cancelled";

    await booking.save();

    // ------------------------------------
    // RELEASE SEATS
    // ------------------------------------

    await Seat.updateMany(
      {
        _id: {
          $in: booking.seats,
        },
        status: "booked",
      },
      {
        $set: {
          status: "available",
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    // ------------------------------------
    // RELEASE PARKING
    // ------------------------------------

    if (booking.parkingSlot) {
      await Parking.findOneAndUpdate(
        {
          _id: booking.parkingSlot,
          bookedBy: req.user._id,
        },
        {
          $set: {
            status: "available",
            bookedBy: null,
            bookedForMatch: null,
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message:
        "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to cancel booking",
    });
  }
};

// ========================================
// GET ALL BOOKINGS
// ADMIN ONLY
// ========================================

const getAllBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await Booking.find()
        .populate(
          "user",
          "name email"
        )
        .populate("match")
        .populate("seats")
        .populate("parkingSlot")
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error(
      "Get all bookings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch bookings",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  createBooking,
  confirmBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
