const { body, param } = require("express-validator");

// CREATE NOTE VALIDATOR
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

// UPDATE NOTE VALIDATOR 
const validateUpdateNote = [
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