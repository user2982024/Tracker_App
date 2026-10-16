
export const getLocalDateKey = (date = new Date()) => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const normalizeHabitHistory = (history) => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const rawDate = item.date || item.completedAt;

      if (!rawDate) {
        return null;
      }

      // Preserve date-only strings to avoid shifting the calendar day
      // because of timezone conversion.
      const date =
        typeof rawDate === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
          ? rawDate
          : getLocalDateKey(rawDate);

      if (!date) {
        return null;
      }

      return {
        ...item,
        date,
      };
    })
    .filter(Boolean);
};

export const getHabitCompletionForDate = (history, date) => {
  const dateKey = getLocalDateKey(date);

  if (!dateKey || !Array.isArray(history)) {
    return null;
  }

  return (
    history.find((item) => {
      const itemDate =
        typeof item?.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date)
          ? item.date
          : getLocalDateKey(item?.date || item?.completedAt);

      return itemDate === dateKey;
    }) || null
  );
};

export const getHabitCompletionPercentage = (completed, scheduled) => {
  if (!Number.isFinite(completed) || !Number.isFinite(scheduled)) {
    return 0;
  }

  if (scheduled <= 0) {
    return 0;
  }

  return Math.round((completed / scheduled) * 100);
};
