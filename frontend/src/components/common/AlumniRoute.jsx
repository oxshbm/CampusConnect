import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

const AlumniRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user || user.role !== 'alumni') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AlumniRoute;
