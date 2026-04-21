import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById } from "../services/notesService";
import { toast } from "react-hot-toast";

const NoteViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);

        const res = await getNoteById(id);
        setNote(res.note);
      } catch (error) {
        toast.error(error.message || "Failed to load note");
        navigate(-1); // go back safely
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading note...
      </div>
    );
  }

  // No note
  if (!note) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Note not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-4xl mb-4 text-sm text-blue-600 hover:cursor-pointer"
      >
        ← Back
      </button>

      {/* Note Card */}
      <div className="bg-white shadow rounded-2xl p-6 border">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4">
          {note.title}
        </h1>

        {/* Content */}
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {note.content}
        </p>

        {/* Meta */}
        <div className="mt-6 text-sm text-gray-400">
          Created: {new Date(note.createdAt).toLocaleString()}
        </div>

      </div>
    </div>
  );
};

export default NoteViewPage;