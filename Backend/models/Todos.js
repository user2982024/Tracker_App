const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: [true, "Todo title is required"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },

  completed: {
    type: Boolean,
    default: false,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  dueDate: {
    type: Date,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Todo", todoSchema);