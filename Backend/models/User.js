const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      weekStartsOn: {
        type: Number,
        enum: [0, 1],
        default: 0,
      },
      defaultPage: {
        type: String,
        enum: ["dashboard", "todos", "habits"],
        default: "dashboard",
      },
      dateFormat: {
        type: String,
        enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        default: "MM/DD/YYYY",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
