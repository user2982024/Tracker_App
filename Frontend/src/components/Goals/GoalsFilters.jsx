import {
  List,
  Clock,
  CheckCircle2,
  PauseCircle,
} from "lucide-react";

const GoalsFilters = ({
  status,
  setStatus,
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
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

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
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
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

        <select className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">

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