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

  if (status && status !== "all") {
    query.status = status;
  }

  if (category && category !== "all") {
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

// Update a goal service
const editGoalService = async ({
  goalId,
  userId,
  title,
  description,
  targetValue,
  unit,
  targetDate,
  priority,
  category,
  status,
}) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Goal ID validation
  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new Error("Invalid goal ID");
  }

  // Find goal with ownership check
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  // Goal existence check
  if (!goal) {
    throw new Error("Goal not found");
  }

  // Allowed status values for editing
  const allowedStatuses = ["active", "paused"];

  // Prevent manual completion
  if (status && !allowedStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }

  // Prevent targetValue from becoming smaller than current progress
  if (
    targetValue !== undefined &&
    targetValue < goal.currentValue
  ) {
    throw new Error(
      "Target value cannot be less than current progress"
    );
  }

  // Safe update pbject
  const updates = {};

  // Editable fields only
  if (title !== undefined) {
    updates.title = title;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (targetValue !== undefined) {
    updates.targetValue = targetValue;
  }

  if (unit !== undefined) {
    updates.unit = unit;
  }

  if (targetDate !== undefined) {
    updates.targetDate = targetDate;
  }

  if (priority !== undefined) {
    updates.priority = priority;
  }

  if (category !== undefined) {
    updates.category = category;
  }

  if (status !== undefined) {
    updates.status = status;
  }

  // Apply updates safely
  Object.keys(updates).forEach((key) => {
    goal[key] = updates[key];
  });

  await goal.save();

  return goal;
};

// Get a single todo service
const getGoalService = async ({ goalId, userId }) => {

  // Authentication check
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Goal ID validation
  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new Error("Invalid goal ID");
  }

  // Find goal with ownership check
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  }).lean({ virtuals: true });

  // Goal existence check
  if (!goal) {
    throw new Error("Goal not found");
  }

  return goal;
};

// Exports
module.exports = {
  createGoalService,
  getAllGoalsService,
  editGoalService,
  getGoalService,
};
