const mongoose = require("mongoose");
const { type } = require("os");
const { resourceUsage } = require("process");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra spaces
      minLength: 4,
      maxLength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
      select: false, // never return password in queries
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("User", userSchema);