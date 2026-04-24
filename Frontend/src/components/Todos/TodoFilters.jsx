import {
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const TodosFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterButton
          active={activeFilter === "all"}
          icon={<List size={16} />}
          label="All"
          onClick={() => onFilterChange("all")}
        />

        <FilterButton
          active={activeFilter === "completed"}
          icon={<CheckCircle2 size={16} />}
          label="Completed"
          onClick={() => onFilterChange("completed")}
        />
        <FilterButton
          active={activeFilter === "pending"}
          icon={<Clock size={16} />}
          label="Pending"
          onClick={() => onFilterChange("pending")}
        />

        <FilterButton
          active={activeFilter === "overdue"}
          icon={<AlertCircle size={16} />}
          label="Overdue"
          onClick={() => onFilterChange("overdue")}
        />
      </div>
    </div>
  );
};

// Reusable Filter Button
const FilterButton = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
        ${
          active
            ? "bg-blue-100 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TodosFilters;
