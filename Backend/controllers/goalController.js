const goalService = require("../services/goals.service");

// Create goal controller
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

    res.status(201).json({
      success: true,
      message: "Goal created successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

// Get all goals controller
const getAllGoals = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { page, limit, status, category, search, sortBy } = req.query;

    const result = await goalService.getAllGoalsService({
      userId,
      page,
      limit,
      status,
      category,
      search,
      sortBy,
    });

    res.status(200).json({
      success: true,
      message: "Goals fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Exports
module.exports = {
  createGoal,
  getAllGoals,
};
