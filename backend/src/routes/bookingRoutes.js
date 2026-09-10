const express = require("express");

const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CREATE BOOKING
// POST /api/bookings
// =====================================================

router.post(
  "/",
  authMiddleware,
  createBooking
);

// =====================================================
// GET MY BOOKINGS
// GET /api/bookings/my
// =====================================================

router.get(
  "/my",
  authMiddleware,
  getMyBookings
);

// =====================================================
// CANCEL MY BOOKING
// PATCH /api/bookings/:id/cancel
// =====================================================

router.patch(
  "/:id/cancel",
  authMiddleware,
  cancelBooking
);

router.get("/:id", authMiddleware, getBookingById);

module.exports = router;