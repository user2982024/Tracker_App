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
} = require("../controllers/goalController");

const {
  addGoalProgress,
  getGoalProgress,
  deleteGoalProgress,
} = require("../controllers/goalProgressController");

const validateRequest = require("../middlewares/validateRequest");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a goal route
router.post(
  "/",
  authMiddleware,
  validateCreateGoal,
  validateRequest,
  createGoal,
);

// Get all goals route (with pagination and filters)
router.get("/", authMiddleware, getAllGoals);

// Edit a goal route
router.patch(
  "/:id",
  authMiddleware,
  validateGoalId,
  validateUpdateGoal,
  validateRequest,
  editGoal,
);

// Delete a goal route
router.delete(
  "/:id",
  authMiddleware,
  validateGoalId,
  validateRequest,
  deleteGoal,
);

// Get a single goal route
router.get("/:id", authMiddleware, validateGoalId, validateRequest, getGoal);

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
  validateAddGoalProgress,
  validateRequest,
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
