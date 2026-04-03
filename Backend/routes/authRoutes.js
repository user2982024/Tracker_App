const express = require("express");
const { signup, signin, signout, getCurrentUser } = require("../controllers/authController");
const { signupValidator, signinValidator } = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Signup route
router.post("/signup", signupValidator, validateRequest, signup);

// Signin route
router.post("/signin", signinValidator, validateRequest, signin);

// Signout route
router.post("/signout", signout);

// Get current user route
router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
