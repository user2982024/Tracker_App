const { body } = require("express-validator");

exports.todoValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Todo title is required")
    .isLength({ max: 100 })
    .withMessage("Todo title cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];
