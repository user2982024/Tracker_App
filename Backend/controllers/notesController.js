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

    const updatedNote = await notesService.updateNote(
      noteId, 
      userId, 
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    })
  }
  catch (error) {
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

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
    })
  }
  catch (error) {
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
        deletedCount: 0.
      });
    }

    return res.status(200).json({
      success: true,
      message: "All notes deleted successfully",
      deletedCount,
    });
  }
  catch (error) {
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
};
