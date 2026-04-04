const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxLength: [100, "Title cannot exceed 100 characters"],
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
      index: true, // helps in sorting/filtering
    },

    isArchived: {
        type: Boolean,
        default: false,
        index: true,
    },
}, 
{
    timestamps: true
}
);

// Compound Index (VERY IMPORTANT for performance)
// Common query: "get all notes of user sorted by pinned + recent"
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 });


// Optional: Text Index for search (future dashboard feature)
noteSchema.index({
  title: "text",
  content: "text",
});

module.exports = mongoose.model("Note", noteSchema);