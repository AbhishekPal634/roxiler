const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  userValidationRules,
  ratingValidationRules,
} = require("../middleware/validation");
const { generateToken } = require("../utils/jwt");
const { invalidateToken } = require("../utils/tokenBlacklist");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

// Signup
router.post(
  "/signup",
  userValidationRules.signup,
  validate,
  async (req, res) => {
    try {
      const { name, email, password, address } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      // Create user with 'user' role
      const user = await User.create({
        name,
        email,
        password,
        address,
        role: "user",
      });

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
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
      console.error("Error during signup:", error);
      res.status(500).json({
        success: false,
        message: "Failed to register user",
        error: error.message,
      });
    }
  }
);

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
    if (user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This endpoint is for normal users only.",
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
  authorize("user"),
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

// List all stores
router.get("/stores", authenticate, authorize("user"), async (req, res) => {
  try {
    const { name, address } = req.query;

    const stores = await Store.getAll({ name, address });

    res.json({
      success: true,
      data: stores.map((store) => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: parseFloat(store.average_rating).toFixed(2),
        totalRatings: store.total_ratings,
      })),
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
      error: error.message,
    });
  }
});

// Submit rating
router.post(
  "/ratings",
  authenticate,
  authorize("user"),
  ratingValidationRules.submit,
  validate,
  async (req, res) => {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Check if store exists
      const store = await Store.findById(store_id);
      if (!store) {
        return res.status(404).json({
          success: false,
          message: "Store not found",
        });
      }

      // Check if user has already rated
      const existingRating = await Rating.findByUserAndStore(user_id, store_id);
      if (existingRating) {
        return res.status(400).json({
          success: false,
          message:
            "You have already rated this store. Use the update endpoint to change your rating.",
        });
      }

      const newRating = await Rating.create({ user_id, store_id, rating });

      res.status(201).json({
        success: true,
        message: "Rating submitted successfully",
        data: newRating,
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit rating",
        error: error.message,
      });
    }
  }
);

// Update rating
router.put(
  "/ratings",
  authenticate,
  authorize("user"),
  ratingValidationRules.submit,
  validate,
  async (req, res) => {
    try {
      const { store_id, rating } = req.body;
      const user_id = req.user.id;

      // Check if rating exists
      const existingRating = await Rating.findByUserAndStore(user_id, store_id);
      if (!existingRating) {
        return res.status(404).json({
          success: false,
          message:
            "You have not rated this store yet. Use the submit endpoint to add a rating.",
        });
      }

      const updatedRating = await Rating.update({ user_id, store_id, rating });

      res.json({
        success: true,
        message: "Rating updated successfully",
        data: updatedRating,
      });
    } catch (error) {
      console.error("Error updating rating:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update rating",
        error: error.message,
      });
    }
  }
);

// Logout
router.post("/logout", authenticate, authorize("user"), async (req, res) => {
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
});

module.exports = router;
