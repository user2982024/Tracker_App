import { CalendarDays, Flag } from "lucide-react";

const GoalCard = ({ goal }) => {

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

  return (
    <div className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-5">

      {/* Top Section */}
      <div className="space-y-3">

        {/* Title + Status */}
        <div className="flex items-start justify-between gap-3">

          {/* Title */}
          <h3 className="text-[15px] font-semibold text-gray-800 leading-6 break-words">
            {goal.title}
          </h3>

          {/* Status Badge */}
          <span
            className={`text-[11px] px-2.5 py-1 rounded-full capitalize whitespace-nowrap font-semibold tracking-wide ${statusStyles[goal.status]}`}
          >
            {goal.status}
          </span>

        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-gray-500 leading-6 break-words line-clamp-2">
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
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${goal.progressPercentage}%`,
            }}
          />

        </div>

      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between gap-3 flex-wrap">

        {/* Left Metadata */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Category */}
          <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold capitalize">
            {goal.category}
          </span>

          {/* Priority */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${priorityStyles[goal.priority]}`}
          >

            <Flag size={12} />

            <span>
              {goal.priority}
            </span>

          </div>

        </div>

        {/* Target Date */}
        {formattedTargetDate && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">

            <CalendarDays size={14} />

            <span>
              {formattedTargetDate}
            </span>

          </div>
        )}

      </div>

    </div>
  );
};

export default GoalCard;