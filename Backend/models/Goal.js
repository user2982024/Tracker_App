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
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

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

    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: ["tasks", "days", "hours", "sessions", "custom"],
      default: "tasks",
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


// Pre-save hook → auto mark as completed
goalSchema.pre("save", function (next) {
  if (this.currentValue >= this.targetValue) {
    this.status = "completed";
    if (!this.completedAt) {
      this.completedAt = new Date();
    }
  } else {
    this.status = "active";
    this.completedAt = null;
  }
  next();
});


// Virtual → progress percentage (NOT stored in DB)
goalSchema.virtual("progressPercentage").get(function () {
  return Math.round((this.currentValue / this.targetValue) * 100);
});


// Ensure virtuals are included in JSON response
goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });


// Index for better query performance
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });


const Goal = mongoose.model("Goal", goalSchema);

export default Goal;