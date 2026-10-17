
import { useState } from "react";
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
import Modal from "../UI/Modal";

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/app/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Notes", path: "/app/notes", icon: <StickyNote size={18} /> },
    { name: "Todos", path: "/app/todos", icon: <CheckSquare size={18} /> },
    { name: "Goals", path: "/app/goals", icon: <Target size={18} /> },
    { name: "Habits", path: "/app/habits", icon: <Activity size={18} /> },
    { name: "Settings", path: "/app/settings", icon: <Settings size={18} /> },
  ];

  const handleConfirmLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      if (closeSidebar) closeSidebar();
      navigate("/", { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  return (
    <aside className="flex h-full w-64 flex-col bg-linear-to-b from-blue-600 to-blue-900 dark:from-slate-900 dark:to-slate-950 p-4 text-white shadow-lg sm:w-72 sm:p-5 md:h-screen">
      {/* Logo */}
      <h1 className="mb-6 text-xl font-bold sm:mb-8 sm:text-2xl">
        TaskFlow
      </h1>

      {/* Navigation */}
      <nav aria-label="Main navigation" className="flex flex-col gap-1 sm:gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/app/dashboard"}
            onClick={() => closeSidebar?.()}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 sm:px-4 sm:text-base",
                isActive
                  ? "bg-white font-semibold text-blue-700 shadow dark:bg-white/10 dark:text-blue-200"
                  : "text-white hover:bg-blue-700/60",
              ].join(" ")
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Signed-in account */}
      <div className="mt-auto border-t border-blue-400/40 pt-4">
        <div className="mb-4 flex min-w-0 items-center gap-3 rounded-xl bg-white/10 p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-semibold" aria-hidden="true">
            {(user?.name || "U").trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name || "TaskFlow user"}</p>
            <p className="truncate text-xs text-blue-100">{user?.email || ""}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-red-500 sm:px-4 sm:text-base"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Sign Out?"
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="border-border text-foreground rounded-lg border px-4 py-2 transition hover:bg-surface-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmLogout}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Sign Out
            </button>
          </>
        }
      >
        Are you sure you want to{" "}
        <span className="font-semibold text-red-500">sign out</span>?
      </Modal>
    </aside>
  );
};

export default Sidebar;
