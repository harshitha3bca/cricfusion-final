const express = require("express");

const {
  getStadiums,
  getStadiumById,
  createStadium,
  updateStadium,
  deleteStadium,
} = require("../controllers/stadiumController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getStadiums);
router.get("/:id", getStadiumById);

// Admin
router.post("/", protect, adminOnly, createStadium);
router.put("/:id", protect, adminOnly, updateStadium);
router.delete("/:id", protect, adminOnly, deleteStadium);

module.exports = router;