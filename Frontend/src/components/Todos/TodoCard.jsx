import {
  CalendarDays,
  Check,
  Flag,
  Pencil,
  Trash2,
  Pin,
} from "lucide-react";

import { toggleTodoCompletion } from "../../services/todoServices";
import { toast } from "react-hot-toast";

const TodoCard = ({ todo, onRefresh, onEdit, onDelete, onPin, onUnpin }) => {
  const {
    _id,
    title,
    description,
    completed,
    dueDate,
    priority = "low",
    pinned = false,
  } = todo;

  const isOverdue =
    !completed && dueDate && new Date(dueDate).getTime() < Date.now();

  const isPending = !completed && !isOverdue;

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "No date";

  const priorityColor =
    priority === "high"
      ? "text-red-500"
      : priority === "medium"
      ? "text-yellow-500"
      : "text-green-500";

  const statusBg = completed
    ? "bg-green-50 hover:bg-green-100"
    : isOverdue
    ? "bg-red-50 hover:bg-red-100"
    : isPending
    ? "bg-yellow-50 hover:bg-yellow-100"
    : "bg-white hover:bg-gray-50";

  const statusBorder = pinned
    ? "border-l-4 border-yellow-400"
    : completed
    ? "border-l-4 border-green-500"
    : isOverdue
    ? "border-l-4 border-red-500"
    : isPending
    ? "border-l-4 border-yellow-500"
    : "border-l-4 border-transparent";

  const handleToggle = async () => {
    try {
      const res = await toggleTodoCompletion(_id);
      toast.success(res.message);
      onRefresh();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePinToggle = () => {
    if (pinned) onUnpin(_id);
    else onPin(_id);
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-lg shadow-sm p-4 transition ${statusBg} ${statusBorder}`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1 min-w-0">

        {/* Checkbox */}
        <div
          onClick={handleToggle}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
            completed ? "bg-green-500 border-green-500" : "border-gray-400"
          }`}
        >
          {completed && <Check size={14} className="text-white" />}
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          <h3
            className={`text-sm font-medium truncate ${
              completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {title}
          </h3>

          {description && (
            <span className="text-xs text-gray-500 truncate">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} />
          {formattedDate}
        </div>

        <div className={`flex items-center gap-2 ${priorityColor}`}>
          <Flag size={14} />
          <span className="capitalize">{priority}</span>
        </div>
      </div>

      {/* Right Section (Actions) */}
      <div className="flex items-center gap-4 text-gray-500">

        {/* Pin */}
        <button
          onClick={handlePinToggle}
          className={`transition hover:scale-110 ${
            pinned
              ? "text-yellow-500"
              : "hover:text-yellow-500 text-gray-400"
          }`}
        >
          <Pin size={17} className={pinned ? "rotate-45" : ""} />
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit(todo)}
          className="hover:text-blue-500 transition hover:scale-110"
        >
          <Pencil size={17} />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(_id)}
          className="hover:text-red-500 transition hover:scale-110"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TodoCard