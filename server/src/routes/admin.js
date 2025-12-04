const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  userValidationRules,
  storeValidationRules,
} = require("../middleware/validation");
const { invalidateToken } = require("../utils/tokenBlacklist");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

// Add user (admin/user/store_owner)
router.post(
  "/users",
  authenticate,
  authorize("admin"),
  userValidationRules.addUser,
  validate,
  async (req, res) => {
    try {
      const { name, email, password, address, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const user = await User.create({ name, email, password, address, role });

      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error: error.message,
      });
    }
  }
);

// Add store
router.post(
  "/stores",
  authenticate,
  authorize("admin"),
  storeValidationRules.create,
  validate,
  async (req, res) => {
    try {
      const { name, email, address, owner_id } = req.body;

      // Verify owner exists and is a store_owner
      const owner = await User.findById(owner_id);
      if (!owner) {
        return res.status(404).json({
          success: false,
          message: "Owner not found",
        });
      }

      if (owner.role !== "store_owner") {
        return res.status(400).json({
          success: false,
          message: "Owner must have store_owner role",
        });
      }

      // Check if owner already has a store
      const existingStore = await Store.findByOwnerId(owner_id);
      if (existingStore) {
        return res.status(400).json({
          success: false,
          message: "This store owner already has a store",
        });
      }

      const store = await Store.create({ name, email, address, owner_id });

      res.status(201).json({
        success: true,
        message: "Store created successfully",
        data: store,
      });
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create store",
        error: error.message,
      });
    }
  }
);

// Dashboard stats
router.get(
  "/dashboard/stats",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const [totalUsers, totalStores, totalRatings] = await Promise.all([
        User.getTotalCount(),
        Store.getTotalCount(),
        Rating.getTotalCount(),
      ]);

      res.json({
        success: true,
        data: {
          totalUsers,
          totalStores,
          totalRatings,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error.message,
      });
    }
  }
);

// Fetch stores list
router.get("/stores", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;

    const stores = await Store.getAll({
      name,
      address,
      sortBy,
      sortOrder,
    });

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

// Fetch users list
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    const users = await User.getAll({
      name,
      email,
      address,
      role,
      sortBy,
      sortOrder,
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// View user details
router.get("/users/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.getUserWithStoreRating(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.created_at,
    };

    // If user is store owner, include store rating
    if (user.role === "store_owner" && user.store_id) {
      response.store = {
        id: user.store_id,
        name: user.store_name,
        rating: parseFloat(user.store_rating || 0).toFixed(2),
      };
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
});

// Logout
router.post("/logout", authenticate, authorize("admin"), async (req, res) => {
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
