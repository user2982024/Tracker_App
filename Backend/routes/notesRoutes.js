const express = require("express");

const { validateCreateNote } = require("../validators/notesValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Note Route
Router.post("/", authMiddleware, validateCreateNote, validateRequest);

module.exports = router;