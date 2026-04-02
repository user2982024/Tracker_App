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

module.exports = {
    createNote,
};