import { toastError } from "../utils/userToast.js";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/UI/Spinner";

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
import useDateFormat from "../hooks/useDateFormat";
import { formatDate } from "../utils/dateFormatting";

const TodoViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dateFormat = useDateFormat();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch todo
  const fetchTodo = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTodo(id);
      setTodo(data);
    } catch (error) {
      toastError(error.message);
      navigate("/app/todos");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTodo();
  }, [fetchTodo]);

  // Handlers
  const handleToggle = async () => {
    try {
      await toggleTodoCompletion(id, !todo.completed);
      toast.success(todo.completed ? "Task moved back to your list." : "Task completed.");
      fetchTodo();
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo(id);
      toast.success("Task deleted.");
      navigate("/app/todos");
    } catch (error) {
      toastError(error.message);
    }
  };

  const handlePinToggle = async () => {
    try {
      if (todo.pinned) await unpinTodo(id);
      else await pinTodo(id);

      toast.success(todo.pinned ? "Task unpinned." : "Task pinned.");
      fetchTodo();
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleEdit = () => {
    navigate(`/app/todos/edit/${id}`);
  };

  if (loading) {
    return <Spinner fullPage size={40} />;
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
    ? formatDate(dueDate, dateFormat)
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
      text: "text-green-600 dark:text-green-300",
    },
    red: {
      border: "border-red-500",
      badge: "bg-red-500",
      text: "text-red-600 dark:text-red-300",
    },
    yellow: {
      border: "border-yellow-500",
      badge: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-300",
    },
    gray: {
      border: "border-transparent",
      badge: "bg-foreground-muted",
      text: "text-foreground-muted",
    },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/app/todos")}
        className="flex items-center gap-2
          text-sm font-medium text-foreground-muted
          hover:text-foreground mb-6 sm:mb-8
          transition-colors duration-200
          hover:cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Todos
      </button>

      {/* Main Card */}
      <div
        className={`relative rounded-xl p-6 shadow-md border-l-4 ${colorMap[statusColor].border} bg-surface`}
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
              completed ? "line-through text-foreground-muted" : "text-foreground"
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
                completed ? "bg-green-500 border-green-500" : "border-border-strong"
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
                  : "text-foreground-muted hover:text-yellow-500 dark:hover:text-yellow-400"
              }`}
            >
              <Pin size={18} className={pinned ? "rotate-45" : ""} />
            </button>

            {/* Edit */}
            <button
              onClick={handleEdit}
              className="text-foreground-muted hover:text-blue-500 dark:hover:text-blue-400 hover:cursor-pointer"
            >
              <Pencil size={18} />
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              className="text-foreground-muted hover:text-red-500 dark:hover:text-red-400 hover:cursor-pointer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-foreground-muted mb-6 whitespace-pre-wrap">
            {description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex gap-6 text-sm text-foreground-muted">
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
