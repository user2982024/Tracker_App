import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";
import {
  getNoteById,
  deleteNote,
  archiveNote,
  unarchiveNote,
  pinNote,
  unpinNote,
} from "../services/notesService";
import { toast } from "react-hot-toast";
import {
  Pencil,
  Trash2,
  Archive,
  ArchiveRestore,
  Pin,
  ArrowLeft,
} from "lucide-react";
import Modal from "../components/UI/Modal";

const NoteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  // DELETE (NO window.confirm anymore)
  const handleDelete = async () => {
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
    navigate(`/app/notes/${id}/edit`);
  };

  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  if (!note) {
    return (
      <div className="text-center text-foreground-muted mt-10">Note not found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2
          text-sm font-medium text-foreground-muted
          hover:text-foreground
          transition-colors duration-200
          hover:cursor-pointer"
        >
          <ArrowLeft size={18} />

          <span>Back to Notes</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Pin */}
          <button
            onClick={handlePinToggle}
            className={`transition-all duration-200 cursor-pointer hover:scale-110 ${
              note.isPinned
                ? "text-yellow-500"
                : "text-foreground-muted hover:text-yellow-600 dark:hover:text-yellow-400"
            }`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Pin size={18} fill={note.isPinned ? "currentColor" : "none"} />
          </button>

          {/* Archive / Unarchive */}
          {note.isArchived ? (
            <button
              onClick={handleArchiveToggle}
              className="text-foreground-muted hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Unarchive Note"
            >
              <ArchiveRestore size={18} />
            </button>
          ) : (
            <button
              onClick={handleArchiveToggle}
              className="text-foreground-muted hover:text-yellow-600 dark:hover:text-yellow-400 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Archive Note"
            >
              <Archive size={18} />
            </button>
          )}

          {/* Edit */}
          {!note.isArchived && (
            <button
              onClick={handleEdit}
              className="text-foreground-muted hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer hover:scale-110"
              title="Edit Note"
            >
              <Pencil size={18} />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-foreground-muted hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 cursor-pointer hover:scale-110"
            title="Delete Note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Note Content */}
      <div
        className={`rounded-2xl p-6 border shadow transition ${
          note.isPinned
            ? "bg-yellow-50 border-yellow-300 shadow-yellow-200 dark:bg-yellow-500/10 dark:border-yellow-500/30 dark:shadow-yellow-900/20"
            : "bg-surface"
        }`}
      >
        {/* Title */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-semibold">{note.title}</h1>

          {note.isPinned && (
            <span className="ml-4 px-2 py-0.5 text-xs font-medium bg-yellow-200 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 rounded-full shadow-sm">
              Pinned
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-foreground-secondary whitespace-pre-wrap leading-relaxed">
          {note.content}
        </p>

        {/* Date */}
        <div className="mt-6 text-sm text-foreground-muted">
          Created: {new Date(note.createdAt).toLocaleString()}
        </div>
      </div>

      {/* DELETE MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Note?"
        actions={
          <>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary transition"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </>
        }
      >
        This action{" "}
        <span className="text-red-500 font-semibold">cannot be undone</span>.
      </Modal>
    </div>
  );
};

export default NoteViewPage;
