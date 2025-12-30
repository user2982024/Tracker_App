const express = require('express');
const { createNote, getAllNotes, editNote, getNoteById, deleteNote, deleteAllNotes, archiveNote, unarchiveNote } = require('../controllers/notesController');
const { notesValidator } = require('../validators/notesValidator');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Create note route
router.post('/create', authMiddleware, notesValidator, createNote);

// Get all notes route
router.get('/', authMiddleware, getAllNotes);

// Get a note by id route
router.get('/:id', authMiddleware, getNoteById);

// Edit note route
router.put('/edit/:id', authMiddleware, notesValidator, editNote);

// Delete single note route
router.delete('/delete/:id', authMiddleware, deleteNote);

// Delete all notes route
router.delete('/delete-all', authMiddleware, deleteAllNotes);

// Archive note route
router.patch('/archive/:id', authMiddleware, archiveNote);

// Unarchive note route
router.patch('/unarchive/:id', authMiddleware, unarchiveNote);

module.exports = router;
