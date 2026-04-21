import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import NoteForm from "../components/Notes/NoteForm";
import Modal from "../components/UI/Modal";

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

  // ✅ Modal states
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);

  const notesPerPage = 9;
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);

      let data;

      if (debouncedQuery && debouncedQuery.trim() !== "") {
        data = await searchNotes(debouncedQuery, currentPage, notesPerPage);
      } else {
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
  }, [currentPage, debouncedQuery]);

  // ======================
  // CREATE / UPDATE
  // ======================
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

  // ======================
  // DELETE SINGLE (MODAL)
  // ======================
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteNote(noteToDelete._id);

      setNotes((prev) =>
        prev.filter((n) => n._id !== noteToDelete._id)
      );

      toast.success(res?.message || "Note deleted successfully");

      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  // ======================
  // DELETE ALL
  // ======================
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

  // ======================
  // ARCHIVE
  // ======================
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

  // ======================
  // PIN / UNPIN
  // ======================
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
        onSearch={(value) => {
          setCurrentPage(1);
          setSearchQuery(value);
        }}
      />

      {/* Archived Button */}
      {!showForm && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate("/app/notes/archive")}
            className="px-4 py-2 bg-blue-100 mb-4 text-blue-600 rounded-3xl shadow hover:bg-blue-200 transition cursor-pointer"
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
              onDelete={handleDeleteClick}   // ✅ UPDATED
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

      {/* ======================
          DELETE SINGLE MODAL
      ====================== */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setNoteToDelete(null);
        }}
        title="Delete Note?"
        actions={
          <>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setNoteToDelete(null);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </>
        }
      >
        This action cannot be undone.
      </Modal>

      {/* ======================
          DELETE ALL MODAL
      ====================== */}
      <Modal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        title="Delete All Notes?"
        actions={
          <>
            <button
              onClick={() => setShowDeleteAllModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete All
            </button>
          </>
        }
      >
        This action
        <span className="text-red-500 font-semibold">
          cannot be undone
        </span>.
      </Modal>
    </div>
  );
};

export default NotesPage;