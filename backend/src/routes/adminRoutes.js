const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// =====================================================

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;