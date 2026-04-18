const express = require("express");

const {
  validateCreateNote,
  validateUpdateNote,
  validateNoteId,
} = require("../validators/notesValidator");
const validateRequest = require("../middlewares/validateRequest");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
  deleteAllNotes,
  archiveNote,
  getArchivedNotes,
  unarchiveNote,
  pinNote,
} = require("../controllers/notesController");

const router = express.Router();

// Get all notes of a logged in user route
router.get("/", authMiddleware, getAllNotes);

// Get all archived notes of a logged in user route
router.get("/archived", authMiddleware, getArchivedNotes);

// Create note route
router.post(
  "/",
  authMiddleware,
  validateCreateNote,
  validateRequest,
  createNote,
);

// Delete all notes route
router.delete("/", authMiddleware, deleteAllNotes);

// Update note route
router.put(
  "/:id",
  authMiddleware,
  validateNoteId,
  validateUpdateNote,
  validateRequest,
  updateNote,
);

// Delete note route
router.delete("/:id", authMiddleware, validateNoteId, deleteNote);

// Archive note route
router.patch("/:id/archive", authMiddleware, validateNoteId, archiveNote);

// Unarchive note route
router.patch("/:id/unarchive", authMiddleware, validateNoteId, unarchiveNote);

// Pin note route
router.patch("/:id/pin", authMiddleware, validateNoteId, pinNote);

module.exports = router;
