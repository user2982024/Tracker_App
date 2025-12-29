const express = require('express');
const { createNote, getAllNotes, editNote, getNoteById, deleteNote, deleteAllNotes } = require('../controllers/notesController');
const { notesValidator } = require('../validators/notesValidator');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Create note route
router.post('/create', authMiddleware, notesValidator, createNote);

// Get all notes route
router.get('/', authMiddleware, getAllNotes);

// Get a note by id
router.get('/:id', authMiddleware, getNoteById);

// Edit note route
router.put('/edit/:id', authMiddleware, notesValidator, editNote);

// Delete a single note of a user
router.delete('/delete/:id', authMiddleware, deleteNote);

// Delete all notes of a particular user
router.delete('/delete-all', authMiddleware, deleteAllNotes);

module.exports = router;
