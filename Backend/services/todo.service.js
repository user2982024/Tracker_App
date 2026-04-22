const Todo = require("../models/Todo");

const createTodoService = async (title, description, user, dueDate, priority) => {
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
    if (priority) totoData.dueDate = dueDate;

    // Create todo
    const todo = await Todo.create(todoData);

    return todo;
};

// Exports
module.exports = {
    createTodoService,
}