import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  createGoal,
  updateGoal,
} from "../../services/goalsServices";

const GoalForm = ({
  mode = "create",
  initialData = {},
  goalId = null,
}) => {

  const isEdit = mode === "edit";

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    targetValue: initialData.targetValue || "",
    unit: initialData.unit || "",
    targetDate: initialData.targetDate
      ? initialData.targetDate.split("T")[0]
      : "",
    category: initialData.category || "personal",
    priority: initialData.priority || "medium",
    status: initialData.status || "active",
  });

  const [loading, setLoading] = useState(false);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        targetValue: Number(formData.targetValue),
      };

      // Edit mode
      if (isEdit) {
        await updateGoal(goalId, payload);
        toast.success("Goal updated successfully!");
      }

      // Create mode
      else {
        await createGoal(payload);

        // Reset form only in create mode
        setFormData({
          title: "",
          description: "",
          targetValue: "",
          unit: "",
          targetDate: "",
          category: "personal",
          priority: "medium",
          status: "active",
        });
      }

      navigate("/app/goals");

    } catch (error) {
      console.error(
        isEdit
          ? "Failed to update goal:"
          : "Failed to create goal:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border max-w-2xl mx-auto">

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEdit ? "Edit Goal" : "Create New Goal"}
      </h2>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >

        {/* Title */}
        <div>
          <label className="text-sm text-gray-600">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter goal title"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-gray-600">
            Description
          </label>

          <textarea
            rows="3"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          ></textarea>
        </div>

        {/* Target + Unit */}
        <div className="grid grid-cols-2 gap-4">

          {/* Target Value */}
          <div>
            <label className="text-sm text-gray-600">
              Target Value
            </label>

            <input
              type="number"
              name="targetValue"
              value={formData.targetValue}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm text-gray-600">
              Unit
            </label>

            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. problems, hours"
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Target Date */}
        <div>
          <label className="text-sm text-gray-600">
            Target Date
          </label>

          <input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Category + Priority */}
        <div className="grid grid-cols-2 gap-4">

          {/* Category */}
          <div>
            <label className="text-sm text-gray-600">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="health">health</option>
              <option value="career">career</option>
              <option value="learning">learning</option>
              <option value="finance">finance</option>
              <option value="personal">personal</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm text-gray-600">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>
        </div>

        {/* Status (ONLY edit mode) */}
        {isEdit && (
          <div>
            <label className="text-sm text-gray-600">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">active</option>
              <option value="paused">paused</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
                ? "Update Goal"
                : "Create Goal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;