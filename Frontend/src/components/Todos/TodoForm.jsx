import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { createTodo, updateTodo } from "../../services/todoServices";

const TodoForm = ({ todoToEdit, onTodoCreated, onCancel }) => {
  // Detect mode
  const isEditMode = Boolean(todoToEdit);

  // Single source of truth
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill form with existing todo data in edit mode
  useEffect(() => {
    if (isEditMode && todoToEdit) {
      setFormData({
        title: todoToEdit.title || "",
        description: todoToEdit.description || "",
        dueDate: todoToEdit.dueDate
          ? todoToEdit.dueDate.split("T")[0]
          : "",
        priority: todoToEdit.priority || "medium",
      });
    }
  }, [isEditMode, todoToEdit]);

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
      
      let res;

      if (isEditMode) {
        // Update todo
        res = await updateTodo(todoToEdit._id, formData);
        toast.success(res.message || "Todo updated successfully");
      }
      else {
        // Create todo
        res = await createTodo(formData);
        toast.success(res.message || "Todo created successfully");
      }

      // Notify parent
      if (onTodoCreated) {
        onTodoCreated();
      }

      // Reset only for create mode
      if (!isEditMode) {
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          priority: "medium",
        });
      }

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl p-6 max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        {isEditMode ? "Edit Todo" : "Create Todo"}
      </h2>

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
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {/* Action buttons */}
        <div className="flex gap-3 pt-2 mx-[30%]">
          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="w-1/2 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition hover:cursor-pointer"
          >
            Cancel
          </button>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition hover:cursor-pointer"
          >
            {loading ? "Saving..." : isEditMode ? "Update Todo" : "Create Todo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;
