import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

const GoalsHeader = ({ search, setSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left Section */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Goals
        </h1>

        <p className="text-sm text-foreground-muted">
          Track your long-term progress and stay consistent
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search goals..."
            className="pl-10 pr-4 py-2 rounded-lg bg-input text-foreground border border-border placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm w-[220px]"
          />
        </div>

        {/* Add Goal Button */}
        <button
          type="button"
          onClick={() => navigate("/app/goals/create")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 transition text-sm"
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>
    </div>
  );
};

export default GoalsHeader;