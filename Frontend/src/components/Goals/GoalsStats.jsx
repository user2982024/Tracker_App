import { Target, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const GoalsStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Goals */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
          <Target size={20} />
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">10</p>
          <p className="text-sm text-gray-500">Total Goals</p>
          <p className="text-xs text-gray-400">All goals</p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">4</p>
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-xs text-gray-400">This is amazing!</p>
        </div>
      </div>

      {/* Active */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
        <div className="p-3 rounded-full bg-orange-100 text-orange-600">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">6</p>
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-xs text-gray-400">Keep going!</p>
        </div>
      </div>

      {/* Avg Progress */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
          <TrendingUp size={20} />
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">62%</p>
          <p className="text-sm text-gray-500">Avg Progress</p>
          <p className="text-xs text-gray-400">Across all goals</p>
        </div>
      </div>

    </div>
  );
};

export default GoalsStats;