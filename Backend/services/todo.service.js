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

// Get all todos of a user service
const getAllTodosService = async (userId, page = 1, limit = 6, filter = "all") => {
    if (!userId) {
        throw new Error("User not authenticated");
    }

    page = Number(page);
    limit = Number(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 6;

    const skip = (page - 1) * limit;

    // STEP 1: BUILD BASE QUERY
    const query = { user: userId };

    // STEP 2: APPLY FILTER
    const now = new Date();

    if (filter === "completed") {
        query.completed = true;
    }

    if (filter === "pending") {
        query.completed = false;
    }

    if (filter === "overdue") {
        query.completed = false;
        query.dueDate = { $lt: now };
    }

    // STEP 3: FETCH FILTERED + PAGINATED TODOS
    const todos = await Todo.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // STEP 4: COUNT FILTERED TODOS (IMPORTANT)
    const totalTodos = await Todo.countDocuments(query);
    const totalPages = Math.ceil(totalTodos / limit);

    // STEP 5: GLOBAL STATS (NOT FILTERED)
    const statsResult = await Todo.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },

                completed: {
                    $sum: {
                        $cond: [{ $eq: ["$completed", true] }, 1, 0]
                    }
                },

                pending: {
                    $sum: {
                        $cond: [{ $eq: ["$completed", false] }, 1, 0]
                    }
                },

                overdue: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$completed", false] },
                                    { $lt: ["$dueDate", new Date()] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const stats = statsResult[0] || {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
    };

    return {
        todos,
        pagination: {
            currentPage: page,
            totalPages,
            totalTodos,
            limit,
        },
        stats,
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