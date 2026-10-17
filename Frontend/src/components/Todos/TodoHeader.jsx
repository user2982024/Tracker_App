import { Plus, Search, X, Trash2 } from "lucide-react";

const TodosHeader = ({
  onAddTodo,
  searchQuery,
  setSearchQuery,
  onDeleteCompleted,
  hasCompleted,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Todos</h1>
        <p className="text-sm text-foreground-muted flex items-center gap-2">
          Stay organized and get things done
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-border bg-input text-foreground rounded-lg pl-10 pr-4 py-2 text-sm placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground-secondary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Delete Completed */}
        <button
          onClick={onDeleteCompleted}
          disabled={!hasCompleted}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition hover:cursor-pointer
            ${
              hasCompleted
                ? "text-red-600 border-red-200 hover:bg-red-50 dark:text-red-300 dark:border-red-500/25 dark:hover:bg-red-500/20"
                : "text-foreground-muted border-border cursor-not-allowed"
            }`}
        >
          <Trash2 size={16} />
          Clear Done
        </button>

        {/* Add Todo Button (PRIMARY) */}
        <button
          onClick={onAddTodo}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={16} />
          Add Todo
        </button>
      </div>
    </div>
  );
};

export default TodosHeader;
