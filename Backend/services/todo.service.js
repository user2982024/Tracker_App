const mongoose = require("mongoose");

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

// Get all todos of a user service (with pagination, filters and stats)
const getAllTodos = async ({
    userId,
    page = 1,
    limit = 6,
    filter = "all",
}) => {
    // Authentication check
    if (!userId) {
        throw new Error("User not authenticated");
    }

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    const query = { user: userId };
    const now = new Date();

    // Filter logic
    switch (filter) {
        case "completed":
            query.completed = true;
            break;
        
        case "pending":
            query.completed = false;
            break;

        case "overdue":
            query.completed = false;
            query.dueDate = { $lt: now };
            break;

        case "all":
        default:
            // No filter
            break;
    }  
    
    // Fetch todos
    const todos = await Todo.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    // Total count for pagination
    const totalTodos = await Todo.countDocuments(query);
    const totalPages = Math.ceil(totalTodos / limit);

    // Stats
    const allTodos = await Todo.find({ user: userId });

    let completed = 0;
    let pending = 0;
    let overdue = 0;

    allTodos.forEach((todo) => {
        if (todo.completed) {
            completed++;
        } else {
            pending++;

            if (todo.dueDate && todo.dueDate < now) {
                overdue++;
            }
        }
    });

    const stats = {
        total: allTodos.length,
        completed,
        pending,
        overdue,
    }

    return {
        todos,
        pagination: {
            totalTodos,
            currentPage: page,
            totalPages,
            pageSize: limit,
        },
        stats,
    };
};

// Toggle todo completed service
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
};

// Update todo service
const updateTodo = async (
    todoId,
    userId,
    { title, description, dueDate, priority }
) => {
    // Authentication check
    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Todo ID check
    if (!todoId) {
        throw new Error("Todo ID is required");
    }

    // Check if at least one field is provided
    if (
        title === undefined &&
        description === undefined &&
        dueDate === undefined &&
        priority === undefined
    ) {
        throw new Error("At least one field (title, description, dueDate, priority) is required to update");
    }

    // Find todo with ownership check
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
    });

    if (!todo) {
        throw new Error("Todo not found or access denied");
    }

    // Update fields if provided
    if (title !== undefined) {
        if (!title.trim()) {
            throw new Error("Title cannot be empty");
        }
        todo.title = title;
    }

    if (description !== undefined) {
        todo.description = description;
    }

    if (dueDate !== undefined) {
        todo.dueDate = dueDate;
    }

    if (priority !== undefined) {
        todo.priority = priority;
    }

    // Save updated todo
    await todo.save();

    return todo;
}

// Exports
module.exports = {
    createTodoService,
    getAllTodos,
    toggleTodoCompletedService,
    updateTodo,
}