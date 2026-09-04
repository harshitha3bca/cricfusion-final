const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema(
  {
    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },

    slotNumber: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleType: {
      type: String,
      enum: ["car", "bike", "other"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    bookedForMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

parkingSchema.index(
  { stadium: 1, slotNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Parking", parkingSchema);