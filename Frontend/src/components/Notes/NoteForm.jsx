import { useState, useEffect } from "react";

const NoteForm = ({ onSubmit, isEditMode, selectedNote }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Pre-fill form in edit mode
  useEffect(() => {
    if (isEditMode && selectedNote) {
      setFormData({
        title: selectedNote.title || "",
        content: selectedNote.content || "",
      });
    }
    else {
      // Reset when switching to create mode
      setFormData({
        title: "",
        content: "",
      });
    }
  }, [isEditMode, selectedNote]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-4 sm:p-6
        rounded-2xl
        shadow-md
        space-y-4
        max-w-2xl
        mx-auto
      "
    >
      {/* Title */}
      <label className="text-gray-500 font-semibold" htmlFor="title">Title</label>
      <input
        required
        type="text"
        name="title"
        placeholder="Title..."
        value={formData.title}
        onChange={handleChange}
        className="w-full mt-2 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Content */}
      <label className="text-gray-500 font-semibold" htmlFor="content">Content</label>
      <textarea
        required
        name="content"
        placeholder="Write your note..."
        value={formData.content}
        onChange={handleChange}
        rows="4"
        className="w-full mt-2 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
        >
          {isEditMode ? "Update Note" : "Save Note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
