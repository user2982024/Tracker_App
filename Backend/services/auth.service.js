const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate token (same as signin)
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Return safe user data
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

exports.signin = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or passowrd");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or passowrd");
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Return safe data
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};