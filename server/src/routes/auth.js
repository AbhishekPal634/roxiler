const express = require("express");
const router = express.Router();
const { userValidationRules, validate } = require("../middleware/validation");
const { generateToken } = require("../utils/jwt");
const User = require("../models/User");

// Common login endpoint for all roles
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

module.exports = router;
