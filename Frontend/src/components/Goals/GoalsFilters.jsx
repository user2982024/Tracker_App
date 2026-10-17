import {
  List,
  Clock,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";

const GoalsFilters = ({
  status,
  setStatus,
  sortBy,
  setSortBy,
}) => {

  const filters = [
    {
      label: "All",
      value: "all",
      icon: List,
    },
    {
      label: "Active",
      value: "active",
      icon: Clock,
    },
    {
      label: "Completed",
      value: "completed",
      icon: CheckCircle2,
    },
    {
      label: "Paused",
      value: "paused",
      icon: PauseCircle,
    },
  ];

  return (
    <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

      {/* Status Filters */}
      <div className="flex items-center gap-2 flex-wrap">

        {filters.map((filter) => {

          const Icon = filter.icon;

          return (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                status === filter.value
                  ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500 shadow-sm"
                  : "bg-surface text-foreground-muted border-border hover:bg-surface-secondary"
              }`}
            >

              <Icon size={16} />

              {filter.label}

            </button>
          );
        })}

      </div>

      {/* Sort Dropdown */}
      <div>

        <select 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-4 py-2 rounded-xl bg-input text-foreground border border-border text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">

          <option value="default">
            Sort by: Default
          </option>

          <option value="targetDate">
            Sort by: Target Date
          </option>

        </select>

      </div>

    </div>
  );
};

export default GoalsFilters;