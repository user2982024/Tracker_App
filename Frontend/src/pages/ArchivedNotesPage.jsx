import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
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
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const limit = 9;

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch archived notes
  const fetchArchivedNotes = async (query = "", pageNum = 1) => {
    try {
      setLoading(true);

      const res =
        query && query.trim()
          ? await searchArchivedNotes(query, pageNum, limit)
          : await getArchivedNotes(pageNum, limit);

      setNotes(res.notes || []);
      setTotal(res.total || 0);
    } catch (error) {
      toast.error(error.message || "Failed to fetch archived notes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on search or page change
  useEffect(() => {
    fetchArchivedNotes(debouncedSearch, page);
  }, [debouncedSearch, page]);

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
    try {
      const res = await deleteNote(noteToDelete._id);

      setNotes((prev) =>
        prev.filter((n) => n._id !== noteToDelete._id)
      );

      toast.success(res.message || "Note deleted successfully");

      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete note");
    }
  };

  // Unarchive
  const handleUnarchive = async (noteId) => {
    try {
      const res = await unarchiveNote(noteId);
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success(res.message || "Note unarchived successfully");
    } catch (error) {
      toast.error(error.message || "Failed to unarchive note");
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
              className="w-full px-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Back */}
          <button
            onClick={() => navigate("/app/notes")}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-3xl hover:bg-blue-200 transition cursor-pointer"
          >
            ← Back to notes
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && notes.length === 0 && (
        <p className="text-gray-500">Loading archived notes...</p>
      )}

      {/* Empty */}
      {!loading && notes.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          {searchTerm
            ? `No results found for "${searchTerm}"`
            : "No archived notes found"}
        </p>
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
          <div className="flex gap-2 mt-6 justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded cursor-pointer ${
                  page === i + 1
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
                setShowDeleteModal(false);
                setNoteToDelete(null);
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
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

export default ArchivedNotesPage;