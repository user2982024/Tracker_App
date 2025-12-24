const express = require('express');
const { createNote, getAllNotes } = require('../controllers/notesController');
const { notesValidator } = require('../validators/notesValidator');
const authMiddleware = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Create note route
router.post('/create', authMiddleware, notesValidator, createNote);

// Gte all notes
router.get('/', authMiddleware, getAllNotes);

module.exports = router;
