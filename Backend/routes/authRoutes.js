const express = require('express');
const { signup } = require('../controllers/authController');
const { signupValidator } = require('../validators/authValidator');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// Signup Route
router.post('/signup', signupValidator, validateRequest, signup);

module.exports = router;