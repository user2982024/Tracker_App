const express = require('express');
const { createTodo, getAllTodos, deleteTodo, updateTodo, getTodoById } = require('../controllers/todoController');
const { todoValidator } = require('../validators/todoValidator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create todo route
router.post("/create", authMiddleware, todoValidator, createTodo);

// Get all todos route
router.get("/", authMiddleware, getAllTodos);

// Get a single todo by id route
router.get("/:id", authMiddleware, getTodoById);

// Delete a single todo route
router.delete("/:id", authMiddleware, deleteTodo);

// Update a todo route
router.patch("/:id", authMiddleware, updateTodo);

module.exports = router;