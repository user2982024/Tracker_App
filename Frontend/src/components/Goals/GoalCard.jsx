const GoalCard = ({ goal }) => {

  // Dynamic status styles
  const statusStyles = {
    active: "bg-green-100 text-green-600",
    completed: "bg-blue-100 text-blue-600",
    paused: "bg-yellow-100 text-yellow-600",
  };

  // Dynamic priority styles
  const priorityStyles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-orange-100 text-orange-600",
    high: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-all duration-200">

      {/* Top Section */}
      <div className="space-y-2">

        {/* Title + Status */}
        <div className="flex items-start justify-between gap-3">

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-800 wrap-break-word">
            {goal.title}
          </h3>

          {/* Status Badge */}
          <span
            className={`text-xs px-2.5 py-1 rounded-full capitalize whitespace-nowrap font-medium ${statusStyles[goal.status]}`}
          >
            {goal.status}
          </span>

        </div>

        {/* Description */}
        {goal.description && (
          <p className="text-sm text-gray-500 leading-relaxed wrap-break-word line-clamp-2">
            {goal.description}
          </p>
        )}

      </div>

      {/* Progress Section */}
      <div>

        {/* Progress Info */}
        <div className="flex items-center justify-between text-sm mb-2">

          <p className="text-gray-500">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </p>

          <p className="font-semibold text-gray-700">
            {goal.progressPercentage}%
          </p>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">

          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{
              width: `${goal.progressPercentage}%`,
            }}
          ></div>

        </div>

      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between text-xs">

        {/* Category */}
        <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-600 capitalize font-medium">
          {goal.category}
        </span>

        {/* Priority */}
        <span
          className={`px-2.5 py-1 rounded-md capitalize font-medium ${priorityStyles[goal.priority]}`}
        >
          {goal.priority}
        </span>

      </div>

    </div>
  );
};

export default GoalCard;