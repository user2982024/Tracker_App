import { CheckCircle, Clock, PlayCircle, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const TodoCard = ({ todo, onStatusChange, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2 hover:shadow-md transition">
      {/* Title + Status */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{todo.title}</h3>

        <span
          className={`px-2 py-1 rounded text-xs capitalize ${statusStyles[todo.status]}`}
        >
          {todo.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600">{todo.description}</p>

      {/* Meta Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <span className="capitalize">Priority: {todo.priority}</span>
        <span>
          Due: {new Date(todo.dueDate).toLocaleDateString()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">

        {/* Status Buttons */}
        <button
          onClick={() => onStatusChange(todo._id, "pending")}
          className="text-gray-500 hover:text-yellow-600 transition"
        >
          <Clock size={18} />
        </button>

        <button
          onClick={() => onStatusChange(todo._id, "in-progress")}
          className="text-gray-500 hover:text-blue-600 transition"
        >
          <PlayCircle size={18} />
        </button>

        <button
          onClick={() => onStatusChange(todo._id, "completed")}
          className="text-gray-500 hover:text-green-600 transition"
        >
          <CheckCircle size={18} />
        </button>

        {/* Spacer */}
        <div className="ml-auto flex gap-3">

          {/* Edit Button */}
          <button
            onClick={() => navigate(`/todos/edit/${todo._id}`)}
            className="text-gray-500 hover:text-violet-600 transition hover:cursor-pointer"
            title="Edit Todo"
          >
            <Pencil size={18} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(todo)}
            className="text-gray-500 hover:text-red-600 transition hover:cursor-pointer"
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