const express = require("express");

const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
} = require("../controllers/matchController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getMatches);
router.get("/:id", getMatchById);

// Admin
router.post("/", protect, adminOnly, createMatch);
router.put("/:id", protect, adminOnly, updateMatch);
router.delete("/:id", protect, adminOnly, deleteMatch);

module.exports = router;