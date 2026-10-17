import { useState } from "react";

const NoteForm = ({ onSubmit, onCancel, isEditMode, selectedNote }) => {
  const [formData, setFormData] = useState(() => ({
    title: "",
    content: "",
    ...(isEditMode && selectedNote
      ? {
          title: selectedNote.title || "",
          content: selectedNote.content || "",
        }
      : {}),
  }));

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
      className="space-y-4"
    >
      {/* Title */}
      <label className="text-foreground-muted font-semibold" htmlFor="title">Title</label>
      <input
        required
        type="text"
        name="title"
        placeholder="Title..."
        value={formData.title}
        onChange={handleChange}
        className="w-full mt-2 bg-input text-foreground border border-border rounded-lg px-3 py-2 text-sm sm:text-base placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Content */}
      <label className="text-foreground-muted font-semibold" htmlFor="content">Content</label>
      <textarea
        required
        name="content"
        placeholder="Write your note..."
        value={formData.content}
        onChange={handleChange}
        rows="4"
        className="w-full mt-2 bg-input text-foreground border border-border rounded-lg px-3 py-2 text-sm sm:text-base placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      {/* Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-5 py-2 text-foreground-secondary transition hover:bg-surface-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          {isEditMode ? "Update Note" : "Save Note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
