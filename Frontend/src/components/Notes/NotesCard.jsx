import { useNavigate } from "react-router-dom";
import useDateFormat from "../../hooks/useDateFormat";
import { formatDate } from "../../utils/dateFormatting";
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
  const dateFormat = useDateFormat();

  return (
    <div
      className={`p-4 rounded-xl border-2 transition ${
        note.isPinned
          ? "bg-yellow-50 border-yellow-300 shadow-sm shadow-yellow-200 hover:shadow-md dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:shadow-yellow-900/20"
          : "bg-blue-50 border-blue-200 shadow-sm hover:shadow-md hover:shadow-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30 dark:hover:shadow-blue-900/30"
      }`}
    >
      {/* Title */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold">{note.title}</h3>

        {note.isPinned && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 rounded-full">
            Pinned
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-foreground-secondary line-clamp-3">{note.content}</p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-foreground-muted">
        {/* Left Side (Date + Pin) */}
        <div className="flex items-center gap-2">
          <span>{formatDate(note.createdAt, dateFormat)}</span>

          {note.isPinned && (
            <Pin size={14} className="text-yellow-500" fill="currentColor" />
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          {/* View icon */}
          <button
            onClick={() => navigate(`/app/notes/${note._id}`)}
            className="text-foreground-muted hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:cursor-pointer hover:scale-125"
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
                  ? "text-yellow-500 hover:scale-125"
                  : "text-foreground-muted hover:text-yellow-600 dark:hover:text-yellow-400 hover:scale-125"
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
              className="text-foreground-muted hover:text-green-600 dark:hover:text-green-400 transition hover:cursor-pointer hover:scale-125"
              title="Unarchive Note"
            >
              <ArchiveRestore size={14} />
            </button>
          ) : (
            // If not archived, show the archive icon
            <button
              onClick={() => onArchive(note._id)}
              className="text-foreground-muted hover:text-yellow-600 dark:hover:text-yellow-400 transition hover:cursor-pointer hover:scale-125"
              title="Archive Note"
            >
              <Archive size={14} />
            </button>
          )}

          {/* Edit icon */}
          {mode !== "archived" && (
            <button
              onClick={() => onEdit(note)}
              className="text-foreground-muted hover:text-blue-600 dark:hover:text-blue-400 transition hover:cursor-pointer hover:scale-125"
              title="Edit Note"
            >
              <Pencil size={14} />
            </button>
          )}

          {/* Delete icon */}
          <button
            onClick={() => onDelete(note)}
            className="text-foreground-muted hover:text-red-600 dark:hover:text-red-400 transition hover:cursor-pointer hover:scale-125"
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
