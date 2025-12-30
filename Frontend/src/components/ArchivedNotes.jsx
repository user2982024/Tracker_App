import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Archive, RefreshCw } from "lucide-react";
import NoteCard from "./NoteCard";

const ArchivedNotes = () => {
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [unarchivingAll, setUnarchivingAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch archived notes
  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/notes/archived", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) setArchivedNotes(data.archivedNotes);
      } catch (error) {
        console.error("Error fetching archived notes:", error);
        toast.error("Failed to fetch archived notes");
      } finally {
        setLoading(false);
      }
    };

    fetchArchived();
  }, []);

  // Unarchive a single note
  const handleUnarchive = async (noteId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/notes/unarchive/${noteId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setArchivedNotes((prev) =>
        prev.filter((note) => note._id !== noteId)
      );

      toast.success("Note restored successfully");
    } catch (error) {
      toast.error(error.message || "Failed to restore note");
    }
  };

  // Unarchive all notes
  const handleUnarchiveAllNotes = async () => {
    try {
      setUnarchivingAll(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/notes/unarchive-all", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setArchivedNotes([]);
      toast.success("All notes restored successfully");
    } catch (error) {
      toast.error(error.message || "Failed to restore all notes");
    } finally {
      setUnarchivingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading archived notes...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
      {/* Page Heading */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-gray-100">
            <Archive className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
            Your Archived Notes
          </h1>
        </div>

        {/* Unarchive All Button */}
        {archivedNotes.length > 0 && (
          <button
            onClick={handleUnarchiveAllNotes}
            disabled={unarchivingAll}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-green-500 transition disabled:opacity-60"
          >
            <RefreshCw size={18} />
            {unarchivingAll ? "Restoring..." : "Unarchive All"}
          </button>
        )}
      </div>

      {/* Empty State */}
      {archivedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 h-[40vh]">
          <Archive className="w-14 h-14 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No archived notes yet</p>
          <p className="text-sm mt-2 max-w-sm">
            Archive notes you don’t need right now. You can always bring them back later.
          </p>
        </div>
      ) : (
        /* Notes Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedNotes.map((note) => (
            <NoteCard
              key={note._id}
              title={note.title}
              content={note.content}
              createdAt={note.createdAt}
              isArchived={true}
              onUnarchive={() => handleUnarchive(note._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivedNotes;
