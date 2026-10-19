import { toastError } from "../utils/userToast.js";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import HabitStats from "../components/Habits/HabitStats";
import HabitCard from "../components/Habits/HabitCard";
import HabitForm from "../components/Habits/HabitForm";
import HabitFormModal from "../components/Habits/HabitFormModal";
import Spinner from "../components/UI/Spinner";

import {
  getHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  completeHabit,
  undoHabitCompletion,
  getHabitStreak,
} from "../services/habitServices";

const PAGE_SIZE = 9;

const getToday = () => {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
};

const getResponseData = (response) => response?.data ?? response ?? {};

const getCompletionDate = (completion) => {
  if (!completion?.date) return null;

  const rawDate = completion.date;

  if (
    typeof rawDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
  ) {
    return rawDate;
  }

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) return null;

  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
};

const Habits = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [pinningId, setPinningId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showArchived, setShowArchived] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const [habitToDelete, setHabitToDelete] = useState(null);
  const [habitToArchive, setHabitToArchive] = useState(null);

  const [completionByHabit, setCompletionByHabit] = useState({});
  const [streakByHabit, setStreakByHabit] = useState({});
  const completionRevision = useRef(0);
  const habitListRevision = useRef(0);

  const today = useMemo(() => getToday(), []);
  // The backend's UTC calendar date is authoritative for habit schedules and
  // completion statistics. Fall back to the browser date before stats load.
  const completionDateToday = stats?.date || today;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, showArchived]);

  const fetchHabits = useCallback(
    async ({ silent = false } = {}) => {
      const requestRevision = ++habitListRevision.current;
      const completionRevisionAtStart = completionRevision.current;
      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
          archived: String(showArchived),
        });

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        const response = await getHabits(`?${params.toString()}`);
        const result = getResponseData(response);

        if (requestRevision !== habitListRevision.current) return null;

        const nextHabits = Array.isArray(result.habits)
          ? result.habits
          : [];

        setHabits(nextHabits);
        const completionChangedDuringRequest =
          completionRevisionAtStart !== completionRevision.current;
        setStats((previous) => {
          if (!completionChangedDuringRequest || !previous || !result.stats) {
            return result.stats ?? null;
          }

          const scheduledToday = Number(result.stats.scheduledToday) || 0;
          const completedToday = Math.max(
            0,
            Math.min(scheduledToday, Number(previous.completedToday) || 0),
          );

          return {
            ...result.stats,
            completedToday,
            remainingToday: Math.max(0, scheduledToday - completedToday),
            completionPercentage: scheduledToday
              ? Math.round((completedToday / scheduledToday) * 100)
              : 0,
          };
        });
        setPagination(result.pagination ?? null);

        const habitIds = new Set(nextHabits.map((habit) => habit._id));

        setCompletionByHabit((previous) =>
          Object.fromEntries(
            nextHabits.map((habit) => {
              const hasNewerValue =
                completionChangedDuringRequest &&
                Object.prototype.hasOwnProperty.call(previous, habit._id);
              return [
                habit._id,
                hasNewerValue
                  ? previous[habit._id]
                  : result.todayCompletions?.[habit._id] ?? null,
              ];
            }),
          ),
        );

        setStreakByHabit((previous) =>
          Object.fromEntries(
            Object.entries(previous).filter(([id]) => habitIds.has(id)),
          ),
        );

        return true;
      } catch (err) {
        if (requestRevision === habitListRevision.current) {
          setError(err?.message || "Failed to load habits.");
        }
        return false;
      } finally {
        if (requestRevision === habitListRevision.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, showArchived, debouncedSearch],
  );

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Load today's completion and current streak for each visible habit.
  useEffect(() => {
    let cancelled = false;
    const requestRevision = completionRevision.current;

    const loadHabitDetails = async () => {
      if (!habits.length || showArchived) {
        setCompletionByHabit({});
        setStreakByHabit({});
        return;
      }

      const results = await Promise.all(
        habits.map(async (habit) => {
          try {
            const streakResponse = await getHabitStreak(habit._id);
            const streakData = getResponseData(streakResponse);

            const streak =
              Number(
                streakData.streak ??
                  streakData.currentStreak ??
                  streakData.data?.streak ??
                  streakData.data?.currentStreak ??
                  0,
              ) || 0;

            return {
              id: habit._id,
              streak,
            };
          } catch {
            return {
              id: habit._id,
              // Network failures mean the current streak is unknown. Keep the
              // last known streak instead of displaying a false zero.
              streak: undefined,
            };
          }
        }),
      );

      if (cancelled || requestRevision !== completionRevision.current) return;

      setCompletionByHabit((previous) => {
        const next = { ...previous };

        results.forEach(({ id, completion }) => {
          if (completion !== undefined) next[id] = completion;
        });

        return next;
      });

      setStreakByHabit((previous) => {
        const next = { ...previous };

        results.forEach(({ id, streak }) => {
          if (streak !== undefined) next[id] = streak;
        });

        return next;
      });
    };

    loadHabitDetails();

    return () => {
      cancelled = true;
    };
  }, [habits, completionDateToday, showArchived]);

  // Open the modal for creating a habit.
  const handleCreateClick = () => {
    if (saving || showArchived) return;

    setSelectedHabit(null);
    setShowForm(true);
  };

  // Open the same modal for editing a habit.
  const handleEditClick = (habit) => {
    if (saving) return;

    setSelectedHabit(habit);
    setShowForm(true);
  };

  const handleCloseForm = useCallback(() => {
    if (saving) return;

    setShowForm(false);
    setSelectedHabit(null);
  }, [saving]);

  // Create or update a habit without navigating away.
  const handleSaveHabit = async (habitData) => {
    if (saving) return;

    try {
      setSaving(true);

      if (selectedHabit?._id) {
        await updateHabit(selectedHabit._id, habitData);
        toast.success("Your habit has been updated.");
      } else {
        await createHabit(habitData);
        toast.success("Your habit has been added.");
      }

      setShowForm(false);
      setSelectedHabit(null);

      await fetchHabits({ silent: true });
    } catch (err) {
      toastError(err?.message || "Failed to save habit.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (
    habit,
    completed,
    completion,
  ) => {
    if (!habit?._id || actionId) return;

    const adjustCompletionStats = (change) => {
      setStats((current) => {
        if (!current) return current;

        const scheduled = Number(current.scheduledToday) || 0;
        const completedCount = Math.min(
          scheduled,
          Math.max(0, (Number(current.completedToday) || 0) + change),
        );

        return {
          ...current,
          completedToday: completedCount,
          remainingToday: Math.max(0, scheduled - completedCount),
          completionPercentage: scheduled
            ? Math.round((completedCount / scheduled) * 100)
            : 0,
        };
      });
    };

    try {
      setActionId(habit._id);

      if (completed) {
        if (!completion?._id) {
          toastError(
            "Could not identify this completion. Refresh and try again.",
          );
          return;
        }

        await undoHabitCompletion(completion._id);
        completionRevision.current += 1;
        setCompletionByHabit((previous) => {
          const next = { ...previous };
          delete next[habit._id];
          return next;
        });
        adjustCompletionStats(-1);
        setError("");
        toast.success("Habit marked incomplete for today.");
      } else {
        const response = await completeHabit(habit._id, { date: completionDateToday });
        completionRevision.current += 1;
        const savedCompletion = response?.data?.data ?? response?.data ?? null;
        if (savedCompletion?._id) {
          setCompletionByHabit((previous) => ({
            ...previous,
            [habit._id]: savedCompletion,
          }));
        }
        if (!response?.alreadyCompleted) adjustCompletionStats(1);
        setError("");
        toast.success("Habit completed. Great work!");
      }
    } catch (err) {
      toastError(err?.message || "Failed to update habit completion.");
    } finally {
      setActionId(null);
    }
  };

  const handleTogglePin = async (habit) => {
    if (!habit?._id || actionId || pinningId) return;

    const nextPinned = !habit.isPinned;
    try {
      setPinningId(habit._id);
      await updateHabit(habit._id, { isPinned: nextPinned });
      toast.success(nextPinned ? "Habit pinned." : "Habit unpinned.");
      await fetchHabits({ silent: true });
    } catch (err) {
      toastError(err?.message || `Failed to ${nextPinned ? "pin" : "unpin"} habit.`);
    } finally {
      setPinningId(null);
    }
  };

  const handleArchiveClick = (habit, shouldArchive) => {
    setHabitToArchive({ habit, shouldArchive });
  };

  const handleConfirmArchive = async () => {
    if (!habitToArchive || actionId) return;

    const { habit, shouldArchive } = habitToArchive;

    try {
      setActionId(habit._id);

      await archiveHabit(habit._id, shouldArchive);

      toast.success(
        shouldArchive
          ? "Habit archived successfully."
          : "Habit restored successfully.",
      );

      setHabitToArchive(null);
      setHabits((previous) => previous.filter((item) => item._id !== habit._id));
      setError("");

      const refreshed = await fetchHabits({ silent: true });
      if (refreshed === false) {
        setError(
          `Habit ${shouldArchive ? "archived" : "restored"}, but the list could not refresh. Use Refresh to reload it.`,
        );
      }
    } catch (err) {
      toastError(err?.message || "Failed to update habit archive status.");
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!habitToDelete || actionId) return;

    try {
      setActionId(habitToDelete._id);

      await deleteHabit(habitToDelete._id);

      toast.success("Habit deleted.");
      setHabitToDelete(null);

      await fetchHabits({ silent: true });
    } catch (err) {
      toastError(err?.message || "Failed to delete habit.");
    } finally {
      setActionId(null);
    }
  };

  // Navigate to the dedicated history page with the selected habit ID.
  const handleViewHistory = useCallback(
    (habit) => {
      if (!habit?._id) {
        toastError("Unable to open history: habit ID is missing.");
        return;
      }

      navigate(`/app/habits/${habit._id}/history`);
    },
    [navigate],
  );

  const currentPage = Number(pagination?.currentPage ?? page);
  const totalPages = Number(pagination?.totalPages ?? 1);

  const totalHabits = Number(
    pagination?.totalHabits ?? stats?.totalActiveHabits ?? 0,
  );

  const displayedHabits = useMemo(
    () =>
      [...habits].sort((a, b) => {
        if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
          return Number(Boolean(b.isPinned)) - Number(Boolean(a.isPinned));
        }

        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
      }),
    [habits],
  );

  const scheduledToday = Number(stats?.scheduledToday ?? 0);
  const completedToday = Number(stats?.completedToday ?? 0);

  if (loading && habits.length === 0 && !error) {
    return <Spinner fullPage size={40} label="Loading habits" />;
  }

  return (
    <main className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
            <ClipboardList size={23} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Daily Habits
            </h1>
            <p className="mt-1 text-sm text-foreground-muted">
              Build consistency, one day at a time.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          disabled={showArchived || saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 btn-hover"
        >
          <Plus size={18} />
          Create Habit
        </button>
      </header>

      {!showArchived && (
        <HabitStats
          stats={{
            ...stats,
            totalActiveHabits: stats?.totalActiveHabits ?? totalHabits,
          }}
        />
      )}

      <section className="rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your habits..."
              aria-label="Search habits"
              className="w-full rounded-xl border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-foreground-muted focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowArchived((previous) => !previous)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition btn-hover ${
                showArchived
                  ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300"
                  : "border-border text-foreground-muted hover:bg-surface-secondary"
              }`}
            >
              <Archive size={16} />
              {showArchived ? "View Active Habits" : "View Archived"}
            </button>

            <button
              type="button"
              onClick={() => fetchHabits({ silent: true })}
              disabled={refreshing || loading}
              aria-label="Refresh habits"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground-muted transition hover:bg-surface-secondary disabled:opacity-50 btn-hover"
            >
              {refreshing ? (
                <Spinner size={16} />
              ) : (
                <RefreshCw size={16} />
              )}
              Refresh
            </button>
          </div>
        </div>

        {!showArchived && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
            <span>
              {completedToday} of {scheduledToday} scheduled habits completed
            </span>

            {scheduledToday > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                {Math.round((completedToday / scheduledToday) * 100)}%
              </span>
            )}
          </div>
        )}
      </section>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-rose-500/25 dark:bg-rose-500/10"
        >
          <div className="flex items-start gap-3">
            <CircleAlert size={20} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-300" />

            <div>
              <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
                {habits.length > 0 ? "Could not refresh habits" : "Could not load habits"}
              </p>
              <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
                {habits.length > 0 && "Your last loaded habits are still shown. "}
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchHabits()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-rose-200 bg-surface px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 sm:self-auto dark:border-rose-500/25 dark:text-rose-300 dark:hover:bg-rose-500/20 btn-hover"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      <HabitFormModal
        isOpen={showForm}
        onClose={handleCloseForm}
        loading={saving}
      >
        <HabitForm
          key={selectedHabit?._id ?? "new-habit"}
          initialData={selectedHabit}
          loading={saving}
          onSubmit={handleSaveHabit}
          onCancel={handleCloseForm}
        />
      </HabitFormModal>

      <section aria-label={showArchived ? "Archived habits" : "Your habits"}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {showArchived ? "Archived Habits" : "Your Habits"}
            </h2>

            <p className="mt-1 text-sm text-foreground-muted">
              {loading
                ? "Loading your habits..."
                : `${habits.length} habit${habits.length === 1 ? "" : "s"} on this page`}
            </p>
          </div>

          {loading && (
            <Spinner size={20} />
          )}
        </div>

        {loading && habits.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-border bg-surface text-foreground-muted">
            <Spinner size={40} className="mb-3" />
            <p className="text-sm">Loading your habits...</p>
          </div>
        ) : !error && displayedHabits.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-foreground-muted">
              {showArchived ? (
                <Archive size={26} />
              ) : (
                <CheckCircle2 size={26} />
              )}
            </div>

            <h3 className="mt-4 text-base font-semibold text-foreground">
              {showArchived
                ? "No archived habits"
                : debouncedSearch
                  ? "No matching habits"
                  : "Start building your habits"}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-foreground-muted">
              {showArchived
                ? "Habits you archive will appear here."
                : debouncedSearch
                  ? "Try a different search term."
                  : "Create your first habit and start building a consistent daily routine."}
            </p>

            {!showArchived && !debouncedSearch && (
              <button
                type="button"
                onClick={handleCreateClick}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 btn-hover"
              >
                <Plus size={17} />
                Create your first habit
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {displayedHabits.map((habit) => {
              const completion = completionByHabit[habit._id] ?? null;
              const completed =
                Boolean(completion) &&
                getCompletionDate(completion) === completionDateToday;

              return (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  completed={completed}
                  completion={completed ? completion : null}
                  streak={streakByHabit[habit._id] ?? 0}
                  loading={actionId === habit._id}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditClick}
                  onArchive={handleArchiveClick}
                  onDelete={setHabitToDelete}
                  onViewHistory={handleViewHistory}
                  onTogglePin={handleTogglePin}
                  pinning={pinningId === habit._id}
                />
              );
            })}
          </div>
        )}

        {!loading && !error && habits.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground-muted">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setPage((previous) => Math.max(1, previous - 1))
                }
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 btn-hover"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 btn-hover"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Archive / Restore Confirmation */}
      {habitToArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-habit-title"
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="archive-habit-title"
                className="text-lg font-semibold text-foreground"
              >
                {habitToArchive.shouldArchive ? "Archive habit?" : "Restore habit?"}
              </h2>

              <button
                type="button"
                onClick={() => setHabitToArchive(null)}
                disabled={Boolean(actionId)}
                aria-label="Close confirmation"
                className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-secondary disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-foreground-muted">
              {habitToArchive.shouldArchive
                ? `Archive "${habitToArchive.habit.title}"? It will be removed from your active habits but can be restored later.`
                : `Restore "${habitToArchive.habit.title}" to your active habits?`}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setHabitToArchive(null)}
                disabled={Boolean(actionId)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary disabled:opacity-50 btn-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmArchive}
                disabled={Boolean(actionId)}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 btn-hover"
              >
                {actionId ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner size={16} label="Archiving habit" />
                    Please wait...
                  </span>
                ) : "Confirm"}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Delete Confirmation */}
      {habitToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-habit-title"
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
                  <Trash2 size={20} />
                </div>

                <h2
                  id="delete-habit-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Delete habit?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setHabitToDelete(null)}
                disabled={Boolean(actionId)}
                aria-label="Close delete confirmation"
                className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-secondary disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-foreground-muted">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {habitToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setHabitToDelete(null)}
                disabled={Boolean(actionId)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground-secondary hover:bg-surface-secondary disabled:opacity-50 btn-hover"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(actionId)}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 btn-hover"
              >
                {actionId ? (
                  <Spinner size={16} />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};


export default Habits;
