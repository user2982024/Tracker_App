import {
  Target,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

const GoalsStats = ({ stats }) => {

  // Prevent crash before API loads
  if (!stats) return null;

  const totalGoals = stats.total || 0;
  const completedGoals = stats.completed || 0;
  const activeGoals = stats.active || 0;

  const averageProgress = Number.isFinite(Number(stats.averageProgress))
    ? Number(stats.averageProgress)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Total Goals */}
      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">

        <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
          <Target size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-foreground">
            {totalGoals}
          </p>

          <p className="text-sm text-foreground-muted">
            Total Goals
          </p>

          <p className="text-xs text-foreground-muted">
            All goals
          </p>
        </div>

      </div>

      {/* Completed */}
      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">

        <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-300">
          <CheckCircle2 size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-foreground">
            {completedGoals}
          </p>

          <p className="text-sm text-foreground-muted">
            Completed
          </p>

          <p className="text-xs text-foreground-muted">
            Great progress!
          </p>
        </div>

      </div>

      {/* Active */}
      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">

        <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300">
          <Clock size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-foreground">
            {activeGoals}
          </p>

          <p className="text-sm text-foreground-muted">
            Active
          </p>

          <p className="text-xs text-foreground-muted">
            Keep going!
          </p>
        </div>

      </div>

      {/* Average Progress */}
      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">

        <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300">
          <TrendingUp size={20} />
        </div>

        <div>
          <p className="text-xl font-semibold text-foreground">
            {averageProgress}%
          </p>

          <p className="text-sm text-foreground-muted">
            Avg Progress
          </p>

          <p className="text-xs text-foreground-muted">
            Across all goals
          </p>
        </div>

      </div>

    </div>
  );
};

export default GoalsStats;
