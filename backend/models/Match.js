const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },

    teamA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    teamB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    stadium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stadium",
      required: true,
    },

    matchNumber: {
      type: Number,
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);