import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Flag,
  Pencil,
  Trash2,
  Pin,
} from "lucide-react";

import {
  getTodo,
  toggleTodoCompletion,
  deleteTodo,
  pinTodo,
  unpinTodo,
} from "../services/todoServices";

import { toast } from "react-hot-toast";

const TodoViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch todo
  const fetchTodo = async () => {
    try {
      setLoading(true);
      const data = await getTodo(id);
      setTodo(data);
    } catch (error) {
      toast.error(error.message);
      navigate("/app/todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, [id]);

  // Handlers
  const handleToggle = async () => {
    try {
      const res = await toggleTodoCompletion(id);
      toast.success(res.message);
      fetchTodo();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteTodo(id);
      toast.success(res.message);
      navigate("/app/todos");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePinToggle = async () => {
    try {
      const res = todo.pinned
        ? await unpinTodo(id)
        : await pinTodo(id);

      toast.success(res.message);
      fetchTodo();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = () => {
    navigate(`/app/todos/edit/${id}`);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!todo) return null;

  const {
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

  // Status color logic (same as card)
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/app/todos")}
        className="flex items-center gap-2 bg-blue-100 hover:bg-blue-100 px-3 py-2 rounded-3xl hover:cursor-pointer text-blue-600 hover: mb-10"
      >
        <ArrowLeft size={18} />
        Back to Todos
      </button>

      {/* Main Card */}
      <div
        className={`relative rounded-xl p-6 shadow-md border-l-4 ${colorMap[statusColor].border} bg-white`}
      >
        {/* Pin Badge */}
        {pinned && (
          <span
            className={`absolute -top-3 left-4 text-xs font-medium text-white px-2 py-1 rounded-md ${colorMap[statusColor].badge}`}
          >
            Pinned
          </span>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h1
            className={`text-xl font-semibold ${
              completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {title}
          </h1>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Toggle */}
            <button
              onClick={handleToggle}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center hover:cursor-pointer ${
                completed
                  ? "bg-green-500 border-green-500"
                  : "border-gray-400"
              }`}
            >
              {completed && <Check size={14} className="text-white" />}
            </button>

            {/* Pin */}
            <button
              onClick={handlePinToggle}
              className={`hover:cursor-pointer ${
                pinned
                  ? "text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              <Pin size={18} className={pinned ? "rotate-45" : ""} />
            </button>

            {/* Edit */}
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"
            >
              <Pencil size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 hover:cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-6 whitespace-pre-wrap">
            {description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            {formattedDate}
          </div>

          <div
            className={`flex items-center gap-2 ${colorMap[statusColor].text}`}
          >
            <Flag size={16} />
            <span className="capitalize">{priority}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoViewPage;