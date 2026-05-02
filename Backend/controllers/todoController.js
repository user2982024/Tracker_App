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
    // Extract query params
    const {
      page = 1,
      limit = 6,
      filter = "all",
      search = "",
      sortBy = "default",
    } = req.query;

    const userId = req.user.userId;

    // Call service
    const result = await todoService.getAllTodos({
      userId,
      page,
      limit,
      filter,
      search,
      sortBy,
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: search
        ? "Search results fetched successfully"
        : "Todos fetched successfully",
      data: result,
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

// Update todo controller
const updateTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;
    const { title, description, dueDate, priority } = req.body;

    const updatedTodo = await todoService.updateTodo(todoId, userId, {
      title,
      description,
      dueDate,
      priority,
    });

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a single todo controller
const deleteTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;

    const deletedTodo = await todoService.deleteTodo(todoId, userId);

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      data: deletedTodo,
    });
  } catch (error) {
    next(error);
  }
};

// Pin todo controller
const pinTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;

    // Call service
    const pinnedTodo = await todoService.pinTodo(todoId, userId);

    return res.status(200).json({
      success: true,
      message: "Todo pinned successfully",
      data: pinnedTodo,
    });
  }
  catch (error) {
    next(error);
  }
};

// Unpin todo controller
const unpinTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;

    const unpinnedTodo = await todoService.unpinTodo(todoId, userId);

    return res.status(200).json({
      success: true,
      message: "Todo unpinned successfully",
      data: unpinnedTodo,
    });
  }
  catch (error) {
    next(error);
  }
};

// Get a single todo controller
const getTodo = async (req, res, next) => {
  try {
    const todoId = req.params.id;
    const userId = req.user.userId;

    const todo = await todoService.getTodo(todoId, userId);

    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      data: todo,
    });
  }
  catch (error) {
    next(error);
  }
};

// Exports
module.exports = {
  createTodo,
  getAllTodos,
  toggleTodoCompleted,
  updateTodo,
  deleteTodo,
  pinTodo,
  unpinTodo,
  getTodo,
};
