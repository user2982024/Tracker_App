
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react";

const getHistoryData = (response) => {
  const payload = response?.data ?? response ?? {};

  if (Array.isArray(payload)) {
    return {
      records: payload,
      currentPage: 1,
      totalPages: 1,
    };
  }

  const records =
    payload.history ??
    payload.completions ??
    payload.data?.history ??
    payload.data?.completions ??
    [];

  return {
    records: Array.isArray(records) ? records : [],
    currentPage: Number(payload.currentPage ?? payload.pagination?.currentPage ?? 1),
    totalPages: Number(payload.totalPages ?? payload.pagination?.totalPages ?? 1),
  };
};

const formatDate = (value) => {
  if (!value) return "Unknown date";

  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value
  );

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const HabitHistory = ({
  habit,
  getHistory,
  pageSize = 10,
  onClose,
}) => {
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    if (!habit?._id || typeof getHistory !== "function") {
      setError("Unable to load history for this habit.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getHistory(habit._id, page, pageSize);
      const result = getHistoryData(response);

      setHistory(result.records);
      setTotalPages(Math.max(1, result.totalPages || 1));
    } catch (err) {
      setError(err?.message || "Failed to load habit history.");
    } finally {
      setLoading(false);
    }
  }, [habit?._id, getHistory, page, pageSize]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    setPage(1);
  }, [habit?._id]);

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || loading) return;
    setPage(nextPage);
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Completion History
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {habit?.title || "Habit"}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading history…
        </p>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="mb-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
          <button
            type="button"
            onClick={loadHistory}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      ) : history.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No completion history found for this page.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {history.map((item, index) => (
              <article
                key={item._id || `${item.date || item.completedAt}-${index}`}
                className="rounded-xl border border-gray-100 p-4 dark:border-gray-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDate(item.date || item.completedAt)}
                    </p>

                    {item.note && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {item.note}
                      </p>
                    )}
                  </div>

                  {item.value != null && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {item.value}
                      {habit?.unit ? ` ${habit.unit}` : ""}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => changePage(page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => changePage(page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default HabitHistory;
