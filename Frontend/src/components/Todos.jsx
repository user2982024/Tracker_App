import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const stats = {
    total: todos.length,
    completed: 0,
    inProgress: todos.length,
    overdue: 0,
  };

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Todos</h1>
          <p className="text-sm text-gray-500">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search todos..."
            className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 sm:block"
          />

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

      {/* Filters & Sort (UI only) */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 rounded-xl bg-white p-1 shadow-sm">
          {["All Tasks", "Active", "Completed", "Overdue"].map((label, index) => (
            <button
              key={label}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                index === 0
                  ? "bg-violet-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 focus:outline-none">
          <option>Sort by: Due Date</option>
          <option>Sort by: Priority</option>
        </select>
      </div>

      {/* Todo List */}
      {todos.length > 0 && (
        <div className="space-y-3">
          {todos.map((todo, index) => (
            <TodoCard key={todo._id || index} todo={todo} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {todos.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <ListTodo className="text-violet-600" size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            No todos to show
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            You haven't added any tasks yet. Start organizing your day by adding
            your first todo.
          </p>

          <button
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-violet-700"
            onClick={() => navigate("/todos/add")}
          >
            <Plus size={18} />
            Create your first task
          </button>
        </div>
      )}

      {/* Motivation Card (hidden for now) */}
      <div className="mt-12 hidden">
        <div className="rounded-2xl bg-linear-to-r from-violet-500 to-indigo-500 px-8 py-10 text-center text-white shadow-lg">
          <div className="mb-4 flex justify-center">
            <Trophy size={32} />
          </div>

          <h3 className="text-xl font-semibold">You’re doing great!</h3>
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
}

export default Todo;
