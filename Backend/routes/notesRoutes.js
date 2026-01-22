const express = require("express");
const {
  createNote,
  getAllNotes,
  editNote,
  getNoteById,
  deleteNote,
  deleteAllNotes,
  archiveNote,
  unarchiveNote,
  getArchivedNotes,
  unArchiveAllNotes,
  pinNote,
  unpinNote,
  getPinnedNotes
} = require("../controllers/notesController");
const notesValidator = require("../validators/notesValidator");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create note route
router.post("/create", authMiddleware, notesValidator, createNote);

// Get archived notes route
router.get("/archived", authMiddleware, getArchivedNotes);

// Get pinned notes route
router.get("/pinned", authMiddleware, getPinnedNotes);

// Get all notes route
router.get("/", authMiddleware, getAllNotes);

// Get a note by id route
router.get("/:id", authMiddleware, getNoteById);

// Edit note route
router.put("/edit/:id", authMiddleware, notesValidator, editNote);

// Unarchive all notes route
router.patch("/unarchive-all", authMiddleware, unArchiveAllNotes);

// Archive note route
router.patch("/archive/:id", authMiddleware, archiveNote);

// Unarchive note route
router.patch("/unarchive/:id", authMiddleware, unarchiveNote);

// Delete all notes route
router.delete("/delete-all", authMiddleware, deleteAllNotes);

// Delete single note route
router.delete("/delete/:id", authMiddleware, deleteNote);

// Pin note route
router.patch("/pin/:id", authMiddleware, pinNote);

// Unpin note route
router.patch("/unpin/:id", authMiddleware, unpinNote);

module.exports = router;
