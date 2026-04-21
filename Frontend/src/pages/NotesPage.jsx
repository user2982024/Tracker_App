import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import NoteForm from "../components/Notes/NoteForm";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  deleteAllNotes,
  archiveNote,
  pinNote,
  unpinNote,
  searchNotes,
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
  
  const [searchQuery, setSearchQuery] = useState("");

  const notesPerPage = 9;
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      
      let data;

      if (searchQuery && searchQuery.trim() !== "") {
        // Search mode
        data = await searchNotes(searchQuery, currentPage, notesPerPage);
      }
      else {
        // Normal mode
        data = await getNotes(currentPage, notesPerPage);
      }

      setNotes(data.notes || []);
      setTotalNotes(data.total || 0);

    } catch (error) {
      toast.error(error.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [currentPage, searchQuery]);

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

      setShowForm(false);
      setIsEditMode(false);
      setSelectedNote(null);
    } catch (error) {
      toast.error(error.message || "Failed to save note");
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (note) => {
    try {
      const res = await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success(res?.message || "Note deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    }
  };

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

  const handleArchive = async (noteId) => {
    try {
      const res = await archiveNote(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setTotalNotes((prev) => prev - 1);
      toast.success(res.message || "Note archived successfully");
    } catch (error) {
      toast.error(error.message || "Failed to archive note");
    }
  };

  const handlePin = async (noteId) => {
    try {
      const res = await pinNote(noteId);

      setNotes((prev) => {
        const updated = prev.map((note) =>
          note._id === noteId ? { ...note, isPinned: true } : note
        );

        const pinned = updated.filter((n) => n.isPinned);
        const unpinned = updated.filter((n) => !n.isPinned);

        const newlyPinned = pinned.find((n) => n._id === noteId);
        const otherPinned = pinned.filter((n) => n._id !== noteId);

        return [
          newlyPinned,
          ...otherPinned,
          ...unpinned.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        ];
      });

      toast.success(res.message || "Note pinned successfully");
    } catch (error) {
      toast.error(error.message || "Failed to pin note");
    }
  };

  const handleUnpin = async (noteId) => {
    try {
      const res = await unpinNote(noteId);

      setNotes((prev) => {
        const updated = prev.map((note) =>
          note._id === noteId ? { ...note, isPinned: false } : note
        );

        const pinned = updated.filter((n) => n.isPinned);
        const unpinned = updated.filter((n) => !n.isPinned);

        return [
          ...pinned,
          ...unpinned.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
        ];
      });

      toast.success(res.message || "Note unpinned successfully");
    } catch (error) {
      toast.error(error.message || "Failed to unpin note");
    }
  };

  const totalPages = Math.ceil(totalNotes / notesPerPage);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <NotesHeader
        onAddClick={() => setShowForm(true)}
        onDeleteAllClick={() => setShowDeleteAllModal(true)}
        onSearch={
          (value) => {
            setCurrentPage(1);
            setSearchQuery(value);
          }
        }
      />

      {/* Archived Button */}
      {!showForm && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/app/notes/archive")}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-3xl shadow hover:bg-blue-200 transition cursor-pointer"
          >
            Archived Notes
          </button>
        </div>
      )}

      {showForm ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <NoteForm
              onSubmit={handleSubmit}
              isEditMode={isEditMode}
              selectedNote={selectedNote}
            />

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  setShowForm(false);
                  setIsEditMode(false);
                  setSelectedNote(null);
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <p className="text-gray-500 mt-4">Loading notes...</p>
          ) : (
            <NotesList
              notes={notes}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onArchive={handleArchive}
              onPin={handlePin}
              onUnpin={handleUnpin}
              mode="active"
            />
          )}

          {/* Pagination */}
          <div className="flex gap-2 mt-6 justify-center">
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

      {/* Delete Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6">
            <h2 className="text-xl font-semibold mb-3">
              Delete All Notes?
            </h2>

            <p className="text-gray-600 mb-6">
              This action{" "}
              <span className="text-red-500 font-semibold">
                cannot be undone
              </span>.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
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