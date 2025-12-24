import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";

const navLinkClass = ({ isActive }) =>
  `font-medium transition ${
    isActive ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
  }`;

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Signed out successfully!");
    setIsMenuOpen(false);
    setIsModalOpen(false); // close modal
    navigate("/");
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 relative z-50">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-2 text-black font-bold text-xl"
            onClick={handleLinkClick}
          >
            <img src="/3.png" alt="TaskFlow Logo" className="h-8 w-8" />
            TaskFlow
          </NavLink>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth */}
          <div className="hidden md:flex space-x-4">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/signin"
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-purple-600 hover:text-white transition"
                >
                  Signin
                </NavLink>
                <NavLink
                  to="/signup"
                  className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)} // open modal instead of direct logout
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Signout
              </button>
            )}
          </div>

          {/* Hamburger Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? <HiOutlineX size={26} /> : <HiOutlineMenu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-6">
          <div className="flex flex-col space-y-4 text-center">
            <NavLink to="/notes" className={navLinkClass} onClick={handleLinkClick}>
              Notes
            </NavLink>
            <NavLink to="/todos" className={navLinkClass} onClick={handleLinkClick}>
              Todos
            </NavLink>
            <NavLink to="/goals" className={navLinkClass} onClick={handleLinkClick}>
              Goals
            </NavLink>
            <NavLink
              to="/daily-habits"
              className={navLinkClass}
              onClick={handleLinkClick}
            >
              Daily Habits
            </NavLink>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/signin"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md"
                >
                  Signin
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={handleLinkClick}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md"
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)} // open modal
                className="px-6 py-2 bg-red-500 text-white rounded-md"
              >
                Signout
              </button>
            )}
          </div>
        </div>
      )}

      {/* Signout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to sign out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
