const Goal = require("../models/Goal");
const GoalProgress = require("../models/GoalProgress");

const addGoalProgressService = async (userId, goalId, value, note) => {
  // Find goal by ID and userId
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // Completed goal cannot recieve additonal progress
  if (goal.status === "completed") {
    throw new Error("Cannot add progress to a completed goal");
  }

  // A paused goal cannot recieve Progress
  if (goal.status === "paused") {
    throw new Error("Cannot add progress to a paused goal");
  }

  // Prevent progress from exceeding the target
  if (goal.currentValue + value > goal.targetValue) {
    throw new Error(
      `Progress cannot exceed the target value of ${goal.targetValue}`,
    );
  }

  // Create progress history record
  const progress = await GoalProgress.create({
    goal: goal._id,
    user: userId,
    value,
    note,
  });

  // Update the cached progress information on the goal
  goal.currentValue += value;
  goal.totalLogs += 1;
  goal.lastProgressDate = new Date();

  // Mark the goal as completed when target is reached
  if (goal.currentValue >= goal.targetValue) {
    goal.status = "completed";
    goal.completedAt = new Date();
  }
  await goal.save();
  return {
    progress,
    goal,
  };
};

// Get progress history
const getGoalProgressService = async (userId, goalId) => {
  // Verify ownership
  const goal = await Goal.findOne({
    _id: goalId,
    user: userId,
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // Get progress history, newest first
  const progress = await GoalProgress.find({
    goal: goalId,
    user: userId,
  }).sort({ createdAt: -1 });

  return progress;
};

// Delete progress history
const deleteGoalProgressService = async (userId, progressId) => {
  // Find the progress entry belonging to the current user
  const progress = await GoalProgress.findOne({
    _id: progressId,
    user: userId,
  });

  if (!progress) {
    throw new Error("Progress entry not found");
  }

  // Find the associated goal and verify ownership
  const goal = await Goal.findOne({
    _id: progress.goal,
    user: userId,
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  // Remove the progress value from the goal
  goal.currentValue = Math.max(goal.currentValue - progress.value, 0);

  // Update log count
  goal.totalLogs = Math.max(goal.totalLogs - 1, 0);

  // Update the last progress date
  const latestProgress = await GoalProgress.findOne({
    goal: goal._id,
    user: userId,
    _id: { $ne: progress._id },
  }).sort({ createdAt: -1 });

  goal.lastProgressDate = latestProgress ? latestProgress.createdAt : null;
  // If deleting progress makes the goal incomplete, change its status back to active.
  if (goal.currentValue < goal.targetValue) {
    goal.status = "active";
    goal.completedAt = null;
  }

  await goal.save();
  // Finally delete the progress history record
  await GoalProgress.deleteOne({
    _id: progress._id,
    user: userId,
  });
  return { progress, goal };
};

module.exports = {
    addGoalProgressService, 
    getGoalProgressService, 
    deleteGoalProgressService,
}