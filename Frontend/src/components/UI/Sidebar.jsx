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

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard size={18} /> },
    { name: "Notes", path: "/app/notes", icon: <StickyNote size={18} /> },
    { name: "Todos", path: "/app/todos", icon: <CheckSquare size={18} /> },
    { name: "Goals", path: "/app/goals", icon: <Target size={18} /> },
    { name: "Habits", path: "/app/habits", icon: <Activity size={18} /> },
    { name: "Settings", path: "/app/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
    toast.success("Logged out successfully");

    if (closeSidebar) closeSidebar();
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
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base hover:bg-red-500 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;