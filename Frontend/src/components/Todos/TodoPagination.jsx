import { ChevronLeft, ChevronRight } from "lucide-react";

const TodosPagination = ({ currentPage, totalPages, onPageChange }) => {

    const pages = []

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <button 
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronLeft className="inline mr-1" size={16} />
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border text-sm hover:cursor-pointer ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-100"
        }`}
      >
        Next
        <ChevronRight className="inline ml-1" size={16} />
      </button>
    </div>
  );
};

export default TodosPagination;
