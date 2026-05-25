import GoalCard from "./GoalCard";

const GoalsList = ({ goals, loading, onDelete }) => {
  
  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-sm text-gray-500">
          Loading goals...
        </p>
      </div>
    );
  }

  // Empty State
  if (!goals || goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">

        <h2 className="text-lg font-semibold text-gray-700">
          No goals found
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Start by creating your first goal 
        </p>

      </div>
    );
  }

  return (
    <div>

      {/* Goals Grid */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard goal={goal} onDelete={onDelete} key={goal._id} />
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
