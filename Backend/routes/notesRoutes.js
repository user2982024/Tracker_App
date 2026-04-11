const express = require("express");

const { validateCreateNote, validateUpdateNote, validateNoteId } = require("../validators/notesValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const { createNote, getAllNotes, updateNote } = require("../controllers/notesController");

const router = express.Router();

// Get all notes of a logged in user route
router.get("/", authMiddleware, getAllNotes)

// Create note route
router.post("/create-note", authMiddleware, validateCreateNote, validateRequest, createNote);

// Update note route
router.put("/:id", authMiddleware, validateNoteId, validateUpdateNote, validateRequest, updateNote);

module.exports = router;