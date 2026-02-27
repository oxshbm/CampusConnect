import { Outlet } from 'react-router-dom';
import AlumniSidebar from './AlumniSidebar';

const AlumniLayout = () => {
  return (
    <div className="flex bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <AlumniSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AlumniLayout;
