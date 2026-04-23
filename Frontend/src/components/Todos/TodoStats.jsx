import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const TodosStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <StatCard
        icon={<ClipboardList className="text-blue-500" size={20} />}
        bg="bg-blue-100"
        value="12"
        label="Total"
        subLabel="All todos"
      />

      {/* Completed */}
      <StatCard
        icon={<CheckCircle2 className="text-green-600" size={20} />}
        bg="bg-green-100"
        value="6"
        label="Completed"
        subLabel="Done"
      />

      {/* Pending */}
      <StatCard
        icon={<Clock className="text-orange-500" size={20} />}
        bg="bg-orange-100"
        value="2"
        label="Pending"
        subLabel="To be done"
      />

      {/* Overdue */}
      <StatCard
        icon={<AlertCircle className="text-red-500" size={20} />}
        bg="bg-red-100"
        value="4"
        label="Overdue"
        subLabel="Take action"
      />
    </div>
  );
};

//  Reusable Stat Card
const StatCard = ({ icon, bg, value, label, subLabel }) => {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center gap-4">
      {/* Icon */}
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>

      {/* Text */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{value}</h2>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">{subLabel}</p>
      </div>
    </div>
  );
};

export default TodosStats;
