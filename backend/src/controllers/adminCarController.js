const pool = require("../config/database");

const getAllCars = async (req, res) => {
  try {
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
        status,
        created_at,
        updated_at
      FROM cars
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    console.error("Admin get all cars error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};

const createCar = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (
      !brand ||
      !model ||
      !category ||
      !seats ||
      !transmission ||
      !fuel ||
      !price ||
      !year ||
      !location ||
      !image_url
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required car details",
      });
    }

    let featuresJson = null;

    if (features) {
      if (Array.isArray(features)) {
        featuresJson = JSON.stringify(features);
      } else {
        featuresJson = JSON.stringify(
          String(features)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        );
      }
    }

    const [result] = await pool.query(
      `
      INSERT INTO cars (
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
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
      `,
      [
        brand.trim(),
        model.trim(),
        category.trim(),
        Number(seats),
        transmission.trim(),
        fuel.trim(),
        Number(price),
        Number(year),
        location.trim(),
        image_url.trim(),
        description?.trim() || null,
        featuresJson,
      ]
    );

    const [cars] = await pool.query(
      `
      SELECT *
      FROM cars
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Car created successfully",
      car: cars[0],
    });
  } catch (error) {
    console.error("Admin create car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create car",
    });
  }
};

const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;

    const {
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
      status,
    } = req.body;

    // Check whether car exists
    const [existingCars] = await pool.query(
      `
      SELECT id
      FROM cars
      WHERE id = ?
      `,
      [carId]
    );

    if (existingCars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Validate required fields
    if (
      !brand ||
      !model ||
      !category ||
      !seats ||
      !transmission ||
      !fuel ||
      !price ||
      !year ||
      !location ||
      !image_url
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required car details",
      });
    }

    // Validate status
    const allowedStatuses = [
      "available",
      "booked",
      "maintenance",
      "inactive",
    ];

    const carStatus = status || "available";

    if (!allowedStatuses.includes(carStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car status",
      });
    }

    // Prepare features
    let featuresJson = null;

    if (features) {
      if (Array.isArray(features)) {
        featuresJson = JSON.stringify(features);
      } else {
        featuresJson = JSON.stringify(
          String(features)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        );
      }
    }

    // Update car
    await pool.query(
      `
      UPDATE cars
      SET
        brand = ?,
        model = ?,
        category = ?,
        seats = ?,
        transmission = ?,
        fuel = ?,
        price = ?,
        year = ?,
        location = ?,
        image_url = ?,
        description = ?,
        features = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        brand.trim(),
        model.trim(),
        category.trim(),
        Number(seats),
        transmission.trim(),
        fuel.trim(),
        Number(price),
        Number(year),
        location.trim(),
        image_url.trim(),
        description?.trim() || null,
        featuresJson,
        carStatus,
        carId,
      ]
    );

    // Get updated car
    const [updatedCars] = await pool.query(
      `
      SELECT *
      FROM cars
      WHERE id = ?
      `,
      [carId]
    );

    return res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: updatedCars[0],
    });
  } catch (error) {
    console.error("Admin update car error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update car",
    });
  }
};

const deactivateCar = async (req, res) => {
  try {
    const carId = req.params.id;

    // Check whether the car exists
    const [cars] = await pool.query(
      `
      SELECT
        id,
        brand,
        model,
        status
      FROM cars
      WHERE id = ?
      `,
      [carId]
    );

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Prevent deactivating an already inactive car
    if (cars[0].status === "inactive") {
      return res.status(400).json({
        success: false,
        message: "Car is already inactive",
      });
    }

    // Check for current bookings
    const [activeBookings] = await pool.query(
      `
      SELECT
        id,
        booking_reference,
        status,
        pickup_date,
        return_date
      FROM bookings
      WHERE car_id = ?
        AND status IN ('pending', 'confirmed', 'active')
        AND return_date >= CURDATE()
      ORDER BY pickup_date ASC
      `,
      [carId]
    );

    if (activeBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "This car cannot be deactivated because it has active or upcoming bookings",
        bookings: activeBookings,
      });
    }

    // Deactivate car
    await pool.query(
      `
      UPDATE cars
      SET
        status = 'inactive',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [carId]
    );

    // Get updated car
    const [updatedCars] = await pool.query(
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
        status,
        updated_at
      FROM cars
      WHERE id = ?
      `,
      [carId]
    );

    return res.status(200).json({
      success: true,
      message: "Car deactivated successfully",
      car: updatedCars[0],
    });
  } catch (error) {
    console.error(
      "Admin deactivate car error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate car",
    });
  }
};

module.exports = {
  getAllCars,
  createCar,
  updateCar,
  deactivateCar,
};