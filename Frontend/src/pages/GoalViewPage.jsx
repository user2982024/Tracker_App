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
  Loader2,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import { getGoal } from "../services/goalsServices";

import {
  addGoalProgress,
  getGoalProgress,
  deleteGoalProgress,
} from "../services/goalProgressServices";

const GoalViewPage = () => {
  const navigate = useNavigate();

  // Get goal ID from route params
  const { id } = useParams();

  // ==========================================
  // Goal State
  // ==========================================

  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // Progress History State
  // ==========================================

  const [progressHistory, setProgressHistory] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState(null);

  // ==========================================
  // Add Progress State
  // ==========================================

  const [progressValue, setProgressValue] = useState("");
  const [progressNote, setProgressNote] = useState("");
  const [addingProgress, setAddingProgress] = useState(false);

  // Controls whether the Add Progress form is visible
  const [showProgressForm, setShowProgressForm] = useState(false);

  // ==========================================
  // Delete Progress State
  // ==========================================

  const [deletingProgressId, setDeletingProgressId] =
    useState(null);

  // ==========================================
  // Fetch Goal
  // ==========================================

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

  // ==========================================
  // Fetch Progress History
  // ==========================================

  const fetchProgressHistory = async () => {
    try {
      setProgressLoading(true);
      setProgressError(null);

      const data = await getGoalProgress(id);

      setProgressHistory(data.data || []);
    } catch (error) {
      setProgressError(
        error.message || "Failed to fetch goal progress",
      );
    } finally {
      setProgressLoading(false);
    }
  };

  // ==========================================
  // Fetch Goal + Progress History
  // ==========================================

  useEffect(() => {
    fetchGoal();
    fetchProgressHistory();
  }, [id]);

  // ==========================================
  // Open Progress Form
  // ==========================================

  const handleOpenProgressForm = () => {
    setProgressError(null);
    setShowProgressForm(true);
  };

  // ==========================================
  // Close Progress Form
  // ==========================================

  const handleCloseProgressForm = () => {
    // Do not allow the form to be closed while
    // a progress request is being submitted.
    if (addingProgress) {
      return;
    }

    // Clear unsaved form data
    setProgressValue("");
    setProgressNote("");
    setProgressError(null);

    // Hide form
    setShowProgressForm(false);
  };

  // ==========================================
  // Progress Form Modal Lifecycle
  // ==========================================

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

  // ==========================================
  // Add Goal Progress
  // ==========================================

  const handleAddProgress = async (event) => {
    event.preventDefault();

    if (!goal) {
      return;
    }

    // Convert input to number
    const value = Number(progressValue);

    // Basic validation
    if (
      progressValue.trim() === "" ||
      !Number.isFinite(value) ||
      value < 1
    ) {
      setProgressError("Progress value must be at least 1.");
      return;
    }

    // Prevent progress on completed goals
    if (goal.status === "completed") {
      setProgressError(
        "This goal is already completed. Additional progress cannot be added.",
      );
      return;
    }

    // Prevent progress on paused goals
    if (goal.status === "paused") {
      setProgressError(
        "This goal is paused. Resume the goal before adding progress.",
      );
      return;
    }

    // Prevent progress from exceeding target
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

      // Clear form fields
      setProgressValue("");
      setProgressNote("");

      // Close the form after successful submission
      setShowProgressForm(false);

      // Refresh goal and progress history
      await Promise.all([
        fetchGoal(),
        fetchProgressHistory(),
      ]);
    } catch (error) {
      setProgressError(
        error.message || "Failed to add goal progress",
      );
    } finally {
      setAddingProgress(false);
    }
  };

  // ==========================================
  // Delete Goal Progress
  // ==========================================

  const handleDeleteProgress = async (progressId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this progress entry?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProgressId(progressId);
      setProgressError(null);

      await deleteGoalProgress(progressId);

      // Refresh goal and progress history
      await Promise.all([
        fetchGoal(),
        fetchProgressHistory(),
      ]);
    } catch (error) {
      setProgressError(
        error.message || "Failed to delete goal progress",
      );
    } finally {
      setDeletingProgressId(null);
    }
  };

  // ==========================================
  // Navigate to Edit Page
  // ==========================================

  const handleEdit = () => {
    navigate(`/app/goals/edit/${goal._id}`);
  };

  // ==========================================
  // Loading State
  // ==========================================

  if (loading) {
    return (
      <div className="p-6">
        <div
          className="
            bg-white border border-gray-100
            rounded-3xl p-8 shadow-sm
          "
        >
          <div className="flex items-center gap-3">
            <Loader2
              size={20}
              className="animate-spin text-blue-600"
            />

            <p className="text-sm text-gray-500">
              Loading goal...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // Error State
  // ==========================================

  if (error) {
    return (
      <div className="p-6">
        <div
          className="
            bg-red-50 border border-red-200
            text-red-600 px-4 py-3 rounded-2xl text-sm
          "
        >
          {error}
        </div>
      </div>
    );
  }

  // ==========================================
  // Goal Not Found
  // ==========================================

  if (!goal) {
    return (
      <div className="p-6">
        <div
          className="
            bg-yellow-50 border border-yellow-200
            text-yellow-700 px-4 py-3 rounded-2xl text-sm
          "
        >
          Goal not found
        </div>
      </div>
    );
  }

  // ==========================================
  // Normalize Goal Values
  // ==========================================

  const targetValue = Number(goal.targetValue) || 0;
  const currentValue = Number(goal.currentValue) || 0;

  // ==========================================
  // Calculate Progress
  // ==========================================

  const rawProgressPercentage =
    targetValue > 0
      ? (currentValue / targetValue) * 100
      : 0;

  // Clamp visual percentage between 0 and 100
  const progressPercentage = Math.min(
    Math.max(rawProgressPercentage, 0),
    100,
  );

  // Rounded value shown to the user
  const displayedProgressPercentage = Math.round(
    progressPercentage,
  );

  // ==========================================
  // Remaining Value
  // ==========================================

  const remainingValue = Math.max(
    targetValue - currentValue,
    0,
  );

  // ==========================================
  // Dynamic Status Styles
  // ==========================================

  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
  };

  // ==========================================
  // Dynamic Priority Styles
  // ==========================================

  const priorityStyles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  // ==========================================
  // Progress Form Disabled State
  // ==========================================

  const progressFormDisabled =
    goal.status === "completed" ||
    goal.status === "paused" ||
    addingProgress;

  // ==========================================
  // Date Formatter
  // ==========================================

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

  // ==========================================
  // Time Formatter
  // ==========================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // ==========================================
  // Return UI
  // ==========================================

  return (
    <div className="p-6 space-y-6">
      {/* ======================================
          Back Button
      ====================================== */}

      <button
        onClick={() => navigate("/app/goals")}
        className="
          flex items-center gap-2
          text-sm font-medium text-gray-500
          hover:text-gray-800
          transition-colors duration-200
          hover:cursor-pointer
        "
      >
        <ArrowLeft size={18} />

        <span>Back to Goals</span>
      </button>

      {/* ======================================
          Hero Section
      ====================================== */}

      <div
        className="
          relative overflow-hidden
          bg-white border border-gray-100
          rounded-3xl shadow-sm
          p-8 space-y-8
        "
      >
        {/* ====================================
            Top Content
        ==================================== */}

        <div className="space-y-5">
          {/* Title + Status */}

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              {/* Title */}

              <h1
                className="
                  text-4xl font-bold
                  text-gray-900 tracking-tight
                  leading-tight
                "
              >
                {goal.title}
              </h1>

              {/* Description */}

              {goal.description && (
                <p
                  className="
                    text-gray-500 leading-7
                    max-w-3xl text-[15px]
                  "
                >
                  {goal.description}
                </p>
              )}
            </div>

            {/* Status Badge */}

            <span
              className={`
                px-4 py-2 rounded-full
                text-xs font-semibold tracking-wide
                capitalize whitespace-nowrap
                ${
                  statusStyles[goal.status] ||
                  "bg-gray-100 text-gray-600"
                }
              `}
            >
              {goal.status}
            </span>
          </div>

          {/* ==================================
              Progress Card
          ================================== */}

          <div
            className="
              bg-linear-to-r from-blue-50 to-indigo-50
              border border-blue-100
              rounded-3xl p-6 space-y-5
            "
          >
            {/* Progress Top */}

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <p
                  className="
                    text-xs uppercase tracking-wide
                    text-blue-600 font-semibold
                  "
                >
                  Goal Progress
                </p>

                <h2 className="text-3xl font-bold text-gray-900">
                  {displayedProgressPercentage}%
                </h2>
              </div>

              {/* Progress Stats */}

              <div
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-2xl
                  bg-white border border-blue-100
                "
              >
                <TrendingUp
                  size={18}
                  className="text-blue-600"
                />

                <p className="text-sm font-semibold text-gray-700">
                  {currentValue} / {targetValue}{" "}
                  {goal.unit}
                </p>
              </div>
            </div>

            {/* Progress Bar */}

            <div className="space-y-2">
              <div
                className="
                  w-full h-4 rounded-full
                  bg-white overflow-hidden
                  border border-blue-100
                "
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={displayedProgressPercentage}
                aria-label={`Goal progress: ${displayedProgressPercentage}%`}
              >
                <div
                  className="
                    h-full rounded-full
                    bg-blue-600
                    transition-[width]
                    duration-500
                    ease-out
                  "
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  {goal.status === "completed"
                    ? "Goal completed successfully."
                    : `${remainingValue} ${goal.unit} remaining`}
                </p>

                <p className="text-xs text-gray-400">
                  {goal.totalLogs || 0}{" "}
                  {goal.totalLogs === 1
                    ? "entry"
                    : "entries"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================
            Details Grid
        ==================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Category */}

          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >
            <div className="flex items-center gap-2">
              <Target
                size={16}
                className="text-purple-600"
              />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Category
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-800 capitalize">
              {goal.category || "Not specified"}
            </p>
          </div>

          {/* Priority */}

          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >
            <div className="flex items-center gap-2">
              <Flag
                size={16}
                className="text-red-500"
              />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Priority
              </p>
            </div>

            <span
              className={`
                inline-flex items-center
                px-3 py-1 rounded-full
                text-xs font-semibold capitalize
                ${
                  priorityStyles[goal.priority] ||
                  "bg-gray-100 text-gray-600"
                }
              `}
            >
              {goal.priority || "Not specified"}
            </span>
          </div>

          {/* Start Date */}

          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-gray-500"
              />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Start Date
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-800">
              {goal.startDate
                ? formatDate(goal.startDate)
                : "Not specified"}
            </p>
          </div>

          {/* Target Date */}

          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >
            <div className="flex items-center gap-2">
              <CalendarDays
                size={16}
                className="text-blue-500"
              />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Target Date
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-800">
              {goal.targetDate
                ? formatDate(goal.targetDate)
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* ====================================
            Action Buttons
        ==================================== */}

        <div className="flex justify-end items-center gap-3 pt-2">
          {/* Edit Button */}

          <button
            onClick={handleEdit}
            className="
              flex items-center gap-2
              px-4 py-2.5 rounded-2xl
              bg-blue-50 text-blue-600
              border border-blue-100
              text-sm font-semibold
              hover:bg-blue-100
              hover:scale-[1.02]
              transition-all duration-200
              hover:cursor-pointer
            "
          >
            <Pencil size={16} />

            <span>Edit Goal</span>
          </button>

          {/* Delete Button */}

          <button
            className="
              flex items-center gap-2
              px-4 py-2.5 rounded-2xl
              bg-red-50 text-red-600
              border border-red-100
              text-sm font-semibold
              hover:bg-red-100
              hover:scale-[1.02]
              transition-all duration-200
              hover:cursor-pointer
            "
          >
            <Trash2 size={16} />

            <span>Delete Goal</span>
          </button>
        </div>
      </div>

      {/* ======================================
          Add Progress Section
      ====================================== */}

      <div
        className="
          bg-white border border-gray-100
          rounded-3xl shadow-sm
          p-6 md:p-8
        "
      >
        {/* ====================================
            Section Header
        ==================================== */}

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Plus
                size={20}
                className="text-blue-600"
              />

              <h2 className="text-xl font-bold text-gray-900">
                Add Progress
              </h2>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Record your latest progress toward this goal.
            </p>
          </div>

          {/* Status */}

          {goal.status === "completed" && (
            <span
              className="
                shrink-0
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                bg-blue-50 text-blue-700
                text-xs font-semibold
              "
            >
              <CheckCircle2 size={14} />
              Completed
            </span>
          )}

          {goal.status === "paused" && (
            <span
              className="
                shrink-0
                inline-flex items-center gap-2
                px-3 py-1.5 rounded-full
                bg-amber-50 text-amber-700
                text-xs font-semibold
              "
            >
              <Clock3 size={14} />
              Paused
            </span>
          )}
        </div>

        {/* ====================================
            Completed Goal
        ==================================== */}

        {goal.status === "completed" && (
          <div
            className="
              mt-6
              flex items-center gap-3
              px-4 py-4
              bg-blue-50
              border border-blue-100
              rounded-2xl
              text-sm text-blue-700
            "
          >
            <CheckCircle2
              size={18}
              className="shrink-0"
            />

            <p>
              This goal has reached its target. No additional
              progress can be added.
            </p>
          </div>
        )}

        {/* ====================================
            Paused Goal
        ==================================== */}

        {goal.status === "paused" && (
          <div
            className="
              mt-6
              flex items-center gap-3
              px-4 py-4
              bg-amber-50
              border border-amber-100
              rounded-2xl
              text-sm text-amber-700
            "
          >
            <Clock3
              size={18}
              className="shrink-0"
            />

            <p>
              This goal is currently paused. Resume it before
              recording additional progress.
            </p>
          </div>
        )}

        {/* ====================================
            Add Progress Trigger
        ==================================== */}

        {goal.status === "active" && !showProgressForm && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenProgressForm}
              className="
                w-full
                min-h-12
                flex items-center
                justify-center gap-2
                px-5 py-3
                rounded-2xl
                bg-blue-600
                text-white
                text-sm font-semibold
                shadow-sm
                hover:bg-blue-700
                hover:scale-[1.005]
                active:scale-[0.995]
                transition-all duration-200
                hover:cursor-pointer
              "
            >
              <Plus size={18} />
              <span>Add Progress</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================
          Add Progress Modal
      ====================================== */}

      {goal.status === "active" && showProgressForm && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            p-4 sm:p-6
            bg-gray-950/50
            backdrop-blur-sm
          "
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !addingProgress
            ) {
              handleCloseProgressForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-progress-title"
            aria-describedby="add-progress-description"
            className="
              w-full max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              bg-white
              border border-gray-100
              rounded-3xl
              shadow-2xl
              animate-in
              fade-in
              zoom-in-95
              duration-200
            "
          >
            {/* Modal Header */}

            <div
              className="
                sticky top-0 z-10
                flex items-start justify-between
                gap-4
                px-5 py-5 md:px-7 md:py-6
                bg-white/95
                backdrop-blur
                border-b border-gray-100
              "
            >
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="
                      w-10 h-10
                      rounded-2xl
                      bg-blue-50
                      text-blue-600
                      flex items-center justify-center
                    "
                  >
                    <Plus size={19} />
                  </div>

                  <div>
                    <h2
                      id="add-progress-title"
                      className="text-lg md:text-xl font-bold text-gray-900"
                    >
                      Record Progress
                    </h2>

                    <p
                      id="add-progress-description"
                      className="text-xs md:text-sm text-gray-500 mt-0.5"
                    >
                      Add the amount you completed toward this goal.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseProgressForm}
                disabled={addingProgress}
                aria-label="Close add progress form"
                className="
                  shrink-0
                  w-10 h-10
                  flex items-center justify-center
                  rounded-xl
                  text-gray-400
                  hover:text-gray-700
                  hover:bg-gray-100
                  border border-transparent
                  hover:border-gray-200
                  transition-all duration-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  hover:cursor-pointer
                "
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="px-5 py-6 md:px-7 md:py-7">
              {/* Progress Error */}

              {progressError && (
                <div
                  className="
                    mb-6
                    flex items-start gap-3
                    bg-red-50
                    border border-red-200
                    text-red-600
                    px-4 py-3
                    rounded-2xl
                    text-sm
                  "
                  role="alert"
                >
                  <span className="leading-5">
                    {progressError}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleAddProgress}
                className="space-y-6"
              >
                {/* Progress Value */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="progressValue"
                      className="
                        block text-sm
                        font-semibold text-gray-700
                      "
                    >
                      Progress Value
                    </label>

                    <span className="text-xs text-gray-400">
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
                      className="
                        w-full
                        px-4 py-3.5
                        pr-20
                        bg-white
                        border border-gray-200
                        rounded-2xl
                        text-sm text-gray-900
                        placeholder:text-gray-400
                        outline-none
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-50
                        transition-all
                        disabled:opacity-60
                        disabled:cursor-not-allowed
                      "
                    />

                    {goal.unit && (
                      <span
                        className="
                          absolute right-4 top-1/2
                          -translate-y-1/2
                          text-xs font-medium
                          text-gray-400
                          pointer-events-none
                        "
                      >
                        {goal.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Note */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="progressNote"
                      className="
                        block text-sm
                        font-semibold text-gray-700
                      "
                    >
                      Note{" "}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>

                    <p className="text-xs text-gray-400">
                      {progressNote.length}/500
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
                    className="
                      w-full
                      px-4 py-3.5
                      bg-white
                      border border-gray-200
                      rounded-2xl
                      text-sm text-gray-900
                      placeholder:text-gray-400
                      outline-none
                      resize-none
                      focus:border-blue-400
                      focus:ring-4
                      focus:ring-blue-50
                      transition-all
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                    "
                  />
                </div>

                {/* Form Actions */}

                <div
                  className="
                    flex flex-col-reverse
                    sm:flex-row
                    sm:justify-end
                    gap-3
                    pt-2
                  "
                >
                  <button
                    type="button"
                    onClick={handleCloseProgressForm}
                    disabled={addingProgress}
                    className="
                      min-h-11
                      flex items-center
                      justify-center gap-2
                      px-5 py-3
                      rounded-2xl
                      bg-white
                      border border-gray-200
                      text-gray-600
                      text-sm font-semibold
                      hover:bg-gray-50
                      hover:border-gray-300
                      transition-all duration-200
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      hover:cursor-pointer
                    "
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    disabled={
                      progressFormDisabled ||
                      !progressValue
                    }
                    className="
                      min-h-11
                      flex items-center
                      justify-center gap-2
                      px-5 py-3
                      rounded-2xl
                      bg-blue-600
                      text-white
                      text-sm font-semibold
                      shadow-sm
                      hover:bg-blue-700
                      hover:scale-[1.01]
                      transition-all duration-200
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      disabled:hover:scale-100
                    "
                  >
                    {addingProgress ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
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

      {/* ======================================
          Progress History
      ====================================== */}

      <div
        className="
          bg-white border border-gray-100
          rounded-3xl shadow-sm
          p-6 md:p-8
        "
      >
        {/* History Header */}

        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Progress History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Every progress entry recorded for this goal.
            </p>
          </div>

          <div
            className="
              px-3 py-1.5
              bg-gray-50
              border border-gray-100
              rounded-full
              text-xs font-semibold
              text-gray-600
            "
          >
            {progressHistory.length}{" "}
            {progressHistory.length === 1
              ? "entry"
              : "entries"}
          </div>
        </div>

        {/* Progress Loading */}

        {progressLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <Loader2
                size={20}
                className="animate-spin text-blue-600"
              />

              <span>Loading progress history...</span>
            </div>
          </div>
        )}

        {/* Progress Error */}

        {!progressLoading && progressError && (
          <div
            className="
              bg-red-50 border border-red-200
              text-red-600
              px-4 py-3
              rounded-2xl
              text-sm
            "
          >
            {progressError}
          </div>
        )}

        {/* Empty State */}

        {!progressLoading &&
          !progressError &&
          progressHistory.length === 0 && (
            <div
              className="
                flex flex-col items-center
                justify-center
                text-center
                py-12
                px-6
                bg-gray-50
                border border-dashed
                border-gray-200
                rounded-3xl
              "
            >
              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                  flex items-center justify-center
                  mb-4
                "
              >
                <TrendingUp size={22} />
              </div>

              <h3 className="text-base font-semibold text-gray-800">
                No progress recorded yet
              </h3>

              <p className="text-sm text-gray-500 mt-1 max-w-md">
                Start tracking this goal by adding your
                first progress entry above.
              </p>
            </div>
          )}

        {/* Progress Entries */}

        {!progressLoading &&
          !progressError &&
          progressHistory.length > 0 && (
            <div className="space-y-3">
              {progressHistory.map((progress) => (
                <div
                  key={progress._id}
                  className="
                    group
                    flex flex-col md:flex-row
                    md:items-center
                    justify-between
                    gap-4
                    p-4 md:p-5
                    bg-gray-50
                    border border-gray-100
                    rounded-2xl
                    hover:bg-white
                    hover:border-gray-200
                    hover:shadow-sm
                    transition-all duration-200
                  "
                >
                  {/* Left Content */}

                  <div className="flex items-start gap-4 min-w-0">
                    {/* Value Badge */}

                    <div
                      className="
                        shrink-0
                        min-w-14 h-14
                        px-3
                        rounded-2xl
                        bg-blue-50
                        border border-blue-100
                        text-blue-700
                        flex flex-col
                        items-center
                        justify-center
                      "
                    >
                      <span className="text-lg font-bold leading-none">
                        +{progress.value}
                      </span>

                      <span className="text-[10px] mt-1 font-medium">
                        {goal.unit}
                      </span>
                    </div>

                    {/* Note + Date */}

                    <div className="min-w-0 space-y-1">
                      <p
                        className="
                          text-sm font-semibold
                          text-gray-800
                          break-words
                        "
                      >
                        {progress.note ||
                          "Progress recorded"}
                      </p>

                      <div
                        className="
                          flex items-center
                          gap-2
                          text-xs
                          text-gray-400
                          flex-wrap
                        "
                      >
                        <CalendarDays size={13} />

                        <span>
                          {formatDate(
                            progress.createdAt,
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {formatTime(
                            progress.createdAt,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Progress */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteProgress(
                        progress._id,
                      )
                    }
                    disabled={
                      deletingProgressId ===
                      progress._id
                    }
                    className="
                      self-end md:self-center
                      shrink-0
                      flex items-center
                      justify-center
                      w-10 h-10
                      rounded-xl
                      text-gray-400
                      hover:text-red-600
                      hover:bg-red-50
                      transition-all duration-200
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                    title="Delete progress"
                    aria-label="Delete progress entry"
                  >
                    {deletingProgressId ===
                    progress._id ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={17} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default GoalViewPage;