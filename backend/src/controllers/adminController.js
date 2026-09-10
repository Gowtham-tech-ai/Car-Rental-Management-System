const pool = require("../config/database");

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

const getDashboardStats = async (req, res) => {
  try {
    // =====================================================
    // TOTAL USERS
    // =====================================================

    const [userResult] = await pool.query(
      `
      SELECT COUNT(*) AS total_users
      FROM users
      `
    );

    // =====================================================
    // TOTAL CARS
    // =====================================================

    const [carResult] = await pool.query(
      `
      SELECT COUNT(*) AS total_cars
      FROM cars
      WHERE status != 'inactive'
      `
    );

    // =====================================================
    // TOTAL BOOKINGS
    // =====================================================

    const [bookingResult] = await pool.query(
      `
      SELECT COUNT(*) AS total_bookings
      FROM bookings
      `
    );

    // =====================================================
    // TOTAL REVENUE
    // =====================================================

    const [revenueResult] = await pool.query(
      `
      SELECT
        COALESCE(
          SUM(total_amount),
          0
        ) AS total_revenue
      FROM bookings
      WHERE status IN (
        'confirmed',
        'active',
        'completed'
      )
      `
    );

    // =====================================================
    // PENDING BOOKINGS
    // =====================================================

    const [pendingResult] = await pool.query(
      `
      SELECT COUNT(*) AS pending_bookings
      FROM bookings
      WHERE status = 'pending'
      `
    );

    // =====================================================
    // ACTIVE BOOKINGS
    // =====================================================

    const [activeResult] = await pool.query(
      `
      SELECT COUNT(*) AS active_bookings
      FROM bookings
      WHERE status = 'active'
      `
    );

    // =====================================================
    // COMPLETED BOOKINGS
    // =====================================================

    const [completedResult] = await pool.query(
      `
      SELECT COUNT(*) AS completed_bookings
      FROM bookings
      WHERE status = 'completed'
      `
    );

    // =====================================================
    // CANCELLED BOOKINGS
    // =====================================================

    const [cancelledResult] = await pool.query(
      `
      SELECT COUNT(*) AS cancelled_bookings
      FROM bookings
      WHERE status = 'cancelled'
      `
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      stats: {
        total_users:
          Number(
            userResult[0].total_users
          ),

        total_cars:
          Number(
            carResult[0].total_cars
          ),

        total_bookings:
          Number(
            bookingResult[0].total_bookings
          ),

        total_revenue:
          Number(
            revenueResult[0].total_revenue
          ),

        pending_bookings:
          Number(
            pendingResult[0].pending_bookings
          ),

        active_bookings:
          Number(
            activeResult[0].active_bookings
          ),

        completed_bookings:
          Number(
            completedResult[0].completed_bookings
          ),

        cancelled_bookings:
          Number(
            cancelledResult[0].cancelled_bookings
          ),
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};