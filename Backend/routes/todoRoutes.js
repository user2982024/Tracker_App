const express = require("express");

const {
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoId,
} = require("../validators/todoValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    createTodo,
    getAllTodos,
    toggleTodoCompleted,
} = require("../controllers/todoController");

const router = express.Router();

// Create todo route
router.post("/", authMiddleware, validateCreateTodo, validateRequest, createTodo);

// Get all todos route
router.get("/", authMiddleware, getAllTodos);

// Toggle todo completed route
router.patch("/:id/toggle", authMiddleware, validateTodoId, validateRequest, toggleTodoCompleted);

module.exports = router;
