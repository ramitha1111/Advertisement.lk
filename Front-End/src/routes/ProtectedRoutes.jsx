import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) return <Navigate to='/login' />;
  if (adminOnly && !isAdmin) return <Navigate to='/unauthorized' />;

  return children;
};

export default ProtectedRoute;
