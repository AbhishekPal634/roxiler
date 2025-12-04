const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const storeOwnerRoutes = require("./routes/storeOwner");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`Server is running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log("=".repeat(50));
  //   console.log("\nAPI Endpoints:");
  //   console.log("  Auth: /api/auth/login");
  //   console.log("  Admin: /api/admin/*");
  //   console.log("  User: /api/user/*");
  //   console.log("  Store Owner: /api/store-owner/*");
  //   console.log("=".repeat(50));
});

module.exports = app;
