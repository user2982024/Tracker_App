const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  updateProfileValidator,
  changePasswordValidator,
  updatePreferencesValidator,
} = require("../validators/settingsValidator");
const settingsController = require("../controllers/settingsController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", settingsController.getSettings);
router.get("/export/pdf", settingsController.exportPdf);
router.get("/export", settingsController.exportData);
router.patch("/profile", updateProfileValidator, validateRequest, settingsController.updateProfile);
router.patch("/password", changePasswordValidator, validateRequest, settingsController.changePassword);
router.patch("/preferences", updatePreferencesValidator, validateRequest, settingsController.updatePreferences);

module.exports = router;
