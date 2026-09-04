const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// ========================================
// ROUTES
// ========================================

const authRoutes = require("./routes/authRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const playerRoutes = require("./routes/playerRoutes");
const matchRoutes = require("./routes/matchRoutes");
const stadiumRoutes = require("./routes/stadiumRoutes");
const seatRoutes = require("./routes/seatRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ========================================
// ENVIRONMENT
// ========================================

dotenv.config();

// ========================================
// DATABASE
// ========================================

connectDB();

// ========================================
// EXPRESS APP
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// ========================================
// HOME / HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CricFusion backend is running",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);

app.use(
  "/api/tournaments",
  tournamentRoutes
);

app.use("/api/teams", teamRoutes);

app.use("/api/players", playerRoutes);

app.use("/api/matches", matchRoutes);

app.use("/api/stadiums", stadiumRoutes);

app.use("/api/seats", seatRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/bookings", bookingRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CricFusion backend running on port ${PORT}`
  );
});