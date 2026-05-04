const GoalsProgress = () => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">

      {/* Title */}
      <p className="text-sm text-gray-500 mb-2">Overall Progress</p>

      {/* Content */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        {/* Left Section */}
        <div className="flex-1">

          {/* Summary Text */}
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            You've completed <span className="text-blue-600">4 out of 10</span> goals
          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full"
              style={{ width: "40%" }}
            ></div>
          </div>

        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8">

          {/* Completed */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="font-semibold text-gray-800">4</p>
              <p className="text-xs text-gray-400">40%</p>
            </div>
          </div>

          {/* Remaining */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <div>
              <p className="text-sm text-gray-500">Remaining</p>
              <p className="font-semibold text-gray-800">6</p>
              <p className="text-xs text-gray-400">60%</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GoalsProgress;