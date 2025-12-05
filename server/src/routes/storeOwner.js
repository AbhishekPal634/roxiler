const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const { validate, userValidationRules } = require("../middleware/validation");
const storeOwnerController = require("../controllers/storeOwnerController");

// Update password
router.put(
  "/password",
  authenticate,
  authorize("store_owner"),
  userValidationRules.updatePassword,
  validate,
  storeOwnerController.updatePassword
);

// Dashboard - Get store info with ratings
router.get(
  "/dashboard",
  authenticate,
  authorize("store_owner"),
  storeOwnerController.getDashboard
);

// Logout
router.post(
  "/logout",
  authenticate,
  authorize("store_owner"),
  storeOwnerController.logout
);

module.exports = router;
