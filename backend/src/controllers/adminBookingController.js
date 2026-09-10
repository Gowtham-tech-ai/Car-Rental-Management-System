const pool = require("../config/database");

// =====================================================
// GET ALL BOOKINGS - ADMIN
// =====================================================

const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `
      SELECT
        b.id,
        b.booking_reference,
        b.pickup_location,
        b.pickup_date,
        b.return_date,
        b.rental_days,
        b.daily_rate,
        b.total_amount,
        b.status,
        b.payment_status,
        b.created_at,
        b.updated_at,

        u.id AS user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,

        c.id AS car_id,
        c.brand,
        c.model,
        c.category,
        c.image_url,
        c.seats,
        c.transmission,
        c.fuel

      FROM bookings b

      INNER JOIN users u
        ON b.user_id = u.id

      INNER JOIN cars c
        ON b.car_id = c.id

      ORDER BY b.created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Admin get all bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// =====================================================
// UPDATE BOOKING STATUS - ADMIN
// =====================================================

const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const { status } = req.body;

    // =================================================
    // VALID STATUSES
    // =================================================

    const allowedStatuses = [
      "pending",
      "confirmed",
      "active",
      "completed",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    // =================================================
    // CHECK BOOKING
    // =================================================

    const [bookings] = await pool.query(
      `
      SELECT
        id,
        status,
        payment_status
      FROM bookings
      WHERE id = ?
      `,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // =================================================
    // UPDATE STATUS
    // =================================================

    await pool.query(
      `
      UPDATE bookings
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [status, bookingId]
    );

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: {
        id: Number(bookingId),
        status,
      },
    });
  } catch (error) {
    console.error(
      "Admin update booking status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

module.exports = {
  getAllBookings,
  updateBookingStatus,
};