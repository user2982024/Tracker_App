const Todo = require("../models/Todo");

// Create todo service
const createTodoService = async (title, description, userId, dueDate, priority) => {
    if (!title) {
        throw new Error("Title is required");
    }
    
    // Authentication check
    if (!user) {
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
const getAllTodosService = async (userId) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const todos = await Todo.find({ user: userId })
    .sort({ createdAt: -1 });       // Latest first

    return todos;
}

// Exports
module.exports = {
    createTodoService,
    getAllTodosService,
}