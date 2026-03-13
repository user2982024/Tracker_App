const GoalCard = ({
  title,
  category,
  progress,
  priority,
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow space-y-3">

      <div className="flex items-center gap-3">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Icon size={18} />
        </div>

        <h3 className="font-semibold">
          {title}
        </h3>
      </div>

      <p className="text-sm text-gray-500">
        Category: {category}
      </p>

      {/* Progress */}
      <div>

        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-gray-200 h-2 rounded-full">

          <div
            className="bg-purple-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
        {priority}
      </span>

    </div>
  );
};

export default GoalCard;