
const habitService = require("../services/habit.service");

// Create Habit Controller
const createHabit = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {
      title,
      description,
      frequency,
      daysOfWeek,
      targetValue,
      unit,
      category,
      priority,
      isPinned,
      startDate,
    } = req.body;

    const habit = await habitService.createHabitService({
      userId,
      title,
      description,
      frequency,
      daysOfWeek,
      targetValue,
      unit,
      category,
      priority,
      isPinned,
      startDate,
    });

    return res.status(201).json({
      success: true,
      message: "Habit created successfully",
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Habits Controller
const getAllHabits = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {
      page,
      limit,
      category,
      search,
      archived,
      sortBy,
    } = req.query;

    const result = await habitService.getAllHabitsService({
      userId,
      page,
      limit,
      category,
      search,
      archived,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      message: "Habits fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Habit Controller
const getHabit = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.id;

    const habit = await habitService.getHabitService({
      habitId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Habit fetched successfully",
      data: habit,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Habit Controller
const editHabit = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.id;

    const {
      title,
      description,
      frequency,
      daysOfWeek,
      targetValue,
      unit,
      category,
      priority,
      isPinned,
      startDate,
    } = req.body;

    const updatedHabit = await habitService.editHabitService({
      habitId,
      userId,
      title,
      description,
      frequency,
      daysOfWeek,
      targetValue,
      unit,
      category,
      priority,
      isPinned,
      startDate,
    });

    return res.status(200).json({
      success: true,
      message: "Habit updated successfully",
      data: updatedHabit,
    });
  } catch (error) {
    next(error);
  }
};

// Archive or Restore Habit Controller
const archiveHabit = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.id;
    const { isArchived } = req.body;

    const updatedHabit = await habitService.archiveHabitService({
      habitId,
      userId,
      isArchived,
    });

    return res.status(200).json({
      success: true,
      message: isArchived
        ? "Habit archived successfully"
        : "Habit restored successfully",
      data: updatedHabit,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Habit Controller
const deleteHabit = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.id;

    const deletedHabit = await habitService.deleteHabitService({
      habitId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Habit deleted successfully",
      data: deletedHabit,
    });
  } catch (error) {
    next(error);
  }
};

// Mark Habit as Completed Controller
const addHabitCompletion = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    const { date, value, note } = req.body;

    const { completion, alreadyCompleted } =
      await habitService.addHabitCompletionService({
        habitId,
        userId,
        date,
        value,
        note,
      });

    return res.status(alreadyCompleted ? 200 : 201).json({
      success: true,
      message: alreadyCompleted
        ? "Habit was already completed for this date"
        : "Habit marked as completed successfully",
      alreadyCompleted,
      data: completion,
    });
  } catch (error) {
    next(error);
  }
};

// Undo Habit Completion Controller
const undoHabitCompletion = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const completionId = req.params.completionId;

    const deletedCompletion =
      await habitService.undoHabitCompletionService({
        completionId,
        userId,
      });

    return res.status(200).json({
      success: true,
      message: "Habit completion undone successfully",
      data: deletedCompletion,
    });
  } catch (error) {
    next(error);
  }
};

// Get Habit Completion History Controller
const getHabitHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    const {
      startDate,
      endDate,
      page,
      limit,
    } = req.query;

    const result = await habitService.getHabitHistoryService({
      habitId,
      userId,
      startDate,
      endDate,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Habit history fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get Habit Current Streak Controller
const getHabitStreak = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const habitId = req.params.habitId;

    const result = await habitService.getHabitStreakService({
      habitId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Habit streak fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Exports
module.exports = {
  createHabit,
  getAllHabits,
  getHabit,
  editHabit,
  archiveHabit,
  deleteHabit,
  addHabitCompletion,
  undoHabitCompletion,
  getHabitHistory,
  getHabitStreak,
};
