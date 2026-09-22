const express = require("express");

const {
  createBooking,
  confirmBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  getPublicTicketByReference,
} = require("../controllers/bookingController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router =
  express.Router();

/* =====================================================
   CREATE BOOKING
===================================================== */

router.post(
  "/",
  protect,
  createBooking
);

/* =====================================================
   CONFIRM BOOKING
===================================================== */

router.put(
  "/:id/confirm",
  protect,
  confirmBooking
);

/* =====================================================
   MY BOOKINGS
===================================================== */

router.get(
  "/my",
  protect,
  getMyBookings
);

/* =====================================================
   PUBLIC QR TICKET

   IMPORTANT:
   This route MUST come before /:id
===================================================== */

router.get(
  "/ticket/:bookingReference",
  getPublicTicketByReference
);

/* =====================================================
   SINGLE BOOKING
===================================================== */

router.get(
  "/:id",
  protect,
  getBookingById
);

/* =====================================================
   CANCEL BOOKING
===================================================== */

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);

/* =====================================================
   ADMIN BOOKINGS
===================================================== */

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBookings
);

module.exports =
  router;