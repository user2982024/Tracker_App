const express = require('express');
const { createNote, getAllNotes, editNote } = require('../controllers/notesController');
const { notesValidator } = require('../validators/notesValidator');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Create note route
router.post('/create', authMiddleware, notesValidator, createNote);

// Get all notes route
router.get('/', authMiddleware, getAllNotes);

// Edit note route
router.put('/edit/:id', authMiddleware, notesValidator, editNote);

module.exports = router;
