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
    medium: "bg-yellow-100 text-yellow-700",
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

  // Navigate to goal details page
  const handleFocus = () => {
    navigate(`/app/goals/${goal._id}`);
  }

  return (
    <div
      className="
        group relative bg-white p-5 rounded-3xl
        border border-gray-100 shadow-sm
        hover:shadow-xl hover:border-gray-200
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
      <div className="space-y-4 pt-1">
        {/* Metadata Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category */}
          <span
            className="
        px-3 py-1 rounded-full
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
        px-3 py-1 rounded-full
        text-[11px] font-semibold capitalize
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
          px-3 py-1 rounded-full
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

        {/* Action Row */}
        <div className="flex justify-end items-center gap-1">
          {/* Focus */}
          <button
          onClick={handleFocus}
            className="
        w-7 h-7 rounded-lg
        flex items-center justify-center
       text-gray-400 hover:cursor-pointer hover:scale-110 hover:text-purple-500
      "
          >
            <Eye size={15} />
          </button>

          {/* Edit */}
          <button
            onClick={handleEdit}
            className="
        w-7 h-7 rounded-lg
        flex items-center justify-center text-gray-400
        hover:cursor-pointer
        hover:text-blue-600
        hover:scale-110
      "
          >
            <Pencil size={15} />
          </button>

          {/* Delete */}
          <button
            className="
        w-7 h-7 rounded-lg
        flex items-center justify-center
       text-gray-400
        hover:cursor-pointer
        hover:text-red-600
        hover:scale-110
      "
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
