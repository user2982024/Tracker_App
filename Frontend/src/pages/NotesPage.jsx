import { useEffect, useState } from "react";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import NoteForm from "../components/Notes/NoteForm";

import { getNotes, createNote, updateNote } from "../services/notesService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 9;
  const [totalNotes, setTotalNotes] = useState(0);

  const [showForm, setShowForm] = useState(false);

  // FETCH NOTES
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

  // SMART SUBMIT HANDLER
  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateNote(selectedNote._id, formData);
      } else {
        await createNote(formData);
      }

      // IMPORTANT: wait for refresh
      await fetchNotes();

      // Reset UI state
      setShowForm(false);
      setIsEditMode(false);
      setSelectedNote(null);

    } catch (error) {
      console.error("Error saving note:", error.message);
    }
  };

  // HANDLE EDIT
  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsEditMode(true);
    setShowForm(true);
  };

  const totalPages = Math.ceil(totalNotes / notesPerPage);

  return (
    <div className="h-full flex flex-col">
      
      {/* Header */}
      <NotesHeader onAddClick={() => setShowForm(true)} />

      {/* FORM MODE */}
      {showForm ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            
            <NoteForm
              onSubmit={handleSubmit}
              isEditMode={isEditMode}
              selectedNote={selectedNote}
            />

            {/* Cancel Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditMode(false);
                  setSelectedNote(null);
                }}
                className="w-full sm:w-auto px-6 py-2 bg-gray-400 border rounded-lg text-white hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      ) : (
        <>
          {/* NOTES LIST */}
          {loading ? (
            <p className="text-gray-500 mt-4">Loading notes...</p>
          ) : (
            <NotesList notes={notes} onEdit={handleEdit} />
          )}

          {/* PAGINATION */}
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