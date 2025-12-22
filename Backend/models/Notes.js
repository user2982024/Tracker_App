const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Note title is required"],
        trim: true,
        maxlength: [50, "Title cannot exceed 50 characters"],
    },

    content: {
        type: String, 
        trim: true,
        maxlength: [5000, "Note is too long"],
    }, 

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,        // faster user-based queries
    },

    isPinned: {
        type: Boolean,
        default: false,
    }, 

    isArchived: {
        type: Boolean,
        default: false,
    }, 
}, 
{
    timestamps: true            // created at & updated at
}
);

module.exports = mongoose.model("Notes", notesSchema);