import GoalsHeader from "../components/Goals/GoalsHeader";
import GoalsStats from "../components/Goals/GoalsStats";
import GoalsProgress from "../components/Goals/GoalsProgress";
import GoalsFilters from "../components/Goals/GoalsFilters";
import GoalsList from "../components/Goals/GoalsList";

const GoalsPage = () => {
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
      <GoalsList />

    </div>
  );
};

export default GoalsPage;