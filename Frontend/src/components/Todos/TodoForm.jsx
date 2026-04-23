import { useState } from "react";

import {
    createTodo,
} from "../../services/todoServices";

const TodoForm = () => {
  // Single source of truth
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);

  // hnadle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hnalde submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        console.log("Sending data", formData);

        // API call to create todo
        const res = await createTodo(formData);

        console.log("Response", res);

        // Reset form after success
        setFormData({
            title: "",
            description: "",
            dueDate: "",
            priority: "medium",
        });
    }
    catch (error) {
        console.error("Error creating todo", error.message);
    }
    finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Create Todo</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter todo title"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">
              Medium
            </option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Todo
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
