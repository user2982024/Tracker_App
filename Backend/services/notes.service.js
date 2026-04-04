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

module.exports = {
    createNote,
    getAllNotes,
};