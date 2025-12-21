import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  `font-medium transition ${
    isActive ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
  }`;

const Navbar = () => {
  // ✅ Correct way: derive auth state synchronously
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Signed out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* App Name */}
          <NavLink to="/" className="text-black font-bold text-xl">
            TaskFlow
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/notes" className={navLinkClass}>Notes</NavLink>
            <NavLink to="/todos" className={navLinkClass}>Todos</NavLink>
            <NavLink to="/goals" className={navLinkClass}>Goals</NavLink>
            <NavLink to="/daily-habits" className={navLinkClass}>
              Daily Habits
            </NavLink>
          </div>

          {/* Auth Buttons */}
          <div className="flex space-x-4">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/signin"
                  className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-gray-700 hover:bg-purple-600 hover:text-white transition"
                >
                  Signin
                </NavLink>

                <NavLink
                  to="/signup"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition"
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md hover:bg-red-600 transition"
              >
                Signout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden px-4 pb-4 flex flex-col items-center space-y-2">
        <NavLink to="/notes" className={navLinkClass}>Notes</NavLink>
        <NavLink to="/todos" className={navLinkClass}>Todos</NavLink>
        <NavLink to="/goals" className={navLinkClass}>Goals</NavLink>
        <NavLink to="/daily-habits" className={navLinkClass}>
          Daily Habits
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
