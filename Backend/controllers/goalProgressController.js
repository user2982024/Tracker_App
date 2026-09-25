const {
  addGoalProgressService,
  getGoalProgressService,
  deleteGoalProgressService,
} = require("../services/goalsProgress.service");

// Add progress to a goal
const addGoalProgress = async (req, res, next) => {
  try {
    // Get authenticated user's ID
    const userId = req.user.userId;

    // Get goal ID from URL parameter
    const { goalId } = req.params;

    // Get progress data from request body
    const { value, note } = req.body;

    // Call service layer
    const result = await addGoalProgressService(
      userId,
      goalId,
      value,
      note,
    );

    // Send successful response
    res.status(201).json({
      success: true,
      message: "Goal progress added successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get progress history for a goal
const getGoalProgress = async (req, res, next) => {
  try {
    // Get authenticated user's ID
    const userId = req.user.userId;

    // Get goal ID from URL parameter
    const { goalId } = req.params;

    // Call service layer
    const progress = await getGoalProgressService(
      userId,
      goalId,
    );

    // Send successful response
    res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a progress entry
const deleteGoalProgress = async (req, res, next) => {
  try {
    // Get authenticated user's ID
    const userId = req.user.userId;

    // Get progress ID from URL parameter
    const { progressId } = req.params;

    // Call service layer
    const result = await deleteGoalProgressService(
      userId,
      progressId,
    );

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Goal progress deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addGoalProgress,
  getGoalProgress,
  deleteGoalProgress,
};