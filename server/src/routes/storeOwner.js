const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { validate, userValidationRules } = require("../middleware/validation");
const { generateToken } = require("../utils/jwt");
const { invalidateToken } = require("../utils/tokenBlacklist");
const User = require("../models/User");
const Store = require("../models/Store");

// Login
router.post("/login", userValidationRules.login, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify user role
    if (user.role !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This endpoint is for store owners only.",
      });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Failed to login",
      error: error.message,
    });
  }
});

// Update password
router.put(
  "/password",
  authenticate,
  authorize("store_owner"),
  userValidationRules.updatePassword,
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Verify current password
      const isPasswordValid = await User.comparePassword(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Check if new password is same as current
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: "New password must be different from current password",
        });
      }

      await User.updatePassword(req.user.id, newPassword);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update password",
        error: error.message,
      });
    }
  }
);

// Dashboard - Get store info with ratings
router.get(
  "/dashboard",
  authenticate,
  authorize("store_owner"),
  async (req, res) => {
    try {
      // Get store owned by this user
      const store = await Store.findByOwnerId(req.user.id);

      if (!store) {
        return res.status(404).json({
          success: false,
          message:
            "No store found for this owner. Please contact admin to create a store.",
        });
      }

      // Get all ratings for the store
      const ratings = await Store.getRatingsForStore(store.id);

      res.json({
        success: true,
        data: {
          store: {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            averageRating: parseFloat(store.average_rating).toFixed(2),
            totalRatings: store.total_ratings,
          },
          ratingsFromUsers: ratings.map((r) => ({
            ratingId: r.id,
            userId: r.user_id,
            userName: r.user_name,
            userEmail: r.user_email,
            rating: r.rating,
            submittedAt: r.created_at,
            lastUpdated: r.updated_at,
          })),
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
        error: error.message,
      });
    }
  }
);

// Logout
router.post(
  "/logout",
  authenticate,
  authorize("store_owner"),
  async (req, res) => {
    try {
      await invalidateToken(req.token);

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({
        success: false,
        message: "Failed to logout",
        error: error.message,
      });
    }
  }
);

module.exports = router;
