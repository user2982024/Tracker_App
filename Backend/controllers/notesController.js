const Notes = require('../models/Notes');

// Create a new note (POST)
exports.createNote = async (req, res) => {
    try {
        const { title, content, isPinned, isArchived } = req.body;

        const note = await Notes.create({
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