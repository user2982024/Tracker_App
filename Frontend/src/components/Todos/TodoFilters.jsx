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
    <div className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <FilterButton active icon={<List size={16} />} label="All" />

        <FilterButton icon={<Clock size={16} />} label="Pending" />

        <FilterButton icon={<CheckCircle2 size={16} />} label="Completed" />

        <FilterButton icon={<AlertCircle size={16} />} label="Overdue" />
      </div>

      {/* Right: Search + Filter Icon */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Filter Button */}
        <button className="p-2 border rounded-lg hover:bg-gray-100 transition">
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

// Reusable Filter Button
const FilterButton = ({ icon, label, active }) => {
  return (
    <button
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
