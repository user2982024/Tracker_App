import TodoCard from "./TodoCard";

const TodosList = ({
  todos,
  loading,
  currentFilter,
  onRefresh,
  onEdit,
  onDelete,
}) => {
  
  // Loading state
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        Loading todos...
      </div>
    );
  }

  // Empty / No results state (MERGED LOGIC)
  if (!todos || todos.length === 0) {
    const messages = {
      all: "No todos found. Create your first todo",
      pending: "No pending todos",
      completed: "No completed todos yet",
      overdue: "No overdue todos",
    };

    return (
      <div className="text-center text-gray-500 py-10">
        <p className="text-lg font-medium">
          {messages[currentFilter] || messages.all}
        </p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Todos list (ONLY runs when todos exist)
  return (
    <div className="rounded-xl">
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          onRefresh={onRefresh}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TodosList;