import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import NotesHeader from "../components/Notes/NotesHeader";
import NotesList from "../components/Notes/NotesList";
import Spinner from "../components/UI/Spinner";
import NoteForm from "../components/Notes/NoteForm";
import Modal from "../components/UI/Modal";
import FormModal from "../components/UI/FormModal";

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

const sortNotes = (notes) =>
  [...notes].sort((a, b) => {
    if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
      return Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
  const notesRequestId = useRef(0);

  const invalidateNotesRequests = () => {
    notesRequestId.current += 1;
    setLoading(false);
  };

  const fetchNotes = useCallback(async ({ page = currentPage, query = debouncedQuery } = {}) => {
    const requestId = ++notesRequestId.current;
    try {
      setLoading(true);

      let data;

      if (query && query.trim() !== "") {
        data = await searchNotes(query, page, notesPerPage);
      } else {
        data = await getNotes(page, notesPerPage);
      }

      if (requestId !== notesRequestId.current) return false;
      setNotes(data.notes || []);
      setTotalNotes(data.total || 0);
      return true;
    } catch (error) {
      if (requestId === notesRequestId.current) {
        toast.error(error.message || "Failed to fetch notes");
      }
      return false;
    } finally {
      if (requestId === notesRequestId.current) setLoading(false);
    }
  }, [currentPage, debouncedQuery]);

  useEffect(() => {
    fetchNotes();
    return () => {
      notesRequestId.current += 1;
    };
  }, [fetchNotes]);

  // ======================
  // CREATE / UPDATE
  // ======================
  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        const res = await updateNote(selectedNote._id, formData);
        if (res?.note) {
          invalidateNotesRequests();
          setNotes((previous) =>
            previous.map((note) => note._id === selectedNote._id ? res.note : note),
          );
        }
        toast.success(res?.message || "Note updated successfully");
        await fetchNotes();
      } else {
        const res = await createNote(formData);
        toast.success(res?.message || "Note created successfully");
        setCurrentPage(1);
        setSearchQuery("");
        if (res?.note) {
          invalidateNotesRequests();
          setNotes((previous) => [
            ...sortNotes([
              ...previous.filter((note) => note._id !== res.note._id),
              res.note,
            ]),
          ].slice(0, notesPerPage));
          setTotalNotes((previous) => previous + 1);
        }
        await fetchNotes({ page: 1, query: "" });
      }

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

      invalidateNotesRequests();

      setNotes((prev) =>
        prev.filter((n) => n._id !== noteToDelete._id)
      );
      setTotalNotes((prev) => Math.max(0, prev - 1));

      toast.success(res?.message || "Note deleted successfully");

      setShowDeleteModal(false);
      setNoteToDelete(null);
      if (notes.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      } else {
        await fetchNotes();
      }
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
      invalidateNotesRequests();
      setNotes([]);
      setTotalNotes(0);
      setCurrentPage(1);
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
      invalidateNotesRequests();
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setTotalNotes((prev) => Math.max(0, prev - 1));
      toast.success(res.message || "Note archived successfully");
      if (notes.length === 1 && currentPage > 1) {
        setCurrentPage((page) => Math.max(1, page - 1));
      } else {
        await fetchNotes();
      }
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
      invalidateNotesRequests();

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
      invalidateNotesRequests();

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
            className="px-4 py-2 bg-blue-100 dark:bg-blue-500/15 mb-4 text-blue-600 dark:text-blue-300 rounded-3xl shadow hover:bg-blue-200 dark:hover:bg-blue-500/25 transition cursor-pointer"
          >
            Archived Notes
          </button>
        </div>
      )}

      {loading ? (
        <Spinner fullPage size={40} />
      ) : (
        <NotesList
          notes={notes}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onArchive={handleArchive}
          onPin={handlePin}
          onUnpin={handleUnpin}
          mode="active"
        />
      )}

      {/* Pagination */}
      {!loading && notes.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 cursor-pointer ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <FormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setIsEditMode(false);
          setSelectedNote(null);
        }}
        title={isEditMode ? "Edit Note" : "Create Note"}
        subtitle="Capture the details you want to remember"
      >
        <NoteForm
          key={isEditMode ? selectedNote?._id ?? "edit-note" : "new-note"}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setIsEditMode(false);
            setSelectedNote(null);
          }}
          isEditMode={isEditMode}
          selectedNote={selectedNote}
        />
      </FormModal>

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
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary"
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
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary"
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
