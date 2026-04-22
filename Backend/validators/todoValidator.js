const { body, param } = require("express-validator");

// Validate create todo
const validateCreateTodo = [
  body("title")
    .notEmpty()
    .withMessage("Todo title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .trim(),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),
];

// Validate update todo
const validateUpdateTodo = [
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

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),
];

// Validate todo id
const validateTodoId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid todo ID"),
];

// Exports
module.exports = {
  validateCreateTodo,
  validateUpdateTodo,
  validateTodoId,
};