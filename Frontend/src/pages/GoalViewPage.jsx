import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getGoal } from "../services/goalsServices";

const GoalViewPage = () => {

  // Get goal ID from route params
  const { id } = useParams();

  // Local state
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single goal
  const fetchGoal = async () => {
    try {
        setLoading(true);
        setError(null);

        // API call
        const data = await getGoal(id);

        // Save data
        setGoal(data);
    }
    catch (error) {
        setError(error.message || "Failed to fetch goal");
    }
    finally {
        setLoading(false);
    }
  };

  // Fetch goal on page load
  useEffect(() => {
    fetchGoal();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">
            Loading goal...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      </div>
    );
  }

  // Goal not found state
  if (!goal) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
          Goal not found
        </div>
      </div>
    );
  }

  // Progress percentage
  const progressPercentage = Math.min(
    Math.round((goal.currentValue / goal.targetValue) * 100),
    100
  );

  return (
    <div className="p-6">

      {/* Goal Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">

        {/* Goal Header */}
        <div className="space-y-2">

          <div className="flex items-center justify-between flex-wrap gap-3">

            {/* Goal Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {goal.title}
            </h1>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
                ${goal.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : goal.status === "paused"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {goal.status}
            </span>

          </div>

          {/* Description */}
          {goal.description && (
            <p className="text-gray-600 leading-relaxed">
              {goal.description}
            </p>
          )}

        </div>

        {/* Progress Section */}
        <div className="space-y-3">

          <div className="flex items-center justify-between text-sm">

            <p className="font-medium text-gray-700">
              Progress
            </p>

            <p className="text-gray-500">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </p>

          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>

          {/* Progress Percentage */}
          <p className="text-sm text-gray-500">
            {progressPercentage}% completed
          </p>

        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Category */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

            <p className="text-xs text-gray-500 mb-1">
              Category
            </p>

            <p className="text-sm font-medium text-gray-800">
              {goal.category || "Not specified"}
            </p>

          </div>

          {/* Priority */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

            <p className="text-xs text-gray-500 mb-1">
              Priority
            </p>

            <p className="text-sm font-medium text-gray-800 capitalize">
              {goal.priority || "Not specified"}
            </p>

          </div>

          {/* Start Date */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

            <p className="text-xs text-gray-500 mb-1">
              Start Date
            </p>

            <p className="text-sm font-medium text-gray-800">
              {goal.startDate
                ? new Date(goal.startDate).toLocaleDateString()
                : "Not specified"}
            </p>

          </div>

          {/* Target Date */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">

            <p className="text-xs text-gray-500 mb-1">
              Target Date
            </p>

            <p className="text-sm font-medium text-gray-800">
              {goal.targetDate
                ? new Date(goal.targetDate).toLocaleDateString()
                : "Not specified"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default GoalViewPage;