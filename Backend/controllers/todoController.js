const todoService = require("../services/todo.service");

// Create todo controller
const createTodo = async (req, res, next) => {
    try {
        // Get user from auth middleware
        const userId = req.user.userId;

        // Extract data from request
        const {  title, description, dueDate, priority } = req.body;

        // Call service
        const todo = await todoService.createTodoService(title, description, userId, dueDate, priority);

        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo,
        })
    }
    catch (error) {
        next(error);
    }
};

// Get all todos of a user controller
const getAllTodos = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const todos = await todoService.getAllTodosService(userId);

        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            data: todos,
        });
    }
    catch (error) {
        next(error);
    }
}

// Exports 
module.exports = {
    createTodo,
    getAllTodos,
}