import { useState, useEffect } from "react";

import toast from "react-hot-toast";

import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";
import GoalsPagination from "../components/Goals/GoalsPagination";
import Modal from "../components/UI/Modal";

import {
  getGoals,
  deleteGoal,
} from "../services/goalsServices";

const GoalsPage = () => {

  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);

  // Debounce search
  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  }, [search]);

  // Reset page when filters/search changes
  useEffect(() => {

    setPage(1);

  }, [debouncedSearch, status, sortBy]);

  // Fetch goals
  const fetchGoals = async () => {

    try {

      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      // Search
      if (debouncedSearch.trim()) {
        queryParams.append(
          "search",
          debouncedSearch.trim()
        );
      }

      // Status filter
      if (status !== "all") {
        queryParams.append("status", status);
      }

      // Sort
      if (sortBy !== "default") {
        queryParams.append("sortBy", sortBy);
      }

      // Pagination
      queryParams.append("page", page);
      queryParams.append("limit", 9);

      const data = await getGoals(
        `?${queryParams.toString()}`
      );

      setGoals(data.data.goals || []);

      setStats(data.data.stats || null);

      setPagination(
        data.data.pagination || null
      );

    } catch (error) {

      setError(
        error.message || "Failed to fetch goals"
      );

    } finally {

      setLoading(false);

    }

  };

  // Open delete modal
  const handleDeleteClick = (goalId) => {

    setGoalToDelete(goalId);

    setIsDeleteModalOpen(true);

  };

  // Confirm delete
  const handleConfirmDelete = async () => {

    try {

      await deleteGoal(goalToDelete);

      // Refresh goals
      await fetchGoals();

      // Close modal
      setIsDeleteModalOpen(false);

      // Reset goal
      setGoalToDelete(null);

      // Success toast
      toast.success("Goal deleted successfully");

    } catch (error) {

      toast.error(
        error.message || "Failed to delete goal"
      );

    }

  };

  // Refresh goals
  useEffect(() => {

    fetchGoals();

  }, [debouncedSearch, page, status, sortBy]);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <GoalsHeader
        search={search}
        setSearch={setSearch}
      />

      {/* Stats */}
      <GoalsStats
        stats={stats}
        goals={goals}
      />

      {/* Overall Progress */}
      <GoalsProgress stats={stats} />

      {/* Filters + Sorting */}
      <GoalsFilters
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Error */}
      {error && (
        <div
          className="
            bg-red-50 border border-red-200
            text-red-600 px-4 py-3
            rounded-lg text-sm
          "
        >
          {error}
        </div>
      )}

      {/* Goals List */}
      <GoalsList
        goals={goals}
        loading={loading}
        onDelete={handleDeleteClick}
      />

      {/* Goals Pagination */}
      <GoalsPagination
        pagination={pagination}
        page={page}
        setPage={setPage}
      />

      {/* Delete Goal Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setGoalToDelete(null);
        }}
        title="Delete Goal"
        actions={
          <>
            {/* Cancel Button */}
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setGoalToDelete(null);
              }}
              className="
                px-4 py-2 rounded-xl
                border border-gray-200
                text-sm font-medium text-gray-600
                hover:bg-gray-50
                transition-colors duration-200
                hover:cursor-pointer
              "
            >
              Cancel
            </button>

            {/* Delete Button */}
            <button
              onClick={handleConfirmDelete}
              className="
                px-4 py-2 rounded-xl
                bg-red-500 text-white
                text-sm font-medium
                hover:bg-red-600
                transition-colors duration-200
                hover:cursor-pointer
              "
            >
              Delete
            </button>
          </>
        }
      >
        Are you sure you want to delete this goal?
        This action cannot be undone.
      </Modal>

    </div>
  );

};

export default GoalsPage;