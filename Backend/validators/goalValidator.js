const { body, param } = require("express-validator");

// Validate Create Goal
const validateCreateGoal = [
  body("title")
    .notEmpty()
    .withMessage("Goal title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .trim(),

  // Core goal logic
  body("targetValue")
    .notEmpty()
    .withMessage("Target value is required")
    .isInt({ min: 1 })
    .withMessage("Target value must be at least 1"),

  body("currentValue")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current value cannot be negative"),

  body("unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isLength({ max: 50 })
    .withMessage("Unit cannot exceed 50 characters")
    .trim(),

  // Dates
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid date"),

  // Enum fields
  body("category")
    .optional()
    .isIn(["health", "career", "learning", "finance", "personal"])
    .withMessage("Invalid category"),

  body("status")
    .optional()
    .isIn(["active", "completed", "paused"])
    .withMessage("Status must be active, completed, or paused"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];


// Validate Update Goal
const validateUpdateGoal = [
  body("title")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .trim(),

  body("targetValue")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Target value must be at least 1"),

  body("currentValue")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Current value cannot be negative"),

  body("unit")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Unit cannot exceed 50 characters")
    .trim(),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("targetDate")
    .optional()
    .isISO8601()
    .withMessage("Target date must be a valid date"),

  body("category")
    .optional()
    .isIn(["health", "career", "learning", "finance", "personal"])
    .withMessage("Invalid category"),

  body("status")
    .optional()
    .isIn(["active", "completed", "paused"])
    .withMessage("Status must be active, completed, or paused"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];


// Validate Goal ID
const validateGoalId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid goal ID"),
];


// Exports
module.exports = {
  validateCreateGoal,
  validateUpdateGoal,
  validateGoalId,
};