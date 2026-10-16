
const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    // Habit owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Habit owner is required"],
      index: true,
    },

    // Habit title
    title: {
      type: String,
      required: [true, "Habit title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    // Optional description
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    // Habit frequency system
    // daily: Habit is scheduled every day
    // specific_days: Habit is scheduled on selected weekdays
    frequency: {
      type: String,
      enum: {
        values: ["daily", "specific_days"],
        message: "Frequency must be daily or specific_days",
      },
      default: "daily",
      required: [true, "Habit frequency is required"],
    },

    // Scheduled weekdays
    // JavaScript weekday numbering:
    // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    // Used only when frequency is specific_days
    daysOfWeek: {
      type: [
        {
          type: Number,
          min: [0, "Weekday cannot be less than 0"],
          max: [6, "Weekday cannot exceed 6"],
        },
      ],
      default: [],
      validate: [
        {
          validator: function (days) {
            return Array.isArray(days) && new Set(days).size === days.length;
          },
          message: "Weekdays cannot contain duplicates",
        },
        {
          validator: function (days) {
            if (this.frequency === "specific_days") {
              return Array.isArray(days) && days.length > 0;
            }

            return Array.isArray(days) && days.length === 0;
          },
          message:
            "Select at least one weekday for specific_days frequency, and leave daysOfWeek empty for daily habits",
        },
      ],
    },

    // Optional quantitative habit target
    // Examples: 30 minutes, 10 pages, 2 litres
    targetValue: {
      type: Number,
      min: [0.01, "Target value must be greater than 0"],
      default: null,
    },

    // Flexible measurement unit
    // Examples: minutes, pages, litres, repetitions
    unit: {
      type: String,
      trim: true,
      maxlength: [50, "Unit cannot exceed 50 characters"],
      default: "",
    },

    // Habit categorization
    category: {
      type: String,
      enum: {
        values: [
          "health",
          "career",
          "learning",
          "finance",
          "personal",
        ],
        message: "Invalid habit category",
      },
      default: "personal",
      index: true,
    },

    // Habit priority
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },

    // UI / UX features
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Archive system
    // Archived habits are hidden from the active habit list
    // but can retain their completion history
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Habit start date
    startDate: {
      type: Date,
      default: Date.now,
      required: [true, "Habit start date is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Virtuals

// Determine whether the habit is scheduled on a given date.
// Weekday numbering follows JavaScript Date.getDay():
// 0 = Sunday, 1 = Monday, ..., 6 = Saturday.
habitSchema.methods.isScheduledOn = function (date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  if (this.frequency === "daily") {
    return true;
  }

  if (this.frequency === "specific_days") {
    return this.daysOfWeek.includes(date.getDay());
  }

  return false;
};

// Include virtuals in serialized documents
habitSchema.set("toJSON", { virtuals: true });
habitSchema.set("toObject", { virtuals: true });

// Indexes

// Retrieve active or archived habits for a user
habitSchema.index({
  user: 1,
  isArchived: 1,
  updatedAt: -1,
});

// Pinned habits sorting
habitSchema.index({
  user: 1,
  isArchived: 1,
  isPinned: -1,
  updatedAt: -1,
});

// Category filtering
habitSchema.index({
  user: 1,
  category: 1,
});

// Frequency-based filtering
habitSchema.index({
  user: 1,
  frequency: 1,
});

// Habit start-date queries
habitSchema.index({
  user: 1,
  startDate: 1,
});

module.exports = mongoose.model("Habit", habitSchema);
