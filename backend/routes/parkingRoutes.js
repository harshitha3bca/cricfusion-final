const express = require("express");

const {
  getParkingByMatch,
  getParkingById,
  reserveParking,
  releaseParking,
  createParking,
  createMultipleParking,
  updateParking,
  deleteParking,
} = require("../controllers/parkingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// PUBLIC
// ========================================

router.get(
  "/match/:matchId",
  getParkingByMatch
);

router.get(
  "/:id",
  getParkingById
);

// ========================================
// USER
// ========================================

router.post(
  "/reserve",
  protect,
  reserveParking
);

router.post(
  "/release",
  protect,
  releaseParking
);

// ========================================
// ADMIN
// ========================================

router.post(
  "/",
  protect,
  adminOnly,
  createParking
);

router.post(
  "/bulk",
  protect,
  adminOnly,
  createMultipleParking
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateParking
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteParking
);

module.exports = router;