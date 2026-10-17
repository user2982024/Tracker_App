const settingsService = require("../services/settings.service");
const { createDataReportPdf } = require("../utils/pdfExport");

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

exports.exportData = async (req, res, next) => {
  try {
    const data = await settingsService.exportUserData(req.user.userId);
    const date = new Date().toISOString().slice(0, 10);
    res.set({
      "Content-Disposition": `attachment; filename="taskflow-backup-${date}.json"`,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.exportPdf = async (req, res, next) => {
  try {
    const data = await settingsService.exportUserData(req.user.userId);
    const pdf = createDataReportPdf(data);
    const date = new Date().toISOString().slice(0, 10);
    res.set({
      "Content-Disposition": `attachment; filename="taskflow-report-${date}.pdf"`,
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
      "Cache-Control": "no-store",
    });
    res.status(200).send(pdf);
  } catch (error) {
    next(error);
  }
};
