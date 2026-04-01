import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded-lg hover:bg-gray-100 transition";

  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <h1 className="text-xl font-bold mb-6">TaskFlow</h1>

      <nav className="space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/notes" className={linkClass}>
          Notes
        </NavLink>

        <NavLink to="/todos" className={linkClass}>
          Todos
        </NavLink>

        <NavLink to="/goals" className={linkClass}>
          Goals
        </NavLink>

        <NavLink to="/habits" className={linkClass}>
          Habits
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;