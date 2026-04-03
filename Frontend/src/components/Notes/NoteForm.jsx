import { useState } from "react";

const NoteForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic guard (extra safety, backend already validates)
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    onSubmit(formData);

    // reset form only for create mode
    if (!isEditing) {
        setFormData({
            title: "",
            content: "",
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-md space-y-4"
    >
      {/* Title */}
      <input
        required
        type="text"
        name="title"
        placeholder="Title..."
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Content */}
      <textarea
        required
        name="content"
        placeholder="Write your note..."
        value={formData.content}
        onChange={handleChange}
        rows="4"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {isEditing ? "Update Note" : "Save Note"}
      </button>
    </form>
  );
};

export default NoteForm;
