const { body } = require('express-validator');

exports.notesValidator = [
    body("title")
      .trim()
      .notEmpty().withMessage("Title is required")
      .isLength({ max: 50 }).withMessage("Title cannot exceed 50 characters"),

    body("content")
      .optional()
      .trim()
      .isLength({ max: 5000 }).withMessage("Content cannot exceed 5000 characters"),

    body("isPinned")
      .optional()
      .isBoolean().withMessage("isPinned must be a boolean"),

     body("isArchieved")
      .optional()
      .isBoolean()
      .withMessage("isArchieved must be a boolean"),
];