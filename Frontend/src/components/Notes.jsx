import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import NoteCard from "./NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [confirmNoteId, setConfirmNoteId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.success) {
          setNotes(data.notes);
        }
      } catch (error) {
        console.error("Failed to fetch notes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const displayedNotes = notes.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Delete note function
  const handleDelete = async (noteId) => {
    try {
      setDeletingNoteId(noteId);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/notes/delete/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete note");

      // Remove note from state
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success("Note deleted successfully");
    }
    catch (error) {
      toast.error(error.message);
    }
    finally {
      setDeletingNoteId(null);
      setConfirmNoteId(null);
    }
  }

  return (
     <section className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-purple-600">All Notes</h1>
          <p className="text-sm text-gray-500">
            <b>{notes.length}</b> notes in total
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/notes/add")}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-purple-500 transition"
          >
            <Plus size={18} />
            Add Note
          </button>

          <button className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-red-600 transition">
            Delete All
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 mt-20">
          Loading notes...
        </div>
      )}

      {/* Empty State */}
      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-4">
            <StickyNote className="text-purple-600" size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No notes to show
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            You haven't created any notes yet.
          </p>

          <button
            onClick={() => navigate("/notes/add")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-violet-700 transition"
          >
            <Plus size={18} />
            Create your first note
          </button>
        </div>
      )}

      {/* Notes Grid */}
      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedNotes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              content={note.content}
              createdAt={note.createdAt}
              onEdit={() => navigate(`/notes/edit/${note._id}`)}
              onDelete={() => setConfirmNoteId(note._id)}
            />
          ))}
        </div>
      )}

      {/* Show More */}
      {visibleCount < notes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white shadow hover:bg-purple-500 transition"
          >
            Show More Notes
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmNoteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete this note?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. The note will be permanently deleted.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmNoteId(null)}
                className="rounded-xl px-4 py-2 text-sm font-medium cursor-pointer text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(confirmNoteId)}
                disabled={deletingNoteId === confirmNoteId}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium cursor-pointer text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {deletingNoteId === confirmNoteId
                  ? "Deleting..."
                  : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Notes;
