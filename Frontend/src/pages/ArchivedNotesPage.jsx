import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getArchivedNotes } from "../services/notesService";
import NotesCard from "../components/Notes/NotesCard";
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
      setNotes(res.notes);
    } catch (error) {
      toast.error(error.message || "Failed to fetch archived notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedNotes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Archived Notes</h1>
      <button
        onClick={() => navigate("/app/notes")}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer mb-6"
      >
        Back to Notes
      </button>

      {/* Loading */}
      {loading && notes.length === 0 && (
        <p className="text-gray-500">Loading archived notes...</p>
      )}

      {!loading && notes.length === 0 && (
        <p className="text-gray-500">No archived notes found</p>
      )}

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <NotesCard
            key={note._id}
            note={note}
            onEdit={() => {}}
            onDelete={() => {}}
            onUnarchive={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default ArchivedNotesPage;
