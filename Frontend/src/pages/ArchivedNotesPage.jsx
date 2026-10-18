import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import Spinner from "../components/UI/Spinner";
import {
  getArchivedNotes,
  deleteNote,
  unarchiveNote,
  searchArchivedNotes,
} from "../services/notesService";
import NotesList from "../components/Notes/NotesList";
import Modal from "../components/UI/Modal";
import { toast } from "react-hot-toast";

const ArchivedNotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [actionPending, setActionPending] = useState(false);
  const requestRevision = useRef(0);

  const limit = 9;

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch archived notes
  const fetchArchivedNotes = useCallback(async (query = "", pageNum = 1) => {
    const currentRequest = ++requestRevision.current;
    try {
      setLoading(true);
      setLoadError("");

      const res =
        query && query.trim()
          ? await searchArchivedNotes(query, pageNum, limit)
          : await getArchivedNotes(pageNum, limit);

      if (currentRequest !== requestRevision.current) return;
      setNotes(res.notes || []);
      setTotal(res.total || 0);
    } catch (error) {
      if (currentRequest === requestRevision.current) {
        setLoadError(error.message || "Failed to load archived notes");
        toast.error(error.message || "Failed to fetch archived notes");
      }
    } finally {
      if (currentRequest === requestRevision.current) setLoading(false);
    }
  }, []);

  // Fetch on search or page change
  useEffect(() => {
    fetchArchivedNotes(debouncedSearch, page);
    return () => {
      requestRevision.current += 1;
    };
  }, [debouncedSearch, fetchArchivedNotes, page]);

  const totalPages = Math.ceil(total / limit);

  // OLD delete removed
  // const handleDelete = async (note) => {...}

  // Trigger modal
  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!noteToDelete || actionPending) return;
    try {
      setActionPending(true);
      const res = await deleteNote(noteToDelete._id);
      requestRevision.current += 1;

      setNotes((prev) =>
        prev.filter((n) => n._id !== noteToDelete._id)
      );
      setTotal((prev) => Math.max(0, prev - 1));

      toast.success(res.message || "Note deleted successfully");

      setShowDeleteModal(false);
      setNoteToDelete(null);
      if (notes.length === 1 && page > 1) {
        setPage((currentPage) => Math.max(1, currentPage - 1));
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    } finally {
      setActionPending(false);
    }
  };

  // Unarchive
  const handleUnarchive = async (noteId) => {
    if (actionPending) return;
    try {
      setActionPending(true);
      const res = await unarchiveNote(noteId);
      requestRevision.current += 1;
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      setTotal((prev) => Math.max(0, prev - 1));
      toast.success(res.message || "Note unarchived successfully");
      if (notes.length === 1 && page > 1) {
        setPage((currentPage) => Math.max(1, currentPage - 1));
      }
    } catch (error) {
      toast.error(error.message || "Failed to unarchive note");
    } finally {
      setActionPending(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-3">
        <h1 className="text-2xl font-semibold">Archived Notes</h1>

        <div className="flex gap-2 w-full md:w-auto items-center">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search archived notes..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 pr-10 py-2 bg-input text-foreground border border-border rounded-lg placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Back */}
          <button
            onClick={() => navigate("/app/notes")}
            className="px-4 py-2 bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 rounded-3xl hover:bg-blue-200 dark:hover:bg-blue-500/25 transition cursor-pointer"
          >
            ← Back to notes
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && <Spinner fullPage size={40} label="Loading archived notes" />}

      {!loading && loadError && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center" role="alert">
          <p className="text-foreground-muted">Could not load archived notes. {loadError}</p>
          <button
            type="button"
            onClick={() => fetchArchivedNotes(debouncedSearch, page)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-secondary"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !loadError && notes.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center" role="status">
          <p className="text-foreground-muted">
            {debouncedSearch.trim()
              ? `No archived notes match “${debouncedSearch.trim()}”. Try another search or clear it.`
              : "No archived notes yet. Notes you archive will appear here."}
          </p>
          {debouncedSearch.trim() && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-secondary"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* List */}
      {!loading && notes.length > 0 && (
        <>
          <NotesList
            notes={notes}
            onEdit={null}
            onDelete={handleDeleteClick}   
            onArchive={null}
            onUnarchive={handleUnarchive}
            mode="archived"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex gap-2 mt-6 justify-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded cursor-pointer ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-border"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* DELETE MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setNoteToDelete(null);
        }}
        title="Delete Archived Note?"
        actions={
          <>
            <button
              onClick={() => {
                if (actionPending) return;
                setShowDeleteModal(false);
                setNoteToDelete(null);
              }}
              disabled={actionPending}
              className="px-4 py-2 border border-border rounded-lg hover:bg-surface-secondary transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={actionPending}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              {actionPending ? "Deleting..." : "Delete"}
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

export default ArchivedNotesPage;
