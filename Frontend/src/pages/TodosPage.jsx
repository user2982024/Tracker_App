import { useState, useEffect } from "react";

import TodoHeader from "../components/Todos/TodoHeader";
import TodoStats from "../components/Todos/TodoStats";
import TodoFilters from "../components/Todos/TodoFilters";
import TodoList from "../components/Todos/TodoList";
import TodoPagination from "../components/Todos/TodoPagination";
import TodoForm from "../components/Todos/TodoForm";

import { getAllTodos } from "../services/todoServices";

const TodosPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);

      const res = await getAllTodos();

      console.log("Fetched todos:", res);

      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Run on page reload
  useEffect(() => {
    fetchTodos();
  }, []);

  // Filtering logic
  const filteredTodos = todos.filter((todo) => {
    switch (activeFilter) {
      case "pending":
        return !todo.completed;

      case "completed":
        return todo.completed;

      case "overdue":
        if (!todo.dueDate) return false;
        const today = new Date();
        const due = new Date(todo.dueDate);
        return !todo.completed && due < today;

      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* Pass handler to header */}
      <TodoHeader onAddTodo={() => setShowForm(true)} />

      {/* Conditional rendering */}
      {showForm ? (
        <TodoForm
          onTodoCreated={() => {
            (fetchTodos(), setShowForm(false));
          }}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {/* Stats */}
          {/* Pass original todos for stats */}
          <TodoStats todos={todos} />

          {/* Filters */}
          {/* Pass filter control */}
          <TodoFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* List */}
          <TodoList todos={filteredTodos} loading={loading} activeFilter={activeFilter} />

          {/* Pagination */}
          <TodoPagination />
        </>
      )}
    </div>
  );
};

export default TodosPage;
