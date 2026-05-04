const GoalCard = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4">

      {/* Top Section */}
      <div className="flex items-start justify-between">

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800">
          Solve 100 DSA Problems
        </h3>

        {/* Status Badge */}
        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
          Active
        </span>

      </div>

      {/* Progress Section */}
      <div>

        {/* Progress Info */}
        <div className="flex items-center justify-between text-sm mb-1">
          <p className="text-gray-500">40 / 100 problems</p>
          <p className="font-medium text-gray-700">40%</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full"
            style={{ width: "40%" }}
          ></div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between text-xs">

        {/* Category */}
        <span className="px-2 py-1 rounded-md bg-purple-100 text-purple-600">
          Learning
        </span>

        {/* Priority */}
        <span className="px-2 py-1 rounded-md bg-red-100 text-red-600">
          High
        </span>

      </div>

    </div>
  );
};

export default GoalCard;