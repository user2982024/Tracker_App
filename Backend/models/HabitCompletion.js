
const mongoose = require("mongoose");

const habitCompletionSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: [true, "Habit reference is required"],
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },

    // The calendar date of completion, normalized to UTC midnight.
    date: {
      type: Date,
      required: [true, "Completion date is required"],
    },

    // Optional actual value, e.g. 25 minutes or 3 glasses.
    value: {
      type: Number,
      min: [0.01, "Completion value must be greater than zero"],
      default: null,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, "Completion note cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// A habit can have only one completion record per calendar date.
habitCompletionSchema.index(
  { habit: 1, date: 1 },
  { unique: true }
);

// Supports retrieving a user's completion history efficiently.
habitCompletionSchema.index({ user: 1, date: -1 });

// Supports history queries for a specific habit owned by a user.
habitCompletionSchema.index({ user: 1, habit: 1, date: -1 });

module.exports = mongoose.model(
  "HabitCompletion",
  habitCompletionSchema
);
