
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
} from "lucide-react";

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
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [visibleMonth]);

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
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Habit Calendar
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Review your daily completion history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft size={18} />
          </button>

          <span className="min-w-32 text-center text-sm font-medium text-gray-800 dark:text-gray-200">
            {monthLabel}
          </span>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
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
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-gray-50 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-700"
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

      <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-green-600" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <Circle size={14} />
          No recorded completion
        </span>
      </div>

      {loading && (
        <p className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          Loading history…
        </p>
      )}
    </section>
  );
};

export default HabitCalendar;
