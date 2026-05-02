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
    pinTodo,
    unpinTodo,
    getTodo,
} = require("../controllers/todoController");

const router = express.Router();

// Create todo route
router.post("/", authMiddleware, validateCreateTodo, validateRequest, createTodo);

// Get all todos route (with pagination and filters)
router.get("/", authMiddleware, getAllTodos);

// Pin todo route
router.patch("/:id/pin", authMiddleware, validateTodoId, validateRequest, pinTodo);

// Unpin todo route
router.patch("/:id/unpin", authMiddleware, validateTodoId, validateRequest, unpinTodo);

// Toggle todo completed route
router.patch("/:id/toggle", authMiddleware, validateTodoId, validateRequest, toggleTodoCompleted);

// Update todo route
router.put("/:id", authMiddleware, validateTodoId, validateUpdateTodo, validateRequest, updateTodo);

// Delete a single todo route
router.delete("/:id", authMiddleware, validateTodoId, validateRequest, deleteTodo);

// Get a single todo route
router.get("/:id", authMiddleware, validateTodoId, validateRequest, getTodo);

module.exports = router;
