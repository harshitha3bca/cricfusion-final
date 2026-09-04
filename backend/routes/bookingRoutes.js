
const express = require("express");

const {
  createBooking,
  confirmBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// USER BOOKING ROUTES
// ========================================

// Create booking

router.post(
  "/",
  protect,
  createBooking
);

// Confirm booking after demo payment

router.put(
  "/:id/confirm",
  protect,
  confirmBooking
);

// Get logged-in user's bookings

router.get(
  "/my",
  protect,
  getMyBookings
);

// Get one booking

router.get(
  "/:id",
  protect,
  getBookingById
);

// Cancel booking

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

// ========================================
// ADMIN BOOKING ROUTES
// ========================================

// Get all bookings

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBookings
);

module.exports = router;
