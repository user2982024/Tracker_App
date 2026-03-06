const Todo = require("../models/Todos");

// CREATE TODO
exports.createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate,
      user: req.user._id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });

  } catch (error) {
    console.error("Error creating todo", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while creating todo",
    });
  }
};


// GET ALL TODOS
exports.getAllTodos = async (req, res) => {
  try {

    const todos = await Todo.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      count: todos.length,
      todos,
    });

  } catch (error) {

    console.error("Error fetching todos", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
    });
  }
};


// DELETE SINGLE TODO
exports.deleteTodo = async (req, res) => {
  try {

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// UPDATE TODO
exports.updateTodo = async (req, res) => {
  try {

    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// GET SINGLE TODO
exports.getTodoById = async (req, res) => {
  try {

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      todo,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// DELETE ALL TODOS
exports.deleteAllTodos = async (req, res) => {
  try {

    const result = await Todo.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "All todos deleted successfully",
      deletedCount: result.deletedCount,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error while deleting todos",
    });
  }
};


// UPDATE STATUS
exports.updateTodoStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.status = status;

    await todo.save();

    res.status(200).json({
      success: true,
      message: "Todo status updated",
      todo,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};