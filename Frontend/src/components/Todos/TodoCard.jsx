import { CalendarDays, Check, Flag } from "lucide-react";

import { toggleTodoCompletion } from "../../services/todoServices";

import { toast } from "react-hot-toast";

const TodoCard = ({ todo, onToggle }) => {
  const { title, description, dueDate, priority, completed } = todo;

  // Toggle handler
  const handleToggle = async () => {
    try {
      const res = await toggleTodoCompletion(todo._id);

      toast.success(res.message || "Todo status updated successfully");

      if (onToggle) {
        onToggle();
      }
    }
    catch (error) {
      toast.error(error.message || "Failed to update todo");
    }
  }

  // Format date
  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "No due date";

  // Priority color
  const priorityColor =
    priority === "high"
      ? "text-red-500"
      : priority === "medium"
        ? "text-yellow-500"
        : "text-green-500";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div
        onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center hover:cursor-pointer ${completed ? "bg-green-500 border-green-500" : "border-blue-500"}`}
        >
          {completed && <Check size={14} className="text-white" />}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3
            className={`text-sm font-medium ${completed ? "line-through text-gray-400" : "text-gray-800"}`}
          >
            {title}
          </h3>

          {description && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded w-fit mt-1">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>{formattedDate}</span>
        </div>

        {/* Priority */}
        <div className={`flex items-center gap-2 text-sm ${priorityColor}`}>
          <Flag size={16} />
          <span className="capitalize">{priority}</span>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
