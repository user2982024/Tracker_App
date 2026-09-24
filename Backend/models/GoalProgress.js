const mongoose = require("mongoose");

const goalProgressSchema = new mongoose.Schema(
  {
    // The goal this progress entry belongs to
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      required: true,
      index: true,
    },

    // Owner of the progress entry
    // Kept explicitly for fast ownership/security queries
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Amount of progress made in this entry
    // Example: +4 questions
    value: {
      type: Number,
      required: [true, "Progress value is required"],
      min: [1, "Progress value must be at least 1"],
    },

    // Optional explanation of what was accomplished
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Progress note cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);


// Compound index
// Useful when retrieving a user's progress history for a goal
goalProgressSchema.index({
  goal: 1,
  user: 1,
  createdAt: -1,
});


module.exports = mongoose.model("GoalProgress", goalProgressSchema);