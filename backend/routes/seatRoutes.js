const express = require("express");

const {
  getSeatsByMatch,
  getSeatById,
  lockSeats,
  releaseSeats,
  createSeat,
  createMultipleSeats,
} = require("../controllers/seatController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC
// ========================================

router.get("/match/:matchId", getSeatsByMatch);

router.get("/:id", getSeatById);

// ========================================
// USER
// ========================================

router.post(
  "/lock",
  protect,
  lockSeats
);

router.post(
  "/release",
  protect,
  releaseSeats
);

// ========================================
// ADMIN
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  createSeat
);

router.post(
  "/bulk",
  protect,
  adminOnly,
  createMultipleSeats
);

module.exports = router;