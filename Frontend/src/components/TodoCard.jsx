import { CheckCircle, Clock, PlayCircle } from "lucide-react";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const TodoCard = ({ todo, onStatusChange }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{todo.title}</h3>

        <span className={`px-2 py-1 rounded text-xs ${statusStyles[todo.status]}`}>
          {todo.status}
        </span>
      </div>

      <p className="text-sm text-gray-600">{todo.description}</p>

      <div className="flex justify-between text-xs text-gray-500">
        <span>Priority: {todo.priority}</span>
        <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={() => onStatusChange(todo._id, "pending")}>
          <Clock size={18} />
        </button>

        <button onClick={() => onStatusChange(todo._id, "in-progress")}>
          <PlayCircle size={18} />
        </button>

        <button onClick={() => onStatusChange(todo._id, "completed")}>
          <CheckCircle size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
