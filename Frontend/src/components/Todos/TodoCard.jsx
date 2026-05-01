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

  const now = new Date();

  const isOverdue =
    !completed && dueDate && new Date(dueDate).getTime() < now.getTime();

  const isPending = !completed && !isOverdue;

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "No date";

  // Status color
  const statusColor = completed
    ? "green"
    : isOverdue
    ? "red"
    : isPending
    ? "yellow"
    : "gray";

  const colorMap = {
    green: {
      border: "border-green-500",
      badge: "bg-green-500",
      text: "text-green-600",
    },
    red: {
      border: "border-red-500",
      badge: "bg-red-500",
      text: "text-red-600",
    },
    yellow: {
      border: "border-yellow-500",
      badge: "bg-yellow-500",
      text: "text-yellow-600",
    },
    gray: {
      border: "border-transparent",
      badge: "bg-gray-400",
      text: "text-gray-500",
    },
  };

  const statusBg = completed
    ? "bg-green-50 hover:bg-green-100"
    : isOverdue
    ? "bg-red-50 hover:bg-red-100"
    : isPending
    ? "bg-yellow-50 hover:bg-yellow-100"
    : "bg-white hover:bg-gray-50";

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
      className={`relative grid grid-cols-[auto_1fr_150px_120px_120px] items-center gap-4 rounded-lg shadow-sm p-4 transition-all duration-200
      ${statusBg}
      border-l-4 ${colorMap[statusColor].border}
      ${pinned ? "ring-1 ring-gray-200 shadow-md" : ""}
    `}
    >
      {/* Pin badge */}
      {pinned && (
        <span
          className={`absolute -top-2 left-3 text-xs font-medium text-white px-2 py-0.5 rounded-md shadow-sm
          ${colorMap[statusColor].badge}`}
        >
          Pinned
        </span>
      )}

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

      {/* Date */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <CalendarDays size={14} />
        {formattedDate}
      </div>

      {/* Priority */}
      <div
        className={`flex items-center justify-center gap-2 text-sm ${colorMap[statusColor].text}`}
      >
        <Flag size={14} />
        <span className="capitalize">{priority}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        
        {/* Pin → Yellow */}
        <button
          onClick={handlePinToggle}
          className={`transition-all duration-200 hover:scale-110 hover:cursor-pointer ${
            pinned
              ? "text-yellow-500"
              : "text-gray-400 hover:text-yellow-500"
          }`}
        >
          <Pin size={17} className={pinned ? "rotate-45" : ""} />
        </button>

        {/* Edit → Blue (industry standard) */}
        <button
          onClick={() => onEdit(todo)}
          className="text-gray-400 hover:text-blue-500 transition hover:scale-110 hover:cursor-pointer"
        >
          <Pencil size={17} />
        </button>

        {/* Delete → Red */}
        <button
          onClick={() => onDelete(_id)}
          className="text-gray-400 hover:text-red-500 transition hover:scale-110 hover:cursor-pointer"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;