
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ClipboardList,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

// Correct path for src/components/Habits/HabitHistory.jsx
import {
  getHabit,
  getHabitHistory,
} from "../../services/habitServices";

const PAGE_SIZE = 15;

const getPayload = (response) => response?.data ?? response ?? {};

const getHabitFromResponse = (response) => {
  const payload = getPayload(response);
  const habit = payload.habit ?? payload.data?.habit ?? payload.data ?? payload;

  return habit && typeof habit === "object" && habit._id ? habit : null;
};

const getHistoryFromResponse = (response) => {
  const payload = getPayload(response);
  const data = payload.data ?? payload;

  const records =
    (Array.isArray(data) ? data : null) ??
    data.history ??
    data.completions ??
    data.records ??
    payload.history ??
    payload.completions ??
    payload.records ??
    [];

  const pagination = data.pagination ?? payload.pagination ?? {};

  const totalRecords = Number(
    data.totalRecords ??
      data.totalCompletions ??
      data.total ??
      pagination.totalRecords ??
      pagination.totalCompletions ??
      pagination.total ??
      payload.totalRecords ??
      payload.totalCompletions ??
      payload.total ??
      0,
  );

  const totalPages = Number(
    data.totalPages ?? pagination.totalPages ?? payload.totalPages ?? 0,
  );

  return {
    records: Array.isArray(records) ? records : [],
    totalRecords: Number.isFinite(totalRecords) ? totalRecords : 0,
    totalPages: Number.isFinite(totalPages) ? totalPages : 0,
  };
};

const formatDate = (value) => {
  if (!value) return "Date not available";

  const isDateOnly =
    typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

  const date = new Date(isDateOnly ? `${value}T12:00:00` : value);

  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatDateTime = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const getRecordDate = (record) =>
  record?.date ?? record?.completedAt ?? record?.createdAt;

const getRecordKey = (record, index) =>
  record?._id ?? record?.id ?? `${getRecordDate(record) ?? "record"}-${index}`;

const getErrorMessage = (error) =>
  error?.message || "Something went wrong while loading habit history.";

const HabitHistory = () => {
  const { id, habitId } = useParams();
  const navigate = useNavigate();
  const currentHabitId = habitId ?? id;

  const [habit, setHabit] = useState(null);
  const [history, setHistory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [loadingHabit, setLoadingHabit] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  // Load the habit details.
  useEffect(() => {
    let cancelled = false;

    const fetchHabit = async () => {
      setLoadingHabit(true);

      if (!currentHabitId) {
        setHabit(null);
        setError("The habit ID is missing from the page URL.");
        setLoadingHabit(false);
        return;
      }

      try {
        const response = await getHabit(currentHabitId);
        const result = getHabitFromResponse(response);

        if (!result) {
          throw new Error("The requested habit could not be found.");
        }

        if (!cancelled) {
          setHabit(result);
        }
      } catch (err) {
        if (!cancelled) {
          setHabit(null);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingHabit(false);
        }
      }
    };

    fetchHabit();

    return () => {
      cancelled = true;
    };
  }, [currentHabitId, retryKey]);

  // Load one page of completion history.
  useEffect(() => {
    let cancelled = false;

    const fetchHistory = async () => {
      setLoadingHistory(true);
      setError("");

      if (!currentHabitId) {
        setHistory([]);
        setTotalRecords(0);
        setTotalPages(1);
        setLoadingHistory(false);
        setError("The habit ID is missing from the page URL.");
        return;
      }

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        const response = await getHabitHistory(
          currentHabitId,
          `?${query.toString()}`,
        );

        const result = getHistoryFromResponse(response);

        if (cancelled) return;

        setHistory(result.records);
        setTotalRecords(result.totalRecords);

        const calculatedPages =
          result.totalRecords > 0
            ? Math.ceil(result.totalRecords / PAGE_SIZE)
            : 1;

        setTotalPages(Math.max(1, result.totalPages || calculatedPages));
      } catch (err) {
        if (!cancelled) {
          setHistory([]);
          setTotalRecords(0);
          setTotalPages(1);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [currentHabitId, page, retryKey]);

  const firstRecordNumber = useMemo(
    () => (totalRecords ? (page - 1) * PAGE_SIZE + 1 : 0),
    [page, totalRecords],
  );

  const lastRecordNumber = useMemo(
    () => (totalRecords ? Math.min(page * PAGE_SIZE, totalRecords) : 0),
    [page, totalRecords],
  );

  const goToPage = (nextPage) => {
    if (
      loadingHistory ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    setPage(nextPage);
  };

  const handleRetry = () => {
    setError("");
    setRetryKey((previous) => previous + 1);
  };

  const handleBack = () => {
    navigate("/app/habits");
  };

  const pageLoading = loadingHabit || loadingHistory;

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground-secondary shadow-sm transition hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to Habits
      </button>

      <header className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <ClipboardList size={24} aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Daily Habits</p>
              <h1 className="mt-1 break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Completion History
              </h1>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Review your past completions and track your consistency over
                time.
              </p>
            </div>
          </div>

          {habit && (
            <div className="shrink-0 rounded-xl border border-border bg-surface-secondary px-4 py-3 sm:min-w-48">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Selected habit
              </p>
              <p className="mt-1 break-words font-semibold text-foreground">
                {habit.title || habit.name || "Untitled habit"}
              </p>
              {habit.category && (
                <p className="mt-1 text-sm text-foreground-muted">{habit.category}</p>
              )}
            </div>
          )}
        </div>
      </header>

      {error ? (
        <section
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-500/25 dark:bg-red-500/10 sm:p-8"
        >
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300">
              <RefreshCw size={22} aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
              Unable to load history
            </h2>
            <p className="mt-2 text-sm leading-6 text-red-700 dark:text-red-300">{error}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw size={16} aria-hidden="true" />
                Try again
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-red-200 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground-secondary transition hover:bg-red-50 dark:border-red-500/25 dark:hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Back to Habits
              </button>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <TrendingUp size={21} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Total completions</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {loadingHistory ? "—" : totalRecords}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <CalendarDays size={21} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Records on this page</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">
                  {loadingHistory ? "—" : history.length}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-semibold text-foreground">
                  Your completion records
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  Showing up to {PAGE_SIZE} records per page.
                </p>
              </div>

              {!loadingHistory && totalRecords > 0 && (
                <p className="text-sm tabular-nums text-foreground-muted">
                  {firstRecordNumber}–{lastRecordNumber} of {totalRecords}
                </p>
              )}
            </div>

            {pageLoading ? (
              <div
                className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center"
                role="status"
                aria-live="polite"
              >
                <LoaderCircle
                  size={30}
                  className="animate-spin text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm font-medium text-foreground-secondary">
                  Loading completion history…
                </p>
                <p className="mt-1 text-sm text-foreground-muted">
                  Please wait while we retrieve your records.
                </p>
              </div>
            ) : history.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-foreground-muted">
                  <CalendarDays size={25} aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No completion history yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-foreground-muted">
                  Once you complete this habit, your records will appear here.
                  Keep building your routine one day at a time.
                </p>
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Return to Habits
                </button>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {history.map((item, index) => {
                    const createdAt = formatDateTime(item.createdAt);
                    const valueIsAvailable =
                      item.value !== undefined &&
                      item.value !== null &&
                      item.value !== "";

                    return (
                      <article
                        key={getRecordKey(item, index)}
                        className="flex gap-3 px-5 py-5 transition hover:bg-surface-secondary/70 sm:gap-4 sm:px-6"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                          <CheckCircle2 size={21} aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground">
                                {formatDate(getRecordDate(item))}
                              </h3>

                              {item.note && (
                                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-foreground-muted">
                                  {item.note}
                                </p>
                              )}

                              {createdAt && (
                                <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-foreground-muted">
                                  <Clock3 size={13} aria-hidden="true" />
                                  Recorded {createdAt}
                                </p>
                              )}
                            </div>

                            {valueIsAvailable && (
                              <span className="inline-flex w-fit shrink-0 items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                                {item.value}
                                {habit?.unit ? ` ${habit.unit}` : ""}
                              </span>
                            )}
                          </div>

                          {item.description && !item.note && (
                            <p className="mt-2 break-words text-sm leading-6 text-foreground-muted">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <nav
                  aria-label="Habit history pagination"
                  className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <p className="text-center text-sm text-foreground-muted sm:text-left">
                    Page{" "}
                    <span className="font-semibold text-foreground">{page}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {totalPages}
                    </span>
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1 || loadingHistory}
                      aria-label="Go to previous page"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground-secondary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <ChevronLeft size={17} aria-hidden="true" />
                      Previous
                    </button>

                    <button
                      type="button"
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= totalPages || loadingHistory}
                      aria-label="Go to next page"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-foreground-secondary transition hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Next
                      <ChevronRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </nav>
              </>
            )}
          </section>
        </>
      )}
    </main>
  );
};

export default HabitHistory;
