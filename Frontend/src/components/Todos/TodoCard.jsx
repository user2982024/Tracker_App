import { CalendarDays, Flag, MoreVertical } from "lucide-react";

const TodoCard = () => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
          {/* Empty circle (unchecked) */}
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-800">
            Design new landing page
          </h3>

          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded w-fit mt-1">
            Work
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Due Date */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarDays size={16} />
          <span>21/04/2026</span>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-2 text-sm text-red-500">
          <Flag size={16} />
          <span>High</span>
        </div>

        {/* Actions */}
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;
