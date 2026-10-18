import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  GripVertical,
  ListTodo,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  FileText,
  Calendar,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContextValue";
import useDateFormat from "../hooks/useDateFormat";
import { formatDate } from "../utils/dateFormatting";
import Spinner from "../components/UI/Spinner";

import {
  getAllTodos,
  toggleTodoCompletion,
} from "../services/todoServices";
import {
  getHabits,
  completeHabit,
  undoHabitCompletion,
} from "../services/habitServices";
import { getGoals } from "../services/goalsServices";
import { getNotes } from "../services/notesService";

const STORAGE_LAYOUT_KEY = "taskflow_dashboard_layout_v1";
const DEFAULT_WIDGET_ORDER = ["todos", "habits", "goals", "notes"];
const isValidWidgetOrder = (value) =>
  Array.isArray(value) &&
  value.length === DEFAULT_WIDGET_ORDER.length &&
  new Set(value).size === DEFAULT_WIDGET_ORDER.length &&
  DEFAULT_WIDGET_ORDER.every((widgetId) => value.includes(widgetId));

const getDateKey = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const getLocalTodayKey = () => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const getDashboardFailure = (result, section) => {
  if (result.status === "rejected") {
    return `${section}: ${result.reason?.message || "request failed"}`;
  }
  return `${section}: the server returned an unexpected response`;
};

const isRetryableDashboardFailure = (result) => {
  if (result.status !== "rejected") return false;
  const error = result.reason;
  const message = error?.message || "";
  const status = Number(error?.status) || 0;
  const isAuthFailure = /unauthorized|invalid or expired token|forbidden/i.test(message);
  const isPermanentClientFailure = status >= 400 && status < 500 && status !== 429;
  return !isAuthFailure && !isPermanentClientFailure;
};

const getAverageGoalProgress = (goals = []) => {
  if (!goals.length) return 0;
  const total = goals.reduce((sum, goal) => {
    const target = Number(goal.targetValue) || 0;
    if (target <= 0) return sum;
    return sum + Math.max(0, Math.min(100, (Number(goal.currentValue) / target) * 100));
  }, 0);
  return Math.round(total / goals.length);
};

const readDashboardSection = async (request) => {
  const retryDelayMs = [300, 900];
  let lastError;

  for (let attempt = 0; attempt <= retryDelayMs.length; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      const message = error?.message || "";
      const status = Number(error?.status) || 0;
      const isAuthFailure = /unauthorized|invalid or expired token|forbidden/i.test(message);
      const isClientFailure = status >= 400 && status < 500 && status !== 429;

      if (attempt === retryDelayMs.length || isAuthFailure || isClientFailure) {
        throw error;
      }

      // Recover in place from transient proxy, database, and server errors.
      // The delay grows slightly to give the backend time to reconnect.
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs[attempt]));
    }
  }

  throw lastError;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { user } = useAuth();
  const dateFormat = useDateFormat();

  const [loading, setLoading] = useState(true);
  const [todosData, setTodosData] = useState({ todos: [], stats: {} });
  const [habitsData, setHabitsData] = useState({ habits: [], stats: {} });
  const [goalsData, setGoalsData] = useState({ goals: [], stats: {} });
  const [notesData, setNotesData] = useState({ notes: [], total: 0 });
  const [loadWarnings, setLoadWarnings] = useState([]);
  const [retryDashboardInBackground, setRetryDashboardInBackground] = useState(false);

  // Today's habit completions map { habitId: completionDoc }
  const [habitCompletions, setHabitCompletions] = useState({});
  const [togglingHabitId, setTogglingHabitId] = useState(null);
  const [togglingTodoId, setTogglingTodoId] = useState(null);
  const habitCompletionRevision = useRef(0);
  const initialDashboardFetchStarted = useRef(false);
  const dashboardFetchInProgress = useRef(false);

  // Widget ordering and drag-and-drop state
  const [widgetOrder, setWidgetOrder] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LAYOUT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidWidgetOrder(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_WIDGET_ORDER;
  });

  const [draggedWidget, setDraggedWidget] = useState(null);
  const [dragOverWidget, setDragOverWidget] = useState(null);
  const activeGoalCount =
    goalsData.stats?.activeGoals ?? goalsData.stats?.active ?? 0;
  const averageGoalProgress =
    goalsData.stats?.averageProgress ??
    getAverageGoalProgress(goalsData.goals);

  const fetchDashboardData = useCallback(async ({ background = false } = {}) => {
    if (dashboardFetchInProgress.current) return;
    dashboardFetchInProgress.current = true;
    const completionRevisionAtStart = habitCompletionRevision.current;
    try {
      if (!background) setLoading(true);

      const [todosRes, habitsRes, goalsRes, notesRes] = await Promise.allSettled([
        readDashboardSection(() =>
          getAllTodos({ limit: 6, filter: "all", sortBy: "default" }),
        ),
        readDashboardSection(() => getHabits("?limit=6&archived=false")),
        readDashboardSection(() => getGoals("?limit=4&status=active")),
        readDashboardSection(() => getNotes(1, 4)),
      ]);

      const warnings = [];

      // Process Todos
      if (
        todosRes.status === "fulfilled" &&
        Array.isArray(todosRes.value?.data?.todos)
      ) {
        setTodosData({
          todos: todosRes.value.data.todos || [],
          stats: todosRes.value.data.stats || {},
        });
      } else warnings.push(getDashboardFailure(todosRes, "Tasks"));

      // Process Habits
      if (
        habitsRes.status === "fulfilled" &&
        Array.isArray(habitsRes.value?.data?.habits)
      ) {
        const hData = habitsRes.value.data;
        const habitsList = hData.habits || [];
        if (completionRevisionAtStart === habitCompletionRevision.current) {
          setHabitsData({
            habits: habitsList,
            stats: hData.stats || {},
          });
          setHabitCompletions(hData.todayCompletions || {});
        } else {
          // Preserve completion state changed after this request started.
          setHabitsData((previous) => ({ ...previous, habits: habitsList }));
        }
      } else warnings.push(getDashboardFailure(habitsRes, "Habits"));

      // Process Goals
      if (
        goalsRes.status === "fulfilled" &&
        Array.isArray(goalsRes.value?.data?.goals)
      ) {
        setGoalsData({
          goals: goalsRes.value.data.goals || [],
          stats: goalsRes.value.data.stats || {},
        });
      } else warnings.push(getDashboardFailure(goalsRes, "Goals"));

      // Process Notes
      const notes =
        notesRes.status === "fulfilled"
          ? notesRes.value?.notes ?? notesRes.value?.data?.notes
          : null;
      if (Array.isArray(notes)) {
        setNotesData({
          notes,
          total: notesRes.value?.total ?? notesRes.value?.data?.total ?? notes.length,
        });
      } else warnings.push(getDashboardFailure(notesRes, "Notes"));

      setLoadWarnings([...new Set(warnings)]);
      setRetryDashboardInBackground(
        [todosRes, habitsRes, goalsRes, notesRes].some(isRetryableDashboardFailure),
      );
    } catch (err) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      if (!background) setLoading(false);
      dashboardFetchInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    if (initialDashboardFetchStarted.current) return;
    initialDashboardFetchStarted.current = true;
    fetchDashboardData();
  }, [fetchDashboardData]);

  // If the API or database is temporarily unavailable, recover in place as
  // soon as it comes back instead of leaving stale dashboard data until reload.
  useEffect(() => {
    if (!retryDashboardInBackground || loading) return undefined;

    const retryTimer = window.setTimeout(
      () => fetchDashboardData({ background: true }),
      5_000,
    );
    const retryWhenOnline = () => fetchDashboardData({ background: true });
    window.addEventListener("online", retryWhenOnline);

    return () => {
      window.clearTimeout(retryTimer);
      window.removeEventListener("online", retryWhenOnline);
    };
  }, [fetchDashboardData, loading, retryDashboardInBackground]);

  // Quick Todo Toggle
  const handleToggleTodo = async (todo) => {
    if (togglingTodoId) return;
    setTogglingTodoId(todo._id);

    // Optimistic update
    setTodosData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) =>
        t._id === todo._id ? { ...t, completed: !t.completed } : t,
      ),
      stats: {
        ...prev.stats,
        completed: todo.completed
          ? Math.max(0, (prev.stats.completed || 0) - 1)
          : (prev.stats.completed || 0) + 1,
        pending: todo.completed
          ? (prev.stats.pending || 0) + 1
          : Math.max(0, (prev.stats.pending || 0) - 1),
      },
    }));

    try {
      await toggleTodoCompletion(todo._id);
      toast.success(todo.completed ? "Task marked pending" : "Task completed!");
    } catch (err) {
      toast.error(err.message || "Failed to update task");
      // Revert
      fetchDashboardData();
    } finally {
      setTogglingTodoId(null);
    }
  };

  // Quick Habit Toggle
  const handleToggleHabit = async (habit) => {
    if (togglingHabitId) return;
    setTogglingHabitId(habit._id);

    const existing = habitCompletions[habit._id];
    const todayStr = habitsData.stats?.date || new Date().toISOString().slice(0, 10);
    try {
      if (existing?._id) {
        // Undo completion
        await undoHabitCompletion(existing._id);
        habitCompletionRevision.current += 1;
        setHabitCompletions((prev) => ({ ...prev, [habit._id]: null }));
        toast.success(`Marked "${habit.title}" incomplete for today`);
      } else {
        // Mark complete
        const res = await completeHabit(habit._id, { date: todayStr });
        habitCompletionRevision.current += 1;
        const record = res?.data || res;
        setHabitCompletions((prev) => ({ ...prev, [habit._id]: record }));
        if (!res?.alreadyCompleted) {
          setHabitsData((previous) => ({
            ...previous,
            stats: adjustHabitStats(previous.stats, 1),
          }));
        }
        toast.success(`Completed "${habit.title}"! 🔥`);
      }
      if (existing?._id) {
        setHabitsData((previous) => ({
          ...previous,
          stats: adjustHabitStats(previous.stats, -1),
        }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update habit");
    } finally {
      setTogglingHabitId(null);
    }
  };

  const adjustHabitStats = (stats = {}, change) => {
    const scheduledToday = Number(stats.scheduledToday) || 0;
    const completedToday = Math.max(
      0,
      Math.min(scheduledToday, (Number(stats.completedToday) || 0) + change),
    );
    return {
      ...stats,
      completedToday,
      remainingToday: Math.max(0, scheduledToday - completedToday),
      completionPercentage: scheduledToday
        ? Math.round((completedToday / scheduledToday) * 100)
        : 0,
    };
  };

  // Drag and drop handlers
  const handleDragStart = (e, widgetId) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, widgetId) => {
    e.preventDefault();
    if (widgetId !== dragOverWidget) {
      setDragOverWidget(widgetId);
    }
  };

  const handleDrop = (e, targetWidgetId) => {
    e.preventDefault();
    if (!draggedWidget || draggedWidget === targetWidgetId) {
      setDraggedWidget(null);
      setDragOverWidget(null);
      return;
    }

    const nextOrder = [...widgetOrder];
    const fromIndex = nextOrder.indexOf(draggedWidget);
    const toIndex = nextOrder.indexOf(targetWidgetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      nextOrder.splice(fromIndex, 1);
      nextOrder.splice(toIndex, 0, draggedWidget);
      setWidgetOrder(nextOrder);
      try {
        localStorage.setItem(STORAGE_LAYOUT_KEY, JSON.stringify(nextOrder));
      } catch {
        // Ignore storage failure
      }
    }

    setDraggedWidget(null);
    setDragOverWidget(null);
  };

  const resetLayout = () => {
    setWidgetOrder(DEFAULT_WIDGET_ORDER);
    try {
      localStorage.removeItem(STORAGE_LAYOUT_KEY);
    } catch {
      // Ignore
    }
    toast.success("Dashboard layout reset to default");
  };

  // Render individual widgets
  const renderTodosWidget = () => {
    const pendingTodos = todosData.todos.filter((t) => !t.completed).slice(0, 5);

    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ListTodo size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Pending Tasks</h2>
              <p className="text-xs text-foreground-muted">
                {todosData.stats?.pending ?? 0} tasks to finish
              </p>
            </div>
          </div>
          <Link
            to="/app/todos"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {pendingTodos.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <CheckCircle2 size={32} className="text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-foreground">All caught up!</p>
            <p className="text-xs text-foreground-muted">No pending tasks remaining.</p>
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            {pendingTodos.map((todo) => {
              const isOverdue =
                todo.dueDate &&
                getDateKey(todo.dueDate) < getLocalTodayKey() &&
                !todo.completed;

              return (
                <div
                  key={todo._id}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-surface-secondary/40"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleTodo(todo)}
                    disabled={togglingTodoId === todo._id}
                    className="mt-0.5 text-foreground-muted hover:text-emerald-600 transition"
                    aria-label="Toggle task"
                  >
                    {todo.completed ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        todo.completed
                          ? "line-through text-foreground-muted"
                          : "text-foreground"
                      }`}
                    >
                      {todo.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      {todo.dueDate && (
                        <span
                          className={`flex items-center gap-1 ${
                            isOverdue
                              ? "font-medium text-red-600 dark:text-red-400"
                              : "text-foreground-muted"
                          }`}
                        >
                          <Calendar size={12} />
                          {formatDate(todo.dueDate, dateFormat)}
                        </span>
                      )}
                      {todo.priority && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            todo.priority === "high"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400"
                              : todo.priority === "medium"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {todo.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderHabitsWidget = () => {
    const habitsList = habitsData.habits.slice(0, 5);

    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400">
              <Flame size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Daily Habits</h2>
              <p className="text-xs text-foreground-muted">
                {habitsData.stats?.completedToday ?? 0} of{" "}
                {habitsData.stats?.scheduledToday ?? 0} done today
              </p>
            </div>
          </div>
          <Link
            to="/app/habits"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Manage
            <ArrowRight size={14} />
          </Link>
        </div>

        {habitsList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <Sparkles size={32} className="text-orange-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-foreground">No active habits</p>
            <p className="text-xs text-foreground-muted">Create a habit to build routines.</p>
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            {habitsList.map((habit) => {
              const isCompleted = Boolean(habitCompletions[habit._id]);

              return (
                <div
                  key={habit._id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-surface-secondary/40"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="truncate text-sm font-medium text-foreground">
                      {habit.title}
                    </p>
                    <p className="text-xs text-foreground-muted">
                      {habit.frequency === "daily" ? "Daily" : "Selected days"}
                      {habit.targetValue && ` • ${habit.targetValue} ${habit.unit}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleHabit(habit)}
                    disabled={togglingHabitId === habit._id}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:text-emerald-400"
                        : "border border-border bg-surface hover:bg-surface-secondary text-foreground-secondary"
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 size={14} />
                        Done
                      </>
                    ) : (
                      <>
                        <Circle size={14} />
                        Check
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderGoalsWidget = () => {
    const goalsList = goalsData.goals.slice(0, 4);

    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Target size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Active Goals</h2>
              <p className="text-xs text-foreground-muted">
                {activeGoalCount} goals in progress
              </p>
            </div>
          </div>
          <Link
            to="/app/goals"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {goalsList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <Target size={32} className="text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-foreground">No active goals</p>
            <p className="text-xs text-foreground-muted">Set targets to stay motivated.</p>
          </div>
        ) : (
          <div className="flex-1 space-y-3">
            {goalsList.map((goal) => {
              const percentage = Math.min(
                100,
                Math.round(((goal.currentValue || 0) / (goal.targetValue || 1)) * 100),
              );

              return (
                <Link
                  key={goal._id}
                  to={`/app/goals/${goal._id}`}
                  className="block rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-surface-secondary/40"
                >
                  <div className="flex items-center justify-between text-sm">
                    <p className="truncate font-medium text-foreground">{goal.title}</p>
                    <span className="font-semibold text-primary">{percentage}%</span>
                  </div>

                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-foreground-muted">
                    <span>
                      {goal.currentValue || 0} / {goal.targetValue} {goal.unit}
                    </span>
                    {goal.targetDate && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatDate(goal.targetDate, dateFormat)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderNotesWidget = () => {
    const notesList = notesData.notes.slice(0, 4);

    return (
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
              <FileText size={18} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Quick Notes</h2>
              <p className="text-xs text-foreground-muted">
                {notesData.total ?? 0} saved notes
              </p>
            </div>
          </div>
          <Link
            to="/app/notes"
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        {notesList.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <FileText size={32} className="text-purple-500 mb-2 opacity-80" />
            <p className="text-sm font-medium text-foreground">No notes found</p>
            <p className="text-xs text-foreground-muted">Capture a thought before it slips away.</p>
          </div>
        ) : (
          <div className="flex-1 space-y-2">
            {notesList.map((note) => (
              <Link
                key={note._id}
                to={`/app/notes/${note._id}`}
                className="block rounded-xl border border-border bg-surface p-3 transition hover:border-primary/40 hover:bg-surface-secondary/40"
              >
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">
                    {note.title}
                  </p>
                  {note.isPinned && (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      Pinned
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">
                  {note.content}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const widgetMap = {
    todos: { id: "todos", render: renderTodosWidget },
    habits: { id: "habits", render: renderHabitsWidget },
    goals: { id: "goals", render: renderGoalsWidget },
    notes: { id: "notes", render: renderNotesWidget },
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {getGreeting()}, {user?.name || "there"}
          </h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Here’s a quick overview of your day and ongoing progress.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/app/todos"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
          >
            <Plus size={15} />
            New Task
          </Link>
          <Link
            to="/app/goals"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-secondary"
          >
            <Plus size={15} />
            New Goal
          </Link>
          <Link
            to="/app/habits"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-secondary"
          >
            <Flame size={15} />
            Habits
          </Link>
          <Link
            to="/app/notes"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-surface-secondary"
          >
            <FileText size={15} />
            Notes
          </Link>
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground-muted transition hover:bg-surface-secondary hover:text-foreground disabled:cursor-wait disabled:opacity-60"
            title="Refresh dashboard data"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={resetLayout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground-muted transition hover:bg-surface-secondary hover:text-foreground"
            title="Reset layout order"
          >
            <RotateCcw size={14} />
            Reset Layout
          </button>
        </div>
      </header>

      {loadWarnings.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200" role="status">
          <span>Dashboard data is incomplete: {loadWarnings.join("; ")}.</span>
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="font-semibold underline underline-offset-2 disabled:opacity-60"
          >
            Try again
          </button>
        </div>
      )}

      {/* Overview Stat Cards */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Pending Tasks */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Pending Tasks
            </span>
            <ListTodo size={18} />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {todosData.stats?.pending ?? 0}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            {todosData.stats?.overdue ? (
              <span className="font-semibold text-red-600 dark:text-red-400">
                {todosData.stats.overdue} overdue
              </span>
            ) : (
              "None overdue"
            )}
          </p>
        </div>

        {/* Daily Habits */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between text-orange-600 dark:text-orange-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Habits Done
            </span>
            <Flame size={18} />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {habitsData.stats?.completedToday ?? 0}
            <span className="text-sm font-normal text-foreground-muted">
              {" "}
              / {habitsData.stats?.scheduledToday ?? 0}
            </span>
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            {habitsData.stats?.completionPercentage ?? 0}% completed today
          </p>
        </div>

        {/* Active Goals */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Active Goals
            </span>
            <Target size={18} />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {activeGoalCount}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            {averageGoalProgress}% average progress
          </p>
        </div>

        {/* Total Notes */}
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
              Total Notes
            </span>
            <FileText size={18} />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {notesData.total ?? 0}
          </p>
          <p className="mt-1 text-xs text-foreground-muted">Saved thoughts</p>
        </div>
      </section>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <Spinner size={32} />
        </div>
      )}

      {/* Draggable Dashboard Grid */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {widgetOrder.map((widgetId) => {
          const widget = widgetMap[widgetId];
          if (!widget) return null;

          const isDragging = draggedWidget === widgetId;
          const isOver = dragOverWidget === widgetId && !isDragging;

          return (
            <div
              key={widgetId}
              draggable
              onDragStart={(e) => handleDragStart(e, widgetId)}
              onDragOver={(e) => handleDragOver(e, widgetId)}
              onDrop={(e) => handleDrop(e, widgetId)}
              onDragEnd={() => {
                setDraggedWidget(null);
                setDragOverWidget(null);
              }}
              className={`flex flex-col rounded-2xl border bg-surface p-5 shadow-sm transition-all duration-200 ${
                isDragging ? "opacity-40 scale-[0.99]" : ""
              } ${
                isOver
                  ? "border-primary ring-2 ring-primary/20 scale-[1.01]"
                  : "border-border"
              }`}
            >
              {/* Drag handle */}
              <div
                className="mb-3 flex items-center justify-between border-b border-border/50 pb-2 text-xs text-foreground-muted cursor-grab active:cursor-grabbing select-none"
                title="Drag to reorder this card"
              >
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <GripVertical size={14} className="text-foreground-muted/60" />
                  Drag to rearrange
                </span>
              </div>

              {widget.render()}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Dashboard;
