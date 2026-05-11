import { useNavigate } from "react-router-dom";

import { Search, Plus, Trash2 } from "lucide-react";

const GoalsHeader = ({ search, setSearch }) => {

  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Goals</h1>
        <p className="text-sm text-gray-500">
          Track your long-term progress and stay consistent
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search goals..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-[220px]"
          />
        </div>

        {/* Delete Completed Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition text-sm">
          <Trash2 size={16} />
          Delete Completed
        </button>

        {/* Add Goal Button */}
        <button onClick={() => navigate("/app/goals/create")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm">
          <Plus size={16} />
          Add Goal
        </button>

      </div>
    </div>
  );
};

export default GoalsHeader;