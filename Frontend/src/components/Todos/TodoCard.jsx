import { CalendarDays, Check, Flag, Pencil, Trash2 } from "lucide-react";
import { toggleTodoCompletion } from "../../services/todoServices";
import { toast } from "react-hot-toast";

const TodoCard = ({ todo, onRefresh, onEdit, onDelete }) => {

  // Destructure 
  const {
    _id,
    title,
    description,
    completed,
    dueDate,
    priority = "low",
    isOverdue,
  } = todo;

  const isPending = !completed && !isOverdue;

  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString()
    : "No date";

  // Priority color
  const priorityColor =
    priority === "high"
      ? "text-red-500"
      : priority === "medium"
        ? "text-yellow-500"
        : "text-green-500";

  // Background colors
  const statusBg = completed
    ? "bg-green-50 hover:bg-green-100"
    : isOverdue
      ? "bg-red-50 hover:bg-red-100"
      : isPending
        ? "bg-yellow-50 hover:bg-yellow-100"
        : "bg-white hover:bg-gray-50";

  // Borders
  const statusBorder = completed
    ? "border-l-4 border-green-500"
    : isOverdue
      ? "border-l-4 border-red-500"
      : isPending
        ? "border-l-4 border-yellow-500"
        : "border-l-4 border-transparent";

  // text colors
  const textColor = completed
    ? "text-green-500"
    : isPending
      ? "text-yellow-500"
      : isOverdue
        ? "text-red-500"
        : "text-gray-500";

    // Toggle 
    const handleToggle = async () => {
    try {
      const res = await toggleTodoCompletion(_id);
      toast.success(res.message);
      onRefresh(); // re-fetch from parent
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr_150px_120px_90px] items-center gap-4 rounded-lg shadow-sm mb-3 p-4 transition ${statusBg} ${statusBorder} hover:cursor-pointer`}
    >
      {/* Checkbox */}
      <div
      onClick={handleToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
          completed ? "bg-green-500 border-green-500" : "border-gray-400"
        }`}
      >
        {completed && <Check size={14} className="text-white" />}
      </div>

      {/* Content (Title + Description) */}
      <div className="flex flex-col min-w-0">
        {/* Title */}
        <h3
          className={`text-sm font-medium truncate ${
            completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <span
            className={`text-xs ${textColor} px-2 py-0.5 rounded mt-1 truncate block max-w-full`}
            title={description}
          >
            {description}
          </span>
        )}
      </div>

      {/* Date (Fixed Column) */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <CalendarDays size={14} />
        <span>{formattedDate}</span>
      </div>

      {/* Priority (Fixed Column) */}
      <div
        className={`flex items-center justify-center gap-2 text-sm ${priorityColor}`}
      >
        <Flag size={14} />
        <span className={`capitalize ${priorityColor}`}>{priority}</span>
      </div>

      {/* Actions (Fixed Right) */}
      <div className="flex items-center justify-end gap-4 text-gray-500">
        <button onClick={() => onEdit(todo)} className="hover:text-blue-500 transition hover:scale-110 hover:cursor-pointer">
          <Pencil size={17} />
        </button>

        <button onClick={() => onDelete(todo._id)} className="hover:text-red-500 transition hover:scale-110 hover:cursor-pointer">
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
