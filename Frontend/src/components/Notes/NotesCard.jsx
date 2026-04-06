const NoteCard = ({ note }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border-2 border-blue-200 hover:shadow-md hover:shadow-blue-300 transition hover:cursor-pointer">

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

        {/* Date */}
        <span>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>

        {/* Status (future: pin/archive) */}
        <span>
          {note.isPinned ? "📌" : ""}
        </span>

      </div>

    </div>
  );
};

export default NoteCard;