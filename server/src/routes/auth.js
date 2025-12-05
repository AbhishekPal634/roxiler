const express = require("express");
const router = express.Router();
const { userValidationRules, validate } = require("../middleware/validation");
const authController = require("../controllers/authController");

// Common login endpoint for all roles
router.post(
  "/login",
  userValidationRules.login,
  validate,
  authController.login
);

module.exports = router;
