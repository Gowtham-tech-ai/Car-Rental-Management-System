require("dotenv").config();

const express = require("express");
const cors = require("cors");

const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminBookingRoutes = require("./routes/adminBookingRoutes");
const adminCarRoutes = require("./routes/adminCarRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DriveEase API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

app.get("/api/db-test", async (req, res) => {
  res.json({
    success: true,
    message: "TiDB database connected successfully",
  });
});

app.use("/api/cars", carRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/admin/bookings",
  adminBookingRoutes
);
app.use("/api/admin/cars", adminCarRoutes);
app.use("/api/admin/users", adminUserRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});