const express = require('express');
const { signup, signin } = require('../controllers/authController');
const { signupValidator, signinValidator } = require('../validators/authValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Signup Route
router.post('/signup', signupValidator, validateRequest, signup);

// Signin Route
router.post('/signin', signinValidator, validateRequest, signin);

module.exports = router;