import { List, Clock, CheckCircle2 } from "lucide-react";

const GoalsFilters = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* Tabs */}
      <div className="flex items-center gap-2">

        {/* All */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 text-sm font-medium">
          <List size={16} />
          All
        </button>

        {/* Active */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition">
          <Clock size={16} />
          Active
        </button>

        {/* Completed */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-sm font-medium transition">
          <CheckCircle2 size={16} />
          Completed
        </button>

      </div>

      {/* Sort Dropdown */}
      <div>
        <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="default">Sort by: Default</option>
          <option value="targetDate">Sort by: Target Date</option>
        </select>
      </div>

    </div>
  );
};

export default GoalsFilters;