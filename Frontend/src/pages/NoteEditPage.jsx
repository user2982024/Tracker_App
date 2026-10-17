import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";
import FormModal from "../components/UI/FormModal";
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
    return <Spinner fullPage size={40} />;
  }

  if (!note) {
    return <div className="text-center mt-10">Note not found</div>;
  }

  return (
    <FormModal
      isOpen
      title="Edit Note"
      subtitle="Update this note"
      onClose={() => navigate(-1)}
    >
      <NoteForm
        onSubmit={handleUpdate}
        onCancel={() => navigate(-1)}
        isEditMode={true}
        selectedNote={note}
      />
    </FormModal>
  );
};

export default NoteEditPage;
