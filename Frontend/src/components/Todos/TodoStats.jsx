import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const TodosStats = ({ stats }) => {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <StatCard
        icon={<ClipboardList className="text-blue-500 dark:text-blue-300" size={20} />}
        bg="bg-blue-100 dark:bg-blue-500/15"
        value={stats?.total || 0}
        label="Total"
        subLabel="All todos"
      />

      {/* Completed */}
      <StatCard
        icon={<CheckCircle2 className="text-green-600 dark:text-green-300" size={20} />}
        bg="bg-green-100 dark:bg-green-500/15"
        value={stats?.completed || 0}
        label="Completed"
        subLabel="Done"
      />

      {/* Pending */}
      <StatCard
        icon={<Clock className="text-orange-500 dark:text-orange-300" size={20} />}
        bg="bg-orange-100 dark:bg-orange-500/15"
        value={stats?.pending || 0}
        label="Pending"
        subLabel="To be done"
      />

      {/* Overdue */}
      <StatCard
        icon={<AlertCircle className="text-red-500 dark:text-red-300" size={20} />}
        bg="bg-red-100 dark:bg-red-500/15"
        value={stats?.overdue || 0}
        label="Overdue"
        subLabel="Take action"
      />
    </div>
  );
};

//  Reusable Stat Card
const StatCard = ({ icon, bg, value, label, subLabel }) => {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4">
      {/* Icon */}
      <div className={`p-3 rounded-full ${bg}`}>{icon}</div>

      {/* Text */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">{value}</h2>
        <p className="text-sm font-medium text-foreground-muted">{label}</p>
        <p className="text-xs text-foreground-muted">{subLabel}</p>
      </div>
    </div>
  );
};

export default TodosStats;
