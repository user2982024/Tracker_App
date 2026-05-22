import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Flag,
  Target,
  TrendingUp,
} from "lucide-react";

import { getGoal } from "../services/goalsServices";

const GoalViewPage = () => {

  const navigate = useNavigate();

  // Get goal ID from route params
  const { id } = useParams();

  // Local state
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single goal
  const fetchGoal = async () => {

    try {

      setLoading(true);
      setError(null);

      // API call
      const data = await getGoal(id);

      // Save goal
      setGoal(data);

    } catch (error) {

      setError(error.message || "Failed to fetch goal");

    } finally {

      setLoading(false);

    }

  };

  // Fetch goal on page load
  useEffect(() => {

    fetchGoal();

  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div
          className="
            bg-white border border-gray-100
            rounded-3xl p-8 shadow-sm
          "
        >
          <p className="text-sm text-gray-500">
            Loading goal...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div
          className="
            bg-red-50 border border-red-200
            text-red-600 px-4 py-3 rounded-2xl text-sm
          "
        >
          {error}
        </div>
      </div>
    );
  }

  // Goal not found state
  if (!goal) {
    return (
      <div className="p-6">
        <div
          className="
            bg-yellow-50 border border-yellow-200
            text-yellow-700 px-4 py-3 rounded-2xl text-sm
          "
        >
          Goal not found
        </div>
      </div>
    );
  }

  // Progress percentage
  const progressPercentage = Math.min(
    Math.round((goal.currentValue / goal.targetValue) * 100),
    100
  );

  // Dynamic status styles
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
    paused: "bg-amber-100 text-amber-700",
  };

  // Dynamic priority styles
  const priorityStyles = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/app/goals")}
        className="
          flex items-center gap-2
          text-sm font-medium text-gray-500
          hover:text-gray-800
          transition-colors duration-200
          hover:cursor-pointer
        "
      >
        <ArrowLeft size={18} />

        <span>Back to Goals</span>
      </button>

      {/* Hero Section */}
      <div
        className="
          relative overflow-hidden
          bg-white border border-gray-100
          rounded-3xl shadow-sm
          p-8 space-y-8
        "
      >

        {/* Top Content */}
        <div className="space-y-5">

          {/* Title + Status */}
          <div className="flex items-start justify-between gap-4 flex-wrap">

            <div className="space-y-3">

              {/* Title */}
              <h1
                className="
                  text-4xl font-bold
                  text-gray-900 tracking-tight
                  leading-tight
                "
              >
                {goal.title}
              </h1>

              {/* Description */}
              {goal.description && (
                <p
                  className="
                    text-gray-500 leading-7
                    max-w-3xl text-[15px]
                  "
                >
                  {goal.description}
                </p>
              )}

            </div>

            {/* Status Badge */}
            <span
              className={`
                px-4 py-2 rounded-full
                text-xs font-semibold tracking-wide
                capitalize whitespace-nowrap
                ${statusStyles[goal.status]}
              `}
            >
              {goal.status}
            </span>

          </div>

          {/* Progress Card */}
          <div
            className="
              bg-linear-to-r from-blue-50 to-indigo-50
              border border-blue-100
              rounded-3xl p-6 space-y-5
            "
          >

            {/* Progress Top */}
            <div className="flex items-center justify-between flex-wrap gap-4">

              <div className="space-y-1">

                <p
                  className="
                    text-xs uppercase tracking-wide
                    text-blue-600 font-semibold
                  "
                >
                  Goal Progress
                </p>

                <h2 className="text-3xl font-bold text-gray-900">
                  {progressPercentage}%
                </h2>

              </div>

              {/* Progress Stats */}
              <div
                className="
                  flex items-center gap-2
                  px-4 py-2 rounded-2xl
                  bg-white border border-blue-100
                "
              >
                <TrendingUp size={18} className="text-blue-600" />

                <p className="text-sm font-semibold text-gray-700">
                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                </p>

              </div>

            </div>

            {/* Progress Bar */}
            <div className="space-y-2">

              <div
                className="
                  w-full h-4 rounded-full
                  bg-white overflow-hidden
                  border border-blue-100
                "
              >
                <div
                  className="
                    h-full rounded-full
                    bg-blue-600 transition-all duration-500
                  "
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <p className="text-sm text-gray-500">
                Keep pushing forward — consistency compounds over time.
              </p>

            </div>

          </div>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Category */}
          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >

            <div className="flex items-center gap-2">

              <Target size={16} className="text-purple-600" />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Category
              </p>

            </div>

            <p className="text-sm font-semibold text-gray-800 capitalize">
              {goal.category || "Not specified"}
            </p>

          </div>

          {/* Priority */}
          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >

            <div className="flex items-center gap-2">

              <Flag size={16} className="text-red-500" />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Priority
              </p>

            </div>

            <span
              className={`
                inline-flex items-center
                px-3 py-1 rounded-full
                text-xs font-semibold capitalize
                ${priorityStyles[goal.priority]}
              `}
            >
              {goal.priority || "Not specified"}
            </span>

          </div>

          {/* Start Date */}
          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >

            <div className="flex items-center gap-2">

              <CalendarDays size={16} className="text-gray-500" />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Start Date
              </p>

            </div>

            <p className="text-sm font-semibold text-gray-800">
              {goal.startDate
                ? new Date(goal.startDate).toLocaleDateString()
                : "Not specified"}
            </p>

          </div>

          {/* Target Date */}
          <div
            className="
              bg-gray-50 border border-gray-100
              rounded-2xl p-5 space-y-3
            "
          >

            <div className="flex items-center gap-2">

              <CalendarDays size={16} className="text-blue-500" />

              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                Target Date
              </p>

            </div>

            <p className="text-sm font-semibold text-gray-800">
              {goal.targetDate
                ? new Date(goal.targetDate).toLocaleDateString()
                : "Not specified"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default GoalViewPage;