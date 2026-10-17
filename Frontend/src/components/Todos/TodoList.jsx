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
      <div className="bg-surface border border-border rounded-xl p-6 text-center text-foreground-muted">
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
      <div className="text-center text-foreground-muted py-10">
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
        <h2 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">
          Pinned Todos ({pinnedTodos.length})
        </h2>

        <div className="space-y-6">
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
      <div className="border-t border-border pt-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground-secondary">
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
