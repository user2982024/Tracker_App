const express = require("express");

const { validateCreateNote } = require("../validators/notesValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const { createNote } = require("../controllers/notesController");

const router = express.Router();

// Get all notes of a logged in user route
app.get("/", authMiddleware)

// Create note route
Router.post("/", authMiddleware, validateCreateNote, validateRequest, createNote);

module.exports = router;