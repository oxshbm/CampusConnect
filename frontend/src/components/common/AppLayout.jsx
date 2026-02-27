import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <div className="flex flex-col bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      {/* Navbar */}
      <Navbar onMobileToggle={handleMobileToggle} />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={handleCloseMobile} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
