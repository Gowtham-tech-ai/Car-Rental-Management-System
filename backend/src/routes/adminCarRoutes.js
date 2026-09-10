const express = require("express");

const {
  getAllCars,
  createCar,
  updateCar,
  deactivateCar,
} = require("../controllers/adminCarController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllCars
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCar
);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCar
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  adminMiddleware,
  deactivateCar
);

module.exports = router;