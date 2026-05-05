import { useState, useEffect } from "react";

import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";

import { getGoals } from "../services/goalsServices";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);

      const data = await getGoals();

      setGoals(data.goals || []);
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
      <GoalsStats />

      {/* Overall Progress */}
      <GoalsProgress />

      {/* Filters + Sorting */}
      <GoalsFilters />

      {/* Goals List */}
      <GoalsList goals={goals} loading={loading} />
    </div>
  );
};

export default GoalsPage;
