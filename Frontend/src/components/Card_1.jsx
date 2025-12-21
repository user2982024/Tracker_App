import React from "react";

const Card_1 = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-purple-50 rounded-xl shadow-md p-6 flex flex-col gap-4 hover:shadow-xl transition">
      
      {/* Icon */}
      <div className="text-purple-600 text-4xl">
        <Icon />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default Card_1;
