import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const TodosStats = ({ todos }) => {

  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = todos.filter((todo) => !todo.completed).length;
  const overdue = todos.filter((todo) => {
    if (!todo.dueDate) return false;

    const today = new Date();
    const due = new Date(todo.dueDate);

    return !todo.completed && due < today;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total */}
      <StatCard
        icon={<ClipboardList className="text-blue-500" size={20} />}
        bg="bg-blue-100"
        value={total}
        label="Total"
        subLabel="All todos"
      />

      {/* Completed */}
      <StatCard
        icon={<CheckCircle2 className="text-green-600" size={20} />}
        bg="bg-green-100"
        value={completed}
        label="Completed"
        subLabel="Done"
      />

      {/* Pending */}
      <StatCard
        icon={<Clock className="text-orange-500" size={20} />}
        bg="bg-orange-100"
        value={pending}
        label="Pending"
        subLabel="To be done"
      />

      {/* Overdue */}
      <StatCard
        icon={<AlertCircle className="text-red-500" size={20} />}
        bg="bg-red-100"
        value={overdue}
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
