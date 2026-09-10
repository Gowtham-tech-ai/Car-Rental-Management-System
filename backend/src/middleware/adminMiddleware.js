// =====================================================
// ADMIN AUTHORIZATION MIDDLEWARE
// =====================================================

const adminMiddleware = (req, res, next) => {
  try {
    // authMiddleware should already have
    // added the authenticated user to req.user

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check user role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // User is an admin
    next();
  } catch (error) {
    console.error(
      "Admin authorization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

module.exports = adminMiddleware;