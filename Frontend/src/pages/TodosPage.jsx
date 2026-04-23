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
          <TodoStats />

          {/* Filters */}
          <TodoFilters />

          {/* List */}
          <TodoList todos={todos} loading={loading} />

          {/* Pagination */}
          <TodoPagination />
        </>
      )}
    </div>
  );
};

export default TodosPage;
