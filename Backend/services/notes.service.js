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
const getAllNotes = async (userId) => {
    const notes = await Note.find({ user: userId })
    .sort({ isPinned: -1, createdAt: -1 });

    return notes;
}

module.exports = {
    createNote,
    getAllNotes,
};