import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, StickyNote } from "lucide-react";
import NoteCard from "./NoteCard";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

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

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Left: Title */}
        <div>
          <h1 className="text-2xl font-semibold text-purple-600">All Notes</h1>
          <p className="text-sm text-gray-500"><b>{notes.length}</b> notes in total</p>
        </div>

        {/* Right: Buttons */}
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

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-500 mt-20">Loading notes...</div>
      )}

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-4">
            <StickyNote className="text-purple-600" size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No notes to show
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            You haven't created any notes yet. Start capturing your ideas,
            tasks, or thoughts by adding your first note.
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
            />
          ))}
        </div>
      )}

      {/* Show More Button */}
      {visibleCount < notes.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 cursor-pointer px-6 py-3 text-sm font-medium text-white shadow hover:bg-purple-500 transition"
          >
            Show More Notes
          </button>
        </div>
      )}
    </section>
  );
};

export default Notes;
