const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  next();
};

// Validation rules
const userValidationRules = {
  signup: [
    body("name")
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required")
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters"),
  ],

  login: [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password").notEmpty().withMessage("Password is required"),
  ],

  updatePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

    body("newPassword")
      .isLength({ min: 8, max: 16 })
      .withMessage("New password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
      .withMessage(
        "New password must contain at least one uppercase letter and one special character"
      ),
  ],

  addUser: [
    body("name")
      .trim()
      .isLength({ min: 20, max: 60 })
      .withMessage("Name must be between 20 and 60 characters"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be between 8 and 16 characters")
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required")
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters"),

    body("role")
      .isIn(["admin", "user", "store_owner"])
      .withMessage("Role must be one of: admin, user, store_owner"),
  ],
};

const storeValidationRules = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Store name is required")
      .isLength({ max: 255 })
      .withMessage("Store name must not exceed 255 characters"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),

    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required")
      .isLength({ max: 400 })
      .withMessage("Address must not exceed 400 characters"),

    body("password")
      .isLength({ min: 8, max: 16 })
      .withMessage("Password must be 8-16 characters long")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),
  ],
};

const ratingValidationRules = {
  submit: [
    body("store_id")
      .isInt({ min: 1 })
      .withMessage("Valid store ID is required"),

    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
  ],
};

module.exports = {
  validate,
  userValidationRules,
  storeValidationRules,
  ratingValidationRules,
};
