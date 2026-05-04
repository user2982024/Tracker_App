const mongoose = require("mongoose");
const Goal = require("../models/Goal");

const createGoalService = async (
  title,
  description,
  userId,
  targetValue,
  currentValue,
  unit,
  startDate,
  targetDate,
  category,
  priority,
) => {
  // Title check
  if (!title) {
    throw new Error("Title is required");
  }

  // Authentication check
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Core goal fields validation
  if (!targetValue) {
    throw new Error("Target value is required");
  }

  if (!unit) {
    throw new Error("Unit is required");
  }

  // Business rule
  if (currentValue !== undefined && currentValue > targetValue) {
    throw new Error("Current value cannot exceed target value");
  }

  const goalData = {
    title,
    user: userId,
    targetValue,
    unit,
  };

  // Optional fields
  if (description) goalData.description = description;
  if (currentValue !== undefined) goalData.currentValue = currentValue;
  if (startDate) goalData.startDate = startDate;
  if (targetDate) goalData.targetDate = targetDate;
  if (category) goalData.category = category;
  if (priority) goalData.priority = priority;

  // Create goal
  const goal = await Goal.create(goalData);

  return goal;
};

// Get all goals service
const getAllGoalsService = async ({
  userId,
  page = 1,
  limit = 6,
  status = "all",
  category = "all",
  search = "",
  sortBy = "default",
}) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  page = Number(page);
  limit = Number(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 6;

  const skip = (page - 1) * limit;

  const query = { user: userId };

  // Search
  if (search && search.trim() !== "") {
    query.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
    ];
  }

  // Status filter
  if (status !== "all") {
    query.status = status;
  }

  // Category filter
  if (category !== "all") {
    query.category = category;
  }

  // Sorting
  let sortOption = {
    isPinned: -1,
    updatedAt: -1,
  };

  if (sortBy === "targetDate") {
    sortOption = { targetDate: 1 };
  }

  // Fetch goals
  const goals = await Goal.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .lean({ virtuals: true });

  // Pagination
  const totalGoals = await Goal.countDocuments(query);
  const totalPages = Math.ceil(totalGoals / limit);

  // Stats
  const allGoals = await Goal.find({ user: userId }).lean();

  let active = 0;
  let completed = 0;
  let overdue = 0;

  const now = new Date();

  allGoals.forEach((goal) => {
    if (goal.status === "completed") {
      completed++;
    } else {
      active++;

      if (goal.targetDate && new Date(goal.targetDate) < now) {
        overdue++;
      }
    }
  });

  const stats = {
    total: allGoals.length,
    active,
    completed,
    overdue,
  };

  return {
    goals,
    pagination: {
      totalGoals,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    stats,
  };
};

// Exports
module.exports = {
    createGoalService,
    getAllGoalsService,
};
