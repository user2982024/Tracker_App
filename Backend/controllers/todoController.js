const todoService = require("../services/todo.service");

// Create todo controller
const createTodo = async (req, res, next) => {
  try {
    // Get user from auth middleware
    const userId = req.user.userId;

    // Extract data from request
    const { title, description, dueDate, priority } = req.body;

    // Call service
    const todo = await todoService.createTodoService(
      title,
      description,
      userId,
      dueDate,
      priority,
    );

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
};

// Get all todos of a user controller
const getAllTodos = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get page and limit from query params
    const { page = 1, limit = 6 } = req.query;

    const result = await todoService.getAllTodosService(
      userId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      data: result.todos,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle todo completed controller
const toggleTodoCompleted = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;

    const updatedTodo = await todoService.toggleTodoCompletedService(
      todoId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: updatedTodo.completed
        ? "Todo marked as completed"
        : "Todo marked as pending",
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

// Exports
module.exports = {
  createTodo,
  getAllTodos,
  toggleTodoCompleted,
};
