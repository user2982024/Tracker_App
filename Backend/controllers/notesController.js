const Note = require("../models/Notes");

// Create a new note (POST)
exports.createNote = async (req, res) => {
  try {
    const { title, content, isPinned, isArchived } = req.body;

    const note = await Note.create({
      title,
      content,
      isPinned: isPinned || false,
      isArchived: isArchived || false,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Error creating note", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating note",
    });
  }
};

// Get all notes (GET)
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

// Edit an existing note (PUT)
exports.editNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;
    const { title, content } = req.body;

    // Find the note
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    console.log("Note owner:", note.user.toString());
    console.log("Request user:", req.user._id.toString());

    // Ownership check
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit this note",
      });
    }

    // Update fields (only if provided)
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    // Save updated note
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Edit note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating note",
    });
  }
};

// Get note by id (GET)
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    // Ownership check
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true, 
      note
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching note"
    });
  }
};

// Deleteing a note (DELETE)
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    // Find the note
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note note found"
      });
    }

    // Ownership check
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this note"
      });
    }

    // Delete note
    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });

  }
  catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Server"
    });
  }
};
