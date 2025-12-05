const { invalidateToken } = require("../utils/tokenBlacklist");
const User = require("../models/User");
const Store = require("../models/Store");
const Rating = require("../models/Rating");

/**
 * Create a new user (admin, normal_user, or store_owner)
 */
exports.createUser = async (req, res) => {
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
};

/**
 * Create a new store
 */
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create store owner user with auto-generated name
    const ownerName = `${name} Owner`;
    const owner = await User.create({
      name: ownerName,
      email,
      address,
      password,
      role: "store_owner",
    });

    // Create store linked to the new owner
    const store = await Store.create({
      name,
      email,
      address,
      owner_id: owner.id,
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: {
        store,
        credentials: {
          email: owner.email,
          password: password, // Return plain password for admin to share
          name: owner.name,
        },
      },
    });
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create store",
      error: error.message,
    });
  }
};

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
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
};

/**
 * Get all stores with filters and sorting
 */
exports.getStores = async (req, res) => {
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
};

/**
 * Get all users with filters and sorting
 */
exports.getUsers = async (req, res) => {
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
};

/**
 * Get user details by ID
 */
exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userDetails = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

    // If user is a store owner, include their store's rating
    if (user.role === "store_owner") {
      const store = await Store.findByOwnerId(user.id);
      if (store) {
        userDetails.store = {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          rating: parseFloat(store.average_rating).toFixed(2),
          totalRatings: store.total_ratings,
        };
      }
    }

    res.json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

/**
 * Logout admin
 */
exports.logout = async (req, res) => {
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
};
