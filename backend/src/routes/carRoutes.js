const express = require("express");

const {
  getCars,
  getCarById,
} = require("../controllers/carController");

const router = express.Router();

router.get("/", getCars);

router.get("/:id", getCarById);

module.exports = router;