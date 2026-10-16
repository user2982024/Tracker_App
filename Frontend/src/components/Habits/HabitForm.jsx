import { useEffect, useState } from "react";
import { Loader2, Pin, X } from "lucide-react";

const WEEKDAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const CATEGORIES = [
  { value: "health", label: "Health" },
  { value: "career", label: "Career" },
  { value: "learning", label: "Learning" },
  { value: "finance", label: "Finance" },
  { value: "personal", label: "Personal" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "personal",
  priority: "medium",
  frequency: "daily",
  daysOfWeek: [],
  targetValue: "",
  unit: "",
  isPinned: false,
};

const HabitForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialData?._id);

  useEffect(() => {
    if (!initialData) {
      setForm(INITIAL_FORM);
      setErrors({});
      return;
    }

    setForm({
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      category: initialData.category ?? "personal",
      priority: initialData.priority ?? "medium",
      frequency: initialData.frequency ?? "daily",
      daysOfWeek: Array.isArray(initialData.daysOfWeek)
        ? initialData.daysOfWeek
        : [],
      targetValue:
        initialData.targetValue === undefined ||
        initialData.targetValue === null
          ? ""
          : String(initialData.targetValue),
      unit: initialData.unit ?? "",
      isPinned: Boolean(initialData.isPinned),
    });

    setErrors({});
  }, [initialData]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));

    setErrors((previous) => {
      if (!previous[field] && field !== "daysOfWeek") {
        return previous;
      }

      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const toggleDay = (dayValue) => {
    setForm((previous) => {
      const selected = previous.daysOfWeek.includes(dayValue);

      return {
        ...previous,
        daysOfWeek: selected
          ? previous.daysOfWeek.filter((day) => day !== dayValue)
          : [...previous.daysOfWeek, dayValue].sort(
              (a, b) =>
                WEEKDAYS.findIndex((day) => day.value === a) -
                WEEKDAYS.findIndex((day) => day.value === b),
            ),
      };
    });

    setErrors((previous) => {
      const next = { ...previous };
      delete next.daysOfWeek;
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const title = form.title.trim();
    const description = form.description.trim();
    const unit = form.unit.trim();

    if (!title) {
      nextErrors.title = "Habit title is required.";
    } else if (title.length < 3) {
      nextErrors.title = "Title must contain at least 3 characters.";
    } else if (title.length > 200) {
      nextErrors.title = "Title cannot exceed 200 characters.";
    }

    if (description.length > 1000) {
      nextErrors.description = "Description cannot exceed 1000 characters.";
    }

    if (!CATEGORIES.some((item) => item.value === form.category)) {
      nextErrors.category = "Please select a valid category.";
    }

    if (!PRIORITIES.some((item) => item.value === form.priority)) {
      nextErrors.priority = "Please select a valid priority.";
    }

    if (!["daily", "specific_days"].includes(form.frequency)) {
      nextErrors.frequency = "Please select a valid frequency.";
    }

    if (form.frequency === "specific_days" && form.daysOfWeek.length === 0) {
      nextErrors.daysOfWeek = "Select at least one day.";
    }

    if (
      form.daysOfWeek.some(
        (day) => !WEEKDAYS.some((item) => item.value === day),
      )
    ) {
      nextErrors.daysOfWeek = "One or more selected days are invalid.";
    }

    if (form.targetValue !== "") {
      const target = Number(form.targetValue);

      if (!Number.isFinite(target) || target <= 0) {
        nextErrors.targetValue = "Target must be greater than zero.";
      }
    }

    if (unit.length > 50) {
      nextErrors.unit = "Unit cannot exceed 50 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || !validateForm()) {
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      frequency: form.frequency,
      daysOfWeek: form.frequency === "specific_days" ? form.daysOfWeek : [],
      unit: form.unit.trim(),
      isPinned: form.isPinned,
    };

    if (form.targetValue !== "") {
      payload.targetValue = Number(form.targetValue);
    } else {
      payload.targetValue = null;
    }

    if (typeof onSubmit === "function") {
      await onSubmit(payload);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
      errors[field] ? "border-rose-400" : "border-gray-200"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? "Edit Habit" : "Create a Habit"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? "Update your habit details and schedule."
              : "Build a routine by setting up a habit."}
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="habit-title"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Habit title <span className="text-rose-500">*</span>
        </label>
        <input
          id="habit-title"
          type="text"
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="e.g. Read for 30 minutes"
          maxLength={200}
          required
          disabled={loading}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "habit-title-error" : undefined}
          className={inputClass("title")}
        />
        {errors.title && (
          <p id="habit-title-error" className="mt-1 text-xs text-rose-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="habit-description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Why is this habit important to you?"
          rows={3}
          maxLength={1000}
          disabled={loading}
          aria-invalid={Boolean(errors.description)}
          className={inputClass("description")}
        />
        <div className="mt-1 flex justify-between gap-3">
          {errors.description ? (
            <p className="text-xs text-rose-600">{errors.description}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400">
            {form.description.length}/1000
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="habit-category"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="habit-category"
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            disabled={loading}
            className={inputClass("category")}
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="habit-priority"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="habit-priority"
            value={form.priority}
            onChange={(event) => updateField("priority", event.target.value)}
            disabled={loading}
            className={inputClass("priority")}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
          {errors.priority && (
            <p className="mt-1 text-xs text-rose-600">{errors.priority}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="habit-frequency"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          value={form.frequency}
          onChange={(event) => updateField("frequency", event.target.value)}
          disabled={loading}
          className={inputClass("frequency")}
        >
          <option value="daily">Every day</option>
          <option value="specific_days">Selected weekdays</option>
        </select>

        {form.frequency === "specific_days" && (
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-medium text-gray-700">
              Repeat on
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WEEKDAYS.map((day) => {
                const selected = form.daysOfWeek.includes(day.value);

                return (
                  <label
                    key={day.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                      selected
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleDay(day.value)}
                      disabled={loading}
                      className="accent-blue-600"
                    />
                    {day.label}
                  </label>
                );
              })}
            </div>
            {errors.daysOfWeek && (
              <p className="mt-2 text-xs text-rose-600">{errors.daysOfWeek}</p>
            )}
          </fieldset>
        )}
        {errors.frequency && (
          <p className="mt-1 text-xs text-rose-600">{errors.frequency}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="habit-target"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Optional target
          </label>
          <input
            id="habit-target"
            type="number"
            min="0.01"
            step="any"
            value={form.targetValue}
            onChange={(event) => updateField("targetValue", event.target.value)}
            placeholder="e.g. 30"
            disabled={loading}
            aria-invalid={Boolean(errors.targetValue)}
            className={inputClass("targetValue")}
          />
          {errors.targetValue && (
            <p className="mt-1 text-xs text-rose-600">{errors.targetValue}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="habit-unit"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Unit
          </label>
          <input
            id="habit-unit"
            type="text"
            value={form.unit}
            onChange={(event) => updateField("unit", event.target.value)}
            placeholder="e.g. minutes, pages, glasses"
            maxLength={50}
            disabled={loading}
            aria-invalid={Boolean(errors.unit)}
            className={inputClass("unit")}
          />
          {errors.unit && (
            <p className="mt-1 text-xs text-rose-600">{errors.unit}</p>
          )}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">
        <input
          type="checkbox"
          checked={form.isPinned}
          onChange={(event) => updateField("isPinned", event.target.checked)}
          disabled={loading}
          className="h-4 w-4 accent-blue-600"
        />
        <span className="flex-1">
          <span className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Pin size={15} />
            Pin this habit
          </span>
          <span className="mt-1 block text-xs text-gray-500">
            Keep important habits easy to find.
          </span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Habit"}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
