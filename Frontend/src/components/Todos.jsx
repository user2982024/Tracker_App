import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Trophy,
} from "lucide-react";
import TodoCard from "./TodoCard";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch todos");
        }

        setTodos(data.todos);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Open modal
  const handleDeleteClick = (todo) => {
    setSelectedTodo(todo);
    setShowModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/todos/${selectedTodo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setTodos((prev) => prev.filter((todo) => todo._id !== selectedTodo._id));

      toast.success("Todo deleted successfully");

      setShowModal(false);
      setSelectedTodo(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Stats
  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.status === "completed").length,
    inProgress: todos.filter((t) => t.status === "in progress").length,
    overdue: todos.filter(
      (t) => new Date(t.dueDate) < new Date() && t.status !== "completed",
    ).length,
  };

  // Filters
  const filters = [
    { label: "All Tasks", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in progress" },
    { label: "Completed", value: "completed" },
    { label: "Overdue", value: "overdue" },
  ];

  // Filter todos dynamically
  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "pending") return todo.status === "pending";

    if (activeFilter === "in progress") return todo.status === "in progress";

    if (activeFilter === "completed") return todo.status === "completed";

    if (activeFilter === "overdue")
      return (
        todo.dueDate &&
        new Date(todo.dueDate) < new Date() &&
        todo.status !== "completed"
      );

    return true;
  });

  const deleteAllTodos = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/todos", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setTodos([]);

      toast.success("All todos deleted successfully");

      setShowDeleteAllModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStatusChange = async (todoId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/todos/${todoId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Update UI instantly
      setTodos((prev) =>
        prev.map((todo) => (todo._id === todoId ? data.todo : todo)),
      );

      toast.success(`Todo status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getEmptyMessage = () => {
    if (todos.length === 0) {
      return {
        title: "No todos yet",
        subtitle: "Create your first task to get started",
        showButton: true,
      };
    }

    switch (activeFilter) {
      case "pending":
        return {
          title: "No pending tasks",
          subtitle: "You're all caught up!",
          showButton: false,
        };

      case "in progress":
        return {
          title: "No tasks in progress",
          subtitle: "Start working on a task to see it here",
          showButton: false,
        };

      case "completed":
        return {
          title: "No completed tasks",
          subtitle: "Finish a task to see it here",
          showButton: false,
        };

      case "overdue":
        return {
          title: "Nothing overdue",
          subtitle: "Great job staying on track!",
          showButton: false,
        };

      default:
        return {
          title: "No todos to show",
          subtitle: "",
          showButton: true,
        };
    }
  };

  const emptyState = getEmptyMessage();

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Todos</h1>
          <p className="text-sm text-gray-500">Manage your tasks efficiently</p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search todos..."
            className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 sm:block"
          />

          <button
            onClick={() => setShowDeleteAllModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-red-700"
          >
            Delete All
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-violet-700"
            onClick={() => navigate("/todos/add")}
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          icon={ListTodo}
          color="violet"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 rounded-xl bg-white p-1 shadow-sm">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeFilter === filter.value
                ? "bg-violet-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Todo List */}
      {filteredTodos.length > 0 && (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onDelete={handleDeleteClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredTodos.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <ListTodo className="text-violet-600" size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            {emptyState.title}
          </h2>

          {emptyState.subtitle && (
            <p className="mt-2 text-sm text-gray-500">{emptyState.subtitle}</p>
          )}

          {emptyState.showButton && (
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-violet-700"
              onClick={() => navigate("/todos/add")}
            >
              <Plus size={18} />
              Create your first task
            </button>
          )}
        </div>
      )}

      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete All Todos?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete all todos? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={deleteAllTodos}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Card (hidden for now) */}
      <div className="mt-12 hidden">
        <div className="rounded-2xl bg-linear-to-r from-violet-500 to-indigo-500 px-8 py-10 text-center text-white shadow-lg">
          <div className="mb-4 flex justify-center">
            <Trophy size={32} />
          </div>

          <h3 className="text-xl font-semibold">You're doing great!</h3>
          <p className="mt-2 text-sm text-violet-100">
            Keep completing tasks and maintain your productivity streak.
          </p>

          <div className="mt-6 flex justify-center gap-12">
            <div>
              <p className="text-2xl font-bold">0%</p>
              <p className="text-xs text-violet-200">Completion Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-violet-200">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">
              Delete Todo?
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete
              <span className="font-medium">{selectedTodo?.title}</span>? This
              action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    violet: "bg-violet-100 text-violet-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors[color]}`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};
export default Todo;
