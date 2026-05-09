import { useState, useEffect } from "react";

import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";

import { getGoals } from "../services/goalsServices";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);

      const data = await getGoals();

      setGoals(data.data.goals || []);
      setStats(data.data.stats || null);
    } catch (err) {
      setError(err.message || "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <GoalsHeader />

      {/* Stats */}
      <GoalsStats stats={stats} goals={goals} />

      {/* Overall Progress */}
      <GoalsProgress stats={stats} />

      {/* Filters + Sorting */}
      <GoalsFilters />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Goals List */}
      <GoalsList goals={goals} loading={loading} />
    </div>
  );
}

export default GoalsPage;

