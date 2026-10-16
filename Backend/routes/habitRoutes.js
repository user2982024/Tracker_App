
const express = require("express");

const {
  validateCreateHabit,
  validateUpdateHabit,
  validateHabitId,
  validateAddHabitCompletion,
  validateHabitCompletionId,
  validateHabitHistory,
} = require("../validators/habitValidator");

const {
  createHabit,
  getAllHabits,
  getHabit,
  editHabit,
  archiveHabit,
  deleteHabit,
  addHabitCompletion,
  undoHabitCompletion,
  getHabitHistory,
  getHabitStreak,
} = require("../controllers/habitController");

const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a habit
router.post(
  "/",
  authMiddleware,
  validateCreateHabit,
  validateRequest,
  createHabit,
);

// Get all habits (with pagination, filters, and daily statistics)
router.get(
  "/",
  authMiddleware,
  getAllHabits,
);

// Get completion history for a habit
router.get(
  "/:habitId/history",
  authMiddleware,
  validateHabitHistory,
  validateRequest,
  getHabitHistory,
);

// Get the current streak for a habit
router.get(
  "/:habitId/streak",
  authMiddleware,
  validateHabitId,
  validateRequest,
  getHabitStreak,
);

// Mark a habit as completed
router.post(
  "/:habitId/completions",
  authMiddleware,
  validateAddHabitCompletion,
  validateRequest,
  addHabitCompletion,
);

// Undo a habit completion
router.delete(
  "/completions/:completionId",
  authMiddleware,
  validateHabitCompletionId,
  validateRequest,
  undoHabitCompletion,
);

// Archive or restore a habit
router.patch(
  "/:id/archive",
  authMiddleware,
  validateHabitId,
  validateRequest,
  archiveHabit,
);

// Edit a habit
router.patch(
  "/:id",
  authMiddleware,
  validateHabitId,
  validateUpdateHabit,
  validateRequest,
  editHabit,
);

// Delete a habit
router.delete(
  "/:id",
  authMiddleware,
  validateHabitId,
  validateRequest,
  deleteHabit,
);

// Get a single habit
router.get(
  "/:id",
  authMiddleware,
  validateHabitId,
  validateRequest,
  getHabit,
);

module.exports = router;
