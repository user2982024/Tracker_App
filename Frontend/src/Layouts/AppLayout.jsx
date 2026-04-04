import { useState } from "react";
import Sidebar from "../components/UI/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-64 z-50 md:hidden shadow-lg">
            <Sidebar closeSidebar={() => setIsOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Mobile Topbar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setIsOpen(true)}
            className="text-xl"
          >
            ☰
          </button>
          <h1 className="font-semibold text-lg">Tracker</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;