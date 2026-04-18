import { Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete, onArchive, onUnarchive, mode }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border-2 border-blue-200 hover:shadow-md hover:shadow-blue-300 transition">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{note.title}</h3>

      {/* Content */}
      <p className="text-gray-700 line-clamp-3">{note.content}</p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        {/* Left Side (Date + Pin) */}
        <div className="flex items-center gap-2">
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>

          {note.isPinned && <span>📌</span>}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* Unarchive icon */}
          {mode === "archived" ? (
            <button
              onClick={() => onUnarchive(note._id)}
              className="text-gray-500 hover:text-green-600 transition hover:cursor-pointer"
              title="Unarchive Note"
            >
              <ArchiveRestore size={14} />
            </button>
          ) : (
            // If not archived, show the archive icon
            <button
              onClick={() => onArchive(note._id)}
              className="text-gray-500 hover:text-yellow-600 transition hover:cursor-pointer"
              title="Archive Note"
            >
              <Archive size={14} />
            </button>
          )}

          {/* Edit icon */}
          {mode !== "archived" && (
            <button
              onClick={() => onEdit(note)}
              className="text-gray-500 hover:text-blue-600 transition hover:cursor-pointer"
              title="Edit Note"
            >
              <Pencil size={14} />
            </button>
          )}

          {/* Delete icon */}
          <button
            onClick={() => onDelete(note)}
            className="text-gray-500 hover:text-red-600 transition hover:cursor-pointer"
            title="Delete Note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
