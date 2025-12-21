import React from "react";
import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `font-medium transition ${
    isActive ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
  }`;

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: App Name */}
          <div className="shrink-0">
            <NavLink to="/" className="text-black font-bold text-xl">
              TaskFlow
            </NavLink>
          </div>

          {/* Middle: Navigation Links (desktop only) */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/notes" className={navLinkClass}>
              Notes
            </NavLink>
            <NavLink to="/todos" className={navLinkClass}>
              Todos
            </NavLink>
            <NavLink to="/goals" className={navLinkClass}>
              Goals
            </NavLink>
            <NavLink to="/daily-habits" className={navLinkClass}>
              Daily Habits
            </NavLink>
          </div>

          {/* Right: Auth Buttons */}
          <div className="flex space-x-4">
            <NavLink
              to="/signin"
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-purple-600 hover:text-white transition"
            >
              Signin
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition"
            >
              Signup
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile: Links centered */}
      <div className="md:hidden px-4 pb-4 flex flex-col items-center space-y-2">
        <NavLink to="/notes" className={navLinkClass}>
          Notes
        </NavLink>
        <NavLink to="/todos" className={navLinkClass}>
          Todos
        </NavLink>
        <NavLink to="/goals" className={navLinkClass}>
          Goals
        </NavLink>
        <NavLink to="/daily-habits" className={navLinkClass}>
          Daily Habits
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
