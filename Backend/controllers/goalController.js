const goalService = require("../services/goals.service");

// Create Goal Controller
const createGoal = async (req, res, next) => {
  try {
    const {
      title,
      description,
      targetValue,
      currentValue,
      unit,
      startDate,
      targetDate,
      category,
      priority,
    } = req.body;

    const userId = req.user.userId;

    const goal = await goalService.createGoalService(
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
    );

    return res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Goals Controller
const getAllGoals = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const {
      page,
      limit,
      status,
      category,
      search,
      sortBy,
    } = req.query;

    const result = await goalService.getAllGoalsService({
      userId,
      page,
      limit,
      status,
      category,
      search,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      message: "Goals fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Goal Controller
const editGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    const {
      title,
      description,
      targetValue,
      unit,
      targetDate,
      priority,
      category,
      status,
    } = req.body;

    const updatedGoal = await goalService.editGoalService({
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
    });

    return res.status(200).json({
      success: true,
      message: "Goal updated successfully",
      data: updatedGoal,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Goal Controller
const getGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    const goal = await goalService.getGoalService({
      goalId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Goal fetched successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Single Goal Controller
const deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const goalId = req.params.id;

    const deletedGoal = await goalService.deleteGoalService({
      userId,
      goalId,
    });

    return res.status(200).json({
      success: true,
      message: "Goal deleted successfully",
      data: deletedGoal,
    });
  } catch (error) {
    next(error);
  }
};

// Delete All Completed Goals Controller
const deleteCompletedGoals = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const result =
      await goalService.deleteCompletedGoalsService({
        userId,
      });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        deletedGoals: result.deletedGoals,
        deletedProgressEntries: result.deletedProgressEntries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Exports
module.exports = {
  createGoal,
  getAllGoals,
  editGoal,
  getGoal,
  deleteGoal,
  deleteCompletedGoals,
};