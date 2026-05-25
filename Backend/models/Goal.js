const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    // Goal owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Goal title
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Goal type
    // (Future scalable architecture)
    goalType: {
      type: String,
      enum: ["quantitative"],
      default: "quantitative",
    },

    // Quantitative goal system
    targetValue: {
      type: Number,
      required: [true, "Target value is required"],
      min: [1, "Target value must be at least 1"],
    },

    // Cached aggregate progress
    // Source of truth will be GoalProgress collection
    currentValue: {
      type: Number,
      default: 0,
      min: [0, "Current progress cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.targetValue;
        },
        message: "Current progress cannot exceed target value",
      },
    },

    // Flexible measurement unit
    // Examples:
    // questions, books, hours, workouts
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      maxlength: [50, "Unit cannot exceed 50 characters"],
    },

    // Analytics

    // Total number of progress logs
    // Helps with analytics & UX later
    totalLogs: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Last time user logged progress
    // Useful for streaks, reminders, inactivity detection
    lastProgressDate: {
      type: Date,
      default: null,
    },

    // Timeline system

    // Goal creation / start date
    startDate: {
      type: Date,
      default: Date.now,
    },

    // Goal deadline
    targetDate: {
      type: Date,
      default: null,
    },

    // Completion timestamp
    completedAt: {
      type: Date,
      default: null,
    },

    // Status system

    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active",
      index: true,
    },

    // Priority system

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // UI/ UX fetaures

    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Categorization

    category: {
      type: String,
      enum: ["health", "career", "learning", "finance", "personal"],
      default: "personal",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook

goalSchema.pre("save", function (next) {
  // Mark goal as completed
  if (this.currentValue >= this.targetValue) {
    this.status = "completed";

    // Set completedAt only once
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  }

  next();
});

// Virtuals

// Progress percentage
goalSchema.virtual("progressPercentage").get(function () {
  if (!this.targetValue) return 0;

  return Math.round((this.currentValue / this.targetValue) * 100);
});


// Remaining progress
goalSchema.virtual("remainingValue").get(function () {
  return Math.max(this.targetValue - this.currentValue, 0);
});


// Overdue detection
goalSchema.virtual("isOverdue").get(function () {
  return (
    this.targetDate &&
    this.status !== "completed" &&
    this.targetDate < new Date()
  );
});

// Include virtuals

goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });

// Indexes

// Dashboard queries
goalSchema.index({ user: 1, status: 1 });

// Pinned goals sorting
goalSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });

// Category filtering
goalSchema.index({ user: 1, category: 1 });

// Deadline sorting/filtering
goalSchema.index({ user: 1, targetDate: 1 });

// Combined dashboard analytics
goalSchema.index({
  user: 1,
  status: 1,
  category: 1,
});

module.exports = mongoose.model("Goal", goalSchema);