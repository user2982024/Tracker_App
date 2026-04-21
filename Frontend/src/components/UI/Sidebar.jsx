import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  StickyNote,
  CheckSquare,
  Target,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Modal from "../UI/Modal";

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ✅ Modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard size={18} /> },
    { name: "Notes", path: "/app/notes", icon: <StickyNote size={18} /> },
    { name: "Todos", path: "/app/todos", icon: <CheckSquare size={18} /> },
    { name: "Goals", path: "/app/goals", icon: <Target size={18} /> },
    { name: "Habits", path: "/app/habits", icon: <Activity size={18} /> },
    { name: "Settings", path: "/app/settings", icon: <Settings size={18} /> },
  ];

  // ✅ Confirm logout
  const handleConfirmLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
      toast.success("Logged out successfully");

      setShowLogoutModal(false);

      if (closeSidebar) closeSidebar();
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <div className="h-full md:h-screen w-64 sm:w-72 bg-linear-to-b from-blue-600 to-blue-900 text-white flex flex-col p-4 sm:p-5 shadow-lg">
      
      {/* Logo */}
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
        Tracker
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 sm:gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/app"}
            onClick={() => closeSidebar && closeSidebar()}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-3 sm:px-4 py-2.5
              rounded-lg
              text-sm sm:text-base
              transition-all duration-200
              ${
                isActive
                  ? "bg-white text-blue-700 font-semibold shadow"
                  : "hover:bg-blue-700/60"
              }
              `
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-blue-400/40">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base hover:bg-red-500 transition cursor-pointer"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      {/* ✅ LOGOUT MODAL */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out?"
        actions={
          <>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </>
        }
      >
        Are you sure you want to{" "}
        <span className="font-semibold text-red-500">sign out</span>?
      </Modal>
    </div>
  );
};

export default Sidebar;