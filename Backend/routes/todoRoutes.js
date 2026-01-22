const express = require('express');
const { createTodo } = require('../controllers/todoController');
const todoValidator = require('../validators/todoValidator');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.router();

// Create todo route
router.post("/", authMiddleware, todoValidator, createTodo);

module.exports = router;