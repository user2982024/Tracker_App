import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote } from "../services/notesService";
import NoteForm from "../components/Notes/NoteForm";
import { toast } from "react-hot-toast";

const NoteEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await getNoteById(id);
        setNote(res.note);
      } catch (error) {
        toast.error(error.message || "Failed to load note");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleUpdate = async (formData) => {
    try {
      const res = await updateNote(id, formData);
      toast.success(res.message || "Note updated successfully");

      // Go back to view page
      navigate(`/app/notes/${id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update note");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!note) {
    return <div className="text-center mt-10">Note not found</div>;
  }

  return (
    <div className="p-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <NoteForm
        onSubmit={handleUpdate}
        isEditMode={true}
        selectedNote={note}
      />
    </div>
  );
};

export default NoteEditPage;