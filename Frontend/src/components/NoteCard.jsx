import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react"; 

const NoteCard = ({ title, content, createdAt, onOpen, onEdit, onDelete }) => {
  return (
    <div className="bg-purple-50 rounded-2xl shadow-md p-5 hover:shadow-xl transition cursor-pointer flex flex-col justify-between">
      {/* Note Content */}
      <div>
        <h3 className="text-lg font-semibold text-purple-600">{title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">{content}</p>
        <p className="text-sm text-gray-400 mt-4">{new Date(createdAt).toLocaleDateString()}</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onOpen}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
        >
          <Eye size={16} /> Open
        </button>

        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-600 transition"
        >
          <Edit size={16} /> Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
