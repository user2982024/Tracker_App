import React from "react";

const NoteCard = ({ title, content, createdAt }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition cursor-pointer">
      <h3 className="text-lg font-semibold text-purple-600">{title}</h3>
      <p className="text-gray-600 mt-2 line-clamp-3">{content}</p>
      <p className="text-sm text-gray-400 mt-4">{new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default NoteCard;
