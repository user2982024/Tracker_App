import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArchivedNotes, deleteNote, unarchiveNote } from "../services/notesService";
import NotesList from "../components/Notes/NotesList";
import { toast } from "react-hot-toast";

const ArchivedNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch archived notes
  const fetchArchivedNotes = async () => {
    try {
      setLoading(true);

      const res = await getArchivedNotes();
      setNotes(res.notes || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch archived notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);  

  // Delete handler
  const handleDelete = async (note) => {
    try {
      const res = await deleteNote(note._id);

      // Remove from UI
      setNotes((prev) => prev.filter((n) => n._id !== note._id));

      toast.success(res.message || "Note deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  // Unarchive handler 
  const handleUnarchive = async (noteId) => {
    try {
      const res = await unarchiveNote(noteId);

      // Remove from UI
      setNotes((prev) => prev.filter((note) => note._id !== noteId));

      toast.success(res.message || "Note unarchived successfully");
    }
    catch (error) {
      toast.error(error.message || "Failed to unarchive note");
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Archived Notes</h1>

        <button
          onClick={() => navigate("/app/notes")}
          className="px-4 py-2 bg-blue-100 text-blue-600 rounded-3xl hover:bg-blue-200 transition cursor-pointer"
        >
          Back to Notes
        </button>
      </div>

      {/* Loading */}
      {loading && notes.length === 0 && (
        <p className="text-gray-500">Loading archived notes...</p>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && (
        <p className="text-gray-500">No archived notes found</p>
      )}

      {/* Notes List */}
      {!loading && notes.length > 0 && (
        <NotesList
          notes={notes}
          onEdit={null}
          onDelete={handleDelete}
          onArchive={null}
          onUnarchive={handleUnarchive}
          mode="archived"
        />
      )}
    </div>
  );
};

export default ArchivedNotesPage;