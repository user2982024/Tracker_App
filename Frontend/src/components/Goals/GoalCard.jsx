import { CalendarDays, Flag, Pencil, Eye, Trash2 } from "lucide-react";

import { useNavigate } from "react-router-dom";

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();

  // Dynamic status styles
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
  };

  // Dynamic priority styles
  const priorityStyles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-orange-100 text-orange-700",
    high: "bg-red-100 text-red-700",
  };

  // Format target date
  const formattedTargetDate = goal.targetDate
    ? new Date(goal.targetDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // Navigate to edit page
  const handleEdit = () => {
    navigate(`/app/goals/edit/${goal._id}`);
  };

  return (
    <div
      className="
        group relative bg-white p-5 rounded-3xl
        border border-gray-100 shadow-sm
        hover:shadow-xl hover:border-gray-200
        hover:-translate-y-1
        transition-all duration-300
        space-y-5
      "
    >
      {/* Top Section */}
      <div className="space-y-3">
        {/* Title + Status */}
        <div className="flex items-start justify-between gap-3 pr-10">
          {/* Title */}
          <h3 className="text-[15px] font-semibold text-gray-800 leading-6 wrap-break-word">
            {goal.title}
          </h3>

          {/* Status Badge */}
          <span
            className={`
              text-[11px] px-2.5 py-1 rounded-full
              capitalize whitespace-nowrap
              font-semibold tracking-wide
              ${statusStyles[goal.status]}
            `}
          >
            {goal.status}
          </span>
        </div>

        {/* Description */}
        {goal.description && (
          <p
            className="
              text-sm text-gray-500
              leading-6 wrap-break-word
              line-clamp-2
            "
          >
            {goal.description}
          </p>
        )}
      </div>

      {/* Progress Section */}
      <div className="space-y-2.5">
        {/* Progress Info */}
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500 font-medium">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </p>

          <p className="font-semibold text-gray-700">
            {goal.progressPercentage}%
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="
              h-full rounded-full bg-blue-600
              transition-all duration-500
            "
            style={{
              width: `${goal.progressPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-4 pt-1">
        {/* Left Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category */}
          <span
            className="
        px-2.5 py-1 rounded-xl
        bg-purple-50 text-purple-700
        text-[11px] font-semibold capitalize
        border border-purple-100
      "
          >
            {goal.category}
          </span>

          {/* Priority */}
          <div
            className={`
        flex items-center gap-1
        px-2.5 py-1 rounded-xl
        text-[11px] font-semibold capitalize
        border
        ${priorityStyles[goal.priority]}
      `}
          >
            <Flag size={10} />

            <span>{goal.priority}</span>
          </div>

          {/* Target Date */}
          {formattedTargetDate && (
            <div
              className="
          flex items-center gap-1
          px-2.5 py-1 rounded-xl
          bg-gray-50 text-gray-600
          text-[11px] font-medium
          border border-gray-100
        "
            >
              <CalendarDays size={10} />

              <span>{formattedTargetDate}</span>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Focus Mode */}
          <button
            className="
        w-8 h-8 rounded-xl
        flex items-center justify-center
        bg-gray-50 text-gray-500
        border border-gray-100
        hover:bg-indigo-50
        hover:text-indigo-600
        hover:border-indigo-100
        transition-all duration-200
      "
          >
            <Eye size={14} />
          </button>

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="
        w-8 h-8 rounded-xl
        flex items-center justify-center
        bg-gray-50 text-gray-500
        border border-gray-100
        hover:bg-blue-50
        hover:text-blue-600
        hover:border-blue-100
        transition-all duration-200
      "
          >
            <Pencil size={14} />
          </button>

          {/* Delete */}
          <button
            className="
        w-8 h-8 rounded-xl
        flex items-center justify-center
        bg-gray-50 text-gray-500
        border border-gray-100
        hover:bg-red-50
        hover:text-red-600
        hover:border-red-100
        transition-all duration-200
      "
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
