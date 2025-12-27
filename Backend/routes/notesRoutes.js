const express = require('express');
const { createNote, getAllNotes, editNote, getNoteById, deleteNote } = require('../controllers/notesController');
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

// Delete 
router.delete('/delete/:id', authMiddleware, deleteNote);

module.exports = router;
