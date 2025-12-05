const { invalidateToken } = require("../utils/tokenBlacklist");
const User = require("../models/User");
const Store = require("../models/Store");

/**
 * Update store owner password
 */
exports.updatePassword = async (req, res) => {
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
};

/**
 * Get store owner dashboard data
 */
exports.getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const dashboardData = await Store.getOwnerDashboard(ownerId);

    if (!dashboardData) {
      return res.status(404).json({
        success: false,
        message: "Store not found for this owner",
      });
    }

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};

/**
 * Logout store owner
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
