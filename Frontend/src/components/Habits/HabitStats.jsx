
import {
  Activity,
  CheckCircle2,
  CircleCheckBig,
  ListChecks,
  TrendingUp,
} from "lucide-react";

const HabitStats = ({ stats = {} }) => {
  const totalActiveHabits = Number(stats.totalActiveHabits ?? 0);
  const scheduledToday = Number(stats.scheduledToday ?? 0);
  const completedToday = Number(stats.completedToday ?? 0);

  const completionPercentage =
    stats.completionPercentage !== undefined &&
    stats.completionPercentage !== null
      ? Math.min(
          100,
          Math.max(0, Number(stats.completionPercentage) || 0),
        )
      : scheduledToday > 0
        ? Math.min(
            100,
            Math.max(0, (completedToday / scheduledToday) * 100),
          )
        : 0;

  const remainingToday = Math.max(
    0,
    Number(stats.remainingToday ?? scheduledToday - completedToday),
  );

  const cards = [
    {
      label: "Active Habits",
      value: totalActiveHabits,
      description: "Your current routines",
      icon: ListChecks,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Scheduled Today",
      value: scheduledToday,
      description: "Habits planned for today",
      icon: Activity,
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      label: "Completed Today",
      value: completedToday,
      description:
        remainingToday === 0 && scheduledToday > 0
          ? "All scheduled habits completed"
          : `${remainingToday} remaining today`,
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Today's Progress",
      value: `${Math.round(completionPercentage)}%`,
      description: `${completedToday} of ${scheduledToday} completed`,
      icon: TrendingUp,
      iconStyle: "bg-amber-50 text-amber-600",
      progress: completionPercentage,
    },
  ];

  return (
    <section
      aria-label="Habit statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${card.iconStyle}`}
              >
                <Icon size={21} />
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {card.description}
            </p>

            {card.progress !== undefined && (
              <div className="mt-4">
                <div
                  className="h-2 overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-label="Today's habit completion"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(card.progress)}
                >
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
};

export default HabitStats;
