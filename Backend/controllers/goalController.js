const Goal = require("../models/Goal");

// Create a goal (POST)
exports.createGoal = async (req, res) => {
  try {
    const { title, description, category, priority, deadline } = req.body;

    const goal = await Goal.create({
      title,
      description,
      category,
      priority,
      deadline,
      user: req.user._id,
    });

    res.status(202).json({
      sucess: trus,
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create goal",
    });
  }
};

// Get all notes (GET)
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Goals fetched successfully",
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch goals",
    });
  }
}
