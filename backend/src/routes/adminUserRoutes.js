const express = require("express");

const {
  getAllUsers,
  updateUserRole,
} = require("../controllers/adminUserController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// GET ALL USERS
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// UPDATE USER ROLE
router.patch(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  updateUserRole
);

module.exports = router;