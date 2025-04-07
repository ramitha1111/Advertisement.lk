import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoutes';

const UserRoutes = () => {
  return (
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
  );
};

export default UserRoutes;
