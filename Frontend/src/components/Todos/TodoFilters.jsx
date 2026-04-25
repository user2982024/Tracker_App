import {
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const TodosFilters = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: "all", label: "All", icon: <List size={16} /> },
    { key: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
    { key: "pending", label: "Pending", icon: <Clock size={16} /> },
    { key: "overdue", label: "Overdue", icon: <AlertCircle size={16} /> },
  ];

  return (
     <div className="bg-white border border-gray-300 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((filter) => (
          <FilterButton 
            key={filter.key}
            icon={filter.icon}
            label={filter.label}
            active={currentFilter === filter.key}
            onClick={() => onFilterChange(filter.key)}
          />
        ))}
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
