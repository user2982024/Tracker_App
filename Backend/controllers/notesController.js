const Note = require('../models/Notes');

// Create a new note (POST)
exports.createNote = async (req, res) => {
    try {
        const { title, content, isPinned, isArchived } = req.body;

        const note = await Note.create({
            title,
            content, 
            isPinned: isPinned || false,
            isArchived: isArchived || false,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            note
        })
    }
    catch (error) {
        console.error("Error creating note", error);
        res.status(500).json({
            success: false,
            message: "Server error while creating note"
        });
    }
};

// Get all notes (GET)
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id })
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notes,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
        });
    }
};