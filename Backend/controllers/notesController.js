const notesService = require("../services/notes.service");

// Create note controller
const createNote = async (req, res, next) => {
    try {
        // Extract data
        const userId = req.user._id;
        const { title, content } = req.body;

        // Call service
        const note = await notesService.createNote({
            title,
            content, 
            userId,
        });
    }
    catch (error) {
        next(error);
    }
};

// Get all notes controller
const getAllNotes = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const notes = await notesService.getAllNotes(userId);

        return res.status(200).json({
            success: true,
            message: "Notes fetched successfully",
            data: notes,
        });
    }
    catch (error) {
        next(error);
    }
}

// Exports
module.exports = {
    createNote,
    getAllNotes,
};