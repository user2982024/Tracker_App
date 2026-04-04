const { body, param } = require("express-validator");

// Create Note Validator
const validateCreateNote = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters")
    .trim(),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters")
    .trim(),
];

// Update Note Validator
const validateUpdateNote = [
    param("id")
    .isMongoId()
    .withMessage("Invalid note ID"),

    body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters")
    .trim(),

  body("content")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters")
    .trim(),
];

// Note ID Validator (for get, delete, archive, etc.)
const validateNoteId = [
    param("id")
    .isMongoId()
    .withMessage("Invalid note ID"),
];

module.exports = {
    validateCreateNote,
    validateUpdateNote,
    validateNoteId,
};