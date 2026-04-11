const Note = require("../models/Notes");

// Create note service
const createNote = async ({ title, content, userId }) => {
    // Create note in DB
    const note = await Note.create({
        title,
        content,
        user: userId,
    });

    return note;
};

// Get all notes of a logged in user service
const getAllNotes = async (userId, page = 1, limit = 9) => {
    const skip = (page - 1) * limit;

    const notes = await Note.find({ user: userId })
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Note.countDocuments({ user: userId });

    return { notes, total };
}

// Update note service
const updateNote = async (noteId, userId, updateData) => {
    const { title, content } = updateData;

    // Validation
    if (!title || !content) {
        throw new Error("Title and content are required");
    }

    // Find note belonging to user
    const note = await Note.findOne({
        _id: noteId,
        user: userId,
    });

    if (!note) {
        throw new Error("Note not found or unauthorized");
    }

    // Update fields
    note.title = title;
    note.content = content;

    // Save updated note
    const updatedNote = await note.save();

    return updatedNote;
};

// Delete note service
const deleteNote = async (noteId, userId) => {
    try {
        // Find note with ownership check
        const note = await Note.findOne({
            _id: noteId, 
            user: userId,
        });

        // If not found throw error
        if (!note) {
            throw new Error("Note not found or unauthorized");
        }

        // Delete note
        await note.deleteOne();

        // Return deleted note
        return note;
    }
    catch (error) {
        throw(error);
    }
}

module.exports = {
    createNote,
    getAllNotes,
    updateNote,
    deleteNote,
};

