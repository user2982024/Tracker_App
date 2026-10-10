const express = require("express");

const {
  validateCreateGoal,
  validateUpdateGoal,
  validateGoalId,
  validateAddGoalProgress,
  validateProgressId,
} = require("../validators/goalValidator");

const {
  createGoal,
  getAllGoals,
  editGoal,
  getGoal,
  deleteGoal,
  deleteCompletedGoals,
} = require("../controllers/goalController");

const {
  addGoalProgress,
  getGoalProgress,
  deleteGoalProgress,
} = require("../controllers/goalProgressController");

const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a goal
router.post(
  "/",
  authMiddleware,
  validateCreateGoal,
  validateRequest,
  createGoal,
);

// Get all goals (with pagination and filters)
router.get("/", authMiddleware, getAllGoals);

// Delete all completed goals
router.delete(
  "/completed",
  authMiddleware,
  deleteCompletedGoals,
);

// Edit a goal
router.patch(
  "/:id",
  authMiddleware,
  validateGoalId,
  validateUpdateGoal,
  validateRequest,
  editGoal,
);

// Delete a single goal
router.delete(
  "/:id",
  authMiddleware,
  validateGoalId,
  validateRequest,
  deleteGoal,
);

// Get a single goal
router.get(
  "/:id",
  authMiddleware,
  validateGoalId,
  validateRequest,
  getGoal,
);

// Add progress to a goal
router.post(
  "/:goalId/progress",
  authMiddleware,
  validateAddGoalProgress,
  validateRequest,
  addGoalProgress,
);

// Get progress history for a goal
router.get(
  "/:goalId/progress",
  authMiddleware,
  getGoalProgress,
);

// Delete a progress entry
router.delete(
  "/progress/:progressId",
  authMiddleware,
  validateProgressId,
  validateRequest,
  deleteGoalProgress,
);

module.exports = router;