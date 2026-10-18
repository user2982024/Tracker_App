const { body, param } = require("express-validator");

// CREATE NOTE VALIDATOR
const validateCreateNote = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .isString()
    .withMessage("Content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters"),
];

// PUT replaces the note body, so both fields are required.
const validateUpdateNote = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("content")
    .isString()
    .withMessage("Content must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .bail()
    .isLength({ max: 5000 })
    .withMessage("Content cannot exceed 5000 characters"),
];

// NOTE ID VALIDATOR
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
