const express = require("express");

const {
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/adminBookingController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================================
// GET ALL BOOKINGS
// GET /api/admin/bookings
// =====================================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

// =====================================================
// UPDATE BOOKING STATUS
// PATCH /api/admin/bookings/:id/status
// =====================================================

router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

module.exports = router;