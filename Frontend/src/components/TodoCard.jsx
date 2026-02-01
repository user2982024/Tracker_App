import React from "react";

const Todo = ({ todo }) => {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow">
      {/* Checkbox (UI only for now) */}
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
      />

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">
          {todo.title || "Todo title"}
        </h3>

        <p className="text-sm text-gray-500">
          {todo.description || "Short todo description goes here"}
        </p>

        {/* Meta Info */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-red-100 px-2 py-1 text-red-600">
            High Priority
          </span>

          <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-600">
            Work
          </span>

          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            Due: Dec 22, 2024
          </span>

          <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">
            In Progress
          </span>
        </div>
      </div>
    </div>
  );
};

export default Todo;
