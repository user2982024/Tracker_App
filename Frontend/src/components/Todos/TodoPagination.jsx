import { ChevronLeft, ChevronRight } from "lucide-react";

const TodosPagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPages = () => {
    const pages = [];
    const delta = 1;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Always include first page
    pages.push(1);

    // Left dots
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Middle pages (NO duplicates now)
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Right dots
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    // Always include last page (avoid duplicate if totalPages === 1)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return [...new Set(pages)]; // REMOVE DUPLICATES
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 cursor-pointer ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {/* Pages */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`dots-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border text-sm cursor-pointer ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border text-sm flex items-center gap-1 cursor-pointer ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default TodosPagination;
