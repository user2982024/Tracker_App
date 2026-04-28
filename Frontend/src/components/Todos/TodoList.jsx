import TodoCard from "./TodoCard";

const TodoList = ({
  todos,
  loading,
  currentFilter,
  onRefresh,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
}) => {

  // Loading state
  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
        Loading todos...
      </div>
    );
  }

  // Empty state
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

  // Split todos
  const pinnedTodos = todos.filter((todo) => todo.pinned);
  const unpinnedTodos = todos.filter((todo) => !todo.pinned);

  return (
  <div className="space-y-4">

    {/* Pinned Section */}
    {pinnedTodos.length > 0 && (
      <div>
        <h2 className="text-lg font-semibold mb-3 text-yellow-600">
          Pinned Todos ({pinnedTodos.length})
        </h2>

        <div className="space-y-3">
          {pinnedTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onRefresh={onRefresh}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onUnpin={onUnpin}
            />
          ))}
        </div>
      </div>
    )}

    {/* Normal Todos */}
    {unpinnedTodos.length > 0 && (
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Todos ({unpinnedTodos.length})
        </h2>

        <div className="space-y-3">
          {unpinnedTodos.map((todo) => (
            <TodoCard
              key={todo._id}
              todo={todo}
              onRefresh={onRefresh}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onUnpin={onUnpin}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);
};

export default TodoList;