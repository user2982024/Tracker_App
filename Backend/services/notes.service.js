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

  const notes = await Note.find({
    user: userId,
    isArchived: false, // Exclude archived notes from main listing
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Note.countDocuments({
    user: userId,
    isArchived: false, // Count only non-archived notes
  });

  return { notes, total };
};

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
  } catch (error) {
    throw error;
  }
};

// Delete all notes service
const deleteAllNotes = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const result = await Note.deleteMany({ user: userId });

    return {
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    throw error;
  }
};

// Archive note service
const archiveNote = async (noteId, userId) => {
  // Atomic update with protection
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
      isArchived: false,
    },
    {
      isArchived: true,
      isPinned: false, // Unpin when archiving
      archivedAt: new Date(),
    },
    { new: true }, // By default, MongoDB will return the old object, but with this filed it will return su the new object with updated value
  );

  if (!note) {
    throw new Error("Note not found, already archived, or unauthorized");
  }

  return note;
};

// Get all archived notes service
const getArchivedNotes = async (userId, page = 1, limit = 9) => {
  const skip = (page - 1) * limit;

  const notes = await Note.find({
    user: userId,
    isArchived: true,
  })
    .sort({ archivedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Note.countDocuments({
    user: userId,
    isArchived: true,
  });

  return { notes, total };
};

// Unarchive and archived note service
const unarchiveNote = async (noteId, userId) => {
  // Get archived note
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
      isArchived: true,
    },
    {
      isArchived: false,
      archivedAt: null,
    },
    { new: true },
  );

  // If not found throw error
  if (!note) {
    throw new Error("Note not found, not archived, or unauthorized");
  }

  return note;
};

// Pin a note service
const pinNote = async (noteId, userId) => {
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
      isArchived: false,
      isPinned: false,
    },
    {
      isPinned: true,
    },
    { new: true },
  );

  if (!note) {
    throw new Error(
      "Note not found, already pinned, archived, or unauthorized",
    );
    ``;
  }

  return note;
};

// Unpin a note service
const unpinNote = async (noteId, userId) => {
  const note = await Note.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
      isPinned: true,
    },
    {
      isPinned: false,
    },
    { new: true },
  );

  if (!note) {
    throw new Error("Note not found, not pinned, or unauthorized");
  }

  return note;
};

// Exports
module.exports = {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
  deleteAllNotes,
  archiveNote,
  getArchivedNotes,
  unarchiveNote,
  pinNote,
  unpinNote,
};
