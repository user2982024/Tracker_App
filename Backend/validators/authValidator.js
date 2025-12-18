const { body } = require('express-validator');

exports.signupValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 4, max: 50 }).withMessage("Name must be 4 - 50 characters long"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/\d/).withMessage("Password must contain atleast one number")
];