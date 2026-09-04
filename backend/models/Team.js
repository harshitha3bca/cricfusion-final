const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortName: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    tournamentType: {
      type: String,
      enum: ["IPL", "WPL"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamSchema);