import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Archive, ArchiveRestore, Pin, Eye } from "lucide-react";

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onPin,
  onUnpin,
  mode,
}) => {

  const navigate = useNavigate();

  return (
    <div
      className={`p-4 rounded-xl border-2 transition ${
        note.isPinned
          ? "bg-yellow-50 border-yellow-300 shadow-sm shadow-yellow-200 hover:shadow-md"
          : "bg-blue-50 border-blue-200 shadow-sm hover:shadow-md hover:shadow-blue-300"
      }`}
    >
      {/* Title */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>

        {note.isPinned && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">
            Pinned
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-700 line-clamp-3">{note.content}</p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
        {/* Left Side (Date + Pin) */}
        <div className="flex items-center gap-2">
          <span>{new Date(note.createdAt).toLocaleDateString()}</span>

          {note.isPinned && (
            <Pin size={14} className="text-yellow-500" fill="currentColor" />
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* View icon */}
          <button
            onClick={() => navigate(`/app/notes/${note._id}`)}
            className="text-gray-500 hover:text-indigo-600 transition hover:cursor-pointer"
            title="View Note"
          >
            <Eye size={14} />
          </button>
          {/* Pin icon */}
          {mode !== "archived" && (
            <button
              onClick={() =>
                note.isPinned ? onUnpin(note._id) : onPin(note._id)
              }
              className={`transition hover:cursor-pointer ${
                note.isPinned
                  ? "text-yellow-500"
                  : "text-gray-500 hover:text-yellow-600"
              }`}
              title={note.isPinned ? "Unpin Note" : "Pin Note"}
            >
              <Pin size={14} fill={note.isPinned ? "currentColor" : "none"} />
            </button>
          )}

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
