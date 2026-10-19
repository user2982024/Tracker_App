import { toastError } from "../utils/userToast.js";
import { useCallback, useState, useEffect } from "react";

import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Spinner from "../components/UI/Spinner";

import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";
import GoalsPagination from "../components/Goals/GoalsPagination";
import Modal from "../components/UI/Modal";
import FormModal from "../components/UI/FormModal";
import GoalForm from "../components/Goals/GoalForm";

import {
  getGoals,
  updateGoal,
  deleteGoal,
  deleteCompletedGoals,
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

  // Individual goal deletion
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState(null);

  // Delete completed goals
  const [isDeleteCompletedModalOpen, setIsDeleteCompletedModalOpen] =
    useState(false);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [deletingCompletedGoals, setDeletingCompletedGoals] =
    useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, sortBy]);

  // Fetch goals
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();

      if (debouncedSearch.trim()) {
        queryParams.append("search", debouncedSearch.trim());
      }

      if (status !== "all") {
        queryParams.append("status", status);
      }

      if (sortBy !== "default") {
        queryParams.append("sortBy", sortBy);
      }

      queryParams.append("page", page);
      queryParams.append("limit", 9);

      const data = await getGoals(`?${queryParams.toString()}`);

      setGoals(data.data.goals || []);
      setStats(data.data.stats || null);
      setPagination(data.data.pagination || null);

      return data;
    } catch (error) {
      setError(error.message || "Failed to fetch goals");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, sortBy, status]);

  // Open individual goal deletion modal
  const handleDeleteClick = (goalId) => {
    setGoalToDelete(goalId);
    setIsDeleteModalOpen(true);
  };

  const handleCompleteQualitativeGoal = async (goal) => {
    if (completingGoalId) return;

    setCompletingGoalId(goal._id);
    try {
      await updateGoal(goal._id, { status: "completed" });
      toast.success("Goal completed. Great work!");
      await fetchGoals();
    } catch (error) {
      toastError(error.message || "Failed to complete goal");
    } finally {
      setCompletingGoalId(null);
    }
  };

  // Close individual goal deletion modal
  const handleCloseDeleteModal = () => {
    if (deletingGoal) return;

    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  // Confirm individual goal deletion
  const handleConfirmDelete = async () => {
    if (!goalToDelete || deletingGoal) return;

    try {
      setDeletingGoal(true);

      await deleteGoal(goalToDelete);

      setIsDeleteModalOpen(false);
      setGoalToDelete(null);

      toast.success("Goal deleted.");

      await fetchGoals();
    } catch (error) {
      toastError(error.message || "Failed to delete goal");
    } finally {
      setDeletingGoal(false);
    }
  };

  // Open completed goals confirmation modal
  const handleDeleteCompletedClick = () => {
    if (deletingCompletedGoals) return;

    setIsDeleteCompletedModalOpen(true);
  };

  // Close completed goals confirmation modal
  const handleCloseDeleteCompletedModal = () => {
    if (deletingCompletedGoals) return;

    setIsDeleteCompletedModalOpen(false);
  };

  // Confirm deletion of all completed goals
  const handleConfirmDeleteCompleted = async () => {
    if (deletingCompletedGoals) return;

    try {
      setDeletingCompletedGoals(true);

      const result = await deleteCompletedGoals();

      const deletedGoals = result.data?.deletedGoals ?? 0;
      const deletedProgressEntries =
        result.data?.deletedProgressEntries ?? 0;

      setIsDeleteCompletedModalOpen(false);

      if (deletedGoals === 0) {
        toast.success("No completed goals found.");
      } else {
        toast.success(
          `Cleared ${deletedGoals} completed goal${deletedGoals === 1 ? "" : "s"} and ${deletedProgressEntries} progress update${deletedProgressEntries === 1 ? "" : "s"}.`,
        );
      }

      // Refresh list and statistics
      const refreshedData = await fetchGoals();

      // Correct the page if the current page no longer exists
      const totalPages = refreshedData.data?.pagination?.totalPages;

      if (
        page > 1 &&
        typeof totalPages === "number" &&
        page > totalPages
      ) {
        setPage(Math.max(1, totalPages));
      }
    } catch (error) {
      toastError(
        error.message || "Failed to delete completed goals",
      );
    } finally {
      setDeletingCompletedGoals(false);
    }
  };

  useEffect(() => {
    fetchGoals().catch(() => {
      // fetchGoals already updates the page error state.
    });
  }, [fetchGoals]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <GoalsHeader
        search={search}
        setSearch={setSearch}
        onCreate={() => setIsGoalFormOpen(true)}
      />

      {/* Statistics */}
      <GoalsStats stats={stats} />

      {/* Overall Progress */}
      <GoalsProgress stats={stats} />

      {/* Filters and Sorting */}
      <GoalsFilters
        status={status}
        setStatus={setStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="
            bg-red-50 border border-red-200
            dark:bg-red-500/10 dark:border-red-500/25
            text-red-600 dark:text-red-300 px-4 py-3
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
        onCompleteQualitative={handleCompleteQualitativeGoal}
        completingGoalId={completingGoalId}
      />

      {/* Goals Pagination */}
      {!loading && goals.length > 0 && (
        <GoalsPagination
          pagination={pagination}
          page={page}
          setPage={setPage}
        />
      )}

      <FormModal
        isOpen={isGoalFormOpen}
        onClose={() => setIsGoalFormOpen(false)}
        title="Create Goal"
        subtitle="Set a clear target to work toward"
      >
        <GoalForm
          mode="create"
          onCancel={() => setIsGoalFormOpen(false)}
          onComplete={() => {
            setIsGoalFormOpen(false);
            fetchGoals();
          }}
        />
      </FormModal>

      {/* Delete Completed Goals Button - Bottom Right */}
      {!loading &&
        ((status === "all" && stats?.completed > 0) ||
          (status === "completed" &&
            goals.some((goal) => goal.status === "completed"))) && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleDeleteCompletedClick}
            disabled={deletingCompletedGoals}
            className="
            inline-flex items-center justify-center gap-2
            px-4 py-2.5
            rounded-xl
            border border-red-200 dark:border-red-500/25
            bg-surface
            text-red-600 dark:text-red-300 text-sm font-medium
            hover:bg-red-50 dark:hover:bg-red-500/10
            hover:border-red-300 dark:hover:border-red-500/40
            transition-colors duration-200
            disabled:opacity-50
            disabled:cursor-not-allowed
            hover:cursor-pointer
          "
          >
            <Trash2 size={16} />
            Delete Completed
          </button>
        </div>
      )}

      {/* Individual Goal Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Goal"
        actions={
          <>
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={deletingGoal}
              className="
                px-4 py-2 rounded-xl
                border border-border
                text-sm font-medium text-foreground-muted
                hover:bg-surface-secondary
                transition-colors duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                hover:cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={!goalToDelete || deletingGoal}
              className="
                min-w-24
                inline-flex items-center justify-center gap-2
                px-4 py-2 rounded-xl
                bg-red-500 text-white
                text-sm font-medium
                hover:bg-red-600
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors duration-200
                hover:cursor-pointer
              "
            >
              {deletingGoal ? (
                <>
                  <Spinner size={15} label="Deleting goal" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </>
        }
      >
        Are you sure you want to delete this goal? This action cannot be undone.
      </Modal>

      {/* Delete Completed Goals Confirmation Modal */}
      <Modal
        isOpen={isDeleteCompletedModalOpen}
        onClose={handleCloseDeleteCompletedModal}
        title="Delete Completed Goals"
        actions={
          <>
            {/* Cancel */}
            <button
              type="button"
              onClick={handleCloseDeleteCompletedModal}
              disabled={deletingCompletedGoals}
              className="
                px-4 py-2 rounded-xl
                border border-border
                bg-surface
                text-sm font-medium text-foreground-muted
                hover:bg-surface-secondary
                transition-colors duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                hover:cursor-pointer
              "
            >
              Cancel
            </button>

            {/* Confirm deletion */}
            <button
              type="button"
              onClick={handleConfirmDeleteCompleted}
              disabled={deletingCompletedGoals}
              className="
                min-w-36
                inline-flex items-center justify-center gap-2
                px-4 py-2 rounded-xl
                bg-red-500 text-white
                text-sm font-medium
                hover:bg-red-600
                transition-colors duration-200
                disabled:opacity-50
                disabled:cursor-not-allowed
                hover:cursor-pointer
              "
            >
              {deletingCompletedGoals ? (
                <>
                  <Spinner size={15} label="Updating goal" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete Completed
                </>
              )}
            </button>
          </>
        }
      >
        <p className="text-sm leading-6 text-foreground-muted">
          Are you sure you want to permanently delete all completed
          goals and their associated progress history?
        </p>

        <p className="mt-3 rounded-lg bg-red-50 border border-red-100 dark:bg-red-500/10 dark:border-red-500/25 p-3 text-sm text-red-700 dark:text-red-300">
          <strong>Warning:</strong> This action cannot be undone.
          Active and paused goals will not be deleted.
        </p>
      </Modal>
    </div>
  );
};


export default GoalsPage;
