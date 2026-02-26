import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AdminRoute;
