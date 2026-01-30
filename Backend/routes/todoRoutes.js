const express = require('express');
const { createTodo, getAllTodos } = require('../controllers/todoController');
const { todoValidator } = require('../validators/todoValidator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create todo route
router.post("/create", authMiddleware, todoValidator, createTodo);

// Get all todos route
router.get("/", authMiddleware, getAllTodos);

module.exports = router;