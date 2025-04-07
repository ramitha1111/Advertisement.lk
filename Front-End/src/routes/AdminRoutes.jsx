import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';
import Dashboard from '../pages/admin/Dashboard';

const AdminRoutes = () => {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute adminOnly>
            <Dashboard />
        </ProtectedRoute>
      }
    />
  );
};

export default AdminRoutes;
