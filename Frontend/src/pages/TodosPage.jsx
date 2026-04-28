import { useState, useEffect } from "react";

import TodoHeader from "../components/Todos/TodoHeader";
import TodoStats from "../components/Todos/TodoStats";
import TodoFilters from "../components/Todos/TodoFilters";
import TodoList from "../components/Todos/TodoList";
import TodoPagination from "../components/Todos/TodoPagination";
import TodoForm from "../components/Todos/TodoForm";
import Modal from "../components/UI/Modal";

import { getAllTodos, deleteTodo, pinTodo, unpinTodo } from "../services/todoServices";
import { toast } from "react-hot-toast";

const TodosPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState("default");

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);

      const res = await getAllTodos({
        page,
        filter,
        search: debouncedSearch,
        sortBy,
      });

      const { todos, stats, pagination } = res.data;

      setTodos(todos);
      setStats(stats);
      setPagination(pagination);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect
  useEffect(() => {
    fetchTodos();
  }, [page, filter, debouncedSearch, sortBy]);

  // Handle edit todo
  const handleEditTodo = (todo) => {
    setTodoToEdit(todo);
    setShowForm(true);
  };

  // Open delete modal
  const handleOpenDeleteModal = (id) => {
    setTodoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle delete
  const handleDeleteTodo = async () => {
    try {
      setLoading(true);

      const res = await deleteTodo(todoToDelete);

      toast.success(res.message || "Todo deleted successfully");

      // Close modal
      setIsDeleteModalOpen(false);
      setTodoToDelete(null);

      // Edge case: last item on page
      if (todos.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchTodos();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hnalde pin todo
  const handlePin = async (todoId) => {
    try {
      await pinTodo(todoId);
      toast.success("Todo pinned successfully");

      await fetchTodos();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle unpin todo
  const handleUnpin = async (todoId) => {
    try {
      await unpinTodo(todoId);
      toast.success("Todo unpinned successfully");

      await fetchTodos();
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <TodoHeader
        onAddTodo={() => setShowForm(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

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
          <TodoStats stats={stats} />

          {/* Filters */}
          <TodoFilters
            currentFilter={filter}
            onFilterChange={(newFilter) => {
              setFilter(newFilter);
              setPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(newSort) => {
              setSortBy(newSort);
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
            onDelete={handleOpenDeleteModal}
            onPin={handlePin}
            onUnpin={handleUnpin}
          />

          {/* Pagination */}
          <TodoPagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTodoToDelete(null);
        }}
        title="Delete Todo"
        actions={
          <>
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setTodoToDelete(null);
              }}
              className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteTodo}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer"
            >
              Delete
            </button>
          </>
        }
      >
        Are you sure you want to delete this todo? This action cannot be undone.
      </Modal>
    </div>
  );
};

export default TodosPage;
