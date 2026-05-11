const GoalsPagination = ({
  pagination,
  page,
  setPage,
}) => {

  // Don't render if only one page exists
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { totalPages } = pagination;

  // Generate page numbers
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">

      {/* Previous Button */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => setPage(pageNumber)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
            page === pageNumber
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {pageNumber}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
          page === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
        }`}
      >
        Next
      </button>

    </div>
  );
};

export default GoalsPagination;