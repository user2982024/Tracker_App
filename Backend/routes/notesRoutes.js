const express = require("express");

const { validateCreateNote, validateUpdateNote, validateNoteId } = require("../validators/notesValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const { createNote, getAllNotes, updateNote, deleteNote, deleteAllNotes } = require("../controllers/notesController");

const router = express.Router();

// Get all notes of a logged in user route
router.get("/", authMiddleware, getAllNotes)

// Create note route
router.post("/", authMiddleware, validateCreateNote, validateRequest, createNote);

// Delete all notes route
router.delete("/", authMiddleware, deleteAllNotes)

// Update note route
router.put("/:id", authMiddleware, validateNoteId, validateUpdateNote, validateRequest, updateNote);

// Delete note route
router.delete("/:id", authMiddleware, validateNoteId, deleteNote);

module.exports = router;