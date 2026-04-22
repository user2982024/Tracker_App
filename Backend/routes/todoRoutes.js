const express = require("express");

const {
    validateCreateTodo,
    validateUpdateTodo,
    validateTodoId,
} = require("../validators/totoValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    createTodo,
} = require("../controllers/todoController");

const router = express.Router();

// Create todo route
router.post("/", authMiddleware, validateCreateTodo, validateRequest, createTodo);

module.exports = router;
