import { useEffect, useState } from "react";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import NoteForm from "../components/Notes/NoteForm";

// Import service layer
import { getNotes, createNote } from "../services/notesService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 9;
  const [totalNotes, setTotalNotes] = useState(0);

  // Form toggle
  const [showForm, setShowForm] = useState(false);

  // Fetch notes (using service)
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const data = await getNotes(currentPage, notesPerPage);

      setNotes(data.notes || []);
      setTotalNotes(data.total || 0);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [currentPage]);

  // Create note (using service)
  const handleCreateNote = async (formData) => {
    try {
      await createNote(formData);

      // Refresh notes after creation
      fetchNotes();

      // Close form
      setShowForm(false);
    } catch (error) {
      console.error("Error creating note:", error.message);
    }
  };

  const totalPages = Math.ceil(totalNotes / notesPerPage);

  return (
    <div className="h-full flex flex-col">
      {/* Header ALWAYS visible */}
      <NotesHeader onAddClick={() => setShowForm(true)} />

      {/* FORM MODE */}
      {showForm ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <NoteForm onSubmit={handleCreateNote} />

            {/* Cancel Button (VERY IMPORTANT UX) */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-6 py-2 bg-gray-400 border rounded-lg text-white hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* NORMAL MODE */
        <>
          {loading ? (
            <p className="text-gray-500 mt-4">Loading notes...</p>
          ) : (
            <NotesList notes={notes} />
          )}

          {/* Pagination */}
          <div className="flex gap-2 mt-4 justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded hover:cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NotesPage;
