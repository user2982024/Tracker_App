const express = require("express");

const {
    validateCreateGoal,
    validateUpdateGoal,
    validateGoalId,
} = require("../validators/goalValidator");

const {
    createGoal,
    getAllGoals,
} = require('../controllers/goalController');

const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a goal route
router.post("/", authMiddleware, validateCreateGoal, validateRequest, createGoal);

// Get all goals route (with pagination and filters)
router.get("/", authMiddleware, getAllGoals);

module.exports = router;