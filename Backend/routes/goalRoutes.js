const express = require("express");

const {
    validateCreateGoal,
    validateUpdateGoal,
    validateGoalId,
} = require("../validators/goalValidator");

const {
    createGoal,
    getAllGoals,
    editGoal,
    getGoal,
} = require('../controllers/goalController');

const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a goal route
router.post("/", authMiddleware, validateCreateGoal, validateRequest, createGoal);

// Get all goals route (with pagination and filters)
router.get("/", authMiddleware, getAllGoals);

// Edit a goal route
router.patch("/:id", authMiddleware, validateGoalId, validateUpdateGoal, validateRequest, editGoal);

// Get a single goal route
router.get("/:id", authMiddleware, validateGoalId, validateRequest, getGoal);

module.exports = router;