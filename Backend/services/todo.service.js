const Todo = require("../models/Todo");

// Create todo service
const createTodoService = async (title, description, userId, dueDate, priority) => {
    if (!title) {
        throw new Error("Title is required");
    }
    
    // Authentication check
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const todoData = {
        title, 
        user: userId,
    };

    // Add optional fields
    if (description) todoData.description = description;
    if (dueDate) todoData.dueDate = dueDate;
    if (priority) todoData.priority = priority;

    // Create todo
    const todo = await Todo.create(todoData);

    return todo;
};

// Get all todos of a user service
const getAllTodosService = async (userId, page = 1, limit = 6) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Ensure numbers
    page = Number(page);
    limit = Number(limit);

    // Prevent invalid values
    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    const skip = (page - 1) * limit;

    const todos = await Todo.find({ user: userId })
    .sort({ createdAt: -1 })        // Latest first
    .skip(skip)
    .limit(limit);

    const totalTodos = await Todo.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalTodos / limit);

    return {
        todos,
        pagination: {
            currentPage: page,
            totalPages,
            totalTodos,
            limit,
        }
    };
};

// Toggle todo completed
const toggleTodoCompletedService = async (todoId, userId) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    if (!todoId) {
        throw new Error("Todo ID is required");
    }

    // Find todo with ownership check
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
    });

    if (!todo) {
        throw new Error("Todo not found or access denied");
    }

    // Toggle completed status
    todo.completed = !todo.completed;

    await todo.save();

    return todo;
}

// Exports
module.exports = {
    createTodoService,
    getAllTodosService,
    toggleTodoCompletedService,
}