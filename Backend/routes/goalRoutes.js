const express = require("express");
const { createGoal, getGoals } = require("../controllers/goalController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create goal route
router.post("/create", authMiddleware, createGoal);

// Get all goals route
router.get("/", authMiddleware, getGoals);

module.exports = router;