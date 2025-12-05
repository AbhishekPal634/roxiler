const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  userValidationRules,
  storeValidationRules,
} = require("../middleware/validation");
const adminController = require("../controllers/adminController");

// Add user (admin/user/store_owner)
router.post(
  "/users",
  authenticate,
  authorize("admin"),
  userValidationRules.addUser,
  validate,
  adminController.createUser
);

// Add store
router.post(
  "/stores",
  authenticate,
  authorize("admin"),
  storeValidationRules.create,
  validate,
  adminController.createStore
);

// Dashboard stats
router.get(
  "/dashboard/stats",
  authenticate,
  authorize("admin"),
  adminController.getDashboardStats
);

// Fetch stores list
router.get(
  "/stores",
  authenticate,
  authorize("admin"),
  adminController.getStores
);

// Fetch users list
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  adminController.getUsers
);

// View user details
router.get(
  "/users/:id",
  authenticate,
  authorize("admin"),
  adminController.getUserDetails
);

// Logout
router.post(
  "/logout",
  authenticate,
  authorize("admin"),
  adminController.logout
);

module.exports = router;
