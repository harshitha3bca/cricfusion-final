const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Batter",
        "Bowler",
        "All-rounder",
        "Wicket-keeper",
      ],
      required: true,
    },

    nationality: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Player", playerSchema);