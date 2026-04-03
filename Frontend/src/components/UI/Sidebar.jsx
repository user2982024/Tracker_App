import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  StickyNote,
  CheckSquare,
  Target,
  Activity,
  Settings
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/app", icon: <LayoutDashboard size={18} /> },
    { name: "Notes", path: "/app/notes", icon: <StickyNote size={18} /> },
    { name: "Todos", path: "/app/todos", icon: <CheckSquare size={18} /> },
    { name: "Goals", path: "/app/goals", icon: <Target size={18} /> },
    { name: "Habits", path: "/app/habits", icon: <Activity size={18} /> },
    { name: "Settings", path: "/app/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-linear-to-b from-blue-700 to-blue-900 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8">Tracker</h1>

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
    </div>
  );
};

export default Sidebar;