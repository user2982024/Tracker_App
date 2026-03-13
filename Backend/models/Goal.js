const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["career", "health", "learning", "finance", "personal"],
      default: "personal",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    progress: {
      type: Number,
      default: 0,
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "completed", "upcoming"],
      default: "active",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // important for sorting
  }
);

module.exports = mongoose.model("Goal", goalSchema);