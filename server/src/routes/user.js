const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  validate,
  userValidationRules,
  ratingValidationRules,
} = require("../middleware/validation");
const userController = require("../controllers/userController");

// Signup
router.post(
  "/signup",
  userValidationRules.signup,
  validate,
  userController.signup
);

// Update password
router.put(
  "/password",
  authenticate,
  authorize("user"),
  userValidationRules.updatePassword,
  validate,
  userController.updatePassword
);

// List all stores with user's rating
router.get(
  "/stores",
  authenticate,
  authorize("user"),
  userController.getStores
);

// Submit rating
router.post(
  "/ratings",
  authenticate,
  authorize("user"),
  ratingValidationRules.submit,
  validate,
  userController.submitRating
);

// Update rating
router.put(
  "/ratings",
  authenticate,
  authorize("user"),
  ratingValidationRules.submit,
  validate,
  userController.updateRating
);

// Logout
router.post("/logout", authenticate, authorize("user"), userController.logout);

module.exports = router;
