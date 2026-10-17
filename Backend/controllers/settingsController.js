const settingsService = require("../services/settings.service");

exports.getSettings = async (req, res, next) => {
  try {
    const user = await settingsService.getSettings(req.user.userId);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await settingsService.updateProfile(req.user.userId, req.body);
    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    await settingsService.changePassword(req.user.userId, req.body);
    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await settingsService.updatePreferences(req.user.userId, req.body);
    res.status(200).json({ success: true, message: "Preferences saved", user });
  } catch (error) {
    next(error);
  }
};
