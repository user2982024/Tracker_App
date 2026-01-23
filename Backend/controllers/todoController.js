const Todo = require('../models/Todos');

// Creating a todo (POST)
exports.createTodo = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        // Createing a todo
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