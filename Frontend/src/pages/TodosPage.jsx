import { useState, useEffect } from "react";

import TodoHeader from "../components/Todos/TodoHeader";
import TodoStats from "../components/Todos/TodoStats";
import TodoFilters from "../components/Todos/TodoFilters";
import TodoList from "../components/Todos/TodoList";
import TodoPagination from "../components/Todos/TodoPagination";
import TodoForm from "../components/Todos/TodoForm";

import { getAllTodos } from "../services/todoServices";

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(false);

  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);

      const res = await getAllTodos({ page, filter });

      const { todos, stats, pagination } = res.data;

      setTodos(todos);
      setStats(stats);
      setPagination(pagination);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect
  useEffect(() => {
    fetchTodos();
  }, [page, filter]);

  // hndle edit
  const handleEditTodo = (todo) => {
    setTodoToEdit(todo);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* Pass handler to header */}
      <TodoHeader onAddTodo={() => setShowForm(true)} />

      {/* Conditional rendering */}
      {showForm ? (
        <TodoForm
        todoToEdit={todoToEdit}
          onTodoCreated={() => {
            setPage(1);
            setShowForm(false);
            setTodoToEdit(null);
            fetchTodos();
          }}
          onCancel={() => {
            setShowForm(false);
            setTodoToEdit(null);
          }}
        />
      ) : (
        <>
          {/* Stats */}
          {/* Pass original todos for stats */}
          <TodoStats stats={stats} />

          {/* Filters */}
          {/* Pass filter control */}
          <TodoFilters
            currentFilter={filter}
            onFilterChange={(newFilter) => {
              setFilter(newFilter);
              setPage(1);
            }}
          />

          {/* List */}
          <TodoList
            todos={todos}
            loading={loading}
            currentFilter={filter}
            onRefresh={fetchTodos}
            onEdit={handleEditTodo}
          />

          {/* Pagination */}
          <TodoPagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
};

export default TodosPage;
