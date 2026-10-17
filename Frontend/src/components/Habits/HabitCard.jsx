
import {
  Archive,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Flame,
  MoreHorizontal,
  Pencil,
  Pin,
  RotateCcw,
  Target,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import Spinner from "../UI/Spinner";

const WEEKDAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600 dark:bg-surface-secondary dark:text-foreground-muted",
  medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300",
};

const CATEGORY_STYLES = {
  health: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  career: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  learning: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
  finance: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  personal: "bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-300",
};

const formatLabel = (value = "") =>
  String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const HabitCard = ({
  habit,
  completed = false,
  completion = null,
  streak = 0,
  loading = false,
  onToggleComplete,
  onEdit,
  onArchive,
  onDelete,
  onViewHistory,
  onTogglePin,
  pinning = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!habit) return null;

  const {
    _id,
    title = "Untitled habit",
    description = "",
    category = "personal",
    priority = "medium",
    frequency = "daily",
    daysOfWeek = [],
    targetValue,
    unit = "",
    isPinned = false,
    isArchived = false,
  } = habit;

  const normalizedPriority = String(priority).toLowerCase();
  const normalizedCategory = String(category).toLowerCase();

  const priorityStyle =
    PRIORITY_STYLES[normalizedPriority] || PRIORITY_STYLES.medium;

  const categoryStyle =
    CATEGORY_STYLES[normalizedCategory] || CATEGORY_STYLES.personal;

  const scheduledDays = WEEKDAYS.filter((day) =>
    daysOfWeek.includes(day.value),
  );

  const handleAction = (callback, ...args) => {
    setMenuOpen(false);
    if (!loading && typeof callback === "function") {
      callback(...args);
    }
  };

  const handleToggle = () => {
    if (!loading && typeof onToggleComplete === "function") {
      onToggleComplete(habit, completed, completion);
    }
  };

  return (
    <article
      className={`rounded-2xl border bg-surface p-5 shadow-sm transition-all duration-200 hover:shadow-md ${
        completed
          ? "border-emerald-100 dark:border-emerald-500/25"
          : "border-border"
      } ${isArchived ? "opacity-70" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading || isArchived}
          aria-label={
            completed
              ? `Undo completion of ${title}`
              : `Mark ${title} as completed`
          }
          aria-pressed={completed}
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:scale-110 active:scale-95 cursor-pointer ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20"
              : "border-border-strong text-transparent hover:border-emerald-500 hover:text-emerald-500"
          }`}
        >
          {loading ? (
            <Spinner size={14} />
          ) : completed ? (
            <Check size={16} strokeWidth={3} />
          ) : (
            <Circle size={16} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`break-words text-base font-semibold ${
                completed
                  ? "text-foreground-muted line-through"
                  : "text-foreground"
              }`}
            >
              {title}
            </h3>

            {isPinned && (
              <Pin
                size={14}
                className="shrink-0 text-amber-500"
                aria-label="Pinned habit"
              />
            )}

            {completed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle2 size={12} />
                Completed
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 whitespace-pre-line break-words text-sm leading-5 text-foreground-muted">
              {description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyle}`}
            >
              {formatLabel(category)}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle}`}
            >
              {formatLabel(priority)} priority
            </span>

            {frequency === "daily" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2.5 py-1 text-xs text-foreground-muted">
                <CalendarDays size={12} />
                Every day
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2.5 py-1 text-xs text-foreground-muted">
                <CalendarDays size={12} />
                {scheduledDays.length > 0
                  ? scheduledDays.map((day) => day.label).join(", ")
                  : "Selected days"}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-muted">
            {targetValue !== undefined && targetValue !== null && (
              <span className="inline-flex items-center gap-1.5">
                <Target size={14} />
                Target: {targetValue}
                {unit ? ` ${unit}` : ""}
              </span>
            )}

            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 font-medium text-orange-600">
                <Flame size={14} />
                {streak} day{streak === 1 ? "" : "s"} streak
              </span>
            )}

            {completion?.createdAt && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            disabled={loading || pinning}
            aria-label={`Actions for ${title}`}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-muted transition-all duration-200 hover:bg-surface-secondary hover:text-foreground disabled:opacity-50 btn-hover"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close actions menu"
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
              />

              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-lg">
                {onEdit && (
                  <button
                    type="button"
                    onClick={() => handleAction(onEdit, habit)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground-secondary hover:bg-surface-secondary transition-colors cursor-pointer"
                  >
                    <Pencil size={15} />
                    Edit habit
                  </button>
                )}

                {onViewHistory && (
                  <button
                    type="button"
                    onClick={() => handleAction(onViewHistory, habit)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground-secondary hover:bg-surface-secondary transition-colors cursor-pointer"
                  >
                    <CalendarDays size={15} />
                    View history
                  </button>
                )}

                {onTogglePin && (
                  <button
                    type="button"
                    onClick={() => handleAction(onTogglePin, habit)}
                    disabled={pinning}
                    aria-label={`${isPinned ? "Unpin" : "Pin"} ${title}`}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground-secondary hover:bg-surface-secondary transition-colors disabled:cursor-wait disabled:opacity-60 cursor-pointer"
                  >
                    {pinning ? (
                      <Spinner size={15} label={`${isPinned ? "Unpinning" : "Pinning"} habit`} />
                    ) : (
                      <Pin size={15} className={isPinned ? "rotate-45 text-amber-500" : ""} fill={isPinned ? "currentColor" : "none"} />
                    )}
                    {isPinned ? "Unpin habit" : "Pin habit"}
                  </button>
                )}

                {onArchive && (
                  <button
                    type="button"
                    onClick={() =>
                      handleAction(onArchive, habit, !isArchived)
                    }
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground-secondary hover:bg-surface-secondary transition-colors cursor-pointer"
                  >
                    <Archive size={15} />
                    {isArchived ? "Restore habit" : "Archive habit"}
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    onClick={() => handleAction(onDelete, habit)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={15} />
                    Delete habit
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default HabitCard;
