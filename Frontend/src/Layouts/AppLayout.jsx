
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import Sidebar from "../components/UI/Sidebar";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="inline-flex h-10 items-center gap-2 rounded-full border app-border app-surface px-3 app-text shadow-sm transition hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {isDark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
      <span className="hidden text-sm font-medium sm:inline">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
};

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden app-bg app-text">
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/50 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
          />

          <div className="fixed left-0 top-0 z-50 h-full w-64 shadow-xl md:hidden">
            <Sidebar closeSidebar={() => setIsOpen(false)} />
          </div>
        </>
      )}

      {/* Main Application Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto app-bg">
        {/* Global Top Bar */}
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b app-border app-surface px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-2 app-text transition hover:bg-surface-secondary md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ☰
              </span>
            </button>

            <span className="font-semibold md:hidden">TaskFlow</span>
          </div>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
