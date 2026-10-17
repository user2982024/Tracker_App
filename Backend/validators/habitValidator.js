
const { body, param, query } = require("express-validator");

// Allowed values
const HABIT_FREQUENCIES = ["daily", "specific_days"];

const HABIT_CATEGORIES = [
  "health",
  "career",
  "learning",
  "finance",
  "personal",
];

const HABIT_PRIORITIES = ["low", "medium", "high"];

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

// Validate Create Habit
const validateCreateHabit = [
  body("title")
    .notEmpty()
    .withMessage("Habit title is required")
    .bail()
    .isString()
    .withMessage("Habit title must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Habit title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  // Frequency and schedule
  body("frequency")
    .optional()
    .isIn(HABIT_FREQUENCIES)
    .withMessage("Frequency must be daily or specific_days"),

  body("daysOfWeek")
    .optional()
    .isArray()
    .withMessage("Days of week must be an array")
    .bail()
    .custom((days) => {
      if (!days.every((day) => WEEKDAYS.includes(day))) {
        throw new Error(
          "Each weekday must be an integer from 0 (Sunday) to 6 (Saturday)"
        );
      }

      if (new Set(days).size !== days.length) {
        throw new Error("Weekdays cannot contain duplicates");
      }

      return true;
    }),

  // Target and measurement unit
  body("targetValue")
    .optional({ values: "null" })
    .isFloat({ min: 0.01 })
    .withMessage("Target value must be greater than 0"),

  body("unit")
    .optional()
    .isString()
    .withMessage("Unit must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Unit cannot exceed 50 characters"),

  // Categorization
  body("category")
    .optional()
    .isIn(HABIT_CATEGORIES)
    .withMessage("Invalid habit category"),

  // Priority
  body("priority")
    .optional()
    .isIn(HABIT_PRIORITIES)
    .withMessage("Priority must be low, medium, or high"),

  // UI / UX
  body("isPinned")
    .optional()
    .isBoolean()
    .withMessage("isPinned must be a boolean"),

  // Start date
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
];

// Validate Update Habit
const validateUpdateHabit = [
  body("title")
    .optional()
    .isString()
    .withMessage("Habit title must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Habit title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("frequency")
    .optional()
    .isIn(HABIT_FREQUENCIES)
    .withMessage("Frequency must be daily or specific_days"),

  body("daysOfWeek")
    .optional()
    .isArray()
    .withMessage("Days of week must be an array")
    .bail()
    .custom((days) => {
      if (!days.every((day) => WEEKDAYS.includes(day))) {
        throw new Error(
          "Each weekday must be an integer from 0 (Sunday) to 6 (Saturday)"
        );
      }

      if (new Set(days).size !== days.length) {
        throw new Error("Weekdays cannot contain duplicates");
      }

      return true;
    }),

  body("targetValue")
    .optional({ values: "null" })
    .isFloat({ min: 0.01 })
    .withMessage("Target value must be greater than 0"),

  body("unit")
    .optional()
    .isString()
    .withMessage("Unit must be a string")
    .bail()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Unit cannot exceed 50 characters"),

  body("category")
    .optional()
    .isIn(HABIT_CATEGORIES)
    .withMessage("Invalid habit category"),

  body("priority")
    .optional()
    .isIn(HABIT_PRIORITIES)
    .withMessage("Priority must be low, medium, or high"),

  body("isPinned")
    .optional()
    .isBoolean()
    .withMessage("isPinned must be a boolean"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("isArchived")
    .optional()
    .isBoolean()
    .withMessage("isArchived must be a boolean"),

  // Prevent empty update requests
  body().custom((value) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Request body must be an object");
    }

    if (Object.keys(value).length === 0) {
      throw new Error("At least one field is required to update a habit");
    }

    return true;
  }),
];

// Validate Habit ID
const validateHabitId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid habit ID"),
];

// The streak route uses `:habitId`, unlike the resource routes that use `:id`.
const validateHabitParamId = [
  param("habitId")
    .isMongoId()
    .withMessage("Invalid habit ID"),
];

// Validate Add Habit Completion
// Expected route: POST /:habitId/completions
// Expected body: { "date": "2026-10-16" }
const validateAddHabitCompletion = [
  param("habitId")
    .isMongoId()
    .withMessage("Invalid habit ID"),

  body("date")
    .notEmpty()
    .withMessage("Completion date is required")
    .bail()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("Completion date must be a valid ISO date")
    .bail()
    .custom((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("Completion date must use YYYY-MM-DD format");
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== value
      ) {
        throw new Error("Completion date is not a valid calendar date");
      }

      return true;
    }),

  // Optional actual amount completed
  body("value")
    .optional({ values: "null" })
    .isFloat({ min: 0.01 })
    .withMessage("Completion value must be greater than 0"),

  body("note")
    .optional()
    .isString()
    .withMessage("Completion note must be a string")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Completion note cannot exceed 500 characters"),
];

// Validate Habit Completion ID
// Expected route: DELETE /completions/:completionId
const validateHabitCompletionId = [
  param("completionId")
    .isMongoId()
    .withMessage("Invalid habit completion ID"),
];

// Validate Habit History Query
// Expected route: GET /:habitId/history?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const validateHabitHistory = [
  param("habitId")
    .isMongoId()
    .withMessage("Invalid habit ID"),

  query("startDate")
    .optional()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("Start date must be a valid ISO date")
    .bail()
    .custom((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("Start date must use YYYY-MM-DD format");
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== value
      ) {
        throw new Error("Start date is not a valid calendar date");
      }

      return true;
    }),

  query("endDate")
    .optional()
    .isISO8601({ strict: true, strictSeparator: true })
    .withMessage("End date must be a valid ISO date")
    .bail()
    .custom((value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new Error("End date must use YYYY-MM-DD format");
      }

      const parsed = new Date(`${value}T00:00:00.000Z`);

      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== value
      ) {
        throw new Error("End date is not a valid calendar date");
      }

      return true;
    }),

  // Ensure startDate does not come after endDate
  query().custom((_, { req }) => {
    const { startDate, endDate } = req.query;

    if (startDate && endDate && startDate > endDate) {
      throw new Error("Start date cannot be after end date");
    }

    return true;
  }),
];

// Exports
module.exports = {
  validateCreateHabit,
  validateUpdateHabit,
  validateHabitId,
  validateHabitParamId,
  validateAddHabitCompletion,
  validateHabitCompletionId,
  validateHabitHistory,
};
