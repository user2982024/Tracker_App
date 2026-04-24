import {
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const TodosFilters = () => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterButton
          icon={<List size={16} />}
          label="All"
        />

        <FilterButton
          icon={<CheckCircle2 size={16} />}
          label="Completed"
        />
        <FilterButton
          icon={<Clock size={16} />}
          label="Pending"
        />

        <FilterButton
          icon={<AlertCircle size={16} />}
          label="Overdue"
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
