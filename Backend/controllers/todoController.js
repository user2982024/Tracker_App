const Todo = require('../models/Todos');

// Creating a todo (POST)
exports.createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        // Creating a todo
        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate,
            user: req.user._id
        });

        return res.status(200).json({
            success: true,
            message: "Todo created successfully", 
            todo
        });
    }
    catch (error) {
        console.error("Error creating todo", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while creating todo"
        })
    }
};

// Get all todos of a user (GET)
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id })
        .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            count: todos.length,
            todos
        });
    }
    catch (error) {
        console.error("Error fetching todos", error.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching todos"
        });
    }
};

// Delete a single todo controller (DELETE)
exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Update a todo controller (PATCH)
exports.updateTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate, status } = req.body;

        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        // Update only if field is provided
        if (title !== undefined) todo.title = title.trim();
        if (description !== undefined) todo.description = description.trim();
        if (priority !== undefined) todo.priority = priority;
        if (dueDate !== undefined) todo.dueDate = dueDate;
        if (status !== undefined) todo.status = status;

        await todo.save();

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};