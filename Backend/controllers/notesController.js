const notesService = require("../services/notes.service");

// Create note controller
const createNote = async (req, res) => {
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

module.exports = {
    createNote,
};