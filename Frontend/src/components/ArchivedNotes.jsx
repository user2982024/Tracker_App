import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NoteCard from "./NoteCard";

const ArchivedNotes = () => {
  const [archivedNotes, setArchivedNotes] = useState([]);
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
        console.log("Archived notes response:", data);

        if (data.success) setArchivedNotes(data.archivedNotes);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchArchived();
  }, []);

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

      if (!res.ok) throw new Error(data.message || "Failed to unarchive note");

      setArchivedNotes((prev) => prev.filter((note) => note._id !== noteId));

      toast.success("Note unarchived successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p>Loading archived notes...</p>;
  if (archivedNotes.length === 0) return <p>No archived notes.</p>;

  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  </div>;
};

export default ArchivedNotes;
