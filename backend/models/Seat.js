const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
      trim: true,
    },

    row: {
      type: String,
      required: true,
      trim: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "locked", "booked"],
      default: "available",
    },

    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

seatSchema.index(
  { match: 1, seatNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Seat", seatSchema);