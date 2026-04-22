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
} = require("../controllers/todoController");

const router = express.Router();

// Create todo route
router.post("/", authMiddleware, validateCreateTodo, validateRequest, createTodo);

// Get all todos route
router.get("/", authMiddleware, getAllTodos);

module.exports = router;
