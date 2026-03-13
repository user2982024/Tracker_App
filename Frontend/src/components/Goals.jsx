import {
  Target,
  CheckCircle2,
  Clock,
  Trophy,
  Heart,
  GraduationCap,
  DollarSign,
} from "lucide-react";

import StatCard from "./StatCard";
import GoalCard from "./GoalCard";
import MilestoneCard from "./MilestoneCard";
import DeadlineCard from "./DeadlineCard";

const Goals = () => {
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Goals</h1>
          <p className="text-gray-500 text-sm">
            Track and achieve your dreams
          </p>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          + New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Goals"
          value="30"
          icon={Target}
          color="blue"
        />

        <StatCard
          title="Completed"
          value="12"
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          title="In Progress"
          value="15"
          icon={Clock}
          color="orange"
        />

        <StatCard
          title="Success Rate"
          value="40%"
          icon={Trophy}
          color="purple"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg">
          All Goals
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Active
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Completed
        </button>

        <button className="px-4 py-2 bg-gray-100 rounded-lg">
          Upcoming
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-3 gap-5">

        <GoalCard
          title="Get Promoted to Senior Developer"
          category="Career"
          progress={65}
          priority="High Priority"
          icon={Target}
        />

        <GoalCard
          title="Run a Marathon"
          category="Health"
          progress={45}
          priority="Medium Priority"
          icon={Heart}
        />

        <GoalCard
          title="Master React & TypeScript"
          category="Learning"
          progress={80}
          priority="High Priority"
          icon={GraduationCap}
        />

        <GoalCard
          title="Save $50,000 for House"
          category="Finance"
          progress={35}
          priority="High Priority"
          icon={DollarSign}
        />

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-5">

        {/* Milestones */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold mb-4">
            Goal Milestones
          </h2>

          <MilestoneCard
            title="Completed React Course"
          />

          <MilestoneCard
            title="Ran 10km without stopping"
          />

          <MilestoneCard
            title="Saved First $10,000"
          />
        </div>

        {/* Deadlines */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold mb-4">
            Upcoming Deadlines
          </h2>

          <DeadlineCard title="Run a Marathon" />
          <DeadlineCard title="Build Stronger Relationships" />
          <DeadlineCard title="Master React & TypeScript" />

        </div>
      </div>

    </div>
  );
};

export default Goals;