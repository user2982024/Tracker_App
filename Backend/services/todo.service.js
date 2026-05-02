const mongoose = require("mongoose");

const Todo = require("../models/Todo");

// Create todo service
const createTodoService = async (
  title,
  description,
  userId,
  dueDate,
  priority,
) => {
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

// Build query
const buildQuery = ({ userId, filter, search }) => {
  const query = { user: userId };
  const now = new Date();

  // Search
  if (search && search.trim() !== "") {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  // Filter
  switch (filter) {
    case "completed":
      query.completed = true;
      break;

    case "pending":
      query.completed = false;
      query.$or = [{ dueDate: { $gte: now } }, { dueDate: null }];
      break;

    case "overdue":
      query.completed = false;
      query.dueDate = { $lt: now };
      break;

    case "all":
    default:
      break;
  }

  return query;
};

// Build sort
const buildSort = (sortBy) => {
  // Always enforce pinned first
  const baseSort = {
    pinned: -1,
    pinnedAt: -1,
  };

  switch (sortBy) {
    case "dueDate":
      return {
        dueDate: 1,
        createdAt: -1,
      };

    default:
      return {
        completed: 1,
        createdAt: -1,
      };
  }
};

// Get all todos of a user service (with pagination, filters and stats)
const getAllTodos = async ({
  userId,
  page = 1,
  limit = 6,
  filter = "all",
  search = "",
  sortBy = "default",
}) => {
  // Authentication check
  if (!userId) {
    throw new Error("User not authenticated");
  }

  page = Number(page);
  limit = Number(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 6;

  const skip = (page - 1) * limit;

  // Build query
  const query = buildQuery({ userId, filter, search });

  // Sorting logic
  const sortOption = buildSort(sortBy);

  // Fetch todos
  const todos = await Todo.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean({ virtuals: true }); // Performance optimization

  // Total count for pagination
  const totalTodos = await Todo.countDocuments(query);
  const totalPages = Math.ceil(totalTodos / limit);

  // Stats
  const allTodos = await Todo.find({ user: userId }).lean();

  let completed = 0;
  let pending = 0;
  let overdue = 0;
  const now = new Date();

  allTodos.forEach((todo) => {
    if (todo.completed) {
      completed++;
    } else {
      pending++;

      if (todo.dueDate && new Date(todo.dueDate) < now) {
        overdue++;
      }
    }
  });

  const stats = {
    total: allTodos.length,
    completed,
    pending,
    overdue,
  };

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
  { title, description, dueDate, priority },
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
    throw new Error(
      "At least one field (title, description, dueDate, priority) is required to update",
    );
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
};

// Delete a single todo service
const deleteTodo = async (todoId, userId) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!todoId) {
    throw new Error("Todo ID is required");
  }

  // Find and delete todo with ownership check
  const deletedTodo = await Todo.findOneAndDelete({
    _id: todoId,
    user: userId,
  });

  if (!deletedTodo) {
    throw new Error("Todo not found or access denied");
  }

  return deletedTodo;
};

// Pin a todo service
const pinTodo = async (todoId, userId) => {
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

  // Pin logic

  if (todo.pinned) {
    return todo; // Already pinned no change
  }

  todo.pinned = true;
  todo.pinnedAt = new Date();

  await todo.save();

  return todo;
};

// Unpin a todo service
const unpinTodo = async (todoId, userId) => {
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

  // Unpin logic
  if (!todo.pinned) {
    return todo; // Already unpinned no change
  }

  todo.pinned = false;
  todo.pinnedAt = null;

  await todo.save();

  return todo;
};

// Get a single todo service
const getTodo = async (todoId, userId) => {
  // Authentication check
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!todoId) {
    throw new Error("Todo ID is required");
  }

  const focusTodo = await Todo.findOne({
    _id: todoId,
    user: userId,
  })
  .lean();

  return focusTodo;
};

// Exports
module.exports = {
  createTodoService,
  getAllTodos,
  toggleTodoCompletedService,
  updateTodo,
  deleteTodo,
  pinTodo,
  unpinTodo,
  getTodo,
};
