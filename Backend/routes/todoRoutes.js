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
    updateTodo,
    deleteTodo,
} = require("../controllers/todoController");

const router = express.Router();

// Create todo route
router.post("/", authMiddleware, validateCreateTodo, validateRequest, createTodo);

// Get all todos route (with pagination and filters)
router.get("/", authMiddleware, getAllTodos);

// Toggle todo completed route
router.patch("/:id/toggle", authMiddleware, validateTodoId, validateRequest, toggleTodoCompleted);

// Update todo route
router.put("/:id", authMiddleware, validateTodoId, validateUpdateTodo, validateRequest, updateTodo);

// Delete a single todo
router.delete("/:id", authMiddleware, validateTodoId, validateRequest, deleteTodo);

module.exports = router;
