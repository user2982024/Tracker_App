import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  Trash2,
  TrendingUp,
} from "lucide-react";

import { getGoal } from "../services/goalsServices";

import {
  getGoalProgress,
  deleteGoalProgress,
} from "../services/goalProgressServices";

import Modal from "../components/UI/Modal";

const GoalProgressHistoryPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // ==================================================
  // State
  // ==================================================

  const [goal, setGoal] = useState(null);

  const [progressHistory, setProgressHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [deletingProgressId, setDeletingProgressId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProgressId, setSelectedProgressId] = useState(null);

  // ==================================================
  // Fetch Goal + Full History
  // ==================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      setError(null);

      const [goalData, progressData] = await Promise.all([
        getGoal(id),
        getGoalProgress(id),
      ]);

      setGoal(goalData);

      setProgressHistory(progressData.data || []);
    } catch (error) {
      setError(error.message || "Failed to load progress history");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // Initial Fetch
  // ==================================================

  useEffect(() => {
    fetchData();
  }, [id]);

  // ==================================================
  // Date Formatter
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ==================================================
  // Time Formatter
  // ==================================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==================================================
  // Open Delete Modal
  // ==================================================

  const handleDeleteProgress = (progressId) => {
    if (!progressId || deletingProgressId) {
      return;
    }

    setSelectedProgressId(progressId);

    setShowDeleteModal(true);
  };

  // ==================================================
  // Close Delete Modal
  // ==================================================

  const handleCloseDeleteModal = () => {
    if (deletingProgressId) {
      return;
    }

    setShowDeleteModal(false);

    setSelectedProgressId(null);
  };

  // ==================================================
  // Confirm Delete
  // ==================================================

  const handleConfirmDelete = async () => {
    if (!selectedProgressId || deletingProgressId) {
      return;
    }

    try {
      setDeletingProgressId(selectedProgressId);

      setError(null);

      await deleteGoalProgress(selectedProgressId);

      await fetchData();

      setShowDeleteModal(false);

      setSelectedProgressId(null);
    } catch (error) {
      setError(error.message || "Failed to delete progress entry");
    } finally {
      setDeletingProgressId(null);
    }
  };

  // ==================================================
  // Loading State
  // ==================================================

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-blue-600 dark:text-blue-400" />

            <p className="text-sm text-foreground-muted">
              Loading full progress history...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // Error State
  // ==================================================

  if (error && !goal) {
    return (
      <div className="p-6 space-y-4">
        <button
          type="button"
          onClick={() => navigate(`/app/goals/${id}`)}
          className="flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 hover:cursor-pointer"
        >
          <ArrowLeft size={18} />

          <span>Back to Goal</span>
        </button>

        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300 px-4 py-3 rounded-2xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  // ==================================================
  // Status Styles
  // ==================================================

  const statusStyles = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",

    completed:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",

    paused:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };

  // ==================================================
  // Calculate Goal Progress
  // ==================================================

  const targetValue = Number(goal?.targetValue) || 0;

  const currentValue = Number(goal?.currentValue) || 0;

  const rawProgressPercentage =
    targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  const progressPercentage = Math.min(Math.max(rawProgressPercentage, 0), 100);

  const displayedProgressPercentage = Math.round(progressPercentage);

  // ==================================================
  // Render
  // ==================================================

  return (
    <div className="p-6 space-y-6">
      {/* ==================================================
          Back Button
          ================================================== */}

      <button
        type="button"
        onClick={() => navigate(`/app/goals/${id}`)}
        className="flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 hover:cursor-pointer"
      >
        <ArrowLeft size={18} />

        <span>Back to Goal</span>
      </button>

      {/* ==================================================
          Header Card
          ================================================== */}

      <div className="bg-surface border border-border rounded-3xl shadow-sm p-6 md:p-8">
        <div className="flex items-start justify-between gap-5 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
              Progress History
            </p>

            <h1 className="text-3xl font-bold text-foreground mt-1">
              {goal?.title || "Goal Progress"}
            </h1>

            <p className="text-sm text-foreground-muted mt-2">
              Complete progress history for this goal.
            </p>
          </div>

          {/* Goal Status */}

          {goal?.status && (
            <span
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide capitalize ${
                statusStyles[goal.status] ||
                "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted"
              }`}
            >
              {goal.status}
            </span>
          )}
        </div>

        {/* Goal Progress Summary */}

        <div className="mt-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-blue-500/25 rounded-3xl p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                Current Progress
              </p>

              <p className="text-2xl font-bold text-foreground mt-1">
                {currentValue} / {targetValue} {goal?.unit}
              </p>
            </div>

            <p className="text-2xl font-bold text-foreground">
              {displayedProgressPercentage}%
            </p>
          </div>

          <div className="mt-4 w-full h-3 rounded-full bg-surface-secondary overflow-hidden border border-blue-100 dark:border-blue-500/25">
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ==================================================
          Full History Card
          ================================================== */}

      <div className="bg-surface border border-border rounded-3xl shadow-sm p-6 md:p-8">
        {/* Header */}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              All Progress History
            </h2>

            <p className="text-sm text-foreground-muted mt-1">
              Every progress entry recorded for this goal.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-surface-secondary border border-border rounded-full text-xs font-semibold text-foreground-muted">
            {progressHistory.length}{" "}
            {progressHistory.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}

        {progressHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-surface-secondary border border-dashed border-border rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center mb-4">
              <TrendingUp size={22} />
            </div>

            <h3 className="text-base font-semibold text-foreground">
              No progress recorded yet
            </h3>

            <p className="text-sm text-foreground-muted mt-1 max-w-md">
              This goal does not have any progress entries yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progressHistory.map((progress) => (
              <div
                key={progress._id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 bg-surface-secondary border border-border rounded-2xl hover:bg-surface hover:border-border-strong hover:shadow-sm transition-all duration-200"
              >
                {/* Left Content */}

                <div className="flex items-start gap-4 min-w-0">
                  {/* Value Badge */}

                  <div className="shrink-0 min-w-14 h-14 px-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/25 dark:text-blue-300 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold leading-none">
                      +{progress.value}
                    </span>

                    <span className="text-[10px] mt-1 font-medium">
                      {goal?.unit}
                    </span>
                  </div>

                  {/* Note + Date */}

                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold text-foreground wrap-break">
                      {progress.note || "Progress recorded"}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-foreground-muted flex-wrap">
                      <CalendarDays size={13} />

                      <span>{formatDate(progress.createdAt)}</span>

                      <span>•</span>

                      <span>{formatTime(progress.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Delete */}

                <button
                  type="button"
                  onClick={() => handleDeleteProgress(progress._id)}
                  disabled={deletingProgressId === progress._id}
                  className="self-end md:self-center shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-foreground-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete progress"
                  aria-label="Delete progress entry"
                >
                  {deletingProgressId === progress._id ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Trash2 size={17} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================================================
          Delete Progress Modal
          ================================================== */}

      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Delete Progress"
        actions={
          <>
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={Boolean(deletingProgressId)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-muted hover:bg-surface-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={Boolean(deletingProgressId)}
              className="min-w-20 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {deletingProgressId ? (
                <>
                  <Loader2 size={15} className="animate-spin" />

                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete</span>
              )}
            </button>
          </>
        }
      >
        <p className="text-sm leading-6 text-foreground-muted">
          Are you sure you want to delete this progress entry?
          <br />
          This will reduce the goal's recorded progress.
        </p>
      </Modal>
    </div>
  );
};

export default GoalProgressHistoryPage;
