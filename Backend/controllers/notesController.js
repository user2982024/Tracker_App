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
    const notes = await Note.find({
      user: req.user._id,
      isArchived: false,
    }).sort({
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
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching note",
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
        message: "Note note found",
      });
    }

    // Ownership check
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this note",
      });
    }

    // Delete note
    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Server",
    });
  }
};

// Deleting all notes of a particular user (DELETE)
exports.deleteAllNotes = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Note.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: "All notes deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while deleting notes",
    });
  }
};

// Archive a note (PATCH)
exports.archiveNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Ownership check
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are note allowed to archive this note",
      });
    }

    // If already archived
    if (note.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Note is already archived",
      });
    }

    // Archive logic
    note.isArchived = true;
    note.isPinned = false; // auto-unpin archived notes

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note archived successfully",
      note,
    });
  } catch (error) {
    console.error("Archive note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while archiving note",
    });
  }
};

// Unarchive a note (PATCH)
exports.unarchiveNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user._id;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Ownership check
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to unarchive this note",
      });
    }

    // Check if note is archived or not
    if (!note.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Note is not archived",
      });
    }

    note.isArchived = false;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note unarchived successfully",
      note,
    });
  } catch (error) {
    console.error("Unarchive note error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while unarchiving note",
    });
  }
};

// Get all archivd notes for a user (GET)
exports.getArchivedNotes = async (req, res) => {
  try {
    // Fetch notes
    const archivedNotes = await Note.find({
      user: req.user._id,
      isArchived: true,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      archivedNotes,
    });
  } catch (err) {
    console.error("Fetch archived notes error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching archived notes",
    });
  }
};

// Unarchive all archived notes for a user (PATCH)
exports.unArchiveAllNotes = async (req, res) => {
  try {
    const result = await Note.updateMany(
      {
        user: req.user._id,
        isArchived: true,
      },
      {
        $set: {
          isArchived: false,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "All notes unarchived successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Unarchive all notes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while unarchiving all notes",
    });
  }
};
