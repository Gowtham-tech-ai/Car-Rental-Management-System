const pool = require("../config/database");

// Get all cars
const getCars = async (req, res) => {
  try {
    const [cars] = await pool.query(`
      SELECT
        id,
        brand,
        model,
        category,
        seats,
        transmission,
        fuel,
        price,
        year,
        location,
        image_url,
        description,
        features,
        status
      FROM cars
      ORDER BY id ASC
    `);

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Get cars error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};

// Get single car
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    const [cars] = await pool.query(
      `
      SELECT
        id,
        brand,
        model,
        category,
        seats,
        transmission,
        fuel,
        price,
        year,
        location,
        image_url,
        description,
        features,
        status
      FROM cars
      WHERE id = ?
      `,
      [id]
    );

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car: cars[0],
    });
  } catch (error) {
    console.error("Get car by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch car",
    });
  }
};

module.exports = {
  getCars,
  getCarById,
};