const { body } = require("express-validator");

exports.updateProfileValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2, max: 30 })
    .withMessage("Name must be between 2 and 30 characters"),
];

exports.changePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 }).withMessage("New password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("New password must contain uppercase, lowercase and a number"),
];

exports.updatePreferencesValidator = [
  body("theme")
    .optional()
    .isIn(["light", "dark"]).withMessage("Theme must be light or dark"),
  body("weekStartsOn")
    .optional()
    .isInt({ min: 0, max: 1 }).withMessage("Week start must be Sunday (0) or Monday (1)")
    .toInt(),
  body().custom((value) => {
    if (value.theme === undefined && value.weekStartsOn === undefined) {
      throw new Error("At least one preference must be provided");
    }
    return true;
  }),
];
