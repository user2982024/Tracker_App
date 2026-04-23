import { ChevronLeft, ChevronRight } from "lucide-react";

const TodosPagination = () => {
  return (
    <div className="flex items-center justify-between">
      {/* Left: Clear completed */}
      <button className="text-red-500 text-sm font-medium hover:underline">
        Clear completed
      </button>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button className="p-2 border rounded-lg hover:bg-gray-100 transition">
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">
          1
        </button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          2
        </button>
        <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
          3
        </button>

        {/* Next */}
        <button className="p-2 border rounded-lg hover:bg-gray-100 transition">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TodosPagination;
