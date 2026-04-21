const notesService = require("../services/notes.service");

// Create note controller
const createNote = async (req, res, next) => {
  try {
    // Extract data
    const userId = req.user.userId;
    const { title, content } = req.body;

    // Call service
    const note = await notesService.createNote({
      title,
      content,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Get all notes controller
const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Extract query params
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 9);

    // Call service
    const { notes, total } = await notesService.getAllNotes(
      userId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Update note controller
const updateNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const updatedNote = await notesService.updateNote(noteId, userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Delete note controller
const deleteNote = async (req, res, next) => {
  try {
    // Extract data
    const noteId = req.params.id;
    const userId = req.user.userId;

    // Call service
    const deletedNote = await notesService.deleteNote(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Delete all notes controller
const deleteAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { deletedCount } = await notesService.deleteAllNotes(userId);

    // In case of no notes to delete
    if (deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No notes to delete",
        deletedCount: 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "All notes deleted successfully",
      deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

// Archive note controller
const archiveNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const archivedNote = await notesService.archiveNote(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note archived successfully",
      note: archivedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Get archived notes of a user controller
const getArchivedNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Querry params for pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 9);

    const { notes, total } = await notesService.getArchivedNotes(
      userId,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Archived notes fetched successfully",
      notes,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Unarchive note controller
const unarchiveNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const unarchivedNote = await notesService.unarchiveNote(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note unarchived successfully",
      note: unarchivedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Pin note controller
const pinNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const pinnedNote = await notesService.pinNote(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note pinned successfully",
      note: pinnedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Unpin note controller
const unpinNote = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const unpinnedNote = await notesService.unpinNote(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note unpinned successfully",
      note: unpinnedNote,
    });
  } catch (error) {
    next(error);
  }
};

// Search notes controller
const searchNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Extract query params
    const q = req.query.q;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 9);

    // Call service
    const { notes, total } = await notesService.searchNotes(
      userId,
      q,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Notes search results",
      notes,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Search archived notes controller
const searchArchivedNotes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Extract query
    const query = req.query.query;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 9);

    // Validation
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Call service
    const { notes, total } = await notesService.searchArchivedNotes(
      userId,
      query.trim(),
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      message: "Archived notes search results fetched successfully",
      notes,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// Get note by id controller
const getNoteById = async (req, res, next) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.userId;

    const note = await notesService.getNoteById(noteId, userId);

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
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
  searchNotes,
  searchArchivedNotes,
  getNoteById,
};
