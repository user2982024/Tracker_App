import { Plus, Search } from "lucide-react";

const TodosHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Todos</h1>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          Stay organized and get things done
          <span className="text-blue-500">✔</span>
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Add Todo Button */}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus size={16} />
          Add Todo
        </button>
      </div>
    </div>
  );
};

export default TodosHeader;
