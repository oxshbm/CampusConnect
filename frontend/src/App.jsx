import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AlumniRoute from './components/common/AlumniRoute';
import AppLayout from './components/common/AppLayout';
import AdminLayout from './components/admin/AdminLayout';
import AlumniLayout from './components/alumni/AlumniLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AlumniSignupPage from './pages/AlumniSignupPage';
import HomePage from './pages/HomePage';
import CreateGroupPage from './pages/CreateGroupPage';
import GroupDetailPage from './pages/GroupDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import ClubsPage from './pages/ClubsPage';
import CreateClubPage from './pages/CreateClubPage';
import ClubDetailPage from './pages/ClubDetailPage';
import AlumniConnectPage from './pages/AlumniConnectPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGroups from './pages/admin/AdminGroups';
import AdminProjects from './pages/admin/AdminProjects';
import AdminEvents from './pages/admin/AdminEvents';
import AdminClubs from './pages/admin/AdminClubs';
import AlumniDashboard from './pages/alumni/AlumniDashboard';
import AlumniProfilePage from './pages/alumni/AlumniProfilePage';
import AlumniEventsPage from './pages/alumni/AlumniEventsPage';
import AlumniClubsPage from './pages/alumni/AlumniClubsPage';
import AlumniConnectionsPage from './pages/alumni/AlumniConnectionsPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-alumni" element={<AlumniSignupPage />} />

          {/* Protected routes with sidebar layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/group/:id" element={<GroupDetailPage />} />
              <Route path="/create-group" element={<CreateGroupPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/create" element={<CreateProjectPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/clubs/register" element={<CreateClubPage />} />
              <Route path="/clubs/:id" element={<ClubDetailPage />} />
              <Route path="/alumni" element={<AlumniConnectPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/groups" element={<AdminGroups />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/clubs" element={<AdminClubs />} />
            </Route>
          </Route>

          {/* Alumni portal routes */}
          <Route element={<AlumniRoute />}>
            <Route element={<AlumniLayout />}>
              <Route path="/alumni-portal" element={<AlumniDashboard />} />
              <Route path="/alumni-portal/profile" element={<AlumniProfilePage />} />
              <Route path="/alumni-portal/events" element={<AlumniEventsPage />} />
              <Route path="/alumni-portal/clubs" element={<AlumniClubsPage />} />
              <Route path="/alumni-portal/connections" element={<AlumniConnectionsPage />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
