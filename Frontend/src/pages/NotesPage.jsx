import { useEffect, useState } from "react";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import NoteForm from "../components/Notes/NoteForm";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteAllNotes
} from "../services/notesService";

import { toast } from "react-hot-toast";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const notesPerPage = 9;

  // Fetch notes
  const fetchNotes = async () => {
    try {
      setLoading(true);

      const data = await getNotes(currentPage, notesPerPage);

      setNotes(data.notes || []);
      setTotalNotes(data.total || 0);
    } catch (error) {
      console.error("Error fetching notes:", error.message);
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [currentPage]);

  // Submit (Create / Update)
  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        const res = await updateNote(selectedNote._id, formData);
        toast.success(res?.message || "Note updated successfully");
      } else {
        const res = await createNote(formData);
        toast.success(res?.message || "Note created successfully");
      }

      await fetchNotes();

      // Reset UI
      setShowForm(false);
      setIsEditMode(false);
      setSelectedNote(null);

    } catch (error) {
      console.error("Error saving note:", error.message);
      toast.error(error.message || "Failed to save note");
    }
  };

  // Edit note
  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsEditMode(true);
    setShowForm(true);
  };

  // Delete single note
  const handleDelete = async (note) => {
    try {
      const res = await deleteNote(note._id);

      // Optimistic UI
      setNotes((prev) => prev.filter((n) => n._id !== note._id));

      toast.success(res?.message || "Note deleted successfully");

    } catch (error) {
      console.error("Delete failed:", error.message);
      toast.error(error.message || "Failed to delete note");
    }
  };

  // Delete ALL notes (FIXED)
  const handleDeleteAll = async () => {
    try {
      const res = await deleteAllNotes();

      setNotes([]); 
      setShowDeleteAllModal(false); 

      toast.success(res.message);
    } catch (error) {
      toast.error(error.message || "Failed to delete all notes");
    }
  };

  const totalPages = Math.ceil(totalNotes / notesPerPage);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <NotesHeader
        onAddClick={() => setShowForm(true)}
        onDeleteAllClick={() => setShowDeleteAllModal(true)} 
      />

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
                className="w-full sm:w-auto px-6 py-2 bg-gray-400 border rounded-lg text-white hover:bg-gray-500 transition cursor-pointer"
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
            <NotesList
              notes={notes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* PAGINATION */}
          <div className="flex gap-2 mt-4 justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded cursor-pointer ${
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

      {/* DELETE ALL MODAL */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-fadeIn">
            
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Delete All Notes?
            </h2>

            <p className="text-gray-600 mb-6">
              This action <span className="font-semibold text-red-500">cannot be undone</span>.
              All your notes will be permanently deleted.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition hover:cursor-pointer"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;