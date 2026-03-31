import React from "react";
import { StickyNote, CheckSquare, Target, Activity } from "lucide-react";

const features = [
  {
    icon: <StickyNote className="w-6 h-6 text-yellow-500" />,
    title: "Notes Management",
    description: "Capture ideas, organize notes, and never miss important thoughts",
  },
  {
    icon: <CheckSquare className="w-6 h-6 text-blue-600" />,
    title: "Task Management",
    description: "Create, organize, and track your tasks with ease",
  },
  {
    icon: <Target className="w-6 h-6 text-red-500" />,
    title: "Goal Setting & Tracking",
    description: "Set goals and monitor your progress in real-time",
  },
  {
    icon: <Activity className="w-6 h-6 text-green-500" />,
    title: "Habit Builder",
    description: "Build healthy habits with streaks and reminders",
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="w-full bg-gray-50 py-20 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Boost Your Productivity Today
        </h2>

        {/* Subtext */}
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Everything you need to stay organized and achieve your goals
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 mx-auto">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;