import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Left: App Name */}
          <div className="shrink-0">
            <h1 className="text-black font-bold text-xl">TaskFlow</h1>
          </div>

          {/* Middle: Navigation Links (desktop only) */}
          <div className="hidden md:flex space-x-8">
            <a
              href="#notes"
              className="text-gray-500 hover:text-gray-700 font-medium transition"
            >
              Notes
            </a>
            <a
              href="#todos"
              className="text-gray-500 hover:text-gray-700 font-medium transition"
            >
              Todos
            </a>
            <a
              href="#goals"
              className="text-gray-500 hover:text-gray-700 font-medium transition"
            >
              Goals
            </a>
            <a
              href="#daily-habits"
              className="text-gray-500 hover:text-gray-700 font-medium transition"
            >
              Daily habits
            </a>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex space-x-4">
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-purple-600 hover:text-white transition">
              Signin
            </button>
            <button className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition">
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Links centered */}
      <div className="md:hidden px-4 pb-4 flex flex-col items-center space-y-2">
        <a
          href="#notes"
          className="text-gray-500 font-medium hover:text-gray-700 text-center"
        >
          Notes
        </a>
        <a
          href="#todos"
          className="text-gray-500 font-medium hover:text-gray-700 text-center"
        >
          Todos
        </a>
        <a
          href="#goals"
          className="text-gray-500 font-medium hover:text-gray-700 text-center"
        >
          Goals
        </a>
        <a
          href="#daily-habits"
          className="text-gray-500 font-medium hover:text-gray-700 text-center"
        >
          Daily habits
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
