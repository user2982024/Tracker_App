const bcrypt = require("bcrypt");
const User = require("../models/User");

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  preferences: {
    theme: user.preferences?.theme || "light",
    weekStartsOn: user.preferences?.weekStartsOn ?? 0,
  },
});

exports.getSettings = async (userId) => {
  const user = await User.findById(userId).select("name email preferences");
  if (!user) throw createError("User not found", 404);
  return getSafeUser(user);
};

exports.updateProfile = async (userId, { name }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { name } },
    { new: true, runValidators: true, select: "name email preferences" },
  );
  if (!user) throw createError("User not found", 404);
  return getSafeUser(user);
};

exports.changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw createError("User not found", 404);

  const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password);
  if (!currentPasswordMatches) {
    throw createError("Current password is incorrect", 400);
  }

  if (currentPassword === newPassword) {
    throw createError("New password must be different from the current password", 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return { success: true };
};

exports.updatePreferences = async (userId, preferences) => {
  const allowedPreferences = {};
  if (preferences.theme !== undefined) allowedPreferences["preferences.theme"] = preferences.theme;
  if (preferences.weekStartsOn !== undefined) {
    allowedPreferences["preferences.weekStartsOn"] = preferences.weekStartsOn;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedPreferences },
    { new: true, runValidators: true, select: "name email preferences" },
  );
  if (!user) throw createError("User not found", 404);
  return getSafeUser(user);
};
