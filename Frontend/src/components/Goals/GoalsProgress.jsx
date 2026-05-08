const GoalsProgress = ({ stats }) => {

  // Prevent crashes before API loads
  if (!stats) return null;

  const totalGoals = stats.total || 0;
  const completedGoals = stats.completed || 0;

  const remainingGoals = totalGoals - completedGoals;

  // Completion percentage
  const progressPercentage =
    totalGoals > 0
      ? Math.round((completedGoals / totalGoals) * 100)
      : 0;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">

      {/* Title */}
      <p className="text-sm text-gray-500 mb-2">
        Overall Progress
      </p>

      {/* Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Left Section */}
        <div className="flex-1">

          {/* Summary */}
          <h2 className="text-lg font-semibold text-gray-800 mb-3">

            You've completed{" "}

            <span className="text-blue-600">
              {completedGoals} out of {totalGoals}
            </span>{" "}

            goals

          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">

            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            ></div>

          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8">

          {/* Completed */}
          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-green-500"></span>

            <div>
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="font-semibold text-gray-800">
                {completedGoals}
              </p>

              <p className="text-xs text-gray-400">
                {progressPercentage}%
              </p>
            </div>

          </div>

          {/* Remaining */}
          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-blue-500"></span>

            <div>
              <p className="text-sm text-gray-500">
                Remaining
              </p>

              <p className="font-semibold text-gray-800">
                {remainingGoals}
              </p>

              <p className="text-xs text-gray-400">
                {100 - progressPercentage}%
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default GoalsProgress;