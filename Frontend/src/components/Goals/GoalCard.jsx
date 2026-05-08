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
    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">

      {/* Top Section */}
      <div className="flex items-start justify-between gap-3">

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 wrap-break-word">
          {goal.title}
        </h3>

        {/* Status Badge */}
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${statusStyles[goal.status]}`}
        >
          {goal.status}
        </span>

      </div>

      {/* Progress Section */}
      <div>

        {/* Progress Info */}
        <div className="flex items-center justify-between text-sm mb-1">

          <p className="text-gray-500">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </p>

          <p className="font-medium text-gray-700">
            {goal.progressPercentage}%
          </p>

        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">

          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{
              width: `${goal.progressPercentage}%`,
            }}
          ></div>

        </div>

      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between text-xs">

        {/* Category */}
        <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-600 capitalize">
          {goal.category}
        </span>

        {/* Priority */}
        <span
          className={`px-2 py-1 rounded-md capitalize ${priorityStyles[goal.priority]}`}
        >
          {goal.priority}
        </span>

      </div>

    </div>
  );
};

export default GoalCard;