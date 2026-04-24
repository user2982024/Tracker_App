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
    const now = new Date();

    const mongoose = require("mongoose");

    // Build match query
    const matchQuery = {
        user: new mongoose.Types.ObjectId(userId),
    };

    if (filter === "completed") {
        matchQuery.completed = true;
    }

    if (filter === "pending") {
        matchQuery.completed = false;
    }

    if (filter === "overdue") {
        matchQuery.completed = false;
        matchQuery.dueDate = { $lt: now };
    }

    // Single aggregation pipeline
    const result = await Todo.aggregate([
        {
            $match: matchQuery
        },

        {
            $facet: {
                // Paginated todos
                todos: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit }
                ],

                // Total count
                totalCount: [
                    { $count: "count" }
                ],

                // Stats
                stats: [
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
                ]
            }
        }
    ]);

    const data = result[0];

    const todos = data.todos;

    const totalTodos = data.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalTodos / limit);

    const stats = data.stats[0] || {
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