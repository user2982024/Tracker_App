
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Spinner from "../UI/Spinner";
import { useAuth } from "../../context/AuthContextValue";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const HabitCalendar = ({
  history = [],
  onSelectDate,
  selectedDate = null,
  loading = false,
}) => {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    if (selectedDate) {
      const date = new Date(`${selectedDate}T12:00:00`);
      if (!Number.isNaN(date.getTime())) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
      }
    }

    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });
  const { user } = useAuth();
  const weekStartsOn = Number(user?.preferences?.weekStartsOn ?? 0);
  const weekdays = Array.from({ length: WEEKDAYS.length }, (_, index) =>
    WEEKDAYS[(weekStartsOn + index) % WEEKDAYS.length],
  );

  const todayKey = getDateKey(new Date());

  const completionByDate = useMemo(() => {
    const map = new Map();

    history.forEach((item) => {
      const rawDate = item.date || item.completedAt;
      if (!rawDate) return;

      const dateKey =
        typeof rawDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
          ? rawDate
          : getDateKey(new Date(rawDate));

      if (dateKey === "Invalid Date") return;

      map.set(dateKey, item);
    });

    return map;
  }, [history]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday =
      (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [visibleMonth, weekStartsOn]);

  const changeMonth = (amount) => {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + amount, 1)
    );
  };

  const monthLabel = visibleMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const selectedKey = selectedDate
    ? selectedDate.slice(0, 10)
    : null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Habit Calendar
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            Review your daily completion history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-lg border border-border p-2 text-foreground-muted hover:bg-surface-secondary"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="min-w-32 text-center text-sm font-medium text-foreground">
            {monthLabel}
          </span>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-lg border border-border p-2 text-foreground-muted hover:bg-surface-secondary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-foreground-muted"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} />;
          }

          const date = new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth(),
            day
          );
          const dateKey = getDateKey(date);
          const completion = completionByDate.get(dateKey);
          const isToday = dateKey === todayKey;
          const isSelected = dateKey === selectedKey;
          const isFuture = dateKey > todayKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={loading || isFuture}
              onClick={() => onSelectDate?.(dateKey, completion || null)}
              aria-label={`${dateKey}${completion ? ", completed" : ""}`}
              aria-pressed={isSelected}
              className={`relative flex min-h-11 flex-col items-center justify-center rounded-lg border text-sm transition
                ${
                  completion
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/25 dark:bg-green-500/10 dark:text-green-300"
                    : "border-transparent text-foreground-secondary hover:border-border hover:bg-surface-secondary"
                }
                ${isToday ? "ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-800" : ""}
                ${isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40" : ""}
                ${isFuture ? "cursor-not-allowed opacity-35" : ""}
                ${loading ? "cursor-wait opacity-60" : ""}
              `}
            >
              <span>{day}</span>
              {completion && (
                <CheckCircle2
                  size={12}
                  className="absolute bottom-0.5"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-green-600 dark:text-green-400" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <Circle size={14} />
          No recorded completion
        </span>
      </div>

      {loading && (
        <div className="mt-3 flex flex-col items-center gap-2 text-sm text-foreground-muted">
          <Spinner size={20} label="Loading history" />
          Loading history…
        </div>
      )}
    </section>
  );
};

export default HabitCalendar;
