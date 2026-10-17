import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Flag,
  Target,
  TrendingUp,
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  Clock3,
  X,
  History,
} from "lucide-react";

import { getGoal, deleteGoal } from "../services/goalsServices";

import Modal from "../components/UI/Modal";
import Spinner from "../components/UI/Spinner";

import {
  addGoalProgress,
  getGoalProgress,
  deleteGoalProgress,
} from "../services/goalProgressServices";

// ======================================================
// Configuration
// ======================================================

const HISTORY_PREVIEW_LIMIT = 3;

// ======================================================
// Goal View Page
// ======================================================

const GoalViewPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // ====================================================
  // Goal State
  // ====================================================

  const [goal, setGoal] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  // ====================================================
  // Progress History State
  // ====================================================

  const [progressHistory, setProgressHistory] = useState([]);

  const [progressLoading, setProgressLoading] = useState(false);

  const [progressError, setProgressError] = useState(null);

  // ====================================================
  // Add Progress State
  // ====================================================

  const [progressValue, setProgressValue] = useState("");

  const [progressNote, setProgressNote] = useState("");

  const [addingProgress, setAddingProgress] = useState(false);

  const [showProgressForm, setShowProgressForm] = useState(false);

  // ====================================================
  // Delete Progress State
  // ====================================================

  const [deletingProgressId, setDeletingProgressId] = useState(null);

  // ====================================================
  // Delete Goal Modal State
  // ====================================================

  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);

  const [deletingGoal, setDeletingGoal] = useState(false);

  // ====================================================
  // Delete Progress Modal State
  // ====================================================

  const [showDeleteProgressModal, setShowDeleteProgressModal] = useState(false);

  const [selectedProgressId, setSelectedProgressId] = useState(null);

  // ====================================================
  // Fetch Goal
  // ====================================================

  const fetchGoal = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await getGoal(id);

      setGoal(data);
    } catch (error) {
      setError(error.message || "Failed to fetch goal");
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // Fetch Progress History
  // ====================================================

  const fetchProgressHistory = async () => {
    try {
      setProgressLoading(true);

      setProgressError(null);

      const data = await getGoalProgress(id);

      setProgressHistory(data.data || []);
    } catch (error) {
      setProgressError(error.message || "Failed to fetch goal progress");
    } finally {
      setProgressLoading(false);
    }
  };

  // ====================================================
  // Initial Data Fetch
  // ====================================================

  useEffect(() => {
    fetchGoal();

    fetchProgressHistory();
  }, [id]);

  // ====================================================
  // Progress Modal Lifecycle
  // ====================================================

  useEffect(() => {
    if (!showProgressForm) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape" && !addingProgress) {
        handleCloseProgressForm();
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleEscape);
    };
  }, [showProgressForm, addingProgress]);

  // ====================================================
  // Open Progress Form
  // ====================================================

  const handleOpenProgressForm = () => {
    setProgressError(null);

    setShowProgressForm(true);
  };

  // ====================================================
  // Close Progress Form
  // ====================================================

  const handleCloseProgressForm = () => {
    if (addingProgress) {
      return;
    }

    setProgressValue("");

    setProgressNote("");

    setProgressError(null);

    setShowProgressForm(false);
  };

  // ====================================================
  // Add Goal Progress
  // ====================================================

  const handleAddProgress = async (event) => {
    event.preventDefault();

    if (!goal) {
      return;
    }

    const value = Number(progressValue);

    // Basic validation
    if (progressValue.trim() === "" || !Number.isFinite(value) || value < 1) {
      setProgressError("Progress value must be at least 1.");

      return;
    }

    // Completed goal
    if (goal.status === "completed") {
      setProgressError(
        "This goal is already completed. Additional progress cannot be added.",
      );

      return;
    }

    // Paused goal
    if (goal.status === "paused") {
      setProgressError(
        "This goal is paused. Resume the goal before adding progress.",
      );

      return;
    }

    const targetValue = Number(goal.targetValue) || 0;

    const currentValue = Number(goal.currentValue) || 0;

    // Prevent exceeding target
    if (currentValue + value > targetValue) {
      setProgressError(
        `Progress cannot exceed the remaining target of ${
          targetValue - currentValue
        }.`,
      );

      return;
    }

    try {
      setAddingProgress(true);

      setProgressError(null);

      await addGoalProgress(id, {
        value,
        note: progressNote.trim() || undefined,
      });

      // Clear form
      setProgressValue("");

      setProgressNote("");

      // Close form
      setShowProgressForm(false);

      // Refresh both goal and history
      await Promise.all([fetchGoal(), fetchProgressHistory()]);
    } catch (error) {
      setProgressError(error.message || "Failed to add goal progress");
    } finally {
      setAddingProgress(false);
    }
  };

  // ====================================================
  // Delete Goal
  // ====================================================

  const handleDeleteGoal = () => {
    if (deletingGoal) {
      return;
    }

    setShowDeleteGoalModal(true);
  };

  // ====================================================
  // Close Delete Goal Modal
  // ====================================================

  const handleCloseDeleteGoalModal = () => {
    if (deletingGoal) {
      return;
    }

    setShowDeleteGoalModal(false);
  };

  // ====================================================
  // Confirm Delete Goal
  // ====================================================

  const handleConfirmDeleteGoal = async () => {
    if (!id || deletingGoal) {
      return;
    }

    try {
      setDeletingGoal(true);

      setError(null);

      await deleteGoal(id);

      setShowDeleteGoalModal(false);

      navigate("/app/goals");
    } catch (error) {
      setError(error.message || "Failed to delete goal");
    } finally {
      setDeletingGoal(false);
    }
  };

  // ====================================================
  // Delete Progress
  // ====================================================

  const handleDeleteProgress = (progressId) => {
    if (!progressId || deletingProgressId) {
      return;
    }

    setSelectedProgressId(progressId);

    setShowDeleteProgressModal(true);
  };

  // ====================================================
  // Close Delete Progress Modal
  // ====================================================

  const handleCloseDeleteProgressModal = () => {
    if (deletingProgressId) {
      return;
    }

    setShowDeleteProgressModal(false);

    setSelectedProgressId(null);
  };

  // ====================================================
  // Confirm Delete Progress
  // ====================================================

  const handleConfirmDeleteProgress = async () => {
    if (!selectedProgressId || deletingProgressId) {
      return;
    }

    try {
      setDeletingProgressId(selectedProgressId);

      setProgressError(null);

      await deleteGoalProgress(selectedProgressId);

      await Promise.all([fetchGoal(), fetchProgressHistory()]);

      setShowDeleteProgressModal(false);

      setSelectedProgressId(null);
    } catch (error) {
      setProgressError(error.message || "Failed to delete goal progress");
    } finally {
      setDeletingProgressId(null);
    }
  };

  // ====================================================
  // Navigate to Edit Page
  // ====================================================

  const handleEdit = () => {
    navigate(`/app/goals/edit/${goal._id}`);
  };

  // ====================================================
  // Navigate to Full History
  // ====================================================

  const handleViewFullHistory = () => {
    navigate(`/app/goals/${id}/history`);
  };

  // ====================================================
  // Date Formatter
  // ====================================================

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

  // ====================================================
  // Time Formatter
  // ====================================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ====================================================
  // Loading State
  // ====================================================

  if (loading) {
    return <Spinner fullPage size={40} />;
  }

  // ====================================================
  // Error State
  // ====================================================

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300 px-4 py-3 rounded-2xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  // ====================================================
  // Goal Not Found
  // ====================================================

  if (!goal) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-500/10 dark:border-yellow-500/25 dark:text-yellow-300 px-4 py-3 rounded-2xl text-sm">
          Goal not found
        </div>
      </div>
    );
  }

  // ====================================================
  // Normalize Goal Values
  // ====================================================

  const targetValue = Number(goal.targetValue) || 0;

  const currentValue = Number(goal.currentValue) || 0;

  // ====================================================
  // Calculate Progress Percentage
  // ====================================================

  const rawProgressPercentage =
    targetValue > 0 ? (currentValue / targetValue) * 100 : 0;

  const progressPercentage = Math.min(Math.max(rawProgressPercentage, 0), 100);

  const displayedProgressPercentage = Math.round(progressPercentage);

  // ====================================================
  // Remaining Value
  // ====================================================

  const remainingValue = Math.max(targetValue - currentValue, 0);

  // ====================================================
  // Status Styles
  // ====================================================

  const statusStyles = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",

    completed:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",

    paused:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };

  // ====================================================
  // Priority Styles
  // ====================================================

  const priorityStyles = {
    low: "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted",

    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",

    high: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };

  // ====================================================
  // Progress Form Disabled State
  // ====================================================

  const progressFormDisabled =
    goal.status === "completed" || goal.status === "paused" || addingProgress;

  // ====================================================
  // Three Most Recent Progress Entries
  // ====================================================

  const recentProgressHistory = progressHistory.slice(0, HISTORY_PREVIEW_LIMIT);

  // ====================================================
  // Render
  // ====================================================

  return (
    <div className="p-6 space-y-6">
      {/* ==================================================
          Back Button
          ================================================== */}

      <button
        type="button"
        onClick={() => navigate("/app/goals")}
        className="flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200 hover:cursor-pointer"
      >
        <ArrowLeft size={18} />

        <span>Back to Goals</span>
      </button>

      {/* ==================================================
          Goal Hero Card
          ================================================== */}

      <div className="relative overflow-hidden bg-surface border border-border rounded-3xl shadow-sm p-8 space-y-8">
        {/* Top Content */}

        <div className="space-y-5">
          {/* Title + Status */}

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground tracking-tight leading-tight">
                {goal.title}
              </h1>

              {goal.description && (
                <p className="text-foreground-muted leading-7 max-w-3xl text-[15px]">
                  {goal.description}
                </p>
              )}
            </div>

            {/* Status */}

            <span
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide capitalize whitespace-nowrap ${
                statusStyles[goal.status] ||
                "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted"
              }`}
            >
              {goal.status}
            </span>
          </div>

          {/* Progress Card */}

          <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-blue-500/25 rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
                  Goal Progress
                </p>

                <h2 className="text-3xl font-bold text-foreground">
                  {displayedProgressPercentage}%
                </h2>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface border border-blue-100 dark:border-blue-500/25">
                <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />

                <p className="text-sm font-semibold text-foreground-secondary">
                  {currentValue} / {targetValue} {goal.unit}
                </p>
              </div>
            </div>

            {/* Progress Bar */}

            <div className="space-y-2">
              <div
                className="w-full h-4 rounded-full bg-surface-secondary overflow-hidden border border-blue-100 dark:border-blue-500/25"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={displayedProgressPercentage}
                aria-label={`Goal progress: ${displayedProgressPercentage}%`}
              >
                <div
                  className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-foreground-muted">
                  {goal.status === "completed"
                    ? "Goal completed successfully."
                    : `${remainingValue} ${goal.unit} remaining`}
                </p>

                <p className="text-xs text-foreground-muted">
                  {goal.totalLogs || 0}{" "}
                  {goal.totalLogs === 1 ? "entry" : "entries"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Category */}

          <div className="bg-surface-secondary border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-purple-600 dark:text-purple-400" />

              <p className="text-xs font-semibold tracking-wide text-foreground-muted uppercase">
                Category
              </p>
            </div>

            <p className="text-sm font-semibold text-foreground capitalize">
              {goal.category || "Not specified"}
            </p>
          </div>

          {/* Priority */}

          <div className="bg-surface-secondary border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Flag size={16} className="text-red-500 dark:text-red-400" />

              <p className="text-xs font-semibold tracking-wide text-foreground-muted uppercase">
                Priority
              </p>
            </div>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                priorityStyles[goal.priority] ||
                "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted"
              }`}
            >
              {goal.priority || "Not specified"}
            </span>
          </div>

          {/* Start Date */}

          <div className="bg-surface-secondary border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-foreground-muted" />

              <p className="text-xs font-semibold tracking-wide text-foreground-muted uppercase">
                Start Date
              </p>
            </div>

            <p className="text-sm font-semibold text-foreground">
              {goal.startDate ? formatDate(goal.startDate) : "Not specified"}
            </p>
          </div>

          {/* Target Date */}

          <div className="bg-surface-secondary border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-blue-500 dark:text-blue-400" />

              <p className="text-xs font-semibold tracking-wide text-foreground-muted uppercase">
                Target Date
              </p>
            </div>

            <p className="text-sm font-semibold text-foreground">
              {goal.targetDate ? formatDate(goal.targetDate) : "Not specified"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}

        <div className="flex justify-end items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:scale-[1.02] transition-all duration-200 hover:cursor-pointer"
          >
            <Pencil size={16} />

            <span>Edit Goal</span>
          </button>

          <button
            type="button"
            onClick={handleDeleteGoal}
            disabled={deletingGoal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 text-red-600 border border-red-100 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/25 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            <Trash2 size={16} />

            <span>Delete Goal</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          Add Progress
          ================================================== */}

      <div className="bg-surface border border-border rounded-3xl shadow-sm p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Plus size={20} className="text-blue-600 dark:text-blue-400" />

              <h2 className="text-xl font-bold text-foreground">Add Progress</h2>
            </div>

            <p className="text-sm text-foreground-muted mt-1">
              Record your latest progress toward this goal.
            </p>
          </div>

          {/* Completed Badge */}

          {goal.status === "completed" && (
            <span className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300 text-xs font-semibold">
              <CheckCircle2 size={14} />
              Completed
            </span>
          )}

          {/* Paused Badge */}

          {goal.status === "paused" && (
            <span className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 text-xs font-semibold">
              <Clock3 size={14} />
              Paused
            </span>
          )}
        </div>

        {/* Completed Message */}

        {goal.status === "completed" && (
          <div className="mt-6 flex items-center gap-3 px-4 py-4 bg-green-50 border border-green-100 dark:bg-green-500/10 dark:border-green-500/25 rounded-2xl text-sm text-green-700 dark:text-green-300">
            <CheckCircle2 size={18} className="shrink-0" />

            <p>
              This goal has reached its target. No additional progress can be
              added.
            </p>
          </div>
        )}

        {/* Paused Message */}

        {goal.status === "paused" && (
          <div className="mt-6 flex items-center gap-3 px-4 py-4 bg-amber-50 border border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/25 rounded-2xl text-sm text-amber-700 dark:text-amber-300">
            <Clock3 size={18} className="shrink-0" />

            <p>
              This goal is currently paused. Resume it before recording
              additional progress.
            </p>
          </div>
        )}

        {/* Add Progress Button */}

        {goal.status === "active" && !showProgressForm && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenProgressForm}
              className="w-full min-h-12 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 hover:cursor-pointer"
            >
              <Plus size={18} />

              <span>Add Progress</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================
          Add Progress Modal
          ================================================== */}

      {goal.status === "active" && showProgressForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-950/50 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !addingProgress) {
              handleCloseProgressForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-progress-title"
            aria-describedby="add-progress-description"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-border rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-5 py-5 md:px-7 md:py-6 bg-surface/95 backdrop-blur border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center">
                  <Plus size={19} />
                </div>

                <div>
                  <h2
                    id="add-progress-title"
                    className="text-lg md:text-xl font-bold text-foreground"
                  >
                    Record Progress
                  </h2>

                  <p
                    id="add-progress-description"
                    className="text-xs md:text-sm text-foreground-muted mt-0.5"
                  >
                    Add the amount you completed toward this goal.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseProgressForm}
                disabled={addingProgress}
                aria-label="Close add progress form"
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl text-foreground-muted hover:text-foreground-secondary hover:bg-surface-secondary border border-transparent hover:border-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="px-5 py-6 md:px-7 md:py-7">
              {progressError && (
                <div
                  className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300 px-4 py-3 rounded-2xl text-sm"
                  role="alert"
                >
                  <span className="leading-5">{progressError}</span>
                </div>
              )}

              <form onSubmit={handleAddProgress} className="space-y-6">
                {/* Progress Value */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="progressValue"
                      className="block text-sm font-semibold text-foreground-secondary"
                    >
                      Progress Value
                    </label>

                    <span className="text-xs text-foreground-muted">
                      Remaining: {remainingValue} {goal.unit}
                    </span>
                  </div>

                  <div className="relative">
                    <input
                      id="progressValue"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={progressValue}
                      onChange={(event) => {
                        setProgressValue(event.target.value);

                        setProgressError(null);
                      }}
                      disabled={progressFormDisabled}
                      autoFocus
                      placeholder={`e.g. 5 ${goal.unit || ""}`}
                      className="w-full px-4 py-3.5 pr-20 bg-input border border-border rounded-2xl text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />

                    {goal.unit && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground-muted pointer-events-none">
                        {goal.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Note */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="progressNote"
                      className="block text-sm font-semibold text-foreground-secondary"
                    >
                      Note{" "}
                      <span className="font-normal text-foreground-muted">
                        (optional)
                      </span>
                    </label>

                    <p className="text-xs text-foreground-muted">
                      {progressNote.length}
                      /500
                    </p>
                  </div>

                  <textarea
                    id="progressNote"
                    rows={4}
                    maxLength={500}
                    value={progressNote}
                    onChange={(event) => {
                      setProgressNote(event.target.value);

                      setProgressError(null);
                    }}
                    disabled={progressFormDisabled}
                    placeholder="What did you accomplish?"
                    className="w-full px-4 py-3.5 bg-input border border-border rounded-2xl text-sm text-foreground placeholder:text-foreground-muted outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Actions */}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseProgressForm}
                    disabled={addingProgress}
                    className="min-h-11 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-surface border border-border text-foreground-secondary text-sm font-semibold hover:bg-surface-secondary hover:border-border-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                  >
                    <X size={16} />

                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={progressFormDisabled || !progressValue}
                    className="min-h-11 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {addingProgress ? (
                      <>
                        <Spinner size={17} label="Deleting progress record" />

                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={17} />

                        <span>Add Progress</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          Recent Progress
          ================================================== */}

      <div className="bg-surface border border-border rounded-3xl shadow-sm p-6 md:p-8">
        {/* Header */}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Recent Progress</h2>

            <p className="text-sm text-foreground-muted mt-1">
              Showing the 3 most recent progress entries.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-surface-secondary border border-border rounded-full text-xs font-semibold text-foreground-muted">
            {progressHistory.length}{" "}
            {progressHistory.length === 1 ? "entry" : "entries"}
          </div>
        </div>

        {/* Loading */}

        {progressLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-3 text-sm text-foreground-muted">
              <Spinner size={20} label="Loading progress history" />

              <span>Loading progress history...</span>
            </div>
          </div>
        )}

        {/* Error */}

        {!progressLoading && progressError && (
          <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300 px-4 py-3 rounded-2xl text-sm">
            {progressError}
          </div>
        )}

        {/* Empty */}

        {!progressLoading && !progressError && progressHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-surface-secondary border border-dashed border-border rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 flex items-center justify-center mb-4">
              <TrendingUp size={22} />
            </div>

            <h3 className="text-base font-semibold text-foreground">
              No progress recorded yet
            </h3>

            <p className="text-sm text-foreground-muted mt-1 max-w-md">
              Start tracking this goal by adding your first progress entry
              above.
            </p>
          </div>
        )}

        {/* Recent Entries */}

        {!progressLoading && !progressError && progressHistory.length > 0 && (
          <>
            <div className="space-y-3">
              {recentProgressHistory.map((progress) => (
                <div
                  key={progress._id}
                  className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 bg-surface-secondary border border-border rounded-2xl hover:bg-surface hover:border-border-strong hover:shadow-sm transition-all duration-200"
                >
                  {/* Left */}

                  <div className="flex items-start gap-4 min-w-0">
                    {/* Value Badge */}

                    <div className="shrink-0 min-w-14 h-14 px-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/25 dark:text-blue-300 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold leading-none">
                        +{progress.value}
                      </span>

                      <span className="text-[10px] mt-1 font-medium">
                        {goal.unit}
                      </span>
                    </div>

                    {/* Note */}

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
                      <Spinner size={17} label="Updating progress" />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* ==================================================
                  See Full History
                  ================================================== */}

            {progressHistory.length > HISTORY_PREVIEW_LIMIT && (
              <button
                type="button"
                onClick={handleViewFullHistory}
                className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:hover:border-blue-500/40 transition-all duration-200 hover:cursor-pointer"
              >
                <History size={17} />
                <span>See Full History</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* ==================================================
          Delete Goal Modal
          ================================================== */}

      <Modal
        isOpen={showDeleteGoalModal}
        onClose={handleCloseDeleteGoalModal}
        title="Delete Goal"
        actions={
          <>
            <button
              type="button"
              onClick={handleCloseDeleteGoalModal}
              disabled={deletingGoal}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-muted hover:bg-surface-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDeleteGoal}
              disabled={deletingGoal}
              className="min-w-20 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {deletingGoal ? (
                <>
                  <Spinner size={15} label="Deleting goal" />

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
          Are you sure you want to delete this goal?
          <br />
          This action cannot be undone.
        </p>
      </Modal>

      {/* ==================================================
          Delete Progress Modal
          ================================================== */}

      <Modal
        isOpen={showDeleteProgressModal}
        onClose={handleCloseDeleteProgressModal}
        title="Delete Progress"
        actions={
          <>
            <button
              type="button"
              onClick={handleCloseDeleteProgressModal}
              disabled={Boolean(deletingProgressId)}
              className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground-muted hover:bg-surface-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDeleteProgress}
              disabled={Boolean(deletingProgressId)}
              className="min-w-20 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {deletingProgressId ? (
                <>
                  <Spinner size={15} label="Saving progress" />

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

export default GoalViewPage;
