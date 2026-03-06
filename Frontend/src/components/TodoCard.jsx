import { CheckCircle, Clock, PlayCircle, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const TodoCard = ({ todo, onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  const formattedDate = todo?.dueDate
    ? new Date(todo.dueDate).toLocaleDateString()
    : "No date";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition space-y-3">

      {/* TITLE + STATUS */}
      <div className="flex justify-between items-start">
        <h3 className="text-gray-800 font-semibold text-sm sm:text-base">
          {todo.title}
        </h3>

        <span
          className={`px-2 py-1 rounded text-xs capitalize ${
            statusStyles[todo.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {todo.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      {todo.description && (
        <p className="text-sm text-gray-600 line-clamp-2">
          {todo.description}
        </p>
      )}

      {/* META INFO */}
      <div className="flex justify-between text-xs text-gray-500">
        <span className="capitalize">Priority: {todo.priority}</span>
        <span>Due: {formattedDate}</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-3 pt-2">

        {/* STATUS BUTTONS */}

        <button
          onClick={() => onStatusChange(todo._id, "pending")}
          className="text-gray-500 hover:text-yellow-600 transition"
          title="Mark as Pending"
        >
          <Clock size={18} />
        </button>

        <button
          onClick={() => onStatusChange(todo._id, "in progress")}
          className="text-gray-500 hover:text-blue-600 transition"
          title="Mark as In Progress"
        >
          <PlayCircle size={18} />
        </button>

        <button
          onClick={() => onStatusChange(todo._id, "completed")}
          className="text-gray-500 hover:text-green-600 transition"
          title="Mark as Completed"
        >
          <CheckCircle size={18} />
        </button>

        {/* RIGHT SIDE ACTIONS */}
        <div className="ml-auto flex gap-3">

          <button
            onClick={() => navigate(`/todos/edit/${todo._id}`)}
            className="text-gray-500 hover:text-violet-600 transition"
            title="Edit Todo"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(todo)}
            className="text-gray-500 hover:text-red-600 transition"
            title="Delete Todo"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default TodoCard;