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
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
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
  };

  return (
    <div className="h-screen w-64 bg-linear-to-b from-blue-700 to-blue-900 text-white flex flex-col p-4">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-8">Tracker</h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/app"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-white text-blue-700 font-semibold"
                  : "hover:bg-blue-600"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button (Bottom) */}
      <div className="mt-auto pt-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;