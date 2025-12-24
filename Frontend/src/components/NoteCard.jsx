import React from "react";
import { Eye, Edit, Trash2, Calendar } from "lucide-react";

const NoteCard = ({ title, content, createdAt, onOpen, onEdit, onDelete }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-white/80 to-white shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Left Accent Line */}
      <div className="absolute left-0 top-0 h-full w-1.5 bg-linear-to-b from-violet-500 via-purple-500 to-fuchsia-500 opacity-80 group-hover:opacity-100" />

      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-violet-400/20 to-purple-600/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6 pl-7">
        <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-violet-600">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-4">
          {content}
        </p>

        <div className="grow" />

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar size={14} />
            {new Date(createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <ActionButton label="Open" icon={Eye} onClick={onOpen} color="violet" />
            <ActionButton label="Edit" icon={Edit} onClick={onEdit} color="purple" />
            <ActionButton label="Delete" icon={Trash2} onClick={onDelete} color="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ icon: Icon, onClick, color, label }) => {
  const colors = {
    violet: "hover:bg-violet-100 hover:text-violet-600",
    purple: "hover:bg-purple-100 hover:text-purple-600",
    red: "hover:bg-red-100 hover:text-red-600",
  };

  return (
    <div className="relative group/button">
      <button
        onClick={onClick}
        className={`rounded-full bg-gray-100 p-2 text-gray-600 cursor-pointer transition ${colors[color]}`}
      >
        <Icon size={16} />
      </button>

      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover/button:opacity-100">
        {label}
      </span>
    </div>
  );
};

export default NoteCard;
