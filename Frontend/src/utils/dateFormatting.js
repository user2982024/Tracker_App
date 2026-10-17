export const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";

const parseDate = (value) => {
  if (!value) return null;
  const dateOnly = typeof value === "string" && (
    /^\d{4}-\d{2}-\d{2}$/.test(value)
    || /^\d{4}-\d{2}-\d{2}T00:00:00(?:\.000)?Z$/.test(value)
  );
  const date = new Date(dateOnly ? `${value.slice(0, 10)}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value, format = DEFAULT_DATE_FORMAT) => {
  const date = parseDate(value);
  if (!date) return "—";
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  if (format === "DD/MM/YYYY") return `${day}/${month}/${year}`;
  if (format === "YYYY-MM-DD") return `${year}-${month}-${day}`;
  return `${month}/${day}/${year}`;
};

export const formatDateTime = (value, format = DEFAULT_DATE_FORMAT) => {
  const date = parseDate(value);
  if (!date) return null;
  return `${formatDate(date, format)}, ${new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)}`;
};
