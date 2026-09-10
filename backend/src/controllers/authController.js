const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        phone,
        role
      )
      VALUES (?, ?, ?, ?, 'customer')
      `,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        phone ? phone.trim() : null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create account",
    });
  }
};


// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const [users] = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT secret
    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is missing from .env"
      );

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();
    const trimmedPhone = phone ? phone.trim() : null;

    if (trimmedName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (trimmedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name cannot exceed 100 characters",
      });
    }

    if (
      trimmedPhone &&
      !/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    const [users] = await pool.query(
      `
      SELECT id
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

    await pool.query(
      `
      UPDATE users
      SET
        name = ?,
        phone = ?
      WHERE id = ?
      `,
      [
        trimmedName,
        trimmedPhone,
        userId,
      ]
    );

    const [updatedUsers] = await pool.query(
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

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUsers[0],
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  updateProfile,
};