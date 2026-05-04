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

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

// Validate update goal
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

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

// Validate goal id
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