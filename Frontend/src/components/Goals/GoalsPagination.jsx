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
            ? "bg-surface-secondary text-foreground-muted cursor-not-allowed border-border"
            : "bg-surface text-foreground-secondary hover:bg-surface-secondary border-border"
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
              ? "bg-blue-600 text-white dark:bg-blue-500 shadow-sm"
              : "bg-surface text-foreground-secondary border border-border hover:bg-surface-secondary"
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
            ? "bg-surface-secondary text-foreground-muted cursor-not-allowed border-border"
            : "bg-surface text-foreground-secondary hover:bg-surface-secondary border-border"
        }`}
      >
        Next
      </button>

    </div>
  );
};

export default GoalsPagination;