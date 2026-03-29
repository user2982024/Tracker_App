const express = require("express");
const { signup, signin, signout } = require("../controllers/authController");
const { signupValidator, signinValidator } = require("../validators/authValidator");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

// Signup route
router.post("/signup", signupValidator, validateRequest, signup);

// Signin route
router.post("/sigin", signinValidator, validateRequest, signin);

// Signout route
router.post("/signout", signout);

module.exports = router;
