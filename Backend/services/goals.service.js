const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const GoalProgress = require("../models/GoalProgress");

// Create Goal Service
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
  // Title validation
  if (!title || !title.trim()) {
    throw new Error("Title is required");
  }

  // Authentication validation
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const hasTarget =
    targetValue !== undefined && targetValue !== null && targetValue !== "";
  if (
    hasTarget &&
    (!Number.isFinite(Number(targetValue)) || Number(targetValue) <= 0)
  ) {
    throw new Error("Target value must be greater than zero");
  }

  if (unit !== undefined && typeof unit !== "string") {
    throw new Error("Unit must be text");
  }

  // Current value validation
  if (
    currentValue !== undefined &&
    currentValue !== null &&
    (
      !Number.isFinite(Number(currentValue)) ||
      Number(currentValue) < 0
    )
  ) {
    throw new Error("Current value must be a non-negative number");
  }

  const normalizedTarget = hasTarget ? Number(targetValue) : null;
  const normalizedCurrent =
    currentValue === undefined || currentValue === null
      ? 0
      : Number(currentValue);

  // Business rule
  if (normalizedTarget !== null && normalizedCurrent > normalizedTarget) {
    throw new Error("Current value cannot exceed target value");
  }

  const goalData = {
    title: title.trim(),
    user: userId,
    targetValue: normalizedTarget,
    goalType: hasTarget ? "quantitative" : "qualitative",
    unit: typeof unit === "string" ? unit.trim() : "",
  };

  // Optional fields
  if (description !== undefined) {
    goalData.description = description;
  }

  if (currentValue !== undefined && currentValue !== null) {
    goalData.currentValue = normalizedCurrent;
  }

  if (startDate) goalData.startDate = startDate;
  if (targetDate) goalData.targetDate = targetDate;
  if (category) goalData.category = category;
  if (priority) goalData.priority = priority;

  const goal = await Goal.create(goalData);

  return goal;
};

// Get All Goals Service
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

  if (!Number.isInteger(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    limit = 6;
  }

  const skip = (page - 1) * limit;
  const query = { user: userId };

  // Search
  if (search && search.trim() !== "") {
    const escapedSearch = search.trim().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  // Status filter
  if (status && status !== "all") {
    query.status = status;
  }

  // Category filter
  if (category && category !== "all") {
    query.category = category;
  }

  // Sorting
  let sortOption = {
    isPinned: -1,
    updatedAt: -1,
  };

  if (sortBy === "targetDate") {
    sortOption = {
      targetDate: 1,
      _id: 1,
    };
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

  // Statistics across all of the user's goals
  const allGoals = await Goal.find({ user: userId })
    .select("status targetDate currentValue targetValue")
    .lean();

  let active = 0;
  let activeGoals = 0;
  let completed = 0;
  let overdue = 0;
  let allGoalProgressTotal = 0;

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

    const target = Number(goal.targetValue) || 0;
    if (goal.status === "completed") {
      allGoalProgressTotal += 100;
    } else if (target > 0) {
      const progress = (Number(goal.currentValue) || 0) / target;
      allGoalProgressTotal += Math.max(0, Math.min(1, progress)) * 100;
    }

    if (goal.status === "active") {
      activeGoals++;
    }
  });

  const stats = {
    total: allGoals.length,
    active,
    activeGoals,
    averageProgress: allGoals.length
      ? Math.round(allGoalProgressTotal / allGoals.length)
      : 0,
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

// Edit Goal Service
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

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  const hasTargetUpdate = targetValue !== undefined;
  const normalizedTarget =
    targetValue === null || targetValue === "" ? null : Number(targetValue);

  // Quantitative goals complete by reaching their target. A qualitative goal
  // can be marked complete manually in the edit form.
  const allowedStatuses = ["active", "paused", "completed"];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }

  if (hasTargetUpdate && normalizedTarget !== null) {
    if (!Number.isFinite(normalizedTarget) || normalizedTarget <= 0) {
      throw new Error("Target value must be greater than zero");
    }

    if (normalizedTarget < goal.currentValue) {
      throw new Error(
        "Target value cannot be less than current progress",
      );
    }
  }

  const resultingTarget = hasTargetUpdate ? normalizedTarget : goal.targetValue;
  if (
    status === "completed" &&
    goal.status !== "completed" &&
    Number(resultingTarget) > 0
  ) {
    throw new Error("Numeric goals are completed by reaching their target");
  }

  // Prevent reopening a completed goal through editing.
  if (goal.status === "completed" && status && status !== "completed") {
    throw new Error("A completed goal cannot be reopened through editing");
  }

  // Prepare permitted updates
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      throw new Error("Title cannot be empty");
    }

    updates.title = title.trim();
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (hasTargetUpdate) {
    updates.targetValue = normalizedTarget;
    updates.goalType = normalizedTarget == null ? "qualitative" : "quantitative";
  }

  if (unit !== undefined) {
    if (typeof unit !== "string") {
      throw new Error("Unit must be text");
    }

    updates.unit = unit.trim();
  }

  if (targetDate !== undefined) {
    updates.targetDate = targetDate ? targetDate : null;
  }

  if (priority !== undefined) {
    updates.priority = priority;
  }

  if (category !== undefined) {
    updates.category = category;
  }

  if (status !== undefined) {
    updates.status = status;
    updates.completedAt =
      status === "completed" ? goal.completedAt || new Date() : null;
  }

  Object.assign(goal, updates);

  await goal.save();

  return goal;
};

// Get Single Goal Service
const getGoalService = async ({ goalId, userId }) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  }).lean({ virtuals: true });

  if (!goal) {
    throw new Error("Goal not found");
  }

  return goal;
};

// Delete Single Goal Service
const deleteGoalService = async ({ goalId, userId }) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!mongoose.Types.ObjectId.isValid(goalId)) {
    throw new Error("Invalid goal ID");
  }

  // Find the goal and verify ownership first.
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  }).select("_id");

  if (!goal) {
    throw new Error("Goal not found");
  }

  // A transaction keeps the goal and its history consistent.
  const session = await mongoose.startSession();

  try {
    let deletedGoal = null;

    await session.withTransaction(async () => {
      // Recheck ownership inside the transaction.
      deletedGoal = await Goal.findOneAndDelete({
        _id: goalId,
        user: userId,
      }).session(session);

      if (!deletedGoal) {
        throw new Error("Goal not found");
      }

      await GoalProgress.deleteMany(
        {
          goal: goal._id,
          user: userId,
        },
        { session },
      );
    });

    return deletedGoal;
  } finally {
    await session.endSession();
  }
};

// Delete All Completed Goals Service
const deleteCompletedGoalsService = async ({ userId }) => {
  // Authentication validation
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Validate the user's ID before database operations.
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const session = await mongoose.startSession();

  try {
    let result = {
      deletedGoals: 0,
      deletedProgressEntries: 0,
    };

    await session.withTransaction(async () => {
      // Select only completed goals belonging to this user.
      const completedGoals = await Goal.find({
        user: userId,
        status: "completed",
      })
        .select("_id")
        .session(session)
        .lean();

      // Nothing to delete is a valid outcome.
      if (completedGoals.length === 0) {
        result = {
          deletedGoals: 0,
          deletedProgressEntries: 0,
        };

        return;
      }

      const completedGoalIds = completedGoals.map(
        (goal) => goal._id,
      );

      // Delete the associated history for these goals only.
      const progressDeletion = await GoalProgress.deleteMany(
        {
          user: userId,
          goal: { $in: completedGoalIds },
        },
        { session },
      );

      // Delete only the completed goals selected above.
      const goalDeletion = await Goal.deleteMany(
        {
          _id: { $in: completedGoalIds },
          user: userId,
          status: "completed",
        },
        { session },
      );

      result = {
        deletedGoals: goalDeletion.deletedCount,
        deletedProgressEntries: progressDeletion.deletedCount,
      };
    });

    return {
      message:
        result.deletedGoals === 0
          ? "No completed goals found"
          : "Completed goals deleted successfully",
      deletedGoals: result.deletedGoals,
      deletedProgressEntries: result.deletedProgressEntries,
    };
  } finally {
    await session.endSession();
  }
};

// Exports
module.exports = {
  createGoalService,
  getAllGoalsService,
  editGoalService,
  getGoalService,
  deleteGoalService,
  deleteCompletedGoalsService,
};
