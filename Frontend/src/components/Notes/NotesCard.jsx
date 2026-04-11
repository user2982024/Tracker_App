import { Pencil } from "lucide-react";

const NoteCard = ({ note, onEdit }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border-2 border-blue-200 hover:shadow-md hover:shadow-blue-300 transition">
      
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">
        {note.title}
      </h3>

      {/* Content */}
      <p className="text-gray-700 line-clamp-3">
        {note.content}
      </p>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-400">

        {/* Left Side (Date + Pin) */}
        <div className="flex items-center gap-2">
          <span>
            {new Date(note.createdAt).toLocaleDateString()}
          </span>

          {note.isPinned && <span>📌</span>}
        </div>

        {/* Right Side (Edit Icon) */}
        <button
          onClick={() => onEdit(note)}
          className="text-gray-500 hover:text-blue-600 transition"
          title="Edit Note"
        >
          <Pencil size={14} />
        </button>

      </div>

    </div>
  );
};

export default NoteCard;