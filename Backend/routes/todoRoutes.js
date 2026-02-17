const express = require('express');
const { createTodo, getAllTodos, deleteTodo } = require('../controllers/todoController');
const { todoValidator } = require('../validators/todoValidator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create todo route
router.post("/create", authMiddleware, todoValidator, createTodo);

// Get all todos route
router.get("/", authMiddleware, getAllTodos);

// Delete a single todo route
router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;