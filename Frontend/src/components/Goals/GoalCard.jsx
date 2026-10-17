import {
  CalendarDays,
  Flag,
  Pencil,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useDateFormat from "../../hooks/useDateFormat";
import { formatDate } from "../../utils/dateFormatting";

const GoalCard = ({ goal, onDelete }) => {
  const navigate = useNavigate();
  const dateFormat = useDateFormat();

  // ==========================================
  // Dynamic Status Styles
  // ==========================================

  const statusStyles = {
    active:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    completed:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    paused:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  };

  // ==========================================
  // Dynamic Priority Styles
  // ==========================================

  const priorityStyles = {
    low: "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300",
    high: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  };

  // ==========================================
  // Normalize Goal Values
  // ==========================================

  const currentValue = Number(goal.currentValue) || 0;
  const targetValue = Number(goal.targetValue) || 0;

  // ==========================================
  // Calculate Goal Progress Percentage
  // ==========================================

  const rawProgressPercentage =
    targetValue > 0
      ? (currentValue / targetValue) * 100
      : 0;

  const progressPercentage = Math.min(
    Math.max(rawProgressPercentage, 0),
    100,
  );

  const displayedProgressPercentage =
    Math.round(progressPercentage);

  // ==========================================
  // Format Target Date
  // ==========================================

  const formattedTargetDate = goal.targetDate
    ? formatDate(goal.targetDate, dateFormat)
    : null;

  // ==========================================
  // Navigate to Edit Page
  // ==========================================

  const handleEdit = () => {
    navigate(`/app/goals/edit/${goal._id}`);
  };

  // ==========================================
  // Navigate to Goal Details Page
  // ==========================================

  const handleFocus = () => {
    navigate(`/app/goals/${goal._id}`);
  };

  // ==========================================
  // Open Add Progress Form on Goal Page
  // ==========================================

  const handleAddProgress = () => {
    navigate(`/app/goals/${goal._id}`, {
      state: {
        openProgressForm: true,
      },
    });
  };

  return (
    <div
      className="
        group relative bg-surface p-5 rounded-3xl
        border border-border shadow-sm
        hover:shadow-xl hover:border-border-strong
        space-y-5
      "
    >
      {/* ======================================
          Top Section
      ====================================== */}

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 pr-10">
          <h3 className="text-[15px] font-semibold text-foreground leading-6 wrap-break-word">
            {goal.title}
          </h3>

          <span
            className={`
              text-[11px] px-2.5 py-1 rounded-full
              capitalize whitespace-nowrap
              font-semibold tracking-wide
              ${
                statusStyles[goal.status] ||
                "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted"
              }
            `}
          >
            {goal.status}
          </span>
        </div>

        {goal.description && (
          <p
            className="
              text-sm text-foreground-muted
              leading-6 wrap-break-word
              line-clamp-2
            "
          >
            {goal.description}
          </p>
        )}
      </div>

      {/* ======================================
          Progress Section
      ====================================== */}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <p className="text-foreground-muted font-medium">
            {currentValue} / {targetValue} {goal.unit}
          </p>

          <p className="font-semibold text-foreground-secondary">
            {displayedProgressPercentage}%
          </p>
        </div>

        <div
          className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayedProgressPercentage}
          aria-label={`Goal progress: ${displayedProgressPercentage}%`}
        >
          <div
            className="
              h-full rounded-full bg-blue-600 dark:bg-blue-500
              transition-[width] duration-500 ease-out
            "
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* ======================================
          Bottom Section
      ====================================== */}

      <div className="space-y-4 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="
              px-3 py-1 rounded-full
              bg-purple-50 text-purple-700
              dark:bg-purple-500/10 dark:text-purple-300
              text-[11px] font-semibold capitalize
              border border-purple-100 dark:border-purple-500/25
            "
          >
            {goal.category}
          </span>

          <div
            className={`
              flex items-center gap-1
              px-3 py-1 rounded-full
              text-[11px] font-semibold capitalize
              ${
                priorityStyles[goal.priority] ||
                "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted"
              }
            `}
          >
            <Flag size={10} />
            <span>{goal.priority}</span>
          </div>

          {formattedTargetDate && (
            <div
              className="
                flex items-center gap-1
                px-3 py-1 rounded-full
                bg-gray-50 text-gray-600
                dark:bg-surface-secondary dark:text-foreground-muted
                text-[11px] font-medium
                border border-gray-100 dark:border-border
              "
            >
              <CalendarDays size={10} />
              <span>{formattedTargetDate}</span>
            </div>
          )}
        </div>

        {/* ======================================
            Action Row
        ====================================== */}

        <div className="flex items-center justify-between gap-3">
          {/* Add Progress */}

          {goal.status === "active" ? (
            <button
              type="button"
              onClick={handleAddProgress}
              className="
                flex items-center gap-1.5
                px-3 py-1.5 rounded-xl
                bg-blue-600 text-white dark:bg-blue-500
                text-[11px] font-semibold
                shadow-sm
                hover:bg-blue-700 dark:hover:bg-blue-400
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all duration-200
                hover:cursor-pointer
              "
            >
              <Plus size={13} />
              <span>Add Progress</span>
            </button>
          ) : (
            <div />
          )}

          {/* View / Edit / Delete */}

          <div className="flex justify-end items-center gap-1">
            <button
              type="button"
              onClick={handleFocus}
              className="
                w-7 h-7 rounded-lg
                flex items-center justify-center
                text-foreground-muted
                hover:cursor-pointer
                hover:scale-110
                hover:text-purple-500 dark:hover:text-purple-400
              "
              aria-label="View goal"
              title="View goal"
            >
              <Eye size={15} />
            </button>

            <button
              type="button"
              onClick={handleEdit}
              className="
                w-7 h-7 rounded-lg
                flex items-center justify-center
                text-foreground-muted
                hover:cursor-pointer
                hover:text-blue-600 dark:hover:text-blue-400
                hover:scale-110
              "
              aria-label="Edit goal"
              title="Edit goal"
            >
              <Pencil size={15} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(goal._id)}
              className="
                w-7 h-7 rounded-lg
                flex items-center justify-center
                text-foreground-muted
                hover:cursor-pointer
                hover:text-red-600 dark:hover:text-red-400
                hover:scale-110
              "
              aria-label="Delete goal"
              title="Delete goal"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
