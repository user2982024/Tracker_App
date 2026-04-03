const { body } = require("express-validator");

exports.signupValidator = [
    body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 5, max: 30 }).withMessage("Name must be between 5 and 30 characters"),

    body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),

    body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase and a number")
];

exports.signinValidator = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

    // Only basic validation because the user signed up with valid password 
    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required"),
];
