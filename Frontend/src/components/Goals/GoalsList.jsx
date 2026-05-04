import GoalCard from "./GoalCard";

const GoalsList = () => {
  // Static dummy data (for now)
  const goals = [1, 2, 3, 4, 5, 6];

  return (
    <div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard key={goal} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium text-gray-700">
            No goals found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Start by creating your first goal 
          </p>
        </div>
      )}

    </div>
  );
};

export default GoalsList;