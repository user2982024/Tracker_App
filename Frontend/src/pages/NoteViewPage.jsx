import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getNoteById,
  deleteNote,
  archiveNote,
  unarchiveNote,
  pinNote,
  unpinNote,
} from "../services/notesService";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Archive, ArchiveRestore, Pin } from "lucide-react";

const NoteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);

        const res = await getNoteById(id);
        setNote(res.note);
      } catch (error) {
        toast.error(error.message || "Failed to load note");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    // Modal to be added here

    try {
      await deleteNote(id);
      toast.success("Note deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  const handleArchiveToggle = async () => {
    try {
      const res = note.isArchived
        ? await unarchiveNote(id)
        : await archiveNote(id);

      setNote(res.note);
      toast.success(note.isArchived ? "Note unarchived" : "Note archived");
    } catch (error) {
      toast.error(error.message || "Failed to update archive status");
    }
  };

  const handlePinToggle = async () => {
    try {
      const res = note.isPinned ? await unpinNote(id) : await pinNote(id);

      setNote(res.note);
      toast.success(note.isPinned ? "Note unpinned" : "Note pinned");
    } catch (error) {
      toast.error(error.message || "Failed to update pin status");
    }
  };

  const handleEdit = () => {
    navigate(`/app/notes?edit=${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading note...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center text-gray-500 mt-10">Note not found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-3xl text-sm text-blue-600 cursor-pointer"
        >
          ← Back
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Pin */}
          <button
            onClick={handlePinToggle}
            className={`transition-all duration-200 cursor-pointer hover:scale-110 ${
              note.isPinned
                ? "text-yellow-500"
                : "text-gray-500 hover:text-yellow-600"
            }`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Pin size={18} fill={note.isPinned ? "currentColor" : "none"} />
          </button>

          {/* Archive / Unarchive */}
          {note.isArchived ? (
            <button
              onClick={handleArchiveToggle}
              className="text-gray-500 hover:text-green-600 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Unarchive Note"
            >
              <ArchiveRestore size={18} />
            </button>
          ) : (
            <button
              onClick={handleArchiveToggle}
              className="text-gray-500 hover:text-yellow-600 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Archive Note"
            >
              <Archive size={18} />
            </button>
          )}

          {/* Edit */}
          {!note.isArchived && (
            <button
              onClick={handleEdit}
              className="text-gray-500 hover:text-blue-600 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Edit Note"
            >
              <Pencil size={18} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600 transition-all duration-200 cursor-pointer hover:scale-110"
            title="Delete Note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div
        className={`rounded-2xl p-6 border shadow ${
          note.isPinned ? "bg-yellow-50 border-yellow-300 shadow-sm shadow-yellow-200 hover:shadow-md" : "bg-white"
        }`}
      >
        {/* Title */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold">{note.title}</h1>

          {note.isPinned && (
            <span className="ml-4 px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">
              Pinned
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {note.content}
        </p>

        {/* Date */}
        <div className="mt-6 text-sm text-gray-400">
          Created: {new Date(note.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default NoteViewPage;
