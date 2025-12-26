import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddNote = ({ mode = "create" }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing note data if in edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchNote = async () => {
        try {
          setLoading(true);

          const token = localStorage.getItem("token");

          const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Failed to fetch notes");

          setTitle(data.note.title);
          setContent(data.note.content);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNote();
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let url = "http://localhost:5000/api/notes/create";
      let method = "POST";

      if (mode === "edit") {
        url = `http://localhost:5000/api/notes/edit/${id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create note");
      }

      toast.success(mode === "create" ? "Note created successfully" : "Note updated successfully");
      navigate("/notes");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {mode === "create" ? "Add new note" : "Edit note"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            placeholder="Content"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 cursor-pointer transition"
          >
            {loading ? (mode === "create" ? "Creating..." : "Updating...") : mode === "create" ? "Save note" : "Update note"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddNote;
