import {
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const GoalsStats = ({ stats, goals }) => {

  // Prevent crash before API loads
  if (!stats) return null;

  const totalGoals = stats.total || 0;
  const completedGoals = stats.completed || 0;
  const activeGoals = stats.active || 0;

  // Average progress calculation
  let averageProgress = 0;

  if (goals.length > 0) {

    const totalProgress = goals.reduce((acc, goal) => {
      return acc + (goal.progressPercentage || 0);
    }, 0);

    averageProgress = Math.round(
      totalProgress / goals.length
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Goals */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">

        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <Target size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-gray-800">
            {totalGoals}
          </p>

          <p className="text-sm text-gray-500">
            Total Goals
          </p>

          <p className="text-xs text-gray-400">
            All goals
          </p>
        </div>

      </div>

      {/* Completed */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">

        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-gray-800">
            {completedGoals}
          </p>

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="text-xs text-gray-400">
            Great progress!
          </p>
        </div>

      </div>

      {/* Active */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">

        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
          <Clock size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-gray-800">
            {activeGoals}
          </p>

          <p className="text-sm text-gray-500">
            Active
          </p>

          <p className="text-xs text-gray-400">
            Keep going!
          </p>
        </div>

      </div>

      {/* Average Progress */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">

        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <TrendingUp size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-gray-800">
            {averageProgress}%
          </p>

          <p className="text-sm text-gray-500">
            Avg Progress
          </p>

          <p className="text-xs text-gray-400">
            Across all goals
          </p>
        </div>

      </div>

    </div>
  );
};

export default GoalsStats;