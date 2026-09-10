const pool = require("../config/database");

// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin get users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// ==========================================
// UPDATE USER ROLE
// ==========================================

const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    // Validate user ID
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Validate role
    const allowedRoles = ["customer", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Use customer or admin",
      });
    }

    // Prevent admin from changing their own role
    if (req.user.id === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own admin role",
      });
    }

    // Check whether user exists
    const [users] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // No change needed
    if (users[0].role === role) {
      return res.status(400).json({
        success: false,
        message: `User is already a ${role}`,
      });
    }

    // Update role
    await pool.query(
      `
      UPDATE users
      SET
        role = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [role, userId]
    );

    // Get updated user
    const [updatedUsers] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error(
      "Admin update user role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
};