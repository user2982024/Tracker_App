
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/UI/Sidebar";
import ThemeToggle from "../components/UI/ThemeToggle";
import { useAuth } from "../context/AuthContextValue";

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
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
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background">
        {/* Global Top Bar */}
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-lg p-2 text-foreground transition hover:bg-surface-secondary md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ☰
              </span>
            </button>

            <span className="font-semibold md:hidden">TaskFlow</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-sm text-foreground-secondary sm:block">
              Welcome, <span className="font-semibold text-foreground">{user?.name || "there"}</span>
            </p>
            <ThemeToggle showLabel />
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
