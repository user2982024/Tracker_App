import { useState, useEffect } from "react";

import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";
import GoalsPagination from "../components/Goals/GoalsPagination";

import { getGoals } from "../services/goalsServices";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      // Search
      if (debouncedSearch.trim()) {
        queryParams.append("search", debouncedSearch.trim());
      }

      // Pagination
      queryParams.append("page", page);
      queryParams.append("limit", 9);

      const data = await getGoals(`?${queryParams.toString()}`);

      setGoals(data.data.goals || []);
      setStats(data.data.stats || null);

      setPagination(data.data.pagination || null);
    } catch (err) {
      setError(err.message || "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [debouncedSearch, page]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <GoalsHeader search={search} setSearch={setSearch} />

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

      {/* Goals Pagination */}
      <GoalsPagination pagination={pagination} page={page} setPage={setPage} />
    </div>
  );
};

export default GoalsPage;
