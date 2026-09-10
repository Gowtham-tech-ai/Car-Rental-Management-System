const pool = require("../config/database");

// =====================================================
// CREATE BOOKING
// =====================================================

const createBooking = async (req, res) => {
  try {
    const {
      car_id,
      pickup_location,
      pickup_date,
      return_date,
    } = req.body;

    const user_id = req.user.id;

    // =====================================================
    // VALIDATE REQUIRED FIELDS
    // =====================================================

    if (
      !car_id ||
      !pickup_location ||
      !pickup_date ||
      !return_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    // =====================================================
    // VALIDATE DATES
    // =====================================================

    const startDate = new Date(pickup_date);
    const endDate = new Date(return_date);

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking dates",
      });
    }

    // Return date must be after pickup date
    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    // =====================================================
    // CHECK USER
    // =====================================================

    const [users] = await pool.query(
      `
      SELECT
        id
      FROM users
      WHERE id = ?
      `,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =====================================================
    // CHECK CAR
    // =====================================================

    const [cars] = await pool.query(
      `
      SELECT
        id,
        brand,
        model,
        price,
        status
      FROM cars
      WHERE id = ?
      `,
      [car_id]
    );

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    const car = cars[0];

    // =====================================================
    // CHECK CAR GLOBAL STATUS
    // =====================================================

    if (car.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This car is currently unavailable",
      });
    }

    // =====================================================
    // CHECK OVERLAPPING BOOKINGS
    // =====================================================

    const [existingBookings] = await pool.query(
      `
      SELECT
        id,
        booking_reference,
        pickup_date,
        return_date,
        status
      FROM bookings
      WHERE car_id = ?
        AND status IN (
          'pending',
          'confirmed',
          'active'
        )
        AND pickup_date < ?
        AND return_date > ?
      `,
      [
        car_id,
        return_date,
        pickup_date,
      ]
    );

    if (existingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This car is already booked for the selected dates",
      });
    }

    // =====================================================
    // CALCULATE RENTAL DAYS
    // =====================================================

    const rentalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // =====================================================
    // CALCULATE PRICE
    // =====================================================

    const dailyRate = Number(car.price);

    const totalAmount =
      dailyRate * rentalDays;

    // =====================================================
    // GENERATE BOOKING REFERENCE
    // =====================================================

    const bookingReference =
      `DRV${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`;

    // =====================================================
    // INSERT BOOKING
    // =====================================================

    const [result] = await pool.query(
      `
      INSERT INTO bookings (
        user_id,
        car_id,
        pickup_location,
        pickup_date,
        return_date,
        rental_days,
        daily_rate,
        total_amount,
        status,
        payment_status,
        booking_reference
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        'pending',
        'pending',
        ?
      )
      `,
      [
        user_id,
        car_id,
        pickup_location,
        pickup_date,
        return_date,
        rentalDays,
        dailyRate,
        totalAmount,
        bookingReference,
      ]
    );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",

      booking: {
        id: result.insertId,
        booking_reference:
          bookingReference,

        user_id,
        car_id,

        pickup_location,
        pickup_date,
        return_date,

        rental_days: rentalDays,

        daily_rate: dailyRate,
        total_amount: totalAmount,

        status: "pending",
        payment_status: "pending",
      },
    });
  } catch (error) {
    console.error(
      "Create booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

// =====================================================
// GET MY BOOKINGS
// =====================================================

const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

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

        c.id AS car_id,
        c.brand,
        c.model,
        c.category,
        c.image_url,
        c.seats,
        c.transmission,
        c.fuel

      FROM bookings b

      INNER JOIN cars c
        ON b.car_id = c.id

      WHERE b.user_id = ?

      ORDER BY b.created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get my bookings error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// =====================================================
// CANCEL MY BOOKING
// =====================================================

const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookingId = req.params.id;

    // =====================================================
    // FIND BOOKING
    // =====================================================

    const [bookings] = await pool.query(
      `
      SELECT
        id,
        user_id,
        status,
        payment_status
      FROM bookings
      WHERE id = ?
        AND user_id = ?
      `,
      [
        bookingId,
        userId,
      ]
    );

    // =====================================================
    // BOOKING NOT FOUND
    // =====================================================

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    // =====================================================
    // ONLY PENDING BOOKINGS CAN BE CANCELLED
    // =====================================================

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending bookings can be cancelled",
      });
    }

    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    await pool.query(
      `
      UPDATE bookings
      SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
      `,
      [
        bookingId,
        userId,
      ]
    );

    // =====================================================
    // SUCCESS
    // =====================================================

    return res.status(200).json({
      success: true,
      message:
        "Booking cancelled successfully",
    });
  } catch (error) {
    console.error(
      "Cancel booking error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

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

        c.id AS car_id,
        c.brand,
        c.model,
        c.category,
        c.seats,
        c.transmission,
        c.fuel,
        c.price,
        c.year,
        c.location AS car_location,
        c.image_url,
        c.description,
        c.features,

        u.id AS customer_id,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone

      FROM bookings b

      INNER JOIN cars c
        ON b.car_id = c.id

      INNER JOIN users u
        ON b.user_id = u.id

      WHERE b.id = ?
        AND b.user_id = ?
      `,
      [bookingId, userId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = bookings[0];

    if (typeof booking.features === "string") {
      try {
        booking.features = JSON.parse(booking.features);
      } catch {
        booking.features = [];
      }
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};