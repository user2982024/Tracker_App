import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    // Quantifiable goal system
    targetValue: {
      type: Number,
      required: [true, "Target value is required"],
      min: [1, "Target must be at least 1"],
    },

    currentValue: {
      type: Number,
      default: 0,
      min: [0, "Progress cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.targetValue;
        },
        message: "Progress cannot exceed target value",
      },
    },

    // Flexible unit system 
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      maxlength: 50,
    },

    // Timeline (important for analytics & UX)
    startDate: {
      type: Date,
      default: Date.now,
    },

    targetDate: {
      type: Date,
    },

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

    // Priority (reuse from todos)
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // UI/UX features
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Categorization (dashboard filters later)
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


// Pre-save hook → auto-manage completion logic
goalSchema.pre("save", function (next) {
  if (this.isModified("currentValue") || this.isModified("targetValue")) {
    if (this.currentValue >= this.targetValue) {
      this.status = "completed";

      if (!this.completedAt) {
        this.completedAt = new Date();
      }
    } else {
      this.status = "active";
      this.completedAt = null;
    }
  }

  next();
});


// Virtual progress percentage 
goalSchema.virtual("progressPercentage").get(function () {
  if (!this.targetValue) return 0;

  return Math.round((this.currentValue / this.targetValue) * 100);
});


// Virtual → overdue detection
goalSchema.virtual("isOverdue").get(function () {
  return (
    this.targetDate &&
    this.status !== "completed" &&
    this.targetDate < new Date()
  );
});


// Include virtuals in responses
goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });


// Indexes for performance 
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });
goalSchema.index({ user: 1, category: 1 });
goalSchema.index({ user: 1, targetDate: 1 });


const Goal = mongoose.model("Goal", goalSchema);

export default Goal;