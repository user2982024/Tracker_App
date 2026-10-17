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
    <div className="bg-surface p-5 shadow-sm border border-border rounded-2xl">

      {/* Title */}
      <p className="text-sm text-foreground-muted mb-2">
        Overall Progress
      </p>

      {/* Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Left Section */}
        <div className="flex-1">

          {/* Summary */}
          <h2 className="text-lg font-semibold text-foreground mb-3">

            You've completed{" "}

            <span className="text-blue-600 dark:text-blue-400">
              {completedGoals} out of {totalGoals}
            </span>{" "}

            goals

          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-border h-2 rounded-full overflow-hidden">

            <div
              className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-300"
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
              <p className="text-sm text-foreground-muted">
                Completed
              </p>

              <p className="font-semibold text-foreground">
                {completedGoals}
              </p>

              <p className="text-xs text-foreground-muted">
                {progressPercentage}%
              </p>
            </div>

          </div>

          {/* Remaining */}
          <div className="flex items-center gap-2">

            <span className="w-2 h-2 rounded-full bg-blue-500"></span>

            <div>
              <p className="text-sm text-foreground-muted">
                Remaining
              </p>

              <p className="font-semibold text-foreground">
                {remainingGoals}
              </p>

              <p className="text-xs text-foreground-muted">
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